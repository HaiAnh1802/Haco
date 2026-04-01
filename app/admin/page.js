"use client";

import { useState, useEffect, useRef } from "react";
import { supabase, uploadProductImage, deleteProductImage } from "../lib/supabase";

const BANNER_UPLOAD_FOLDER = "banner";

// ============ SLUG GENERATOR ============
function toSlug(str) {
  return str
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d").replace(/Đ/g, "D")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// ============ MAIN ADMIN PAGE ============
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  // Check sessionStorage on mount
  useEffect(() => {
    if (sessionStorage.getItem("admin_authed") === "true") {
      setAuthed(true);
    }
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError("");
    try {
      const res = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem("admin_authed", "true");
        setAuthed(true);
      } else {
        setAuthError(data.message || "Mật khẩu không đúng");
      }
    } catch {
      setAuthError("Lỗi kết nối server");
    }
    setAuthLoading(false);
  }

  if (!authed) {
    return (
      <div className="admin-login">
        <div className="admin-login__card">
          <div className="admin-login__icon">🔐</div>
          <h1 className="admin-login__title">Admin Panel</h1>
          <p className="admin-login__subtitle">Nhập mật khẩu để tiếp tục</p>
          <form onSubmit={handleLogin} className="admin-login__form">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu admin"
              className="admin-login__input"
              autoFocus
            />
            {authError && <p className="admin-login__error">{authError}</p>}
            <button type="submit" className="admin-login__btn" disabled={authLoading}>
              {authLoading ? "Đang xác thực..." : "Đăng nhập"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <AdminDashboard onLogout={() => { sessionStorage.removeItem("admin_authed"); setAuthed(false); }} />;
}

// ============ ADMIN DASHBOARD ============
function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("products"); // "products" | "featured" | "orders"
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState(null); // null = list view, object = form view
  const [isNew, setIsNew] = useState(false);

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
      .from("haco_products")
      .select(`*, haco_variants (id, name, original_price, sale_price, images, sort_order)`)
      .order("created_at", { ascending: true });
    if (error) {
      showMsg("error", "Lỗi tải sản phẩm: " + error.message);
    } else {
      setProducts(data.map(p => ({
        ...p,
        variants: (p.haco_variants || []).sort((a, b) => a.sort_order - b.sort_order),
      })));
    }
    setLoading(false);
  }

  function showMsg(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  function handleNew() {
    setIsNew(true);
    setEditingProduct({
      name: "", slug: "", category: "Khác", description: "", ingredients: "", usage_info: "",
      images: [], card_image: "", variants: [],
    });
  }

  function handleEdit(product) {
    setIsNew(false);
    setEditingProduct({ ...product });
  }

  async function handleDelete(product) {
    if (!confirm(`Xóa sản phẩm "${product.name}"?\nTất cả biến thể và ảnh cũng sẽ bị xóa.`)) return;

    // Delete images from Storage
    if (product.card_image) deleteProductImage(product.card_image);
    if (product.images?.length) {
      for (const url of product.images) deleteProductImage(url);
    }
    if (product.variants?.length) {
      for (const v of product.variants) {
        if (v.images?.length) {
          for (const url of v.images) deleteProductImage(url);
        }
      }
    }

    const { error } = await supabase.from("haco_products").delete().eq("id", product.id);
    if (error) {
      showMsg("error", "Lỗi xóa: " + error.message);
    } else {
      showMsg("success", `Đã xóa "${product.name}"`);
      fetchProducts();
    }
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // ===== ORDERS TAB =====
  if (activeTab === "orders" && !editingProduct) {
    return (
      <div className="admin-panel">
        <header className="admin-panel__header">
          <div className="admin-panel__header-left">
            <h1>🛍️ Quản lý cửa hàng</h1>
          </div>
          <div className="admin-panel__header-right">
            <a href="/" className="admin-btn admin-btn--ghost" target="_blank">🌐 Xem trang</a>
            <button className="admin-btn admin-btn--ghost admin-btn--danger-text" onClick={onLogout}>🚪 Đăng xuất</button>
          </div>
        </header>

        <div className="admin-tabs">
          <button className={`admin-tabs__btn ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>🛍️ Sản phẩm</button>
          <button className={`admin-tabs__btn ${activeTab === "featured" ? "active" : ""}`} onClick={() => setActiveTab("featured")}>🌟 Trang chủ</button>
          <button className={`admin-tabs__btn ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>📋 Đơn hàng</button>
        </div>

        <OrdersExport />
      </div>
    );
  }

  // ===== FEATURED SECTION TAB =====
  if (activeTab === "featured" && !editingProduct) {
    return (
      <div className="admin-panel">
        <header className="admin-panel__header">
          <div className="admin-panel__header-left">
            <h1>🛍️ Quản lý cửa hàng</h1>
          </div>
          <div className="admin-panel__header-right">
            <a href="/" className="admin-btn admin-btn--ghost" target="_blank">🌐 Xem trang</a>
            <button className="admin-btn admin-btn--ghost admin-btn--danger-text" onClick={onLogout}>🚪 Đăng xuất</button>
          </div>
        </header>

        <div className="admin-tabs">
          <button className={`admin-tabs__btn ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>🛍️ Sản phẩm</button>
          <button className={`admin-tabs__btn ${activeTab === "featured" ? "active" : ""}`} onClick={() => setActiveTab("featured")}>🌟 Trang chủ</button>
          <button className={`admin-tabs__btn ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>📋 Đơn hàng</button>
        </div>

        <FeaturedSectionEditor products={products} />
        <FeatureSectionEditor />
        <BrandValuesEditor />
      </div>
    );
  }

  // ===== LIST VIEW =====
  if (!editingProduct) {
    return (
      <div className="admin-panel">
        <header className="admin-panel__header">
          <div className="admin-panel__header-left">
            <h1>🛍️ Quản lý cửa hàng</h1>
          </div>
          <div className="admin-panel__header-right">
            <a href="/" className="admin-btn admin-btn--ghost" target="_blank">🌐 Xem trang</a>
            <button className="admin-btn admin-btn--ghost admin-btn--danger-text" onClick={onLogout}>🚪 Đăng xuất</button>
          </div>
        </header>

        <div className="admin-tabs">
          <button className={`admin-tabs__btn ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>🛍️ Sản phẩm</button>
          <button className={`admin-tabs__btn ${activeTab === "featured" ? "active" : ""}`} onClick={() => setActiveTab("featured")}>🌟 Trang chủ</button>
          <button className={`admin-tabs__btn ${activeTab === "orders" ? "active" : ""}`} onClick={() => setActiveTab("orders")}>📋 Đơn hàng</button>
        </div>

        {message && (
          <div className={`admin-msg admin-msg--${message.type}`} onClick={() => setMessage(null)}>
            {message.type === "success" ? "✅" : "❌"} {message.text}
          </div>
        )}

        <div className="admin-toolbar">
          <input
            type="text"
            placeholder="🔍 Tìm kiếm sản phẩm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search"
          />
          <button className="admin-btn admin-btn--primary" onClick={handleNew}>+ Thêm sản phẩm</button>
        </div>

        {loading ? (
          <div className="admin-loading">
            <div className="admin-loading__spinner" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="admin-grid">
            {filtered.length === 0 ? (
              <div className="admin-empty">
                <span>📦</span>
                <p>{search ? "Không tìm thấy sản phẩm phù hợp" : "Chưa có sản phẩm nào"}</p>
              </div>
            ) : (
              filtered.map((p) => {
                const firstVariant = p.variants?.[0];
                return (
                  <div key={p.id} className="admin-product-card">
                    <div className="admin-product-card__img">
                      {p.card_image ? (
                        <img src={p.card_image} alt={p.name} />
                      ) : (
                        <div className="admin-product-card__placeholder">📷</div>
                      )}
                    </div>
                    <div className="admin-product-card__body">
                      <h3 className="admin-product-card__name">{p.name}</h3>
                      <p className="admin-product-card__slug">/{p.slug}</p>
                      <div className="admin-product-card__meta">
                        {firstVariant && (
                          <span className="admin-product-card__price">
                            {firstVariant.sale_price
                              ? Number(firstVariant.sale_price).toLocaleString("vi-VN") + "đ"
                              : Number(firstVariant.original_price).toLocaleString("vi-VN") + "đ"}
                          </span>
                        )}
                        <span className="admin-product-card__variants">
                          {p.variants?.length || 0} biến thể
                        </span>
                      </div>
                    </div>
                    <div className="admin-product-card__actions">
                      <button className="admin-btn admin-btn--sm" onClick={() => handleEdit(p)}>✏️ Sửa</button>
                      <button className="admin-btn admin-btn--sm admin-btn--danger" onClick={() => handleDelete(p)}>🗑️ Xóa</button>
                      <a href={`/products/${p.slug}`} className="admin-btn admin-btn--sm" target="_blank">👁️</a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    );
  }

  // ===== FORM VIEW =====
  return (
    <ProductForm
      product={editingProduct}
      isNew={isNew}
      onSave={() => { setEditingProduct(null); fetchProducts(); }}
      onCancel={() => setEditingProduct(null)}
      showMsg={showMsg}
      message={message}
      setMessage={setMessage}
    />
  );
}

// ============ PRODUCT FORM ============
function ProductForm({ product, isNew, onSave, onCancel, showMsg, message, setMessage }) {
  const [form, setForm] = useState({
    name: product.name || "",
    slug: product.slug || "",
    category: product.category || "Khác",
    description: product.description || "",
    ingredients: product.ingredients || "",
    usage_info: product.usage_info || "",
    card_image: product.card_image || "",
    images: product.images || [],
  });
  const [variants, setVariants] = useState(product.variants || []);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(""); // tracks what's uploading: "card", "gallery", "variant"

  // File input refs
  const galleryFileRef = useRef(null);
  const cardFileRef = useRef(null);
  const variantFileRef = useRef(null);

  // Variant form
  const [variantForm, setVariantForm] = useState({ name: "", original_price: "", sale_price: "", image: "" });
  const [editingVariantIdx, setEditingVariantIdx] = useState(-1);

  // ---- Upload handlers ----
  async function handleUploadGallery(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading("gallery");
    const folder = form.slug || "temp";
    const uploaded = [];
    for (const file of files) {
      const url = await uploadProductImage(file, folder);
      if (url) uploaded.push(url);
      else showMsg("error", `Lỗi upload "${file.name}". Kiểm tra bucket đã tạo chưa.`);
    }
    if (uploaded.length) {
      setForm(prev => ({ ...prev, images: [...prev.images, ...uploaded] }));
      showMsg("success", `Đã upload ${uploaded.length} ảnh`);
    }
    setUploading("");
    if (galleryFileRef.current) galleryFileRef.current.value = "";
  }

  async function handleUploadCard(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("card");
    const folder = form.slug || "temp";
    const url = await uploadProductImage(file, folder);
    if (url) {
      setForm(prev => ({ ...prev, card_image: url }));
      showMsg("success", "Đã upload ảnh thumbnail");
    } else {
      showMsg("error", "Lỗi upload thumbnail. Kiểm tra bucket đã tạo chưa.");
    }
    setUploading("");
    if (cardFileRef.current) cardFileRef.current.value = "";
  }

  async function handleUploadVariantImage(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading("variant");
    const folder = form.slug || "temp";
    const url = await uploadProductImage(file, folder);
    if (url) {
      setVariantForm(prev => ({ ...prev, image: url }));
      showMsg("success", "Đã upload ảnh biến thể");
    } else {
      showMsg("error", "Lỗi upload ảnh biến thể");
    }
    setUploading("");
    if (variantFileRef.current) variantFileRef.current.value = "";
  }

  function updateField(field, value) {
    setForm(prev => {
      const updated = { ...prev, [field]: value };
      if (field === "name" && (isNew || !prev.slug || prev.slug === toSlug(prev.name))) {
        updated.slug = toSlug(value);
      }
      return updated;
    });
  }

  function addImage() {
    if (!newImageUrl.trim()) return;
    setForm(prev => ({ ...prev, images: [...prev.images, newImageUrl.trim()] }));
    setNewImageUrl("");
  }

  function removeImage(idx) {
    const url = form.images[idx];
    if (url) deleteProductImage(url); // xóa file trên Storage
    setForm(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
  }

  function removeCardImage() {
    if (form.card_image) deleteProductImage(form.card_image);
    updateField("card_image", "");
  }

  function addOrUpdateVariant() {
    const v = {
      name: variantForm.name,
      original_price: parseInt(variantForm.original_price) || 0,
      sale_price: variantForm.sale_price ? parseInt(variantForm.sale_price) : null,
      images: variantForm.image ? [variantForm.image] : [],
      sort_order: editingVariantIdx >= 0 ? editingVariantIdx : variants.length,
    };
    if (!v.name || !v.original_price) {
      showMsg("error", "Tên và giá gốc biến thể là bắt buộc");
      return;
    }

    if (editingVariantIdx >= 0) {
      // Preserve existing variant id if editing
      const existingId = variants[editingVariantIdx]?.id;
      if (existingId) v.id = existingId;
      setVariants(prev => prev.map((item, i) => i === editingVariantIdx ? v : item));
    } else {
      setVariants(prev => [...prev, v]);
    }
    setVariantForm({ name: "", original_price: "", sale_price: "", image: "" });
    setEditingVariantIdx(-1);
  }

  function editVariant(idx) {
    const v = variants[idx];
    setVariantForm({
      name: v.name,
      original_price: v.original_price?.toString() || "",
      sale_price: v.sale_price?.toString() || "",
      image: v.images?.[0] || "",
    });
    setEditingVariantIdx(idx);
  }

  function removeVariant(idx) {
    const v = variants[idx];
    // If variant has an id (exists in DB), we need to delete it
    if (v.id) {
      supabase.from("haco_variants").delete().eq("id", v.id).then(({ error }) => {
        if (error) showMsg("error", "Lỗi xóa biến thể: " + error.message);
      });
    }
    setVariants(prev => prev.filter((_, i) => i !== idx));
  }

  async function handleSave() {
    if (!form.name || !form.slug) {
      showMsg("error", "Tên và slug sản phẩm là bắt buộc");
      return;
    }
    setSaving(true);

    try {
      const productData = {
        name: form.name,
        slug: form.slug,
        category: form.category || "Khác",
        description: form.description || null,
        ingredients: form.ingredients || null,
        usage_info: form.usage_info || null,
        card_image: form.card_image || null,
        images: form.images,
      };

      let productId;

      if (isNew) {
        const { data, error } = await supabase
          .from("haco_products")
          .insert([productData])
          .select("id")
          .single();
        if (error) throw error;
        productId = data.id;
      } else {
        productId = product.id;
        const { error } = await supabase
          .from("haco_products")
          .update(productData)
          .eq("id", productId);
        if (error) throw error;
      }

      // Save variants
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        const variantData = {
          product_id: productId,
          name: v.name,
          original_price: v.original_price,
          sale_price: v.sale_price,
          images: v.images || [],
          sort_order: i,
        };

        if (v.id) {
          // Update existing variant
          const { error } = await supabase
            .from("haco_variants")
            .update(variantData)
            .eq("id", v.id);
          if (error) throw error;
        } else {
          // Insert new variant
          const { error } = await supabase
            .from("haco_variants")
            .insert([variantData]);
          if (error) throw error;
        }
      }

      showMsg("success", isNew ? `Đã thêm "${form.name}"` : `Đã cập nhật "${form.name}"`);
      onSave();
    } catch (err) {
      showMsg("error", "Lỗi lưu: " + err.message);
    }
    setSaving(false);
  }

  return (
    <div className="admin-panel">
      <header className="admin-panel__header">
        <div className="admin-panel__header-left">
          <button className="admin-btn admin-btn--ghost" onClick={onCancel}>← Quay lại</button>
          <h1>{isNew ? "Thêm sản phẩm mới" : `Sửa: ${product.name}`}</h1>
        </div>
        <div className="admin-panel__header-right">
          <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? "⏳ Đang lưu..." : "💾 Lưu sản phẩm"}
          </button>
        </div>
      </header>

      {message && (
        <div className={`admin-msg admin-msg--${message.type}`} onClick={() => setMessage(null)}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      <div className="admin-form">
        {/* Basic Info */}
        <section className="admin-form__section">
          <h2 className="admin-form__section-title">📋 Thông tin cơ bản</h2>
          <div className="admin-form__grid">
            <div className="admin-form__field admin-form__field--full">
              <label>Tên sản phẩm *</label>
              <input type="text" value={form.name} onChange={e => updateField("name", e.target.value)} placeholder="VD: Kem chống nắng Anessa" />
            </div>
            <div className="admin-form__field">
              <label>Slug (URL) *</label>
              <input type="text" value={form.slug} onChange={e => updateField("slug", e.target.value)} placeholder="Auto-generated" />
            </div>
            <div className="admin-form__field">
              <label>Loại sản phẩm</label>
              <CategoryPicker value={form.category} onChange={val => updateField("category", val)} />
            </div>
            <div className="admin-form__field">
              <label>Ảnh thumbnail</label>
              <div className="admin-upload-row">
                {form.card_image && <img src={form.card_image} alt="thumb" className="admin-upload-preview" />}
                <div className="admin-upload-btns">
                  <label className={`admin-btn admin-btn--sm ${uploading === "card" ? "admin-btn--loading" : ""}`}>
                    {uploading === "card" ? "⏳ Đang upload..." : "📤 Upload ảnh"}
                    <input type="file" accept="image/*" hidden ref={cardFileRef} onChange={handleUploadCard} disabled={!!uploading} />
                  </label>
                  {form.card_image && <button className="admin-btn admin-btn--xs admin-btn--danger" onClick={removeCardImage}>✕</button>}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="admin-form__section">
          <h2 className="admin-form__section-title">📝 Mô tả chi tiết</h2>
          <div className="admin-form__field">
            <label>Mô tả sản phẩm</label>
            <textarea rows={5} value={form.description} onChange={e => updateField("description", e.target.value)} placeholder="Mô tả công dụng, đặc điểm sản phẩm..." />
          </div>
          <div className="admin-form__field">
            <label>Thành phần</label>
            <textarea rows={4} value={form.ingredients} onChange={e => updateField("ingredients", e.target.value)} placeholder="Liệt kê thành phần sản phẩm..." />
          </div>
          <div className="admin-form__field">
            <label>Hướng dẫn sử dụng</label>
            <textarea rows={4} value={form.usage_info} onChange={e => updateField("usage_info", e.target.value)} placeholder="Cách sử dụng sản phẩm..." />
          </div>
        </section>

        {/* Images */}
        <section className="admin-form__section">
          <h2 className="admin-form__section-title">🖼️ Hình ảnh sản phẩm</h2>
          <div className="admin-images">
            {form.images.length > 0 && (
              <div className="admin-images__list">
                {form.images.map((url, i) => (
                  <div key={i} className="admin-images__item">
                    <img src={url} alt={`Ảnh ${i + 1}`} />
                    <button className="admin-images__remove" onClick={() => removeImage(i)}>✕</button>
                    <span className="admin-images__index">{i + 1}</span>
                  </div>
                ))}
              </div>
            )}
            <div className="admin-images__add">
              <label className={`admin-btn admin-btn--sm admin-btn--primary ${uploading === "gallery" ? "admin-btn--loading" : ""}`}>
                {uploading === "gallery" ? "⏳ Đang upload..." : "📤 Upload ảnh"}
                <input type="file" accept="image/*" multiple hidden ref={galleryFileRef} onChange={handleUploadGallery} disabled={!!uploading} />
              </label>
              <span className="admin-images__divider">hoặc</span>
              <input
                type="text"
                value={newImageUrl}
                onChange={e => setNewImageUrl(e.target.value)}
                placeholder="Nhập URL ảnh..."
                onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addImage())}
              />
              <button className="admin-btn admin-btn--sm" onClick={addImage}>+ Thêm URL</button>
            </div>
          </div>
        </section>

        {/* Variants */}
        <section className="admin-form__section">
          <h2 className="admin-form__section-title">📦 Biến thể sản phẩm</h2>

          {variants.length > 0 && (
            <div className="admin-variants__table-wrap">
              <table className="admin-variants__table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Tên biến thể</th>
                    <th>Giá gốc</th>
                    <th>Giá sale</th>
                    <th>Ảnh</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v, i) => (
                    <tr key={i} className={editingVariantIdx === i ? "editing" : ""}>
                      <td>{i + 1}</td>
                      <td>{v.name}</td>
                      <td>{Number(v.original_price).toLocaleString("vi-VN")}đ</td>
                      <td>{v.sale_price ? Number(v.sale_price).toLocaleString("vi-VN") + "đ" : "—"}</td>
                      <td>
                        {v.images?.[0] ? (
                          <img src={v.images[0]} alt="" className="admin-variants__thumb" />
                        ) : "—"}
                      </td>
                      <td>
                        <button className="admin-btn admin-btn--xs" onClick={() => editVariant(i)}>✏️</button>
                        <button className="admin-btn admin-btn--xs admin-btn--danger" onClick={() => removeVariant(i)}>🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="admin-variant-form">
            <h3>{editingVariantIdx >= 0 ? "✏️ Sửa biến thể" : "➕ Thêm biến thể"}</h3>
            <div className="admin-variant-form__grid">
              <input
                type="text"
                placeholder="Tên (VD: 50ml)"
                value={variantForm.name}
                onChange={e => setVariantForm(prev => ({ ...prev, name: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Giá gốc"
                value={variantForm.original_price}
                onChange={e => setVariantForm(prev => ({ ...prev, original_price: e.target.value }))}
              />
              <input
                type="number"
                placeholder="Giá sale (tuỳ chọn)"
                value={variantForm.sale_price}
                onChange={e => setVariantForm(prev => ({ ...prev, sale_price: e.target.value }))}
              />
              <div className="admin-variant-img-field">
                {variantForm.image && <img src={variantForm.image} alt="" className="admin-upload-preview--sm" />}
                <label className={`admin-btn admin-btn--xs ${uploading === "variant" ? "admin-btn--loading" : ""}`}>
                  {uploading === "variant" ? "⏳..." : "📤 Ảnh"}
                  <input type="file" accept="image/*" hidden ref={variantFileRef} onChange={handleUploadVariantImage} disabled={!!uploading} />
                </label>
                {variantForm.image && <button type="button" className="admin-btn admin-btn--xs admin-btn--danger" onClick={() => setVariantForm(prev => ({ ...prev, image: "" }))}>✕</button>}
              </div>
            </div>
            <div className="admin-variant-form__actions">
              <button className="admin-btn admin-btn--sm admin-btn--primary" onClick={addOrUpdateVariant}>
                {editingVariantIdx >= 0 ? "💾 Cập nhật" : "➕ Thêm biến thể"}
              </button>
              {editingVariantIdx >= 0 && (
                <button className="admin-btn admin-btn--sm" onClick={() => { setEditingVariantIdx(-1); setVariantForm({ name: "", original_price: "", sale_price: "", image: "" }); }}>
                  Huỷ
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// ============ CATEGORY PICKER ============
function CategoryPicker({ value, onChange }) {
  const [categories, setCategories] = useState([]);
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState("");

  useEffect(() => {
    supabase
      .from("haco_products")
      .select("category")
      .then(({ data }) => {
        if (data) {
          const unique = [...new Set(data.map(d => d.category).filter(Boolean))].sort();
          setCategories(unique);
          // If current value isn't in the list, it's custom
          if (value && !unique.includes(value) && value !== "Khác") {
            setIsCustom(true);
            setCustomValue(value);
          }
        }
      });
  }, []);

  function handleSelectChange(e) {
    const val = e.target.value;
    if (val === "__NEW__") {
      setIsCustom(true);
      setCustomValue("");
    } else {
      setIsCustom(false);
      onChange(val);
    }
  }

  function handleCustomConfirm() {
    if (customValue.trim()) {
      onChange(customValue.trim());
      setCategories(prev => [...new Set([...prev, customValue.trim()])].sort());
      setIsCustom(false);
    }
  }

  if (isCustom) {
    return (
      <div className="admin-category-custom">
        <input
          type="text"
          value={customValue}
          onChange={e => setCustomValue(e.target.value)}
          placeholder="Nhập tên loại mới..."
          autoFocus
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), handleCustomConfirm())}
        />
        <button className="admin-btn admin-btn--xs admin-btn--primary" onClick={handleCustomConfirm}>✓</button>
        <button className="admin-btn admin-btn--xs" onClick={() => { setIsCustom(false); onChange(value || "Khác"); }}>✕</button>
      </div>
    );
  }

  return (
    <select value={value} onChange={handleSelectChange} className="admin-form__select">
      {categories.map(c => (
        <option key={c} value={c}>{c}</option>
      ))}
      {value && !categories.includes(value) && (
        <option value={value}>{value}</option>
      )}
      <option value="__NEW__">+ Thêm loại mới...</option>
    </select>
  );
}

// ============ FEATURED SECTION EDITOR ============
function FeaturedSectionEditor({ products }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectionId, setSectionId] = useState(null);
  // Banner fields
  const [bannerImage, setBannerImage] = useState("");
  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubtitle, setBannerSubtitle] = useState("");
  const [bannerCta, setBannerCta] = useState("");
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerFileRef = useRef(null);

  useEffect(() => {
    fetchSection();
  }, []);

  async function fetchSection() {
    setLoading(true);
    const { data, error } = await supabase
      .from("featured_sections")
      .select("*")
      .eq("section_key", "editorial")
      .maybeSingle();

    if (!error && data) {
      setSectionId(data.id);
      setTitle(data.title || "");
      setDescription(data.description || "");
      setSelectedIds(data.product_ids || []);
      setIsActive(data.is_active !== false);
      setBannerImage(data.banner_image || "");
      setBannerTitle(data.banner_title || "");
      setBannerSubtitle(data.banner_subtitle || "");
      setBannerCta(data.banner_cta || "");
    }
    setLoading(false);
  }

  async function handleUploadBanner(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBanner(true);
    const url = await uploadProductImage(file, BANNER_UPLOAD_FOLDER);
    if (url) {
      setBannerImage(url);
      showMsg("success", "Đã upload ảnh banner");
    } else {
      showMsg("error", "Lỗi upload ảnh banner");
    }
    setUploadingBanner(false);
    if (bannerFileRef.current) bannerFileRef.current.value = "";
  }

  function removeBannerImage() {
    if (bannerImage && !bannerImage.startsWith("/")) deleteProductImage(bannerImage);
    setBannerImage("");
  }

  function showMsg(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  function toggleProduct(productId) {
    setSelectedIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        section_key: "editorial",
        title,
        description,
        product_ids: selectedIds,
        is_active: isActive,
        banner_image: bannerImage,
        banner_title: bannerTitle,
        banner_subtitle: bannerSubtitle,
        banner_cta: bannerCta,
        updated_at: new Date().toISOString(),
      };

      if (sectionId) {
        const { error } = await supabase
          .from("featured_sections")
          .update(payload)
          .eq("id", sectionId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from("featured_sections")
          .insert([payload])
          .select("id")
          .single();
        if (error) throw error;
        setSectionId(data.id);
      }

      showMsg("success", "Đã lưu cài đặt trang chủ!");
    } catch (err) {
      showMsg("error", "Lỗi lưu: " + err.message);
    }
    setSaving(false);
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="admin-loading__spinner" />
        <p>Đang tải cài đặt...</p>
      </div>
    );
  }

  return (
    <div className="admin-form">
      {message && (
        <div className={`admin-msg admin-msg--${message.type}`} onClick={() => setMessage(null)}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      {/* Banner Settings */}
      <section className="admin-form__section">
        <h2 className="admin-form__section-title">🖼️ Banner trang chủ</h2>

        <div className="admin-form__field" style={{ marginBottom: "1rem" }}>
          <label>Ảnh banner</label>
          <div className="admin-banner-preview">
            {bannerImage && (
              <div className="admin-banner-preview__img-wrap">
                <img src={bannerImage} alt="Banner preview" />
                <button className="admin-banner-preview__remove" onClick={removeBannerImage}>✕ Xóa ảnh</button>
              </div>
            )}
            <div className="admin-upload-btns">
              <label className={`admin-btn admin-btn--sm admin-btn--primary ${uploadingBanner ? "admin-btn--loading" : ""}`}>
                {uploadingBanner ? "⏳ Đang upload..." : "📤 Upload ảnh banner"}
                <input type="file" accept="image/*" hidden ref={bannerFileRef} onChange={handleUploadBanner} disabled={uploadingBanner} />
              </label>
            </div>
          </div>
        </div>

        <div className="admin-form__grid">
          <div className="admin-form__field admin-form__field--full">
            <label>Tiêu đề banner</label>
            <input
              type="text"
              value={bannerTitle}
              onChange={e => setBannerTitle(e.target.value)}
              placeholder="VD: Khám phá bộ sưu tập mùa xuân."
            />
          </div>
          <div className="admin-form__field">
            <label>Phụ đề</label>
            <input
              type="text"
              value={bannerSubtitle}
              onChange={e => setBannerSubtitle(e.target.value)}
              placeholder="VD: Xuân 2026"
            />
          </div>
          <div className="admin-form__field">
            <label>Nút CTA</label>
            <input
              type="text"
              value={bannerCta}
              onChange={e => setBannerCta(e.target.value)}
              placeholder="VD: Sắc màu mới đã có mặt"
            />
          </div>
        </div>
      </section>

      {/* Section Settings */}
      <section className="admin-form__section">
        <h2 className="admin-form__section-title">🌟 Phần sản phẩm nổi bật</h2>

        <div className="admin-form__field" style={{ marginBottom: "1rem" }}>
          <label className="admin-toggle-label">
            <span className={`admin-toggle ${isActive ? "active" : ""}`} onClick={() => setIsActive(!isActive)}>
              <span className="admin-toggle__knob" />
            </span>
            <span>{isActive ? "Đang hiển thị" : "Đang ẩn"}</span>
          </label>
        </div>

        <div className="admin-form__grid">
          <div className="admin-form__field admin-form__field--full">
            <label>Tiêu đề</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="VD: Sắc màu mùa xuân."
            />
          </div>
          <div className="admin-form__field admin-form__field--full">
            <label>Mô tả</label>
            <textarea
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Mô tả cho phần nổi bật..."
            />
          </div>
        </div>
      </section>

      {/* Product Picker */}
      <section className="admin-form__section">
        <h2 className="admin-form__section-title">
          📦 Chọn sản phẩm hiển thị
          <span className="admin-form__section-badge">{selectedIds.length} đã chọn</span>
        </h2>

        <div className="admin-form__field" style={{ marginBottom: "1rem" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="🔍 Tìm kiếm sản phẩm..."
            className="admin-search"
          />
        </div>

        <div className="admin-product-picker">
          {filteredProducts.length === 0 ? (
            <div className="admin-empty">
              <span>📦</span>
              <p>Không tìm thấy sản phẩm</p>
            </div>
          ) : (
            filteredProducts.map(p => {
              const isSelected = selectedIds.includes(p.id);
              const firstVariant = p.variants?.[0];
              return (
                <div
                  key={p.id}
                  className={`admin-product-picker__item ${isSelected ? "selected" : ""}`}
                  onClick={() => toggleProduct(p.id)}
                >
                  <div className="admin-product-picker__checkbox">
                    {isSelected && <span>✓</span>}
                  </div>
                  <div className="admin-product-picker__img">
                    {p.card_image ? (
                      <img src={p.card_image} alt={p.name} />
                    ) : (
                      <div className="admin-product-card__placeholder">📷</div>
                    )}
                  </div>
                  <div className="admin-product-picker__info">
                    <span className="admin-product-picker__name">{p.name}</span>
                    {firstVariant && (
                      <span className="admin-product-picker__price">
                        {firstVariant.sale_price
                          ? Number(firstVariant.sale_price).toLocaleString("vi-VN") + "đ"
                          : Number(firstVariant.original_price).toLocaleString("vi-VN") + "đ"}
                      </span>
                    )}
                  </div>
                  {isSelected && (
                    <span className="admin-product-picker__order">
                      #{selectedIds.indexOf(p.id) + 1}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Save Button */}
      <div className="admin-form__footer">
        <button className="admin-btn admin-btn--primary admin-btn--lg" onClick={handleSave} disabled={saving}>
          {saving ? "⏳ Đang lưu..." : "💾 Lưu cài đặt trang chủ"}
        </button>
      </div>
    </div>
  );
}

// ============ FEATURE SECTION EDITOR ============
function FeatureSectionEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [featureImage, setFeatureImage] = useState("");
  const [featureLabel, setFeatureLabel] = useState("");
  const [featureTitle, setFeatureTitle] = useState("");
  const [featureDesc, setFeatureDesc] = useState("");
  const [featureCta, setFeatureCta] = useState("");
  const [uploadingFeature, setUploadingFeature] = useState(false);
  const featureFileRef = useRef(null);

  useEffect(() => { fetchFeature(); }, []);

  async function fetchFeature() {
    setLoading(true);
    const { data } = await supabase
      .from("featured_sections")
      .select("*")
      .eq("section_key", "feature")
      .maybeSingle();
    if (data) {
      setSectionId(data.id);
      setIsActive(data.is_active !== false);
      setFeatureImage(data.banner_image || "");
      setFeatureLabel(data.banner_title || "");
      setFeatureTitle(data.title || "");
      setFeatureDesc(data.description || "");
      setFeatureCta(data.banner_cta || "");
    }
    setLoading(false);
  }

  function showMsg(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  async function handleUploadFeatureImg(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFeature(true);
    const url = await uploadProductImage(file, "feature");
    if (url) { setFeatureImage(url); showMsg("success", "Đã upload ảnh"); }
    else showMsg("error", "Lỗi upload ảnh");
    setUploadingFeature(false);
    if (featureFileRef.current) featureFileRef.current.value = "";
  }

  function removeFeatureImg() {
    if (featureImage && !featureImage.startsWith("/")) deleteProductImage(featureImage);
    setFeatureImage("");
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        section_key: "feature",
        title: featureTitle,
        description: featureDesc,
        is_active: isActive,
        banner_image: featureImage,
        banner_title: featureLabel,
        banner_cta: featureCta,
        updated_at: new Date().toISOString(),
      };
      if (sectionId) {
        const { error } = await supabase.from("featured_sections").update(payload).eq("id", sectionId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("featured_sections").insert([{ ...payload, product_ids: [] }]).select("id").single();
        if (error) throw error;
        setSectionId(data.id);
      }
      showMsg("success", "Đã lưu phần Feature!");
    } catch (err) {
      showMsg("error", "Lá»—i: " + err.message);
    }
    setSaving(false);
  }

  if (loading) return null;

  return (
    <div className="admin-form" style={{ paddingTop: 0 }}>
      {message && (
        <div className={`admin-msg admin-msg--${message.type}`} onClick={() => setMessage(null)}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}
      <section className="admin-form__section">
        <h2 className="admin-form__section-title">📱 Phần đặc sắc (Feature)</h2>

        <div className="admin-form__field" style={{ marginBottom: "1rem" }}>
          <label className="admin-toggle-label">
            <span className={`admin-toggle ${isActive ? "active" : ""}`} onClick={() => setIsActive(!isActive)}>
              <span className="admin-toggle__knob" />
            </span>
            <span>{isActive ? "Đang hiển thị" : "Đang ẩn"}</span>
          </label>
        </div>

        <div className="admin-form__field" style={{ marginBottom: "1rem" }}>
          <label>Ảnh</label>
          <div className="admin-banner-preview">
            {featureImage && (
              <div className="admin-banner-preview__img-wrap">
                <img src={featureImage} alt="Feature preview" />
                <button className="admin-banner-preview__remove" onClick={removeFeatureImg}>✕ Xóa</button>
              </div>
            )}
            <div className="admin-upload-btns">
              <label className={`admin-btn admin-btn--sm admin-btn--primary ${uploadingFeature ? "admin-btn--loading" : ""}`}>
                {uploadingFeature ? "⏳..." : "📤 Upload ảnh"}
                <input type="file" accept="image/*" hidden ref={featureFileRef} onChange={handleUploadFeatureImg} disabled={uploadingFeature} />
              </label>
            </div>
          </div>
        </div>

        <div className="admin-form__grid">
          <div className="admin-form__field">
            <label>Nhãn phụ</label>
            <input type="text" value={featureLabel} onChange={e => setFeatureLabel(e.target.value)} placeholder="VD: Phiên Bản Giới Hạn" />
          </div>
          <div className="admin-form__field">
            <label>Nút CTA</label>
            <input type="text" value={featureCta} onChange={e => setFeatureCta(e.target.value)} placeholder="VD: Mua ngay" />
          </div>
          <div className="admin-form__field admin-form__field--full">
            <label>Tiêu đề</label>
            <input type="text" value={featureTitle} onChange={e => setFeatureTitle(e.target.value)} placeholder="VD: Kết nối tức thì." />
          </div>
          <div className="admin-form__field admin-form__field--full">
            <label>Mô tả</label>
            <textarea rows={3} value={featureDesc} onChange={e => setFeatureDesc(e.target.value)} placeholder="Mô tả..." />
          </div>
        </div>

        <div style={{ marginTop: "16px" }}>
          <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? "⏳ Đang lưu..." : "💾 Lưu Feature"}
          </button>
        </div>
      </section>
    </div>
  );
}

// ============ BRAND VALUES EDITOR ============
function BrandValuesEditor() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [sectionId, setSectionId] = useState(null);
  const [isActive, setIsActive] = useState(true);
  const [sectionTitle, setSectionTitle] = useState("");
  const [cards, setCards] = useState([
    { icon: "✦", title: "", desc: "", link: "" },
    { icon: "♡", title: "", desc: "", link: "" },
    { icon: "â—Ž", title: "", desc: "", link: "" },
  ]);

  useEffect(() => { fetchBrandValues(); }, []);

  async function fetchBrandValues() {
    setLoading(true);
    const { data } = await supabase
      .from("featured_sections")
      .select("*")
      .eq("section_key", "brand_values")
      .maybeSingle();
    if (data) {
      setSectionId(data.id);
      setIsActive(data.is_active !== false);
      setSectionTitle(data.title || "");
      if (data.brand_values_data && data.brand_values_data.length > 0) {
        setCards(data.brand_values_data);
      }
    }
    setLoading(false);
  }

  function showMsg(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  function updateCard(idx, field, value) {
    setCards(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = {
        section_key: "brand_values",
        title: sectionTitle,
        is_active: isActive,
        brand_values_data: cards,
        updated_at: new Date().toISOString(),
      };
      if (sectionId) {
        const { error } = await supabase.from("featured_sections").update(payload).eq("id", sectionId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from("featured_sections").insert([{ ...payload, product_ids: [] }]).select("id").single();
        if (error) throw error;
        setSectionId(data.id);
      }
      showMsg("success", "Đã lưu Brand Values!");
    } catch (err) {
      showMsg("error", "Lá»—i: " + err.message);
    }
    setSaving(false);
  }

  if (loading) return null;

  return (
    <div className="admin-form" style={{ paddingTop: 0 }}>
      {message && (
        <div className={`admin-msg admin-msg--${message.type}`} onClick={() => setMessage(null)}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}
      <section className="admin-form__section">
        <h2 className="admin-form__section-title">🌿 Giá trị thương hiệu (Brand Values)</h2>

        <div className="admin-form__field" style={{ marginBottom: "1rem" }}>
          <label className="admin-toggle-label">
            <span className={`admin-toggle ${isActive ? "active" : ""}`} onClick={() => setIsActive(!isActive)}>
              <span className="admin-toggle__knob" />
            </span>
            <span>{isActive ? "Đang hiển thị" : "Đang ẩn"}</span>
          </label>
        </div>

        <div className="admin-form__field" style={{ marginBottom: "1.5rem" }}>
          <label>Tiêu đề section</label>
          <input type="text" value={sectionTitle} onChange={e => setSectionTitle(e.target.value)} placeholder="VD: rhode + bạn" />
        </div>

        <div className="admin-brand-cards">
          {cards.map((card, idx) => (
            <div key={idx} className="admin-brand-card">
              <div className="admin-brand-card__header">Thẻ {idx + 1}</div>
              <div className="admin-form__grid">
                <div className="admin-form__field">
                  <label>Icon</label>
                  <input type="text" value={card.icon} onChange={e => updateCard(idx, "icon", e.target.value)} placeholder="VD: ✦" />
                </div>
                <div className="admin-form__field">
                  <label>Link text</label>
                  <input type="text" value={card.link} onChange={e => updateCard(idx, "link", e.target.value)} placeholder="VD: Giá Trị" />
                </div>
                <div className="admin-form__field admin-form__field--full">
                  <label>Tiêu đề</label>
                  <input type="text" value={card.title} onChange={e => updateCard(idx, "title", e.target.value)} placeholder="Tiêu đề thẻ" />
                </div>
                <div className="admin-form__field admin-form__field--full">
                  <label>Mô tả</label>
                  <textarea rows={2} value={card.desc} onChange={e => updateCard(idx, "desc", e.target.value)} placeholder="Mô tả thẻ..." />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "16px" }}>
          <button className="admin-btn admin-btn--primary" onClick={handleSave} disabled={saving}>
            {saving ? "⏳ Đang lưu..." : "💾 Lưu Brand Values"}
          </button>
        </div>
      </section>
    </div>
  );
}

// ============ ORDERS EXPORT ============
function OrdersExport() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split("T")[0]);

  function showMsg(type, text) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 4000);
  }

  async function handleExport() {
    setLoading(true);
    try {
      const fromDate = new Date(dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      const toDate = new Date(dateTo);
      toDate.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", fromDate.toISOString())
        .lte("created_at", toDate.toISOString())
        .order("created_at", { ascending: false });

      if (error) throw error;
      if (!data || data.length === 0) {
        showMsg("error", "Không có đơn hàng trong khoảng thời gian này");
        setLoading(false);
        return;
      }

      const XLSX = await import("xlsx");

      const rows = data.map(order => {
        const items = order.items || [];
        return {
          "Mã đơn": order.id.substring(0, 8),
          "Ngày đặt": new Date(order.created_at).toLocaleString("vi-VN"),
          "Khách hàng": order.customer_name,
          "Email": order.customer_email,
          "SĐT": order.customer_phone || "",
          "Địa chỉ": order.shipping_address,
          "Thành phố": order.shipping_city,
          "Ghi chú": order.shipping_note || "",
          "Sản phẩm": items.map(it => {
            const variant = it.shade || it.variant || "";
            const qty = it.qty || it.quantity || 1;
            return `${it.name || ""}${variant ? " - " + variant : ""} x${qty}`;
          }).join("; "),
          "Tạm tính": Number(order.subtotal),
          "Phí ship": Number(order.shipping_fee || 0),
          "Tổng cộng": Number(order.total),
          "Thanh toán": order.payment_method === "cod" ? "COD" : order.payment_method,
          "Trạng thái": order.status,
        };
      });

      const ws = XLSX.utils.json_to_sheet(rows);
      ws["!cols"] = Object.keys(rows[0]).map(key => ({
        wch: Math.max(key.length + 2, ...rows.slice(0, 20).map(r => String(r[key] || "").length))
      }));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Đơn hàng");
      XLSX.writeFile(wb, `don-hang_${dateFrom}_${dateTo}.xlsx`);
      showMsg("success", `Đã tải ${rows.length} đơn hàng!`);
    } catch (err) {
      showMsg("error", "Lỗi: " + err.message);
    }
    setLoading(false);
  }

  return (
    <div className="admin-form">
      {message && (
        <div className={`admin-msg admin-msg--${message.type}`} onClick={() => setMessage(null)}>
          {message.type === "success" ? "✅" : "❌"} {message.text}
        </div>
      )}

      <section className="admin-form__section">
        <h2 className="admin-form__section-title">📋 Xuất đơn hàng ra Excel</h2>

        <div className="admin-form__grid">
          <div className="admin-form__field">
            <label>Từ ngày</label>
            <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          </div>
          <div className="admin-form__field">
            <label>Đến ngày</label>
            <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} />
          </div>
        </div>

        <div style={{ marginTop: "16px" }}>
          <button className="admin-btn admin-btn--primary admin-btn--lg" onClick={handleExport} disabled={loading} style={{ background: "#27ae60" }}>
            {loading ? "⏳ Đang xử lý..." : "📥 Tải Excel"}
          </button>
        </div>
      </section>
    </div>
  );
}
