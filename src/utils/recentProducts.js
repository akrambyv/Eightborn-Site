const RECENT_PRODUCTS_KEY = 'recentlyViewedProducts';

export const addToRecentlyViewed = (product) => {
  try {
    const existing = getRecentlyViewed();

    const filteredProducts = existing.filter(item => item.id !== product.id);

    const updatedProducts = [product, ...filteredProducts];

    const finalProducts = updatedProducts.slice(0, 4);

    localStorage.setItem(RECENT_PRODUCTS_KEY, JSON.stringify(finalProducts));

    window.dispatchEvent(new CustomEvent('recentProductsUpdated', {
      detail: finalProducts
    }));

    return finalProducts;
  } catch (error) {
    console.error('Son görüntülənənlər əlavə edilərkən xəta:', error);
    return [];
  }
};

// Son görüntülənənləri al
export const getRecentlyViewed = () => {
  try {
    const stored = localStorage.getItem(RECENT_PRODUCTS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Son görüntülənənlər alınarkən xəta:', error);
    return [];
  }
};

// Son görüntülənənləri təmizlə
export const clearRecentlyViewed = () => {
  try {
    localStorage.removeItem(RECENT_PRODUCTS_KEY);
    window.dispatchEvent(new CustomEvent('recentProductsUpdated', {
      detail: []
    }));
  } catch (error) {
    console.error('Son görüntülənənlər təmizlənərkən xəta:', error);
  }
};

// Məhsul məlumatlarını format et (son görüntülənənlər üçün lazım olan)
export const formatProductForRecent = (product) => {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    currency: product.currency || '$',
    image: product.image_urls?.[0] || product.image || '/placeholder-image.jpg',
    category: product.category || product.kategori || '',
    slug: product.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  };
};