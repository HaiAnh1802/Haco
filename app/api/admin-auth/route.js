import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { success: false, message: "Chưa cấu hình mật khẩu admin" },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, message: "Mật khẩu không đúng" },
        { status: 401 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}
