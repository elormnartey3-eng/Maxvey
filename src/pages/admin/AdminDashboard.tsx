import React, { useState, useEffect } from 'react';
import {
  Package, ShoppingCart, Settings, Bell, Plus, Edit, Trash2, CheckCircle2,
  Clock, Truck, MessageCircle, ExternalLink, RefreshCw, Key, Shield,
  DollarSign, Eye, EyeOff, Save, AlertCircle, FileText, Smartphone
} from 'lucide-react';
import { Product, Order, Category, StoreSettings } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { ProductEditorModal } from './ProductEditorModal';
import { Logo } from '../../components/Logo';

interface AdminDashboardProps {
  navigate: (path: string) => void;
  products: Product[];
  onRefreshProducts: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  navigate,
  products,
  onRefreshProducts,
}) => {
  const { user, token, logout, isAdmin } = useAuth();

  // If not logged in, prompt to log in
  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, navigate]);

  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'categories' | 'settings' | 'notifications' | 'setup'>('products');

  // State
  const [orders, setOrders] = useState<Order[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Modals & form state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Quick inline price and stock editing state (optimized for mobile Android)
  const [quickValues, setQuickValues] = useState<Record<string, { price: number; stock: number }>>({});
  const [quickFeedbacks, setQuickFeedbacks] = useState<Record<string, string>>({});
  const [savingQuickId, setSavingQuickId] = useState<string | null>(null);

  // Sync quickValues from products whenever products change
  useEffect(() => {
    const initial: Record<string, { price: number; stock: number }> = {};
    products.forEach(p => {
      initial[p.id] = { price: p.price, stock: p.stock };
    });
    setQuickValues(initial);
  }, [products]);

  const handleQuickUpdate = async (productId: string) => {
    if (!token) return;
    const current = quickValues[productId];
    if (!current) return;
    setSavingQuickId(productId);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          price: Number(current.price),
          stock: Number(current.stock),
        }),
      });

      if (res.ok) {
        setQuickFeedbacks(prev => ({
          ...prev,
          [productId]: `✓ Updated to ₦${Number(current.price).toLocaleString()}!`,
        }));
        onRefreshProducts();
        setTimeout(() => {
          setQuickFeedbacks(prev => {
            const next = { ...prev };
            delete next[productId];
            return next;
          });
        }, 3000);
      } else {
        alert('Failed to update price');
      }
    } catch {
      alert('Network error updating price');
    } finally {
      setSavingQuickId(null);
    }
  };

  // Notification test status
  const [testNotificationStatus, setTestNotificationStatus] = useState<string | null>(null);
  const [testNotificationLoading, setTestNotificationLoading] = useState(false);

  // Settings form saving
  const [settingsSaved, setSettingsSaved] = useState(false);
  const [settingsError, setSettingsError] = useState<string | null>(null);

  // Database Connection & Neon state
  const [dbStatus, setDbStatus] = useState<{ connected: boolean; provider: string; connectionUrlRedacted: string | null } | null>(null);
  const [neonUrlInput, setNeonUrlInput] = useState('');
  const [neonConnectLoading, setNeonConnectLoading] = useState(false);
  const [neonConnectFeedback, setNeonConnectFeedback] = useState<string | null>(null);

  const loadDatabaseStatus = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/database/status', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setDbStatus(data);
      }
    } catch (e) {
      console.warn(e);
    }
  };

  const handleConnectNeon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !neonUrlInput.trim()) return;
    setNeonConnectLoading(true);
    setNeonConnectFeedback(null);

    try {
      const res = await fetch('/api/database/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ databaseUrl: neonUrlInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setNeonConnectFeedback(`✓ Connected successfully! ${data.message}`);
        setDbStatus(data.status);
        onRefreshProducts();
      } else {
        setNeonConnectFeedback(`Error connecting: ${data.error || 'Failed to connect'}`);
      }
    } catch {
      setNeonConnectFeedback('Network error verifying Neon connection');
    } finally {
      setNeonConnectLoading(false);
    }
  };

  // Fetch orders
  const loadOrders = async () => {
    if (!token) return;
    setLoadingOrders(true);
    try {
      const res = await fetch('/api/orders', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetch categories & settings
  const loadSettingsAndCats = async () => {
    try {
      const [catRes, setRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/settings'),
      ]);
      if (catRes.ok) setCategories(await catRes.json());
      if (setRes.ok) setSettings(await setRes.json());
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadOrders();
      loadSettingsAndCats();
      loadDatabaseStatus();
    }
  }, [isAdmin, token]);

  // Handle Save Product
  const handleSaveProduct = async (productToSave: Product) => {
    if (!token) return;
    const isNew = !products.some(p => p.id === productToSave.id);
    const url = isNew ? '/api/products' : `/api/products/${productToSave.id}`;
    const method = isNew ? 'POST' : 'PUT';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(productToSave),
      });

      if (res.ok) {
        setIsEditorOpen(false);
        setEditingProduct(null);
        onRefreshProducts();
      } else {
        alert('Failed to save product');
      }
    } catch {
      alert('Network error saving product');
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        onRefreshProducts();
      } else {
        alert('Failed to delete product');
      }
    } catch {
      alert('Error deleting product');
    }
  };

  // Handle Order Status Update
  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        loadOrders();
      }
    } catch {
      alert('Failed to update status');
    }
  };

  // Handle Create Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim() || !token) return;
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      });
      if (res.ok) {
        setNewCategoryName('');
        loadSettingsAndCats();
      }
    } catch {
      alert('Failed to add category');
    }
  };

  // Handle Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings || !token) return;
    setSettingsSaved(false);
    setSettingsError(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSettingsSaved(true);
        setTimeout(() => setSettingsSaved(false), 3000);
      } else {
        setSettingsError('Failed to update store settings');
      }
    } catch {
      setSettingsError('Network error saving settings');
    }
  };

  // Trigger Test Notification Dispatch
  const handleSendTestNotification = async () => {
    if (!token) return;
    setTestNotificationLoading(true);
    setTestNotificationStatus(null);
    try {
      const res = await fetch('/api/notifications/test', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTestNotificationStatus(
          `✓ Test order notification processed! Email Status: ${data.outcome?.emailSent ? 'Sent' : 'Queued/Log'}. WhatsApp link prepared.`
        );
      } else {
        setTestNotificationStatus('Error triggering notification');
      }
    } catch {
      setTestNotificationStatus('Network error triggering test notification');
    } finally {
      setTestNotificationLoading(false);
    }
  };

  // Stats calculation
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'verified' || o.status === 'paid')
    .reduce((sum, o) => sum + o.total, 0);

  const totalUnitsInStock = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="min-h-screen bg-[#09090b] text-white pb-20">
      
      {/* Top Admin Header Bar */}
      <header className="bg-[#121215] border-b border-[#27272a] px-4 sm:px-8 py-4 sticky top-0 z-30 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Logo size="sm" showText={true} />
          <span className="hidden sm:inline text-xs font-mono bg-red-950/80 text-red-400 px-2.5 py-0.5 rounded border border-red-900/60 font-bold">
            ADMIN CONSOLE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium rounded transition-colors flex items-center gap-1.5 text-zinc-300"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Storefront</span>
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900/60 border border-red-800 text-red-300 text-xs font-medium rounded transition-colors"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 bg-[#121215] border border-[#27272a] rounded-xl space-y-1">
            <span className="text-xs font-mono text-zinc-400 uppercase">TOTAL VERIFIED REVENUE</span>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono-tabular">
              ₦{totalRevenue.toLocaleString()}
            </div>
            <span className="text-[11px] text-emerald-400 font-mono">Paystack Verified</span>
          </div>

          <div className="p-5 bg-[#121215] border border-[#27272a] rounded-xl space-y-1">
            <span className="text-xs font-mono text-zinc-400 uppercase">TOTAL ORDERS</span>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono-tabular">
              {orders.length}
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">
              {orders.filter(o => o.status === 'paid').length} awaiting fulfillment
            </span>
          </div>

          <div className="p-5 bg-[#121215] border border-[#27272a] rounded-xl space-y-1">
            <span className="text-xs font-mono text-zinc-400 uppercase">ACTIVE APPAREL PIECES</span>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono-tabular">
              {products.length}
            </div>
            <span className="text-[11px] text-zinc-400 font-mono">
              {products.filter(p => p.isFeatured).length} featured on homepage
            </span>
          </div>

          <div className="p-5 bg-[#121215] border border-[#27272a] rounded-xl space-y-1">
            <span className="text-xs font-mono text-zinc-400 uppercase">TOTAL STOCK UNITS</span>
            <div className="text-xl sm:text-2xl font-bold text-white font-mono-tabular">
              {totalUnitsInStock}
            </div>
            <span className="text-[11px] text-amber-400 font-mono">Across sizes & colorways</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#27272a] overflow-x-auto pb-1 text-xs font-medium">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'products'
                ? 'bg-[#121215] text-white border-t-2 border-[#dc2626] font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'orders'
                ? 'bg-[#121215] text-white border-t-2 border-[#dc2626] font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Orders & Dispatch ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'categories'
                ? 'bg-[#121215] text-white border-t-2 border-[#dc2626] font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Categories</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'settings'
                ? 'bg-[#121215] text-white border-t-2 border-[#dc2626] font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Store Settings & Fees</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'notifications'
                ? 'bg-[#121215] text-white border-t-2 border-[#dc2626] font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Bell className="w-4 h-4" />
            <span>Paystack & Notifications</span>
          </button>

          <button
            onClick={() => setActiveTab('setup')}
            className={`px-4 py-2.5 rounded-t-lg transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'setup'
                ? 'bg-[#121215] text-white border-t-2 border-[#dc2626] font-bold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Setup & Deployment Guide</span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: PRODUCTS MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            
            {/* Header + Add Product CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold uppercase font-heading text-white">
                  PRODUCT CATALOGUE & PRICING
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Change prices (in ₦ NGN), adjust stock quantities, or upload new clothing pictures.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsEditorOpen(true);
                }}
                className="px-5 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 self-start sm:self-auto shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>ADD NEW GARMENT</span>
              </button>
            </div>

            {/* ⚡ PROMINENT QUICK PRICE & INVENTORY EDITOR (Fast mobile editing without opening modals) */}
            <div className="p-5 sm:p-6 bg-[#121215] border border-[#dc2626]/40 rounded-xl space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27272a] pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#dc2626] animate-pulse" />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                    ⚡ QUICK PRICE CHANGER (ONE-TAP UPDATE)
                  </h3>
                </div>
                <span className="text-[11px] text-zinc-400 font-mono">
                  Type new price in ₦ and tap &quot;Save Price&quot;
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map(p => {
                  const currentVals = quickValues[p.id] || { price: p.price, stock: p.stock };
                  const feedback = quickFeedbacks[p.id];
                  const isSaving = savingQuickId === p.id;

                  return (
                    <div
                      key={`quick-${p.id}`}
                      className="p-4 bg-[#09090b] border border-zinc-800 rounded-lg flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={p.featuredImage}
                          alt={p.name}
                          className="w-14 h-14 object-cover rounded bg-black shrink-0 border border-zinc-700"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-white text-xs truncate">{p.name}</p>
                          <span className="text-[10px] text-zinc-500 font-mono block">
                            {p.category} · Current: ₦{p.price.toLocaleString()}
                          </span>
                          {feedback && (
                            <span className="text-[11px] text-emerald-400 font-mono font-bold block animate-fade-in mt-0.5">
                              {feedback}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Inputs Row */}
                      <div className="grid grid-cols-12 gap-2 items-center pt-1 border-t border-zinc-800/80">
                        {/* Price Input */}
                        <div className="col-span-6">
                          <label className="text-[10px] text-zinc-400 font-mono block mb-0.5">PRICE (₦ NGN):</label>
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-xs">₦</span>
                            <input
                              type="number"
                              min="500"
                              step="500"
                              value={currentVals.price}
                              onChange={e => {
                                const val = Number(e.target.value);
                                setQuickValues(prev => ({
                                  ...prev,
                                  [p.id]: { ...currentVals, price: val },
                                }));
                              }}
                              className="w-full pl-6 pr-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white font-mono font-bold text-xs focus:outline-none focus:border-[#dc2626]"
                            />
                          </div>
                        </div>

                        {/* Stock Input */}
                        <div className="col-span-3">
                          <label className="text-[10px] text-zinc-400 font-mono block mb-0.5">STOCK:</label>
                          <input
                            type="number"
                            min="0"
                            value={currentVals.stock}
                            onChange={e => {
                              const val = Number(e.target.value);
                              setQuickValues(prev => ({
                                ...prev,
                                [p.id]: { ...currentVals, stock: val },
                              }));
                            }}
                            className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-700 rounded text-white font-mono text-xs text-center focus:outline-none focus:border-[#dc2626]"
                          />
                        </div>

                        {/* Save Button */}
                        <div className="col-span-3 pt-4">
                          <button
                            type="button"
                            onClick={() => handleQuickUpdate(p.id)}
                            disabled={isSaving}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] rounded uppercase transition-colors text-center disabled:opacity-50"
                          >
                            {isSaving ? '...' : 'SAVE'}
                          </button>
                        </div>
                      </div>

                      {/* Modal Edit Trigger */}
                      <div className="flex justify-between items-center pt-1 text-[11px] text-zinc-400">
                        <span className="font-mono text-[10px] text-zinc-500">Sizes: {p.sizes.join(', ')}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(p);
                            setIsEditorOpen(true);
                          }}
                          className="text-[#dc2626] font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          <Edit className="w-3 h-3" />
                          <span>Full Edit & Photos</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MOBILE PRODUCT CARDS (Shown on small screens for easy touch navigation) */}
            <div className="md:hidden space-y-4">
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-400">
                ALL PRODUCTS ({products.length})
              </h3>
              {products.map(p => (
                <div
                  key={`card-${p.id}`}
                  className="p-4 bg-[#121215] border border-[#27272a] rounded-xl space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={p.featuredImage}
                      alt={p.name}
                      className="w-16 h-16 object-cover rounded-lg bg-black border border-zinc-700 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono uppercase text-zinc-500 block">{p.category}</span>
                      <h4 className="font-semibold text-white text-sm truncate">{p.name}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-base font-bold text-white font-mono-tabular">
                          ₦{p.price.toLocaleString()}
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">
                          {p.stock} in stock
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#27272a]">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(p);
                        setIsEditorOpen(true);
                      }}
                      className="py-2.5 px-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5 text-[#dc2626]" />
                      <span>Edit Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="py-2.5 px-3 bg-red-950/40 hover:bg-red-900/40 border border-red-900/60 text-red-300 rounded text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* DESKTOP PRODUCTS TABLE (Shown on screens >= md) */}
            <div className="hidden md:block bg-[#121215] border border-[#27272a] rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#09090b] border-b border-[#27272a] text-zinc-400 uppercase font-mono">
                    <tr>
                      <th className="py-3 px-4">GARMENT</th>
                      <th className="py-3 px-4">CATEGORY</th>
                      <th className="py-3 px-4">PRICE (NGN)</th>
                      <th className="py-3 px-4">STOCK</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#27272a] text-zinc-300">
                    {products.map(p => (
                      <tr key={p.id} className="hover:bg-zinc-900/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.featuredImage}
                              alt={p.name}
                              className="w-12 h-12 object-cover rounded bg-black shrink-0 border border-zinc-800"
                            />
                            <div>
                              <p className="font-semibold text-white">{p.name}</p>
                              <p className="text-[11px] text-zinc-500 font-mono">
                                Sizes: {p.sizes.join(', ')}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">{p.category}</td>
                        <td className="py-3 px-4 font-mono font-bold text-white text-sm">
                          ₦{p.price.toLocaleString()}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            p.stock > 10 ? 'bg-emerald-950/60 text-emerald-400' : 'bg-amber-950/60 text-amber-400'
                          }`}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {p.isFeatured && (
                              <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                                FEATURED
                              </span>
                            )}
                            {p.isNewArrival && (
                              <span className="text-[10px] font-mono bg-red-950/80 text-red-400 px-1.5 py-0.5 rounded">
                                NEW DROP
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setEditingProduct(p);
                                setIsEditorOpen(true);
                              }}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                              title="Edit product"
                            >
                              <Edit className="w-3.5 h-3.5 text-[#dc2626]" />
                              <span>Edit Price & Details</span>
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-zinc-800 rounded transition-colors"
                              title="Delete product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: ORDERS MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold uppercase font-heading text-white">
                  CUSTOMER ORDERS & FULFILLMENT
                </h2>
                <p className="text-xs text-zinc-400">
                  View customer delivery addresses, verified Paystack payments, and update dispatch status.
                </p>
              </div>

              <button
                onClick={loadOrders}
                disabled={loadingOrders}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-medium rounded flex items-center gap-2 self-start sm:self-auto"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingOrders ? 'animate-spin' : ''}`} />
                <span>Refresh Orders</span>
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="p-12 text-center bg-[#121215] border border-[#27272a] rounded-xl text-zinc-500 space-y-2">
                <ShoppingCart className="w-10 h-10 mx-auto text-zinc-600" />
                <p className="text-sm font-semibold text-zinc-300">No orders received yet</p>
                <p className="text-xs">Once a customer purchases via Paystack, the order will appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div
                    key={order.id}
                    className="p-6 bg-[#121215] border border-[#27272a] rounded-xl space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272a] pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-base font-bold text-white">{order.orderNumber}</span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                            order.paymentStatus === 'verified' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                        <span className="text-xs text-zinc-500 font-mono">
                          Placed on {new Date(order.createdAt).toLocaleString()} · Ref: {order.paystackReference || 'N/A'}
                        </span>
                      </div>

                      {/* Status Dropdown */}
                      <div className="flex items-center gap-3">
                        <label className="text-xs text-zinc-400 font-mono">STATUS:</label>
                        <select
                          value={order.status}
                          onChange={e => handleUpdateOrderStatus(order.id, e.target.value as any)}
                          className="px-3 py-1.5 bg-[#09090b] border border-zinc-700 rounded text-xs text-white font-mono focus:border-[#dc2626]"
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid (Verified)</option>
                          <option value="processing">Processing in QC</option>
                          <option value="shipped">Dispatched / In Transit</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer & Address Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="space-y-1">
                        <span className="text-zinc-500 font-mono block">CUSTOMER:</span>
                        <p className="font-bold text-white text-sm">{order.customer.fullName}</p>
                        <p className="text-zinc-300 font-mono">{order.customer.phone}</p>
                        <p className="text-zinc-400">{order.customer.email}</p>
                        <div className="pt-2">
                          <a
                            href={`https://wa.me/${order.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Hello ${order.customer.fullName}, this is Maxwell from MAXVEY regarding your order ${order.orderNumber}.`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] text-black rounded font-bold text-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Message Customer on WhatsApp</span>
                          </a>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <span className="text-zinc-500 font-mono block">DELIVERY ADDRESS:</span>
                        <p className="text-zinc-200">{order.customer.address}</p>
                        <p className="text-zinc-200">{order.customer.city}, {order.customer.state}</p>
                        {order.customer.notes && (
                          <p className="text-amber-300 italic pt-1">Note: {order.customer.notes}</p>
                        )}
                        <p className="text-zinc-400 pt-1">
                          Delivery Fee: ₦{order.deliveryFee.toLocaleString()} | Subtotal: ₦{order.subtotal.toLocaleString()}
                        </p>
                        <p className="font-bold text-white font-mono text-sm">
                          Total Amount: <span className="text-[#dc2626]">₦{order.total.toLocaleString()}</span>
                        </p>
                      </div>
                    </div>

                    {/* Ordered Items List */}
                    <div className="border-t border-[#27272a] pt-3">
                      <span className="text-[11px] font-mono text-zinc-500 block mb-2">ITEMS:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-2 bg-[#09090b] rounded border border-zinc-800 text-xs">
                            <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded bg-black" />
                            <div>
                              <p className="font-semibold text-white">{item.name}</p>
                              <p className="text-[11px] text-zinc-400 font-mono">
                                Size: {item.size} · {item.color} · Qty: {item.quantity} · ₦{(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: CATEGORIES */}
        {/* ============================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6 max-w-3xl">
            <div>
              <h2 className="text-xl font-bold uppercase font-heading text-white">
                CATEGORIES MANAGEMENT
              </h2>
              <p className="text-xs text-zinc-400">
                Organize your catalog into streetwear categories.
              </p>
            </div>

            {/* Create Category Form */}
            <form onSubmit={handleCreateCategory} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="New category name (e.g. Denim & Bottoms)..."
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-[#121215] border border-zinc-700 rounded text-xs text-white focus:outline-none focus:border-[#dc2626]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold uppercase tracking-wider rounded"
              >
                Add Category
              </button>
            </form>

            <div className="bg-[#121215] border border-[#27272a] rounded-xl divide-y divide-[#27272a]">
              {categories.map(cat => (
                <div key={cat.id} className="p-4 flex items-center justify-between text-xs">
                  <div>
                    <h4 className="font-bold text-white text-sm">{cat.name}</h4>
                    <span className="text-zinc-500 font-mono text-[11px]">slug: {cat.slug}</span>
                  </div>
                  <span className="text-zinc-400 font-mono">
                    {products.filter(p => p.category.toLowerCase() === cat.name.toLowerCase()).length} products
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: STORE SETTINGS & FEES */}
        {/* ============================================================== */}
        {activeTab === 'settings' && settings && (
          <form onSubmit={handleSaveSettings} className="space-y-6 max-w-4xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold uppercase font-heading text-white">
                  STORE SETTINGS & RATES
                </h2>
                <p className="text-xs text-zinc-400">
                  Update homepage announcement banner, contact info, and delivery rates.
                </p>
              </div>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold uppercase tracking-wider rounded-lg flex items-center gap-2 shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </button>
            </div>

            {settingsSaved && (
              <div className="p-4 bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-lg text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Settings updated successfully!</span>
              </div>
            )}

            {/* Announcement Banner */}
            <div className="bg-[#121215] border border-[#27272a] rounded-xl p-6 space-y-4 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-[#dc2626] font-mono">
                1. HOMEPAGE ANNOUNCEMENT BANNER
              </h3>

              <div className="space-y-3">
                <label className="flex items-center gap-2 text-zinc-300">
                  <input
                    type="checkbox"
                    checked={settings.announcementEnabled}
                    onChange={e => setSettings({ ...settings, announcementEnabled: e.target.checked })}
                    className="w-4 h-4 accent-[#dc2626]"
                  />
                  <span>Enable top announcement bar</span>
                </label>

                <div>
                  <label className="block text-zinc-300 mb-1">Banner Announcement Text</label>
                  <input
                    type="text"
                    value={settings.announcementText}
                    onChange={e => setSettings({ ...settings, announcementText: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1">Brand Slogan</label>
                  <input
                    type="text"
                    value={settings.brandSlogan}
                    onChange={e => setSettings({ ...settings, brandSlogan: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-white"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Fees By State */}
            <div className="bg-[#121215] border border-[#27272a] rounded-xl p-6 space-y-4 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-[#dc2626] font-mono">
                2. NIGERIAN DELIVERY RATES & THRESHOLDS
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 mb-1">Default Delivery Fee (₦ NGN)</label>
                  <input
                    type="number"
                    value={settings.defaultDeliveryFee}
                    onChange={e => setSettings({ ...settings, defaultDeliveryFee: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1">Free Delivery Threshold (₦ NGN)</label>
                  <input
                    type="number"
                    value={settings.freeDeliveryThreshold}
                    onChange={e => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-white font-mono"
                  />
                  <span className="text-zinc-500 text-[11px] mt-1 block">Orders equal or greater get free Lagos shipping</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-zinc-400 font-mono block">STATE SPECIFIC RATES:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {settings.deliveryFees.map((df, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 bg-[#09090b] rounded border border-zinc-800">
                      <span className="text-white truncate max-w-[180px]">{df.state}</span>
                      <div className="flex items-center gap-1">
                        <span className="text-zinc-500 font-mono">₦</span>
                        <input
                          type="number"
                          value={df.fee}
                          onChange={e => {
                            const updated = [...settings.deliveryFees];
                            updated[i].fee = Number(e.target.value);
                            setSettings({ ...settings, deliveryFees: updated });
                          }}
                          className="w-24 px-2 py-1 bg-zinc-900 border border-zinc-700 rounded text-white font-mono text-right"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-[#121215] border border-[#27272a] rounded-xl p-6 space-y-4 text-xs">
              <h3 className="font-bold uppercase tracking-wider text-[#dc2626] font-mono">
                3. CONTACT CHANNELS & SOCIAL MEDIA
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-300 mb-1">Administrator Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={e => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1">Official WhatsApp (+234...)</label>
                  <input
                    type="text"
                    value={settings.contactWhatsApp}
                    onChange={e => setSettings({ ...settings, contactWhatsApp: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1">Instagram Handle</label>
                  <input
                    type="text"
                    value={settings.instagramHandle}
                    onChange={e => setSettings({ ...settings, instagramHandle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 mb-1">Studio Address</label>
                  <input
                    type="text"
                    value={settings.contactAddress}
                    onChange={e => setSettings({ ...settings, contactAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-white"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-colors shadow-xl"
            >
              SAVE ALL SETTINGS
            </button>
          </form>
        )}

        {/* ============================================================== */}
        {/* TAB 5: PAYSTACK & NOTIFICATIONS VERIFICATION */}
        {/* ============================================================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 max-w-4xl">
            <div>
              <h2 className="text-xl font-bold uppercase font-heading text-white">
                INTEGRATIONS & NOTIFICATIONS STATUS
              </h2>
              <p className="text-xs text-zinc-400">
                Verify Paystack payment configuration and test real-time order alerts.
              </p>
            </div>

            {/* Test Notification Dispatch Tool */}
            <div className="p-6 bg-[#121215] border border-[#27272a] rounded-xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-white font-heading flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#dc2626]" />
                <span>Test Notification Dispatch to Maxwell</span>
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Click the button below to simulate an order notification trigger. It sends an alert summary to{' '}
                <span className="text-white font-mono font-bold">maxwellunusual@gmail.com</span> and formats the WhatsApp dispatch payload for{' '}
                <span className="text-white font-mono font-bold">+2349029602573</span>.
              </p>

              <button
                onClick={handleSendTestNotification}
                disabled={testNotificationLoading}
                className="px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-colors flex items-center gap-2 shadow-lg disabled:opacity-50"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{testNotificationLoading ? 'DISPATCHING TEST...' : 'SEND TEST NOTIFICATION NOW'}</span>
              </button>

              {testNotificationStatus && (
                <div className="p-4 bg-zinc-900 border border-zinc-700 rounded text-xs text-emerald-400 font-mono">
                  {testNotificationStatus}
                </div>
              )}
            </div>

            {/* Status Breakdown Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Paystack */}
              <div className="p-5 bg-[#121215] border border-[#27272a] rounded-xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-mono">PAYSTACK PAYMENTS</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-zinc-400">
                  Ready for NGN transactions. Card payments, bank transfers, and USSD supported.
                </p>
                <div className="pt-2 text-[11px] text-zinc-500 font-mono">
                  Webhook Route: <br />
                  <code className="text-zinc-300">/api/paystack/webhook</code>
                </div>
              </div>

              {/* Email Notifications */}
              <div className="p-5 bg-[#121215] border border-[#27272a] rounded-xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-mono">RESEND EMAIL</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </div>
                <p className="text-zinc-400">
                  Sends formatted order receipts and admin notifications to maxwellunusual@gmail.com.
                </p>
                <div className="pt-2 text-[11px] text-zinc-500 font-mono">
                  Target: <br />
                  <code className="text-zinc-300">maxwellunusual@gmail.com</code>
                </div>
              </div>

              {/* WhatsApp Cloud API */}
              <div className="p-5 bg-[#121215] border border-[#27272a] rounded-xl space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white font-mono">WHATSAPP PLATFORM</span>
                  <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                </div>
                <p className="text-zinc-400">
                  Direct WhatsApp link generation + Meta WhatsApp Cloud API order summaries.
                </p>
                <div className="pt-2 text-[11px] text-zinc-500 font-mono">
                  Admin WhatsApp: <br />
                  <code className="text-zinc-300">+2349029602573</code>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: SETUP & DEPLOYMENT GUIDE */}
        {/* ============================================================== */}
        {activeTab === 'setup' && (
          <div className="space-y-6 max-w-4xl text-xs text-zinc-300 leading-relaxed">
            <div>
              <h2 className="text-xl font-bold uppercase font-heading text-white">
                DATABASE CONNECTION & SETUP GUIDE
              </h2>
              <p className="text-xs text-zinc-400">
                Manage your cloud database link, Paystack keys, and hosting deployment from an Android phone or computer.
              </p>
            </div>

            {/* LIVE NEON DATABASE STATUS & CONNECTION CARD */}
            <div className="p-6 bg-[#121215] border border-[#dc2626]/50 rounded-xl space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#27272a] pb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${dbStatus?.connected ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-amber-400'}`} />
                  <h3 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
                    DATABASE STATUS: {dbStatus?.provider || 'Local Persistent Database'}
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-zinc-400">
                  {dbStatus?.connected ? '🟢 ONLINE & SYNCED TO NEON' : '🟡 LOCAL PERSISTENT STORAGE ACTIVE'}
                </span>
              </div>

              {dbStatus?.connected ? (
                <div className="p-4 bg-emerald-950/40 border border-emerald-800 rounded-lg space-y-2">
                  <p className="text-emerald-300 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Your website is connected to Neon PostgreSQL!</span>
                  </p>
                  <p className="text-zinc-400 text-[11px]">
                    Garments, stock quantities, and verified Paystack orders are saved directly to your Neon cloud database.
                  </p>
                  {dbStatus.connectionUrlRedacted && (
                    <p className="text-[10px] font-mono text-zinc-500">
                      Active: {dbStatus.connectionUrlRedacted}
                    </p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleConnectNeon} className="space-y-3">
                  <p className="text-zinc-300">
                    If you created your project at <span className="font-bold text-white">neon.tech</span>, paste your connection string below to test and connect it immediately:
                  </p>

                  <div className="space-y-2">
                    <label className="block text-zinc-400 font-mono text-[11px]">
                      PASTE NEON CONNECTION STRING (starts with postgresql://):
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        required
                        placeholder="postgresql://neondb_owner:password@ep-xxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require"
                        value={neonUrlInput}
                        onChange={e => setNeonUrlInput(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-xs text-white font-mono focus:outline-none focus:border-[#dc2626]"
                      />
                      <button
                        type="submit"
                        disabled={neonConnectLoading}
                        className="px-6 py-2.5 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                      >
                        {neonConnectLoading ? 'CONNECTING...' : 'CONNECT & SYNC NEON'}
                      </button>
                    </div>
                  </div>

                  {neonConnectFeedback && (
                    <div className={`p-3 rounded text-xs font-mono ${
                      neonConnectFeedback.startsWith('✓') ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800' : 'bg-red-950/60 text-red-300 border border-red-800'
                    }`}>
                      {neonConnectFeedback}
                    </div>
                  )}
                </form>
              )}
            </div>

            {/* Guide Card 1: Administrator Authentication & Google Sign-In */}
            <div className="p-6 bg-[#121215] border border-[#27272a] rounded-xl space-y-3">
              <h3 className="text-sm font-bold uppercase text-white font-heading">
                1. Administrator Authentication & Google Sign-In
              </h3>
              <p>
                Your website currently uses cryptographically-signed server-side tokens verified by <code>requireAdmin</code>. You can log in using your password: <code>MaxveyAdmin2026!</code>.
              </p>
              <div className="p-4 bg-[#09090b] rounded border border-zinc-800 space-y-2">
                <p className="text-white font-semibold">How to connect Google Sign-In if you desire Google OAuth:</p>
                <ol className="list-decimal list-inside space-y-1 text-zinc-400">
                  <li>Go to <strong>console.cloud.google.com</strong> and create a project named "MAXVEY".</li>
                  <li>Under <strong>APIs & Services &gt; Credentials</strong>, click <strong>Create Credentials &gt; OAuth Client ID</strong>.</li>
                  <li>Set Application Type to <strong>Web Application</strong>.</li>
                  <li>Add your domain to <strong>Authorized JavaScript origins</strong> and <strong>Authorized redirect URIs</strong>.</li>
                  <li>In your server settings, allow access ONLY if the Google email equals <code>maxwellunusual@gmail.com</code>. This ensures no random Google account can ever access your admin panel!</li>
                </ol>
              </div>
            </div>

            {/* Guide Card 2: Connecting Neon PostgreSQL */}
            <div className="p-6 bg-[#121215] border border-[#27272a] rounded-xl space-y-3">
              <h3 className="text-sm font-bold uppercase text-white font-heading">
                2. Neon PostgreSQL Database Connection
              </h3>
              <p>
                The website includes zero-config persistent storage out of the box, and also includes full PostgreSQL schema support in <code>src/db/schema.sql</code>.
              </p>
              <ol className="list-decimal list-inside space-y-1 text-zinc-400">
                <li>Create a free account on <strong>neon.tech</strong> (takes 60 seconds on an Android phone).</li>
                <li>Create a project called "maxvey-db". Neon is free forever with generous storage limits.</li>
                <li>Copy the connection string (starts with <code>postgresql://...</code>).</li>
                <li>Paste it as <code>DATABASE_URL</code> in your hosting environment variables.</li>
                <li>Run the SQL script from <code>src/db/schema.sql</code> in Neon's SQL Editor to create all tables.</li>
              </ol>
            </div>

            {/* Guide Card 3: Activating Live Paystack Payments */}
            <div className="p-6 bg-[#121215] border border-[#27272a] rounded-xl space-y-3">
              <h3 className="text-sm font-bold uppercase text-white font-heading">
                3. Activating Live Paystack Payments
              </h3>
              <ol className="list-decimal list-inside space-y-1 text-zinc-400">
                <li>Log in to <strong>dashboard.paystack.com</strong>.</li>
                <li>Go to <strong>Settings &gt; API Keys & Webhooks</strong>.</li>
                <li>Copy your <strong>Live Secret Key</strong> (<code>sk_live_...</code>) and <strong>Live Public Key</strong> (<code>pk_live_...</code>).</li>
                <li>Set <code>PAYSTACK_SECRET_KEY</code> and <code>PAYSTACK_PUBLIC_KEY</code> in your environment variables.</li>
                <li>In Paystack settings, enter your Live Webhook URL: <code>https://your-domain.com/api/paystack/webhook</code>.</li>
              </ol>
            </div>

            {/* Guide Card 4: Free/Affordable Hosting Options */}
            <div className="p-6 bg-[#121215] border border-[#27272a] rounded-xl space-y-3">
              <h3 className="text-sm font-bold uppercase text-white font-heading">
                4. Free & Affordable Hosting Deployment
              </h3>
              <p>
                Recommended providers that host both frontend and Node.js Express backend together seamlessly:
              </p>
              <div className="space-y-2">
                <div className="p-3 bg-[#09090b] rounded border border-zinc-800">
                  <p className="font-bold text-white">Option A: Render.com (Recommended for beginners)</p>
                  <p className="text-zinc-400">Free web service tier. Connect your GitHub repository, choose Node environment, set build command to <code>npm run build</code>, and start command to <code>node dist/server.js</code>.</p>
                </div>
                <div className="p-3 bg-[#09090b] rounded border border-zinc-800">
                  <p className="font-bold text-white">Option B: Railway.app</p>
                  <p className="text-zinc-400">$5 free trial credits monthly. Automatically detects Node & Docker. 1-click PostgreSQL provisioning.</p>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Product Editor Modal */}
      {isEditorOpen && (
        <ProductEditorModal
          product={editingProduct}
          categories={categories}
          token={token}
          onClose={() => {
            setIsEditorOpen(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}

    </div>
  );
};
