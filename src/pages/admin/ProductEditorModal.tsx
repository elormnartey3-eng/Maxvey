import React, { useState } from 'react';
import { X, Upload, Plus, Trash2, Check, Image as ImageIcon } from 'lucide-react';
import { Product, Category } from '../../types';

interface ProductEditorModalProps {
  product?: Product | null;
  categories: Category[];
  token: string | null;
  onClose: () => void;
  onSave: (product: Product) => void;
}

export const ProductEditorModal: React.FC<ProductEditorModalProps> = ({
  product,
  categories,
  token,
  onClose,
  onSave,
}) => {
  const isEditing = Boolean(product);

  const [name, setName] = useState(product?.name || '');
  const [tagline, setTagline] = useState(product?.tagline || '');
  const [description, setDescription] = useState(product?.description || '');
  const [price, setPrice] = useState(product?.price || 28500);
  const [compareAtPrice, setCompareAtPrice] = useState(product?.compareAtPrice || 35000);
  const [category, setCategory] = useState(product?.category || (categories[0]?.name || 'T-Shirts & Tops'));
  const [collection, setCollection] = useState(product?.collection || 'Graffiti Star Drop 01');
  const [stock, setStock] = useState(product?.stock ?? 30);
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured ?? true);
  const [isNewArrival, setIsNewArrival] = useState(product?.isNewArrival ?? false);

  const [images, setImages] = useState<string[]>(product?.images || ['/images/tee-black.jpg']);
  const [featuredImage, setFeaturedImage] = useState<string>(
    product?.featuredImage || product?.images?.[0] || '/images/tee-black.jpg'
  );

  const [sizes, setSizes] = useState<string[]>(product?.sizes || ['S', 'M', 'L', 'XL', 'XXL']);
  const [colorName, setColorName] = useState(product?.colors?.[0]?.name || 'Jet Black');
  const [colorHex, setColorHex] = useState(product?.colors?.[0]?.hex || '#09090b');

  const [detailsText, setDetailsText] = useState(
    product?.details?.join('\n') || '260 GSM heavy combed ringspun cotton\nBoxy relaxed drop-shoulder fit\nReinforced twin-needle stitching'
  );
  const [careText, setCareText] = useState(
    product?.careInstructions?.join('\n') || 'Machine wash cold inside out\nDo not iron on graphic\nHang dry in shade'
  );

  // Sync state whenever product prop updates
  React.useEffect(() => {
    if (product) {
      setName(product.name || '');
      setTagline(product.tagline || '');
      setDescription(product.description || '');
      setPrice(product.price || 28500);
      setCompareAtPrice(product.compareAtPrice || 0);
      setCategory(product.category || 'T-Shirts & Tops');
      setCollection(product.collection || 'Graffiti Star Drop 01');
      setStock(product.stock ?? 30);
      setIsFeatured(product.isFeatured ?? true);
      setIsNewArrival(product.isNewArrival ?? false);
      setImages(product.images?.length ? product.images : ['/images/tee-black.jpg']);
      setFeaturedImage(product.featuredImage || product.images?.[0] || '/images/tee-black.jpg');
      setSizes(product.sizes?.length ? product.sizes : ['S', 'M', 'L', 'XL', 'XXL']);
      setColorName(product.colors?.[0]?.name || 'Standard');
      setColorHex(product.colors?.[0]?.hex || '#09090b');
      setDetailsText(product.details?.join('\n') || '');
      setCareText(product.careInstructions?.join('\n') || '');
    }
  }, [product]);

  const [uploading, setUploading] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const allAvailableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'];

  const toggleSize = (s: string) => {
    if (sizes.includes(s)) {
      setSizes(sizes.filter(x => x !== s));
    } else {
      setSizes([...sizes, s]);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = reader.result as string;
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            imageBase64: base64,
            filename: file.name,
          }),
        });
        const data = await res.json();
        if (data.url) {
          setImages(prev => [data.url, ...prev]);
          setFeaturedImage(data.url);
        }
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setUploading(false);
      alert('Upload failed');
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setImages(prev => [...prev, imageUrlInput.trim()]);
      if (!featuredImage) setFeaturedImage(imageUrlInput.trim());
      setImageUrlInput('');
    }
  };

  const handleRemoveImage = (img: string) => {
    const updated = images.filter(i => i !== img);
    setImages(updated);
    if (featuredImage === img) {
      setFeaturedImage(updated[0] || '');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const details = detailsText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const careInstructions = careText
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const slug = product?.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const finalProduct: Product = {
      id: product?.id || `mv-prod-${Date.now()}`,
      name: name.trim(),
      slug,
      tagline: tagline.trim(),
      description: description.trim() || name,
      details,
      careInstructions,
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : undefined,
      category,
      collection: collection.trim(),
      images: images.length ? images : ['/images/tee-black.jpg'],
      featuredImage: featuredImage || images[0] || '/images/tee-black.jpg',
      sizes: sizes.length ? sizes : ['M', 'L', 'XL'],
      colors: [{ name: colorName, hex: colorHex }],
      stock: Number(stock),
      isFeatured,
      isNewArrival,
      createdAt: product?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(finalProduct);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#121215] border border-[#27272a] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl my-8">
        
        {/* Header */}
        <div className="p-6 border-b border-[#27272a] flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white uppercase font-heading">
              {isEditing ? 'EDIT CLOTHING PRODUCT' : 'ADD NEW STREETWEAR PIECE'}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Updates to garments sync instantly with the live storefront database.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          
          {/* 1. Pricing in NGN & Stock Quantity (Top priority for quick merchant edits) */}
          <div className="p-4 bg-zinc-900/60 border border-[#dc2626]/40 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold uppercase tracking-wider text-[#dc2626] font-mono flex items-center gap-2">
                <span>1. PRICING & INVENTORY (NGN)</span>
              </h3>
              <span className="text-[10px] font-mono bg-black text-zinc-400 px-2 py-0.5 rounded border border-zinc-800">
                OFFICIAL PAYSTACK RATE
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-zinc-200 font-bold mb-1.5 text-xs">
                  Selling Price (₦ NGN) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₦</span>
                  <input
                    type="number"
                    required
                    min="500"
                    step="500"
                    value={price}
                    onChange={e => setPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-white font-mono font-bold text-sm focus:outline-none focus:border-[#dc2626]"
                  />
                </div>
                <span className="text-[10px] text-zinc-400 mt-1 block">Live price charged to buyers</span>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1.5 text-xs">
                  Original / Strikethrough (₦ NGN)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">₦</span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={compareAtPrice}
                    onChange={e => setCompareAtPrice(Number(e.target.value))}
                    className="w-full pl-8 pr-3 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-white font-mono text-sm focus:outline-none focus:border-[#dc2626]"
                  />
                </div>
                <span className="text-[10px] text-zinc-500 mt-1 block">Leave 0 if not on sale</span>
              </div>

              <div>
                <label className="block text-zinc-200 font-bold mb-1.5 text-xs">
                  Units in Stock *
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  value={stock}
                  onChange={e => setStock(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-white font-mono font-bold text-sm focus:outline-none focus:border-[#dc2626]"
                />
                <span className="text-[10px] text-zinc-400 mt-1 block">Available across all sizes</span>
              </div>
            </div>
          </div>

          {/* 2. Basic Info */}
          <div className="space-y-4">
            <h3 className="font-bold uppercase tracking-wider text-zinc-300 font-mono">
              2. GARMENT NAME & CATEGORY
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-medium mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MAXVEY 'Graffiti Star' Oversized Tee — Jet Black"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-white focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Signature 260GSM Boxy Drop-Shoulder Graphic T-Shirt"
                  value={tagline}
                  onChange={e => setTagline(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-white focus:outline-none focus:border-[#dc2626]"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Category *</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-white focus:outline-none focus:border-[#dc2626]"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                  <option value="T-Shirts & Tops">T-Shirts & Tops</option>
                  <option value="Sleeveless & Tanks">Sleeveless & Tanks</option>
                  <option value="Hoodies & Outerwear">Hoodies & Outerwear</option>
                  <option value="Cargos & Bottoms">Cargos & Bottoms</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-zinc-300 font-medium mb-1">Collection</label>
                <input
                  type="text"
                  placeholder="e.g. Graffiti Star Drop 01"
                  value={collection}
                  onChange={e => setCollection(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#09090b] border border-zinc-700 rounded text-white focus:outline-none focus:border-[#dc2626]"
                />
              </div>
            </div>
          </div>

          {/* 3. Product Images */}
          <div className="space-y-4 pt-4 border-t border-[#27272a]">
            <h3 className="font-bold uppercase tracking-wider text-[#dc2626] font-mono">
              3. PRODUCT PHOTOGRAPHY & UPLOAD
            </h3>

            {/* Current Images list */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border border-zinc-700 bg-black shrink-0">
                  <img src={img} alt="Product" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(img)}
                    className="absolute top-1 right-1 p-1 bg-black/80 text-red-400 hover:text-red-300 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                  {featuredImage === img ? (
                    <span className="absolute bottom-1 left-1 text-[9px] font-mono font-bold bg-[#dc2626] text-white px-1.5 py-0.5 rounded">
                      PRIMARY
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setFeaturedImage(img)}
                      className="absolute bottom-1 left-1 text-[9px] font-mono bg-black/70 text-zinc-300 hover:text-white px-1.5 py-0.5 rounded"
                    >
                      SET PRIMARY
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Upload from Phone / Laptop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="flex flex-col items-center justify-center p-4 border border-dashed border-zinc-700 hover:border-[#dc2626] rounded-lg cursor-pointer bg-[#09090b] transition-colors">
                <Upload className="w-5 h-5 text-zinc-400 mb-1" />
                <span className="text-zinc-300 font-medium">Upload Image from Device</span>
                <span className="text-zinc-500 text-[10px]">JPG, PNG, WEBP (Max 15MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>

              {/* Paste Image URL */}
              <div className="flex flex-col justify-center space-y-1.5">
                <label className="text-zinc-400 text-[11px]">Or paste direct image path / URL:</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="/images/tee-black.jpg"
                    value={imageUrlInput}
                    onChange={e => setImageUrlInput(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#09090b] border border-zinc-700 rounded text-white"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded font-bold"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Sizes & Color */}
          <div className="space-y-4 pt-4 border-t border-[#27272a]">
            <h3 className="font-bold uppercase tracking-wider text-[#dc2626] font-mono">
              4. SIZES & COLORWAY
            </h3>

            <div>
              <label className="block text-zinc-300 font-medium mb-1.5">Available Sizing:</label>
              <div className="flex flex-wrap gap-2">
                {allAvailableSizes.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => toggleSize(s)}
                    className={`px-3 py-1.5 rounded font-mono font-bold transition-colors ${
                      sizes.includes(s)
                        ? 'bg-white text-black'
                        : 'bg-[#09090b] text-zinc-500 border border-zinc-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Color Name</label>
                <input
                  type="text"
                  placeholder="e.g. Jet Black / Canary Yellow"
                  value={colorName}
                  onChange={e => setColorName(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#09090b] border border-zinc-700 rounded text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Color Swatch (Hex)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colorHex}
                    onChange={e => setColorHex(e.target.value)}
                    className="w-10 h-8 rounded border border-zinc-700 bg-transparent cursor-pointer"
                  />
                  <input
                    type="text"
                    value={colorHex}
                    onChange={e => setColorHex(e.target.value)}
                    className="flex-1 px-3 py-2 bg-[#09090b] border border-zinc-700 rounded text-white font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 5. Descriptions & Accordion Specs */}
          <div className="space-y-4 pt-4 border-t border-[#27272a]">
            <h3 className="font-bold uppercase tracking-wider text-[#dc2626] font-mono">
              5. DESCRIPTIONS & TECHNICAL BULLETS
            </h3>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Long Description</label>
              <textarea
                rows={3}
                placeholder="Story behind the design and cutting specs..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#09090b] border border-zinc-700 rounded text-white leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Bullet Details (One per line)</label>
                <textarea
                  rows={4}
                  value={detailsText}
                  onChange={e => setDetailsText(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#09090b] border border-zinc-700 rounded text-white font-mono leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Care Instructions (One per line)</label>
                <textarea
                  rows={4}
                  value={careText}
                  onChange={e => setCareText(e.target.value)}
                  className="w-full px-3.5 py-2 bg-[#09090b] border border-zinc-700 rounded text-white font-mono leading-relaxed"
                />
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={e => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 accent-[#dc2626]"
                />
                <span>Feature on Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                <input
                  type="checkbox"
                  checked={isNewArrival}
                  onChange={e => setIsNewArrival(e.target.checked)}
                  className="w-4 h-4 accent-[#dc2626]"
                />
                <span>Mark as New Arrival Drop</span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="p-4 bg-[#09090b] rounded-lg border border-[#27272a] flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded border border-zinc-700 text-zinc-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded bg-[#dc2626] hover:bg-[#b91c1c] text-white font-bold uppercase tracking-wider"
            >
              {isEditing ? 'Save Product Changes' : 'Publish Product to Store'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
