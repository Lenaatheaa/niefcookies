import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShoppingBag, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Phone, 
  MapPin, 
  Clock, 
  Star, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  X, 
  ExternalLink, 
  MessageCircle, 
  Share2, 
  ShieldCheck, 
  Flame, 
  RefreshCw, 
  Check, 
  Info,
  ChevronRight,
  SlidersHorizontal,
  Lock,
  Unlock,
  Upload,
  Camera,
  Menu
} from 'lucide-react';
import { INITIAL_PRODUCTS, BUSINESS_INFO } from './data/initialProducts';

const STORAGE_KEY = 'nief_cookies_products_v2';

export default function App() {
  // State data produk (disimpan di LocalStorage)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed reading localStorage', e);
    }
    return INITIAL_PRODUCTS;
  });

  // Mode Admin & UI States
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [adminPin, setAdminPin] = useState('');
  const [adminError, setAdminError] = useState('');

  // File Upload Ref
  const fileInputRef = useRef(null);

  // Form State untuk Tambah / Edit Produk (Termasuk Rating & Upload Foto)
  const [formData, setFormData] = useState({
    name: '',
    category: 'Cokelat & Manis',
    price: '',
    weight: 'Toples 450 gr',
    rating: 4.9,
    soldCount: '150+ terjual',
    image: '',
    isBestSeller: true,
    stockStatus: 'Ready Stock',
    badge: 'Cookies Pilihan',
    description: '',
    ingredientsText: 'Terigu, Butter Wijsman, Kuning telur, Gula halus, Choco chips, Vaneli'
  });

  // Simpan ke localStorage setiap ada perubahan pada products
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed saving to localStorage', e);
    }
  }, [products]);

  // Toast Helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Helper WhatsApp Link Generator
  const createWhatsAppUrl = (product = null) => {
    const phone = BUSINESS_INFO.phone.replace(/^0/, '62');
    let text = `Halo Nief Cookies! Saya ingin bertanya seputar produk cookies.`;
    if (product) {
      text = `Halo Nief Cookies! Saya mau cek stok dan pesan *${product.name}* (${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)} - ${product.weight}). Apakah stok masih tersedia?`;
    }
    return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  };

  // Categories list
  const categories = useMemo(() => {
    return ['Semua', 'Terlaris (Best Seller)', 'Cokelat & Manis', 'Keju & Gurih', 'Artisan & Spesial'];
  }, []);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description?.toLowerCase().includes(searchQuery.toLowerCase());
      if (selectedCategory === 'Semua') return matchSearch;
      if (selectedCategory === 'Terlaris (Best Seller)') return matchSearch && p.isBestSeller;
      return matchSearch && p.category === selectedCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Best seller list for spotlight
  const bestSellerProducts = useMemo(() => {
    return products.filter(p => p.isBestSeller);
  }, [products]);

  // Handler Upload Foto dari File Perangkat (Komputer / HP)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Harap pilih file gambar (JPG, PNG, WebP)!');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran foto terlalu besar. Maksimal 8MB!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData(prev => ({ ...prev, image: event.target.result }));
        showToast('Foto produk berhasil diunggah!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Open Form Add Product
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      category: 'Cokelat & Manis',
      price: '',
      weight: 'Toples 450 gr',
      rating: 4.9,
      soldCount: '150+ terjual',
      image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
      isBestSeller: true,
      stockStatus: 'Ready Stock',
      badge: 'Favorit Baru',
      description: 'Artisan cookies berkualitas tinggi dengan tekstur renyah dan lumer khas resep Nief Cookies.',
      ingredientsText: 'Terigu, Butter Wijsman, Kuning telur, Gula halus, Choco chips, Vaneli'
    });
    setIsModalOpen(true);
  };

  // Open Form Edit Product
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category || 'Cokelat & Manis',
      price: product.price,
      weight: product.weight || 'Toples 450 gr',
      rating: product.rating !== undefined ? product.rating : 4.9,
      soldCount: product.soldCount || '100+ terjual',
      image: product.image || 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
      isBestSeller: !!product.isBestSeller,
      stockStatus: product.stockStatus || 'Ready Stock',
      badge: product.badge || 'Cookies Pilihan',
      description: product.description || '',
      ingredientsText: Array.isArray(product.ingredients) ? product.ingredients.join(', ') : (product.ingredients || '')
    });
    setIsModalOpen(true);
  };

  // Submit Add or Edit Product (CRUD)
  const handleSubmitProduct = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Mohon isi nama produk dan harga!');
      return;
    }

    const ingredientsArray = formData.ingredientsText
      ? formData.ingredientsText.split(',').map(s => s.trim()).filter(Boolean)
      : ['Terigu', 'Kuning telur', 'Mentega', 'Butter', 'Gula halus', 'Vaneli'];

    const newProductData = {
      id: editingProduct ? editingProduct.id : `prod-${Date.now()}`,
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      weight: formData.weight,
      rating: Number(formData.rating) || 4.9,
      soldCount: formData.soldCount || '100+ terjual',
      image: formData.image || 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80',
      isBestSeller: formData.isBestSeller,
      stockStatus: formData.stockStatus,
      badge: formData.badge,
      description: formData.description,
      ingredients: ingredientsArray
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? newProductData : p));
      showToast(`Sukses memperbarui "${newProductData.name}"!`);
    } else {
      setProducts(prev => [newProductData, ...prev]);
      showToast(`Sukses menambahkan produk baru "${newProductData.name}"!`);
    }

    setIsModalOpen(false);
  };

  // Delete Product (CRUD)
  const handleDeleteProduct = (product) => {
    if (window.confirm(`Yakin ingin menghapus produk "${product.name}"?`)) {
      setProducts(prev => prev.filter(p => p.id !== product.id));
      showToast(`Produk "${product.name}" berhasil dihapus.`);
    }
  };

  // Reset to Default Products
  const handleResetDefault = () => {
    if (window.confirm('Apakah Anda ingin memulihkan semua produk ke katalog bawaan Nief Cookies?')) {
      setProducts(INITIAL_PRODUCTS);
      showToast('Katalog produk berhasil di-reset ke daftar awal.');
    }
  };

  // Toggle Admin Mode
  const handleToggleAdmin = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
      showToast('Keluar dari Mode Admin');
    } else {
      setIsAdminLoginOpen(true);
      setAdminPin('');
      setAdminError('');
    }
  };

  const handleVerifyAdminPin = (e) => {
    e.preventDefault();
    if (adminPin === '1234' || adminPin.toLowerCase() === 'admin' || adminPin === '') {
      setIsAdminMode(true);
      setIsAdminLoginOpen(false);
      showToast('Mode Admin Aktif! Anda sekarang dapat Menambah, Mengubah, atau Menghapus Produk.');
    } else {
      setAdminError('PIN salah! Silakan coba lagi (PIN default: 1234 atau kosongkan saja).');
    }
  };

  return (
    <div className="site-wrapper">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notice">
          <CheckCircle2 size={20} color="#D49A3D" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner Notice */}
      <div style={{ background: '#432818', color: '#F6E6C9', padding: '0.45rem 1rem', fontSize: '0.825rem', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
        <Sparkles size={15} color="#D49A3D" />
        <span><strong>Freshly Baked Artisan Cookies:</strong> Dapatkan Free Bubble Wrap Tebal & Garansi Cookies Sampai Utuh! Hubungi WhatsApp: <strong>{BUSINESS_INFO.phone}</strong></span>
      </div>

      {/* Navbar Header */}
      <header className="navbar">
        <div className="container">
          <div className="navbar-inner">
            {/* Logo & Brand Name */}
            <a href="#beranda" className="brand-logo-wrap">
              <img 
                src="/images/logo.jpg" 
                alt="Nief Cookies Logo" 
                className="brand-logo-img"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=150&q=80';
                }}
              />
              <div className="brand-text">
                <h1>{BUSINESS_INFO.name}</h1>
                <p>Artisan Cookies • Est. 2020</p>
              </div>
            </a>

            {/* Nav Links Desktop */}
            <nav>
              <ul className="nav-links">
                <li><a href="#beranda" className="nav-link">Beranda</a></li>
                <li><a href="#terlaris" className="nav-link">Produk Terlaris</a></li>
                <li><a href="#semua-produk" className="nav-link">Katalog Cookies</a></li>
                <li><a href="#bahan-pilihan" className="nav-link">Bahan Premium</a></li>
                <li><a href="#tentang-kontak" className="nav-link">Kontak & Alamat</a></li>
              </ul>
            </nav>

            {/* Nav Actions Desktop */}
            <div className="nav-actions">
              <button 
                onClick={handleToggleAdmin}
                className={`btn btn-admin ${isAdminMode ? 'active' : ''}`}
                title="Kelola Produk (CRUD Admin)"
              >
                {isAdminMode ? <Unlock size={14} /> : <Lock size={14} />}
                <span>{isAdminMode ? 'Admin: ON' : 'Kelola Produk'}</span>
              </button>

              <a 
                href={createWhatsAppUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-wa"
                style={{ padding: '0.55rem 1.15rem', fontSize: '0.85rem' }}
              >
                <MessageCircle size={16} />
                <span>Chat WA</span>
              </a>
            </div>

            {/* Tombol Garis 3 (Hamburger Menu) untuk Mode HP / Layar Setengah */}
            <button 
              className={`nav-hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </header>

      {/* Drawer Menu Mobile (Saat garis 3 diklik) */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="mobile-menu-backdrop"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <div className="mobile-menu-drawer">
            <div className="mobile-menu-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <img 
                  src="/images/logo.jpg" 
                  alt="Nief Cookies" 
                  style={{ width: '38px', height: '38px', borderRadius: '50%', border: '1px solid #D49A3D' }} 
                />
                <div>
                  <h3 className="font-serif" style={{ fontSize: '1.15rem', margin: 0 }}>{BUSINESS_INFO.name}</h3>
                  <span style={{ fontSize: '0.7rem', color: '#B37D28', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Artisan Cookies</span>
                </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="btn-close">
                <X size={20} />
              </button>
            </div>

            <ul className="mobile-menu-links">
              <li>
                <a 
                  href="#beranda" 
                  className="mobile-menu-link" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Beranda</span>
                  <ChevronRight size={16} color="#B37D28" />
                </a>
              </li>
              <li>
                <a 
                  href="#terlaris" 
                  className="mobile-menu-link" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Produk Terlaris</span>
                  <ChevronRight size={16} color="#B37D28" />
                </a>
              </li>
              <li>
                <a 
                  href="#semua-produk" 
                  className="mobile-menu-link" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Katalog Semua Cookies</span>
                  <ChevronRight size={16} color="#B37D28" />
                </a>
              </li>
              <li>
                <a 
                  href="#bahan-pilihan" 
                  className="mobile-menu-link" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Bahan-Bahan Pilihan</span>
                  <ChevronRight size={16} color="#B37D28" />
                </a>
              </li>
              <li>
                <a 
                  href="#tentang-kontak" 
                  className="mobile-menu-link" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span>Kontak, Medsos & Alamat</span>
                  <ChevronRight size={16} color="#B37D28" />
                </a>
              </li>
            </ul>

            <div className="mobile-menu-actions">
              <button 
                onClick={() => { setIsMobileMenuOpen(false); handleToggleAdmin(); }}
                className={`btn btn-secondary`}
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {isAdminMode ? <Unlock size={16} /> : <Lock size={16} />}
                <span>{isAdminMode ? 'Keluar Mode Admin' : 'Kelola Produk (Admin)'}</span>
              </button>

              <a 
                href={createWhatsAppUrl()} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-wa"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <MessageCircle size={18} />
                <span>Chat WhatsApp ({BUSINESS_INFO.phone})</span>
              </a>

              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9E8D82', marginTop: '0.5rem' }}>
                {BUSINESS_INFO.openingHours}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Hero Section Sesuai Guide Book */}
      <section 
        id="beranda" 
        className="hero-section" 
        style={{ backgroundImage: `url('/images/hero.jpg')` }}
      >
        <div className="hero-overlay"></div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-pill">
              <Sparkles size={16} />
              <span>Authentic Homemade Taste sejak 2020</span>
            </div>

            {/* Tulisan Latar Pendahuluan Sesuai Permintaan */}
            <h1 className="hero-title">
              Percayakan artisan cookies terbaik untuk <span>setiap momen Anda</span>
            </h1>

            {/* Tulisan Sub-headline Sesuai Permintaan */}
            <p className="hero-subtitle">
              Nief Cookies dipercaya sejak 2020 dan Sudah Menyelesaikan 2000+ Pesanan. Dibuat fresh setiap hari dengan butter pilihan yang wangi, renyah, dan lumer di mulut.
            </p>

            <div className="hero-buttons">
              <a href="#terlaris" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
                <ShoppingBag size={18} />
                <span>Lihat Produk Terlaris</span>
              </a>
              <a 
                href={createWhatsAppUrl()} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-secondary"
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
              >
                <Phone size={18} />
                <span>Hubungi: {BUSINESS_INFO.phone}</span>
              </a>
            </div>

            <div className="hero-stats">
              <div className="stat-item">
                <h4>2020</h4>
                <p>Berpengalaman Sejak</p>
              </div>
              <div className="stat-item">
                <h4>2.000+</h4>
                <p>Pesanan Terselesaikan</p>
              </div>
              <div className="stat-item">
                <h4>100%</h4>
                <p>Butter & Bahan Premium</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Admin Quick Bar (Only visible when Admin Mode is ON) */}
      {isAdminMode && (
        <div style={{ background: '#FAF6F0', borderBottom: '2px dashed #D49A3D', padding: '1rem 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', borderRadius: '50%', background: '#25D366' }}></span>
              <strong style={{ color: '#432818', fontSize: '0.95rem' }}>Mode Admin Aktif:</strong>
              <span style={{ color: '#6A584D', fontSize: '0.875rem' }}>Bisa Upload Foto File dari HP/Laptop, Edit Rating Bintang, Tambah, Edit & Hapus Cookies.</span>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleOpenAddModal} className="btn btn-primary" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
                <Plus size={16} />
                <span>+ Tambah Produk Baru</span>
              </button>
              <button onClick={handleResetDefault} className="btn btn-secondary" style={{ padding: '0.45rem 0.95rem', fontSize: '0.85rem' }} title="Pulihkan data awal">
                <RefreshCw size={14} />
                <span>Reset Data</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Section 1: Produk Terlaris (Sesuai Guide Book Bagian 3) */}
      <section id="terlaris" className="section-padding" style={{ backgroundColor: '#FAF6F0' }}>
        <div className="container">
          <div className="text-center">
            <span className="section-badge">
              <Flame size={14} />
              Pilihan Favorit Pelanggan
            </span>
            <h2 className="section-title">Produk Terlaris Nief Cookies</h2>
            <p className="section-desc">
              Cookies paling banyak dipesan untuk camilan santai, hampers hadiah, dan teman kopi harian Anda. Tersedia tombol cek stok yang langsung terhubung ke WhatsApp.
            </p>
          </div>

          <div className="products-grid">
            {bestSellerProducts.slice(0, 4).map((product) => (
              <div key={product.id} className="product-card">
                {/* Kotakan Foto */}
                <div className="card-img-wrap" onClick={() => setDetailProduct(product)} style={{ cursor: 'pointer' }}>
                  <img 
                    src={product.image} 
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80';
                    }}
                  />
                  <span className="badge-bestseller">
                    <Flame size={12} />
                    {product.badge || 'Terlaris'}
                  </span>
                  <span className="badge-stock">
                    {product.stockStatus || 'Ready'}
                  </span>
                </div>

                {/* Kotakan Isi */}
                <div className="card-body">
                  <div className="card-meta">
                    <span className="card-category">{product.category}</span>
                    <div className="card-rating">
                      <Star size={13} fill="#E68A00" color="#E68A00" />
                      <span>{product.rating}</span>
                      <span style={{ color: '#9E8D82', fontWeight: 400 }}>({product.soldCount})</span>
                    </div>
                  </div>

                  {/* Nama Produk */}
                  <h3 
                    className="card-title font-serif" 
                    onClick={() => setDetailProduct(product)} 
                    style={{ cursor: 'pointer' }}
                  >
                    {product.name}
                  </h3>

                  <p className="card-desc">{product.description}</p>

                  <div className="card-footer">
                    <div className="price-wrap">
                      <span className="product-price">
                        {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
                      </span>
                      <span className="product-weight">{product.weight}</span>
                    </div>

                    {/* Tombol Kotakan Cek Stock Langsung ke WA Sesuai Permintaan */}
                    <a 
                      href={createWhatsAppUrl(product)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-cek-stok"
                    >
                      <MessageCircle size={18} />
                      <span>Cek Stok (WhatsApp)</span>
                    </a>

                    {/* Detail Button */}
                    <button 
                      onClick={() => setDetailProduct(product)}
                      style={{ 
                        width: '100%', 
                        marginTop: '0.45rem', 
                        background: 'transparent', 
                        border: 'none', 
                        color: '#6F452A', 
                        fontSize: '0.8rem', 
                        fontWeight: 600, 
                        cursor: 'pointer',
                        padding: '0.35rem 0'
                      }}
                    >
                      Lihat Resep Bahan & Detail →
                    </button>

                    {/* Admin Actions jika aktif */}
                    {isAdminMode && (
                      <div className="card-admin-bar">
                        <button 
                          onClick={() => handleOpenEditModal(product)} 
                          className="btn-admin-action"
                        >
                          <Edit3 size={13} />
                          <span>Edit</span>
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(product)} 
                          className="btn-admin-action btn-admin-delete"
                        >
                          <Trash2 size={13} />
                          <span>Hapus</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Bahan-Bahan Pilihan (Sesuai Guide Book Bagian Bahan) */}
      <section id="bahan-pilihan" className="section-padding ingredients-section">
        <div className="container">
          <div className="text-center">
            <span className="section-badge">
              <Award size={14} />
              Kualitas Tanpa Kompromi
            </span>
            <h2 className="section-title">Bahan-Bahan Premium Pilihan</h2>
            <p className="section-desc">
              Kelezatan dan keharuman cookies Nief Cookies berakar dari bahan-bahan bermutu tinggi pilihan tanpa bahan pengawet buatan.
            </p>
          </div>

          <div className="ingredients-grid">
            {BUSINESS_INFO.standardIngredients.map((item, index) => (
              <div key={index} className="ingredient-card">
                <div className="ingredient-icon">
                  <CheckCircle2 size={26} />
                </div>
                <div className="ingredient-info">
                  <h4 className="font-serif">{item.name}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Higienis & Halal */}
          <div style={{
            marginTop: '3.5rem',
            background: 'linear-gradient(135deg, #432818 0%, #2B180E 100%)',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.5rem',
            boxShadow: '0 12px 30px rgba(67, 40, 24, 0.2)'
          }}>
            <div>
              <h3 style={{ color: '#F6E6C9', fontSize: '1.5rem', marginBottom: '0.5rem' }} className="font-serif">
                Jaminan Kualitas Nief Cookies
              </h3>
              <p style={{ color: '#E2D3C4', fontSize: '0.95rem', maxWidth: '580px' }}>
                Dipanggang secara higienis dengan resep turun-temurun. Mengutamakan kepuasan pelanggan dengan pengemasan toples kedap udara dan bubble wrap aman untuk pengiriman ke seluruh kota.
              </p>
            </div>
            <a 
              href={createWhatsAppUrl()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
              style={{ padding: '0.8rem 1.6rem' }}
            >
              <MessageCircle size={18} />
              <span>Konsultasi Pesanan</span>
            </a>
          </div>
        </div>
      </section>

      {/* Section 3: Semua Katalog Cookies & Filter Search (Lengkap dengan CRUD) */}
      <section id="semua-produk" className="section-padding" style={{ backgroundColor: '#FAF6F0' }}>
        <div className="container">
          <div className="text-center">
            <span className="section-badge">
              <ShoppingBag size={14} />
              Koleksi Lengkap
            </span>
            <h2 className="section-title">Koleksi Varian Cookies Pilihan</h2>
            <p className="section-desc">
              Pilih varian cookies favorit Anda: mulai dari cokelat lumer, manis legit, hingga gurih keju renyah.
            </p>
          </div>

          {/* Filter Bar & Search */}
          <div className="filter-bar">
            <div className="category-tabs">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div className="search-box">
                <Search size={16} color="#9E8D82" />
                <input 
                  type="text" 
                  placeholder="Cari cookies favorit (Choco Chip, Red Velvet, Keju...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9E8D82' }}>
                    <X size={14} />
                  </button>
                )}
              </div>

              {isAdminMode && (
                <button 
                  onClick={handleOpenAddModal} 
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  <Plus size={16} />
                  <span>Tambah Cookies</span>
                </button>
              )}
            </div>
          </div>

          {/* Grid Semua Produk */}
          {filteredProducts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #EFE4D6' }}>
              <p style={{ color: '#6A584D', fontSize: '1.1rem', marginBottom: '1rem' }}>
                Tidak ada produk cookies yang cocok dengan pencarian "<strong>{searchQuery}</strong>".
              </p>
              <button onClick={() => { setSearchQuery(''); setSelectedCategory('Semua'); }} className="btn btn-secondary">
                Tampilkan Semua Cookies
              </button>
            </div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-card">
                  {/* Foto Produk */}
                  <div className="card-img-wrap" onClick={() => setDetailProduct(product)} style={{ cursor: 'pointer' }}>
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=500&q=80';
                      }}
                    />
                    {product.isBestSeller && (
                      <span className="badge-bestseller">
                        <Flame size={12} />
                        Best Seller
                      </span>
                    )}
                    <span className="badge-stock">
                      {product.stockStatus || 'Ready'}
                    </span>
                  </div>

                  {/* Body Produk */}
                  <div className="card-body">
                    <div className="card-meta">
                      <span className="card-category">{product.category}</span>
                      <div className="card-rating">
                        <Star size={13} fill="#E68A00" color="#E68A00" />
                        <span>{product.rating}</span>
                        <span style={{ color: '#9E8D82', fontWeight: 400 }}>({product.soldCount})</span>
                      </div>
                    </div>

                    <h3 
                      className="card-title font-serif" 
                      onClick={() => setDetailProduct(product)} 
                      style={{ cursor: 'pointer' }}
                    >
                      {product.name}
                    </h3>

                    <p className="card-desc">{product.description}</p>

                    <div className="card-footer">
                      <div className="price-wrap">
                        <span className="product-price">
                          {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(product.price)}
                        </span>
                        <span className="product-weight">{product.weight}</span>
                      </div>

                      {/* Kotakan Cek Stock Menuju WhatsApp Sesuai Guide Book */}
                      <a 
                        href={createWhatsAppUrl(product)} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-cek-stok"
                      >
                        <MessageCircle size={18} />
                        <span>Cek Stok (WhatsApp)</span>
                      </a>

                      <button 
                        onClick={() => setDetailProduct(product)}
                        style={{ 
                          width: '100%', 
                          marginTop: '0.45rem', 
                          background: 'transparent', 
                          border: 'none', 
                          color: '#6F452A', 
                          fontSize: '0.8rem', 
                          fontWeight: 600, 
                          cursor: 'pointer',
                          padding: '0.35rem 0'
                        }}
                      >
                        Lihat Komposisi & Detail →
                      </button>

                      {/* Tombol Aksi Admin */}
                      {isAdminMode && (
                        <div className="card-admin-bar">
                          <button 
                            onClick={() => handleOpenEditModal(product)} 
                            className="btn-admin-action"
                          >
                            <Edit3 size={13} />
                            <span>Edit</span>
                          </button>
                          <button 
                            onClick={() => handleDeleteProduct(product)} 
                            className="btn-admin-action btn-admin-delete"
                          >
                            <Trash2 size={13} />
                            <span>Hapus</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 4: Media Sosial, Kontak HP & Google Maps (Sesuai Guide Book Bagian 4) */}
      <section id="tentang-kontak" className="section-padding social-contact-section">
        <div className="container">
          <div className="text-center">
            <span className="section-badge">
              <Share2 size={14} />
              Terhubung Bersama Kami
            </span>
            <h2 className="section-title">Media Sosial, Kontak & Alamat</h2>
            <p className="section-desc">
              Pilih channel media sosial resmi Nief Cookies untuk melihat katalog harian, review pelanggan, promo menarik, dan alamat lokasi kami.
            </p>
          </div>

          {/* Pilihan WA, Tiktok, Shopee, Instagram Sesuai Guide Book */}
          <div className="social-grid">
            {/* WhatsApp */}
            <a 
              href={createWhatsAppUrl()} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-card wa"
            >
              <div className="social-icon-box">
                <MessageCircle size={24} />
              </div>
              <div className="social-info">
                <h4 className="font-serif">WhatsApp</h4>
                <p>{BUSINESS_INFO.phone}</p>
                <span style={{ fontSize: '0.75rem', color: '#25D366', fontWeight: 600 }}>Chat Pemesanan & Cek Stok →</span>
              </div>
            </a>

            {/* TikTok */}
            <a 
              href={BUSINESS_INFO.tiktokUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-card tiktok"
            >
              <div className="social-icon-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.4a6.33 6.33 0 0 0-.85-.05A6.33 6.33 0 0 0 3.1 15.68 6.34 6.34 0 0 0 9.44 22a6.34 6.34 0 0 0 6.33-6.33V8.87a8.28 8.28 0 0 0 4.82 1.54v-3.45a4.85 4.85 0 0 1-1-.27z"/>
                </svg>
              </div>
              <div className="social-info">
                <h4 className="font-serif">TikTok</h4>
                <p>@niefcookies</p>
                <span style={{ fontSize: '0.75rem', color: '#111111', fontWeight: 600 }}>Video Baking & Review →</span>
              </div>
            </a>

            {/* Shopee */}
            <a 
              href={BUSINESS_INFO.shopeeUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-card shopee"
            >
              <div className="social-icon-box">
                <ShoppingBag size={24} />
              </div>
              <div className="social-info">
                <h4 className="font-serif">Shopee</h4>
                <p>Nief Cookies Official</p>
                <span style={{ fontSize: '0.75rem', color: '#EE4D2D', fontWeight: 600 }}>Bebas Ongkir & COD →</span>
              </div>
            </a>

            {/* Instagram */}
            <a 
              href={BUSINESS_INFO.instagramUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-card instagram"
            >
              <div className="social-icon-box">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
              <div className="social-info">
                <h4 className="font-serif">Instagram</h4>
                <p>@niefcookies</p>
                <span style={{ fontSize: '0.75rem', color: '#E1306C', fontWeight: 600 }}>Foto Produk & Testimoni →</span>
              </div>
            </a>
          </div>

          {/* Kotak Ringkasan Bisnis & Maps Sesuai Guide Book */}
          <div className="contact-maps-wrap">
            {/* Info Col */}
            <div className="contact-info-col">
              <span className="section-badge" style={{ alignSelf: 'flex-start' }}>Tentang Nief Cookies</span>
              <h3 className="font-serif">Nief Cookies</h3>
              <p style={{ color: '#6A584D', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                Aneka varian artisan cookies premium pilihan:
                <br />
                <strong>• Classic NYC Choco Chip Cookies</strong><br />
                <strong>• Red Velvet Cream Cheese</strong><br />
                <strong>• Palm Cheese Crunchy Cookies</strong><br />
                <strong>• Double Dark Choco Cashew, Dll...</strong>
              </p>

              <div className="info-item">
                <div className="info-icon">
                  <Phone size={18} />
                </div>
                <div className="info-text">
                  <h5>Nomor Handphone / WhatsApp</h5>
                  <p><strong>{BUSINESS_INFO.phone}</strong> (Fast Response)</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <Clock size={18} />
                </div>
                <div className="info-text">
                  <h5>Jam Buka & Layanan</h5>
                  <p>{BUSINESS_INFO.openingHours}</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <MapPin size={18} />
                </div>
                <div className="info-text">
                  <h5>Alamat Toko & Kitchen</h5>
                  <p>{BUSINESS_INFO.address}</p>
                  <a 
                    href={BUSINESS_INFO.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '0.4rem', 
                      color: '#B37D28', 
                      fontSize: '0.825rem', 
                      fontWeight: 600, 
                      marginTop: '0.35rem',
                      textDecoration: 'none'
                    }}
                  >
                    <ExternalLink size={14} />
                    <span>Buka Rute di Google Maps ↗</span>
                  </a>
                </div>
              </div>

              <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a 
                  href={createWhatsAppUrl()} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-wa"
                  style={{ width: '100%' }}
                >
                  <MessageCircle size={18} />
                  <span>Kirim Pesan ke {BUSINESS_INFO.phone}</span>
                </a>
                <a 
                  href={BUSINESS_INFO.mapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <MapPin size={18} />
                  <span>Petunjuk Arah Google Maps</span>
                </a>
              </div>
            </div>

            {/* Google Maps Embed Col */}
            <div className="maps-col">
              <iframe
                title="Lokasi Nief Cookies - Bidan Siti Hajaroh Brebes"
                src={BUSINESS_INFO.mapsEmbedUrl}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <img 
                  src="/images/logo.jpg" 
                  alt="Nief Cookies" 
                  style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #D49A3D' }} 
                />
                <h2 className="font-serif" style={{ margin: 0 }}>{BUSINESS_INFO.name}</h2>
              </div>
              <p>
                "Percayakan artisan cookies terbaik untuk setiap momen Anda. Nief Cookies dipercaya sejak 2020 dan Sudah Menyelesaikan 2000+ Pesanan."
              </p>
            </div>

            <div className="footer-col">
              <h4>Cookies Favorit</h4>
              <ul className="footer-links">
                <li><a href="#semua-produk">Classic Choco Chip</a></li>
                <li><a href="#semua-produk">Red Velvet Cream Cheese</a></li>
                <li><a href="#semua-produk">Palm Cheese Cookies</a></li>
                <li><a href="#semua-produk">Double Dark Choco</a></li>
                <li><a href="#semua-produk">Lotus Biscoff Spiced</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Media Sosial</h4>
              <ul className="footer-links">
                <li><a href={BUSINESS_INFO.whatsappUrl} target="_blank" rel="noreferrer">WhatsApp Chat</a></li>
                <li><a href={BUSINESS_INFO.instagramUrl} target="_blank" rel="noreferrer">Instagram</a></li>
                <li><a href={BUSINESS_INFO.tiktokUrl} target="_blank" rel="noreferrer">TikTok</a></li>
                <li><a href={BUSINESS_INFO.shopeeUrl} target="_blank" rel="noreferrer">Shopee Mall</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Pemesanan Langsung</h4>
              <p style={{ fontSize: '0.875rem', color: '#BBAAA0', marginBottom: '0.75rem' }}>
                Untuk pemesanan jumlah besar, hampers cookies, gift box instansi & souvenir:
              </p>
              <p style={{ color: '#D49A3D', fontWeight: 700, fontSize: '1.1rem', marginBottom: '1rem' }}>
                {BUSINESS_INFO.phone}
              </p>
              <button 
                onClick={handleToggleAdmin}
                className="btn btn-secondary" 
                style={{ padding: '0.4rem 0.85rem', fontSize: '0.775rem' }}
              >
                {isAdminMode ? 'Tutup Akses Admin' : 'Akses Admin Toko'}
              </button>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} {BUSINESS_INFO.name}. All Rights Reserved. Dibuat dengan cinta untuk menemani setiap momen manis keluarga dan sahabat.</p>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button */}
      <a 
        href={createWhatsAppUrl()} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="floating-wa"
        title="Chat dengan Nief Cookies di WhatsApp"
      >
        <MessageCircle size={22} />
        <span>Chat WhatsApp</span>
      </a>

      {/* MODAL 1: Detail Produk & Komposisi Bahan */}
      {detailProduct && (
        <div className="modal-backdrop" onClick={() => setDetailProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="font-serif">{detailProduct.name}</h3>
              <button onClick={() => setDetailProduct(null)} className="btn-close">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ height: '260px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1.25rem', background: '#FAF6F0' }}>
                <img 
                  src={detailProduct.image} 
                  alt={detailProduct.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=600&q=80';
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#432818' }}>
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(detailProduct.price)}
                  </span>
                  <span style={{ color: '#9E8D82', marginLeft: '0.5rem', fontSize: '0.9rem' }}>/ {detailProduct.weight}</span>
                </div>
                <span className="badge-stock" style={{ position: 'static' }}>{detailProduct.stockStatus || 'Ready Stock'}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#E68A00' }}>
                  <Star size={16} fill="#E68A00" color="#E68A00" />
                  <strong style={{ fontSize: '0.95rem' }}>{detailProduct.rating}</strong>
                </div>
                <span style={{ color: '#9E8D82', fontSize: '0.85rem' }}>• ({detailProduct.soldCount})</span>
              </div>

              <p style={{ color: '#6A584D', lineHeight: 1.6, marginBottom: '1.5rem', fontSize: '0.95rem' }}>
                {detailProduct.description}
              </p>

              <div style={{ background: '#FAF6F0', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem' }}>
                <h4 className="font-serif" style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: '#432818', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Award size={18} color="#D49A3D" />
                  Komposisi Bahan Berkualitas:
                </h4>
                <ul style={{ paddingLeft: '1.2rem', color: '#432818', fontSize: '0.875rem', lineHeight: 1.7 }}>
                  {Array.isArray(detailProduct.ingredients) ? (
                    detailProduct.ingredients.map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))
                  ) : (
                    <li>{detailProduct.ingredients || 'Terigu, Kuning telur, Mentega, Butter, Gula halus, Vaneli'}</li>
                  )}
                </ul>
              </div>

              <a 
                href={createWhatsAppUrl(detailProduct)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-wa"
                style={{ width: '100%', padding: '0.85rem 1rem', fontSize: '1rem' }}
              >
                <MessageCircle size={20} />
                <span>Pesan Sekarang Via WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Admin PIN Login Switcher */}
      {isAdminLoginOpen && (
        <div className="modal-backdrop" onClick={() => setIsAdminLoginOpen(false)}>
          <div className="modal-content" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="font-serif" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={18} color="#D49A3D" />
                Login Mode Admin
              </h3>
              <button onClick={() => setIsAdminLoginOpen(false)} className="btn-close">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleVerifyAdminPin} className="modal-body">
              <p style={{ fontSize: '0.875rem', color: '#6A584D', marginBottom: '1rem' }}>
                Masukkan PIN Admin untuk mengelola katalog produk (tambah, edit, upload foto dari file, dan hapus cookies).
              </p>
              
              <div className="form-group">
                <label>PIN Admin</label>
                <input 
                  type="password" 
                  className="form-control"
                  placeholder="Ketik PIN (default: 1234 atau tekan Masuk)"
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  autoFocus
                />
              </div>

              {adminError && (
                <p style={{ color: '#D9453B', fontSize: '0.8rem', marginTop: '-0.5rem', marginBottom: '1rem' }}>
                  {adminError}
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button type="button" onClick={() => setIsAdminLoginOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  Masuk Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: CRUD Form Tambah / Edit Produk (Dengan Upload File & Edit Rating) */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="font-serif">
                {editingProduct ? 'Edit Data Produk Cookies' : 'Tambah Produk Cookies Baru'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="btn-close">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="modal-body">
              {/* Nama Produk */}
              <div className="form-group">
                <label>Nama Produk Cookies *</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="Contoh: Classic NYC Choco Chip Cookies"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {/* Harga & Berat */}
              <div className="form-row">
                <div className="form-group">
                  <label>Harga (Rp) *</label>
                  <input 
                    type="number" 
                    className="form-control"
                    placeholder="Contoh: 65000"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Ukuran / Berat Toples</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Contoh: Toples 450 gr"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  />
                </div>
              </div>

              {/* Kategori & Status Stok */}
              <div className="form-row">
                <div className="form-group">
                  <label>Kategori Produk</label>
                  <select 
                    className="form-control"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Cokelat & Manis">Cokelat & Manis</option>
                    <option value="Keju & Gurih">Keju & Gurih</option>
                    <option value="Artisan & Spesial">Artisan & Spesial</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status Stok</label>
                  <select 
                    className="form-control"
                    value={formData.stockStatus}
                    onChange={(e) => setFormData({ ...formData, stockStatus: e.target.value })}
                  >
                    <option value="Ready Stock">Ready Stock</option>
                    <option value="Stok Terbatas">Stok Terbatas</option>
                    <option value="Pre-Order">Pre-Order (PO)</option>
                    <option value="Habis">Habis</option>
                  </select>
                </div>
              </div>

              {/* Tempat Edit Rating Bintang Sesuai Permintaan User */}
              <div style={{ background: '#FFFDF9', border: '1px solid #EFE4D6', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#432818', marginBottom: '0.5rem' }}>
                  ⭐ Pengaturan Rating Bintang & Ulasan
                </label>
                
                <div className="form-row" style={{ alignItems: 'center' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem', color: '#6A584D' }}>Nilai Rating (1.0 - 5.0)</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input 
                        type="number" 
                        step="0.1" 
                        min="1.0" 
                        max="5.0" 
                        className="form-control"
                        style={{ width: '100px', fontWeight: 700 }}
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      />
                      <div className="rating-picker">
                        {[1, 2, 3, 4, 5].map((starNum) => (
                          <button
                            key={starNum}
                            type="button"
                            className={`star-btn ${Number(formData.rating) >= starNum ? 'active' : ''}`}
                            onClick={() => setFormData({ ...formData, rating: starNum })}
                            title={`Set ${starNum} Bintang`}
                          >
                            <Star 
                              size={20} 
                              fill={Number(formData.rating) >= starNum ? '#E68A00' : 'none'} 
                              color={Number(formData.rating) >= starNum ? '#E68A00' : '#D0C2B0'} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label style={{ fontSize: '0.8rem', color: '#6A584D' }}>Keterangan Penjualan</label>
                    <input 
                      type="text" 
                      className="form-control"
                      placeholder="Contoh: 850+ terjual"
                      value={formData.soldCount}
                      onChange={(e) => setFormData({ ...formData, soldCount: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Upload Foto / File Sesuai Permintaan User */}
              <div className="form-group">
                <label>Foto Produk (Upload File dari Komputer/HP) *</label>
                
                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  style={{ display: 'none' }} 
                />

                {/* Upload Zone */}
                <div 
                  className="upload-dropzone" 
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="upload-dropzone-inner">
                    <div className="upload-icon-circle">
                      <Upload size={22} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: '#432818', fontSize: '0.9rem', marginBottom: '0.15rem' }}>
                        Klik di sini untuk upload foto dari file perangkat Anda
                      </p>
                      <p style={{ fontSize: '0.775rem', color: '#9E8D82' }}>
                        Mendukung format JPG, PNG, atau WebP (Maksimal 8MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preview Foto */}
                {formData.image && (
                  <div className="upload-preview-box">
                    <img src={formData.image} alt="Preview Foto Produk" />
                    <div className="upload-preview-overlay">
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', background: 'rgba(255,255,255,0.95)' }}
                      >
                        <Camera size={13} />
                        <span>Ganti Foto</span>
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setFormData({ ...formData, image: '' })}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: '#D9453B', background: 'rgba(255,255,255,0.95)' }}
                      >
                        <Trash2 size={13} />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Pilihan Cepat Foto Contoh / Preset */}
                <div style={{ marginTop: '0.65rem' }}>
                  <span style={{ fontSize: '0.75rem', color: '#9E8D82', marginRight: '0.5rem' }}>Atau pilih cepat foto contoh:</span>
                  <div style={{ display: 'inline-flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=600&q=80' })}
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: '4px', border: '1px solid #EFE4D6', background: '#FFFFFF', cursor: 'pointer' }}
                    >
                      Choco Chip
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, image: 'https://images.unsplash.com/photo-1618923834413-2770b904ee10?auto=format&fit=crop&w=600&q=80' })}
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: '4px', border: '1px solid #EFE4D6', background: '#FFFFFF', cursor: 'pointer' }}
                    >
                      Red Velvet
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setFormData({ ...formData, image: '/images/palm-cookies.jpg' })}
                      style={{ fontSize: '0.75rem', padding: '0.2rem 0.55rem', borderRadius: '4px', border: '1px solid #EFE4D6', background: '#FFFFFF', cursor: 'pointer' }}
                    >
                      Palm Cookies
                    </button>
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="form-group">
                <label>Deskripsi Singkat</label>
                <textarea 
                  className="form-control"
                  rows={2}
                  placeholder="Jelaskan aroma, tekstur, dan rasa khas cookies ini..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                ></textarea>
              </div>

              {/* Bahan-bahan */}
              <div className="form-group">
                <label>Komposisi Bahan (Pisahkan dengan tanda koma)</label>
                <textarea 
                  className="form-control"
                  rows={2}
                  placeholder="Contoh: Terigu, Butter Wijsman, Kuning telur, Gula halus, Choco chips, Vaneli"
                  value={formData.ingredientsText}
                  onChange={(e) => setFormData({ ...formData, ingredientsText: e.target.value })}
                ></textarea>
              </div>

              {/* Best Seller Checkbox */}
              <div className="form-checkbox">
                <input 
                  type="checkbox" 
                  id="isBestSeller"
                  checked={formData.isBestSeller}
                  onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                />
                <label htmlFor="isBestSeller">Tampilkan di Bagian "Produk Terlaris" (Best Seller)</label>
              </div>

              <div className="modal-footer" style={{ margin: '1.5rem -1.75rem -1.75rem -1.75rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">
                  Batal
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Simpan Perubahan' : 'Tambahkan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
