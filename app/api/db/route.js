// =============================================
// DB API Route - Generic PostgreSQL Proxy
// POST /api/db
// Thay thế toàn bộ Supabase REST API
// =============================================
import { NextResponse } from "next/server";
import pool from "../../lib/db";

export async function POST(request) {
  try {
    const body = await request.json();
    const { operation, table, select, filters, data, order, single, maybeSingle, returnSelect } = body;

    const values = [];
    let idx = 1;

    // Build WHERE clause
    function buildWhere(prefix = "") {
      if (!filters || !filters.length) return "";
      const col_prefix = prefix ? `${prefix}.` : "";
      const conditions = filters.map((f) => {
        if (f.op === "in" && Array.isArray(f.val)) {
          // Handle IN operator: col = ANY(ARRAY[$1, $2, ...])
          const placeholders = f.val.map(() => `$${idx++}`);
          f.val.forEach((v) => values.push(v));
          return `${col_prefix}"${f.col}"::text = ANY(ARRAY[${placeholders.join(", ")}])`;
        }
        // Default: eq
        values.push(f.val);
        return `${col_prefix}"${f.col}" = $${idx++}`;
      });
      return "WHERE " + conditions.join(" AND ");
    }

    // ============ SELECT ============
    if (!operation || operation === "select") {
      const hasVariantsJoin = table === "haco_products" && select && select.includes("haco_variants");

      if (hasVariantsJoin) {
        // JOIN haco_products + haco_variants
        const whereClause = buildWhere("p");
        const orderClause = order
          ? `ORDER BY p."${order.col}" ${order.ascending !== false ? "ASC" : "DESC"}`
          : "ORDER BY p.created_at ASC";

        const sql = `
          SELECT p.*,
            COALESCE(
              json_agg(
                json_build_object(
                  'id', v.id,
                  'name', v.name,
                  'original_price', v.original_price,
                  'sale_price', v.sale_price,
                  'images', v.images,
                  'sort_order', v.sort_order
                ) ORDER BY v.sort_order ASC
              ) FILTER (WHERE v.id IS NOT NULL),
              '[]'::json
            ) as haco_variants
          FROM haco_products p
          LEFT JOIN haco_variants v ON v.product_id = p.id
          ${whereClause}
          GROUP BY p.id
          ${orderClause}
          ${single ? "LIMIT 1" : ""}
        `;

        const result = await pool.query(sql, values);
        console.log(`[DB DEBUG] haco_products JOIN query: ${result.rows.length} rows, filters:`, JSON.stringify(filters));
        if (result.rows.length === 0 && values.length > 0) {
          console.log(`[DB DEBUG] SQL: ${sql.trim()}`);
          console.log(`[DB DEBUG] Values:`, values);
        }
        if (single || maybeSingle) {
          return NextResponse.json({ data: result.rows[0] || null, error: null });
        }
        return NextResponse.json({ data: result.rows, error: null });
      }

      // Regular SELECT
      let cols = "*";
      if (select && select.trim() !== "*") {
        // Remove embedded join notation like "haco_variants(...)"
        const cleaned = select.replace(/,?\s*\w+\s*\([^)]*\)/g, "").trim().replace(/,\s*$/, "").trim();
        if (cleaned) cols = cleaned;
      }

      const whereClause = buildWhere();
      const orderClause = order
        ? `ORDER BY "${order.col}" ${order.ascending !== false ? "ASC" : "DESC"}`
        : "";
      const limitClause = single ? "LIMIT 1" : "";

      const sql = `SELECT ${cols} FROM "${table}" ${whereClause} ${orderClause} ${limitClause}`;
      const result = await pool.query(sql, values);

      if (single) {
        if (!result.rows[0]) {
          return NextResponse.json({ data: null, error: { message: "Not found" } });
        }
        return NextResponse.json({ data: result.rows[0], error: null });
      }
      if (maybeSingle) {
        return NextResponse.json({ data: result.rows[0] || null, error: null });
      }
      return NextResponse.json({ data: result.rows, error: null });
    }

    // ============ INSERT ============
    if (operation === "insert") {
      const records = Array.isArray(data) ? data : [data];
      const results = [];

      for (const record of records) {
        const localVals = [];
        const keys = Object.keys(record);
        const placeholders = keys.map((_, i) => `$${i + 1}`);
        keys.forEach((k) => {
          const v = record[k];
          if (v !== undefined && v !== null && typeof v === "object") {
            localVals.push(JSON.stringify(v));
          } else {
            localVals.push(v !== undefined ? v : null);
          }
        });

        const sql = `INSERT INTO "${table}" (${keys.map((k) => `"${k}"`).join(", ")}) VALUES (${placeholders.join(", ")}) RETURNING *`;
        const result = await pool.query(sql, localVals);
        results.push(result.rows[0]);
      }

      if (single) return NextResponse.json({ data: results[0] || null, error: null });
      return NextResponse.json({ data: results, error: null });
    }

    // ============ UPDATE ============
    if (operation === "update") {
      const keys = Object.keys(data);
      const localVals = keys.map((k) => {
        const v = data[k];
        if (v !== undefined && v !== null && typeof v === "object") {
          return JSON.stringify(v);
        }
        return v !== undefined ? v : null;
      });
      const setClauses = keys.map((k, i) => `"${k}" = $${i + 1}`);
      let paramIdx = keys.length + 1;

      const conditions = (filters || []).map((f) => {
        localVals.push(f.val);
        return `"${f.col}" = $${paramIdx++}`;
      });
      const whereClause = conditions.length ? "WHERE " + conditions.join(" AND ") : "";

      const sql = `UPDATE "${table}" SET ${setClauses.join(", ")} ${whereClause} RETURNING *`;
      const result = await pool.query(sql, localVals);
      return NextResponse.json({ data: result.rows, error: null });
    }

    // ============ DELETE ============
    if (operation === "delete") {
      const whereClause = buildWhere();
      const sql = `DELETE FROM "${table}" ${whereClause} RETURNING *`;
      const result = await pool.query(sql, values);
      return NextResponse.json({ data: result.rows, error: null });
    }

    return NextResponse.json({ error: { message: "Unknown operation" } }, { status: 400 });
  } catch (err) {
    console.error("[DB API Error]:", err.message);
    return NextResponse.json({ data: null, error: { message: err.message } }, { status: 500 });
  }
}
