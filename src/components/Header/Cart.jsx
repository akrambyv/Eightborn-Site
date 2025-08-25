import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi'
import { IoIosArrowBack } from 'react-icons/io'
import { useTranslation } from 'react-i18next'

function Cart() {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

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
    const loadCartItems = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCartItems(cart)
      setLoading(false)
    }

    loadCartItems()

    const handleCartUpdate = () => {
      loadCartItems()
    }

    window.addEventListener('cartUpdated', handleCartUpdate)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  const formatPrice = (price, currency) => {
    switch (currency) {
      case 'TRY':
        return `₺ ${Number(price).toFixed(2)}`
      default:
        return `${Number(price).toFixed(2)} ${currency || ''}`
    }
  }

  const updateCart = (newCart) => {
    setCartItems(newCart)
    localStorage.setItem('cart', JSON.stringify(newCart))
    window.dispatchEvent(new Event('cartUpdated'))
  }

  const increaseQuantity = (index) => {
    const newCart = [...cartItems]
    newCart[index].quantity = (newCart[index].quantity || 1) + 1
    updateCart(newCart)
  }

  const decreaseQuantity = (index) => {
    const newCart = [...cartItems]
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1
      updateCart(newCart)
    }
  }

  const removeItem = (index) => {
    const newCart = cartItems.filter((_, i) => i !== index)
    updateCart(newCart)
  }

  const clearCart = () => {
    if (window.confirm('Səbəti təmizləmək istəyirsiniz?')) {
      updateCart([])
    }
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1))
    }, 0)
  }

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + (item.quantity || 1), 0)
  }

  const goToProduct = (product) => {
    const normalizeCategory = (category) => {
      if (!category) return ''
      return category.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-')
    }

    const categorySlug = normalizeCategory(product.category || product.kategori)
    const productSlug = product.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    navigate(`/${categorySlug}/${productSlug}`)
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
          <div className="h-32 bg-gray-300 rounded"></div>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <FiTrash2 className="text-4xl text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('Cartp1')}</h2>
            <p className="text-gray-600">{t('Cartp2')}</p>
          </div>
          <button
            onClick={() => navigate('/ust-giyim')}
            className="bg-black text-white px-8 py-3 cursor-pointer rounded-md font-semibold hover:bg-gray-800 transition-colors"
          >
            {t('Cartbtn')}
          </button>
        </div>
      </div>
    )
  }

  const total = calculateTotal()
  const totalItems = getTotalItems()

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoIosArrowBack className="text-xl cursor-pointer" />
          </button>
          <h1 className="text-2xl font-bold">{t('Cartv1')} ({totalItems})</h1>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="text-red-600 cursor-pointer hover:text-red-800 flex items-center gap-2 transition-colors"
          >
            <FiTrash2 />
            {t('Cartv3')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Səbət məhsulları */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item, index) => (
            <div key={`${item.id}-${item.selectedSize || 'no-size'}-${index}`} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex gap-4">
                {/* Məhsul şəkli */}
                <div className="flex-shrink-0">
                  <img
                    src={item.image_urls?.[0] || '/placeholder-image.jpg'}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => goToProduct(item)}
                  />
                </div>

                {/* Məhsul məlumatları */}
                <div className="flex-1 space-y-2">
                  <h3 
                    className="font-semibold text-gray-800 cursor-pointer hover:text-gray-600 transition-colors"
                    onClick={() => goToProduct(item)}
                  >
                    {item.name}
                  </h3>
                  
                  <p className="text-sm text-gray-500 capitalize">
                    {(item.category || item.kategori || '').replace('_', ' ').replace('-', ' ')}
                  </p>

                  {item.selectedSize && (
                    <p className="text-sm text-gray-600">
                      Bədən: <span className="font-medium">{item.selectedSize}</span>
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-4">
                    {/* Qiymət */}
                    <div className="font-bold text-lg text-green-600">
                      {formatPrice(item.price, item.currency)}
                    </div>

                    {/* Miktar kontrolleri */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-gray-300 rounded-md">
                        <button
                          onClick={() => decreaseQuantity(index)}
                          className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          disabled={(item.quantity || 1) <= 1}
                        >
                          <FiMinus className="text-sm cursor-pointer" />
                        </button>
                        <span className="px-4 py-2 font-semibold min-w-[60px] text-center">
                          {item.quantity || 1}
                        </span>
                        <button
                          onClick={() => increaseQuantity(index)}
                          className="p-2 hover:bg-gray-100 transition-colors"
                        >
                          <FiPlus className="text-sm cursor-pointer" />
                        </button>
                      </div>

                      {/* Sil düyməsi */}
                      <button
                        onClick={() => removeItem(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                        title="Səbətdən sil"
                      >
                        <FiTrash2 className="text-lg cursor-pointer" />
                      </button>
                    </div>
                  </div>

                  {/* Ümuimi qiymət (məhsul üçün) */}
                  <div className="text-right">
                    <span className="text-sm text-gray-500">{t('Cartv2')}: </span>
                    <span className="font-bold text-gray-800">
                      {formatPrice(item.price * (item.quantity || 1), item.currency)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sifariş xülasəsi */}
        <div className="bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-xl font-bold mb-6">{t('Cartv4')}</h2>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>{t('Cartv5')} ({totalItems})</span>
              <span>{formatPrice(total, 'TRY')}</span>
            </div>
            
            <div className="flex justify-between text-gray-600">
              <span>{t('Cartv6')}</span>
              <span className="text-green-600">
                {total >= 1500 ? 'Pulsuz' : '₺ 29.99'}
              </span>
            </div>

            <hr className="my-4" />

            <div className="flex justify-between text-xl font-bold">
              <span>{t('Cartv7')}</span>
              <span className="text-green-600">
                {formatPrice(total + (total >= 1500 ? 0 : 29.99), 'TRY')}
              </span>
            </div>
          </div>

          {total < 1500 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-6">
              <p className="text-sm text-yellow-800">
                {t('Cartv80')} {formatPrice(1500 - total, 'TRY')} {t('Cartv81')}
              </p>
            </div>
          )}

          <button 
            className="w-full cursor-pointer bg-black text-white py-4 rounded-md font-semibold hover:bg-gray-800 transition-colors mb-3"
            onClick={() => {
              // Burada ödəniş səhifəsinə yönləndirmək olar
              alert('Ödəniş funksiyası əlavə ediləcək')
            }}
          >
            {t('Cartv9')}
          </button>

          <button
            onClick={() => navigate('/ust-giyim')}
            className="w-full border cursor-pointer border-black text-black py-4 rounded-md font-semibold hover:bg-black hover:text-white transition-all"
          >
            {t('Cartv10')}
          </button>

          {/* Təhlükəsizlik məlumatı */}
          <div className="mt-6 p-3 bg-gray-50 rounded-md">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold text-xs">✓</span>
              </div>
              <span>{t('Cartv11')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart