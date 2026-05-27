// =============================================
// Upload API Route
// POST /api/upload - Forward file lên VPS
// DELETE /api/upload - Xóa file trên VPS
// =============================================
import { NextResponse } from "next/server";

const VPS_UPLOAD_URL = `http://${process.env.VPS_IP || "160.191.50.41"}:8080/upload`;
const VPS_DELETE_URL = `http://${process.env.VPS_IP || "160.191.50.41"}:8080/delete`;
const API_KEY = process.env.VPS_UPLOAD_KEY || "haco-upload-secret-2024";

export async function POST(request) {
  try {
    const formData = await request.formData();

    // Forward file lên VPS upload server
    const res = await fetch(VPS_UPLOAD_URL, {
      method: "POST",
      headers: { "X-API-Key": API_KEY },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: `VPS error: ${err}` }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[Upload Error]:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json();

    const res = await fetch(VPS_DELETE_URL, {
      method: "DELETE",
      headers: {
        "X-API-Key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[Delete Error]:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
