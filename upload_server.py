"""
=================================================
HACO Upload Server - Chạy trên VPS Windows
=================================================
Cài đặt: pip install flask
Chạy: python upload_server.py
Port: 8080
=================================================
"""
from flask import Flask, request, jsonify
import os
import uuid

app = Flask(__name__)

# --- Cấu hình ---
UPLOAD_DIR = r"C:\inetpub\wwwroot\uploads\products"
VPS_IP = "160.191.50.41"
API_KEY = "haco-upload-secret-2024"  # Đổi key này nếu muốn bảo mật hơn

def check_auth():
    return request.headers.get("X-API-Key") == API_KEY

@app.route("/upload", methods=["POST"])
def upload():
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401

    file = request.files.get("file")
    folder = request.form.get("folder", "general")

    if not file:
        return jsonify({"error": "No file provided"}), 400

    # Tạo thư mục con nếu chưa có
    subfolder = os.path.join(UPLOAD_DIR, folder)
    os.makedirs(subfolder, exist_ok=True)

    # Tạo tên file unique
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in [".jpg", ".jpeg", ".png", ".gif", ".webp"]:
        ext = ".jpg"
    filename = str(uuid.uuid4()) + ext
    filepath = os.path.join(subfolder, filename)

    file.save(filepath)

    url = f"http://{VPS_IP}/uploads/products/{folder}/{filename}"
    print(f"[UPLOAD] Saved: {filepath} → {url}")
    return jsonify({"url": url, "success": True})


@app.route("/delete", methods=["DELETE"])
def delete_file():
    if not check_auth():
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    url = data.get("url", "") if data else ""

    # Chuyển URL thành đường dẫn file
    prefix = f"http://{VPS_IP}/uploads/products/"
    if url.startswith(prefix):
        rel_path = url[len(prefix):].replace("/", "\\")
        filepath = os.path.join(UPLOAD_DIR, rel_path)
        if os.path.exists(filepath):
            os.remove(filepath)
            print(f"[DELETE] Removed: {filepath}")
            return jsonify({"success": True})

    return jsonify({"success": False, "error": "File not found"})


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "upload_dir": UPLOAD_DIR})


if __name__ == "__main__":
    print(f"[SERVER] Upload server starting on port 8080")
    print(f"[SERVER] Upload dir: {UPLOAD_DIR}")
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    app.run(host="0.0.0.0", port=8080, debug=False)
