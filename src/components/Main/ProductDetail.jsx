import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { FiMinus, FiPlus } from 'react-icons/fi'
import { addToRecentlyViewed, formatProductForRecent } from '../../utils/RecentProducts'
import { useTranslation } from "react-i18next";

function ProductDetail() {
  const { category, product: productSlug } = useParams()
  const navigate = useNavigate()

  const [products, setProducts] = useState({})
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)

  const { t, i18n } = useTranslation() // i18n hook
  const getCurrentLanguageLabel = () => {
    const langMap = {
      'tr': 'TR',
      'en': 'EN',
      'az': 'AZ',
      'ru': 'RU'
    };
    return langMap[i18n.language] || 'TR';
  };


  useEffect(() => {
    fetch('/data/data.json')
      .then(res => res.json())
      .then(data => {
        if (data?.products) {
          setProducts(data.products)
        }
        setLoading(false)
      })
      .catch(error => {
        console.error('Ürün verileri yüklenemedi:', error)
        setLoading(false)
      })
  }, [])

  const currentProduct = useMemo(() => {
    if (!products || Object.keys(products).length === 0) return null

    for (const categoryKey of Object.keys(products)) {
      const categoryProducts = products[categoryKey]
      if (Array.isArray(categoryProducts)) {
        const found = categoryProducts.find(p => {
          const productNameSlug = p.name.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
          return productNameSlug === productSlug
        })
        if (found) return found
      }
    }
    return null
  }, [products, productSlug])

  useEffect(() => {
    if (currentProduct) {
      const formattedProduct = formatProductForRecent(currentProduct);
      addToRecentlyViewed(formattedProduct);
    }
  }, [currentProduct]);

  const sizeCategories = ['hoodie', 'tshirt', 'sweatshirt', 'jacket']

  const needsSize = useMemo(() => {
    if (!currentProduct) return false
    const productCategory = (currentProduct.category || currentProduct.kategori || '').toLowerCase()
    return sizeCategories.some(cat => productCategory.includes(cat))
  }, [currentProduct])

  // Qiymət formatı
  const formatPrice = (price, currency) => {
    switch (currency) {
      case 'TRY':
        return `₺ ${Number(price).toFixed(2)}`
      default:
        return `${Number(price).toFixed(2)} ${currency || ''}`
    }
  }

  // Şəkil naviqasiyası
  const nextImage = () => {
    if (currentProduct?.image_urls?.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === currentProduct.image_urls.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (currentProduct?.image_urls?.length > 1) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? currentProduct.image_urls.length - 1 : prev - 1
      )
    }
  }

  const increaseQuantity = () => setQuantity(prev => prev + 1)
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1))

  const handleAddToCart = () => {
    if (needsSize && !selectedSize) {
      alert('Zəhmət olmasa bədən ölçüsü seçin')
      return
    }

    const cartItem = {
      ...currentProduct,
      quantity,
      selectedSize: needsSize ? selectedSize : null
    }

    const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
    const existingItemIndex = existingCart.findIndex(item =>
      item.id === currentProduct.id &&
      (needsSize ? item.selectedSize === selectedSize : true)
    )

    if (existingItemIndex !== -1) {
      existingCart[existingItemIndex].quantity += quantity
    } else {
      existingCart.push(cartItem)
    }

    localStorage.setItem('cart', JSON.stringify(existingCart))
    window.dispatchEvent(new Event('cartUpdated'))

    alert('Məhsul səbətə əlavə edildi!')
  }

  const handleBuyNow = () => {
    handleAddToCart()
    navigate('/cart')
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-300 h-96 rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 rounded w-1/2"></div>
              <div className="h-10 bg-gray-300 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!currentProduct) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Məhsul tapılmadı</h1>
        <button
          onClick={() => navigate('/ust-giyim')}
          className="bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
        >
          Məhsullara qayıt
        </button>
      </div>
    )
  }

  const availableSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <nav className="mb-8 text-sm">
        <button
          onClick={() => navigate('/ust-giyim')}
          className="text-gray-500 cursor-pointer hover:text-gray-700"
        >
          {t('Cartv5')}
        </button>
        <span className="mx-2 text-gray-400">/</span>
        <span className="capitalize">
          {(currentProduct.category || currentProduct.kategori || '').replace('-', ' ')}
        </span>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-800">{currentProduct.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="relative mb-4 group">
            <img
              src={currentProduct.image_urls?.[currentImageIndex] || '/placeholder-image.jpg'}
              alt={currentProduct.name}
              className="w-full min-h-96 lg:min-h-[500px] object-cover rounded-lg"
            />

            {currentProduct.image_urls?.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                >
                  <IoIosArrowBack className="text-xl" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                >
                  <IoIosArrowForward className="text-xl" />
                </button>
              </>
            )}
          </div>

          {currentProduct.image_urls?.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {currentProduct.image_urls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`${currentProduct.name} ${index + 1}`}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-16 object-cover rounded cursor-pointer transition-all ${index === currentImageIndex
                    ? 'ring-2 ring-black'
                    : 'opacity-70 hover:opacity-100'
                    }`}
                />
              ))}
            </div>
          )}
        </div>

        <div>
          <h1 className="text-2xl lg:text-3xl font-bold mb-4">{currentProduct.name}</h1>

          <div className="mb-6">
            <span className="text-3xl font-bold text-green-600">
              {formatPrice(currentProduct.price, currentProduct.currency)}
            </span>
          </div>

          {needsSize && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">{t('Product5')}</h3>
              <div className="flex gap-2 flex-wrap">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md font-semibold transition-all ${selectedSize === size
                      ? 'bg-black text-white border-black'
                      : 'bg-white text-black border-gray-300 hover:border-black'
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">{t('Product1')}</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={decreaseQuantity}
                  className="p-3 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  <FiMinus className="text-lg cursor-pointer" />
                </button>
                <span className="px-6 py-3 font-semibold min-w-[60px] text-center">
                  {quantity}
                </span>
                <button
                  onClick={increaseQuantity}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <FiPlus className="text-lg cursor-pointer" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              className="w-full cursor-pointer bg-white border-2 border-black text-black py-4 rounded-md font-semibold hover:bg-black hover:text-white transition-all duration-300"
            >
              {t('Card1')}
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full cursor-pointer bg-black text-white py-4 rounded-md font-semibold hover:bg-gray-800 transition-colors"
            >
              {t('Product2')}
            </button>
          </div>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
              <span>{t('free_shipping_banner')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">⟲</span>
              </div>
              <span>{t('Product3')}</span>
            </div>
          </div>

          {currentProduct.description && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-3">{t('Product4')}</h3>
              <div className="prose prose-sm max-w-none">
                <button className="text-gray-600 flex items-center gap-2 w-full text-left py-2 hover:text-black transition-colors">
                  <span>{currentProduct.description}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail