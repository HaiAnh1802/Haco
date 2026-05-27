// =============================================
// Supabase Compatibility Shim
// Thay thế @supabase/supabase-js
// Tự động route tất cả queries qua /api/db
// Toàn bộ code cũ KHÔNG CẦN SỬA!
// =============================================

class QueryBuilder {
  constructor(table) {
    this._table = table;
    this._operation = "select";
    this._select = "*";
    this._filters = [];
    this._order = null;
    this._single = false;
    this._maybeSingle = false;
    this._data = null;
    this._returnSelect = null;
  }

  select(cols) {
    // Nếu đang insert/update thì đây là "RETURNING" select
    if (this._operation === "insert" || this._operation === "update") {
      this._returnSelect = cols || "*";
    } else {
      this._operation = "select";
      this._select = cols || "*";
    }
    return this;
  }

  eq(col, val) {
    this._filters.push({ col, val, op: "eq" });
    return this;
  }

  in(col, values) {
    this._filters.push({ col, val: values, op: "in" });
    return this;
  }

  order(col, opts = {}) {
    this._order = { col, ascending: opts.ascending !== false };
    return this;
  }

  single() {
    this._single = true;
    return this._execute();
  }

  maybeSingle() {
    this._maybeSingle = true;
    return this._execute();
  }

  insert(data) {
    this._operation = "insert";
    this._data = data;
    return this;
  }

  update(data) {
    this._operation = "update";
    this._data = data;
    return this;
  }

  delete() {
    this._operation = "delete";
    return this;
  }

  // Cho phép .then() và await
  then(resolve, reject) {
    return this._execute().then(resolve, reject);
  }

  catch(reject) {
    return this._execute().catch(reject);
  }

  async _execute() {
    try {
      const payload = {
        operation: this._operation,
        table: this._table,
        select: this._select,
        filters: this._filters,
        data: this._data,
        order: this._order,
        single: this._single,
        maybeSingle: this._maybeSingle,
        returnSelect: this._returnSelect,
      };

      const baseUrl = typeof window !== "undefined"
        ? ""
        : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

      const res = await fetch(`${baseUrl}/api/db`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        return { data: null, error: { message: `HTTP ${res.status}: ${errText}` } };
      }

      return await res.json();
    } catch (err) {
      console.error("[Supabase Shim Error]:", err.message);
      return { data: null, error: { message: err.message } };
    }
  }
}

// Export supabase object tương thích với API cũ
export const supabase = {
  from: (table) => new QueryBuilder(table),
};

// =============================================
// Upload image lên VPS qua /api/upload
// =============================================
export async function uploadProductImage(file, folder = "general") {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      console.error("[Upload] HTTP error:", res.status);
      return null;
    }

    const data = await res.json();
    return data.url || null;
  } catch (err) {
    console.error("[Upload Error]:", err.message);
    return null;
  }
}

// =============================================
// Xóa image trên VPS
// =============================================
export async function deleteProductImage(url) {
  if (!url || url.startsWith("/images/") || !url.startsWith("http")) return;
  try {
    await fetch("/api/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
  } catch (err) {
    console.error("[Delete Image Error]:", err.message);
  }
}
