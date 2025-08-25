import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRecentlyViewed } from '../../utils/recentProducts';
import { useTranslation } from 'react-i18next';

function Main() {
  const navigate = useNavigate();
  const scrollContainerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [screenSize, setScreenSize] = useState('mobile');
  const [recentProducts, setRecentProducts] = useState([]);
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
  const loadRecentProducts = () => {
    const recent = getRecentlyViewed();
    setRecentProducts(recent);
    if (recent.length > 0 && currentIndex >= recent.length) {
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    loadRecentProducts();
  }, []);

  useEffect(() => {
    const handleRecentProductsUpdate = () => {
      loadRecentProducts();
    };

    window.addEventListener('recentProductsUpdated', handleRecentProductsUpdate);

    return () => {
      window.removeEventListener('recentProductsUpdated', handleRecentProductsUpdate);
    };
  }, [currentIndex]);

  // Məhsula tıklama
  const handleProductClick = (product) => {
    // Slug yarat və məhsula get
    const slug = product.slug || product.name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const category = product.category || 'ust-giyim';
    navigate(`/${category}/${slug}`);
  };

  // Qiymət formatı
  const formatPrice = (price, currency) => {
    switch (currency) {
      case 'TRY':
        return `₺ ${Number(price).toFixed(2)}`
      case '$':
      case 'USD':
        return `$ ${Number(price).toFixed(2)}`
      default:
        return `${Number(price).toFixed(2)} ${currency || '$'}`
    }
  };

  // Ox işarələri ilə keçim funksiyaları
  const getVisibleCount = () => {
    return screenSize === 'lg' ? 4 : screenSize === 'md' ? 3 : 2;
  };

  const goToPrevious = () => {
    if (recentProducts.length === 0) return;
    const visibleCount = getVisibleCount();
    setCurrentIndex(prev => prev === 0 ? Math.max(0, recentProducts.length - visibleCount) : prev - 1);
  };

  const goToNext = () => {
    if (recentProducts.length === 0) return;
    const visibleCount = getVisibleCount();
    setCurrentIndex(prev => prev >= recentProducts.length - visibleCount ? 0 : prev + 1);
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const createInfiniteText = () => {
      const text = 'EIGHTBORN';
      const textElement = document.createElement('span');
      textElement.className = 'text-[#a9d31e] text-[14px] inline-block mr-8';
      textElement.textContent = text;

      container.appendChild(textElement);

      setTimeout(() => {
        if (textElement.parentNode) {
          textElement.remove();
        }
      }, 25000);
    };

    const interval = setInterval(createInfiniteText, 1000);
    createInfiniteText();

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setScreenSize('lg');
      } else if (window.innerWidth >= 768) {
        setScreenSize('md');
      } else {
        setScreenSize('mobile');
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <main>
      <div className='relative z-0'>
        <img src="https://cdn.myikas.com/images/theme-images/b49bcdd8-f893-458a-8ad9-872c31c14d26/image_1296.webp" className='w-full sm:hidden shadow-2xl filter brightness-90' alt="" />
        <img src="https://cdn.myikas.com/images/theme-images/e0c9411c-cad9-4635-a6f6-4dac27e20d6e/image_1296.webp" className='w-full hidden sm:block shadow-2xl' alt="" />
        <div className='absolute inset-0 bg-black/10 pointer-events-none' />
      </div>

      {/* Məhsul kartları */}
      <div className='grid grid-cols-2 md:grid-cols-4 mt-5 gap-4 p-4 max-w-7xl mx-auto '>
        <div className='bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300' onClick={() => navigate('/ust-giyim/beat-kalin-bere-koyu-gri')}>
          <img
            src="https://cdn.myikas.com/images/d1a88c1c-11e6-49da-8469-64632e4b6c4c/e368c89a-ee74-4b6d-8dad-96d331c62898/1080/8born-09-12-20230048.webp"
            alt="bere"
            className='w-full min-h-45 object-cover'
          />
          <div className='p-3'>
            <p className='font-medium text-sm mb-2'>Beat Kalın Bere - Koyu Gri</p>
            <span className='font-bold text-green-600'>$ 19.00</span>
          </div>
        </div>
        <div className='bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300' onClick={() => navigate('/ust-giyim/beat-kalin-bere-haki-yesili')}>
          <img
            src="https://cdn.myikas.com/images/d1a88c1c-11e6-49da-8469-64632e4b6c4c/0ab5c3de-9962-448e-8589-5517d5dc2a82/540/8born-09-12-20230060-77.webp"
            alt="bere"
            className='w-full min-h-45 object-cover'
          />
          <div className='p-3'>
            <p className='font-medium text-sm mb-2'>Beat Kalın Bere - Haki Yeşili</p>
            <span className='font-bold text-green-600'>$ 52.99</span>
          </div>
        </div>
        <div className='bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300' onClick={() => navigate('/ust-giyim/tree-oversized-hoodie-01')}>
          <img
            src="https://cdn.myikas.com/images/d1a88c1c-11e6-49da-8469-64632e4b6c4c/0aef34b9-2104-42af-bf80-304569f01517/540/8born-09-12-202310511.webp"
            alt="hoodie"
            className='w-full min-h-45 object-cover'
          />
          <div className='p-3'>
            <p className='font-medium text-sm mb-2'>Tree Oversized Hoodie 01</p>
            <span className='font-bold text-green-600'>$ 149.99</span>
          </div>
        </div>
        <div className='bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300' onClick={() => navigate('/ust-giyim/astronaut-oversized-hoodie')}>
          <img
            src="https://cdn.myikas.com/images/d1a88c1c-11e6-49da-8469-64632e4b6c4c/cdeb90ec-6cc5-4e8c-a82d-c5a08c48bd08/540/8born-09-12-202311108.webp"
            alt="hoodie"
            className='w-full min-h-45 object-cover'
          />
          <div className='p-3'>
            <p className='font-medium text-sm mb-2'>Astronaut Oversized Hoodie</p>
            <span className='font-bold text-green-600'>$ 149.99</span>
          </div>
        </div>
      </div>

      <div className='bg-[#000] mt-5 overflow-hidden'>
        <div
          ref={scrollContainerRef}
          className='animate-scroll whitespace-nowrap'
        ></div>
      </div>

      {recentProducts.length > 0 && (
        <div className='relative mt-10'>
          {/* Başlıq */}
          <div className='max-w-7xl mx-auto px-4 mb-6'>
            <h2 className='font-bold text-[25px]'>{t('Main_sg')}</h2>
          </div>

          {screenSize !== 'lg' && recentProducts.length > getVisibleCount() && (
            <button
              onClick={goToPrevious}
              className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg'
            >
              <svg className='w-6 h-6 text-gray-600 transition-transform duration-300 ease-in-out' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>
          )}

          {/* Sağ ox - yalnız lazım olduqda və məhsul olduqda görünür */}
          {screenSize !== 'lg' && recentProducts.length > getVisibleCount() && (
            <button
              onClick={goToNext}
              className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md z-10 hover:bg-gray-100 transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-lg'
            >
              <svg className='w-6 h-6 text-gray-600 transition-transform duration-300 ease-in-out' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </button>
          )}

          {/* Son görüntülənən məhsul kartları */}
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 transition-all duration-500 ease-in-out max-w-7xl mx-auto'>
            {recentProducts
              .slice(currentIndex, currentIndex + getVisibleCount())
              .map((product) => (
                <div
                  key={`${product.id}-${product.selectedSize || 'default'}`}
                  className='bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-500 ease-in-out hover:scale-105 cursor-pointer'
                  onClick={() => handleProductClick(product)}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className='w-full min-h-48 object-cover transition-transform duration-500 ease-in-out'
                  />
                  <div className='p-3'>
                    <p className='font-medium text-sm mb-2 line-clamp-2'>{product.name}</p>
                    <span className='font-bold text-green-600'>
                      {formatPrice(product.price, product.currency)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      <hr className='mt-5 text-[#d2d2d2]' />
      <img className='p-4 sm:hidden' src="https://cdn.myikas.com/images/theme-images/d48c288a-b582-45f0-aade-20a6ccf4f7c7/image_1950.webp" alt="eightborn photo mobile" />
      <div className='lg:flex lg:justify-center lg:items-start lg:gap-8 lg:max-w-7xl lg:mx-auto'>
        <img className='p-4 hidden lg:block h-80 lg:h-96 xl:h-[28rem] 2xl:h-[32rem] lg:flex-shrink-0' src="https://cdn.myikas.com/images/theme-images/d48c288a-b582-45f0-aade-20a6ccf4f7c7/image_900.webp" alt="eightborn photo desktop" />
        <div className='max-w-4xl lg:flex-1 px-6 pt-6'>
          <p className='text-md mb-6 text-gray-700 font-medium text-left'>{t('about1')}</p>
          <p className='text-md mb-6 text-gray-700 font-medium text-left'>{t('about2')}</p>
          <p className='text-md mb-6 text-gray-700 font-medium text-left'>{t('about3')}</p>
        </div>
      </div>
      <hr className='text-[#d2d2d2]' />

      <div className='flex md:gap-4 lg:gap-10 xl:gap-20 mt-10 justify-center items-center text-center'>
        <div className='flex flex-col items-center text-center mx-4'>
          <img src="https://cdn.myikas.com/images/theme-images/03310641-9822-4fc3-927d-983f85d1baea/image_180.webp" alt="" className='w-16 h-16 object-contain' />
          <p className='text-[13px]'>256 Bit SSL ile güvende alışveriş</p>
        </div>
        <div className='flex flex-col items-center text-center mx-4'>
          <img src="https://cdn.myikas.com/images/theme-images/95b7493f-c23b-4f3a-9082-a5eff8d27b18/image_180.webp" alt="" className='w-16 h-16 object-contain' />
          <p className='text-[13px]'>1500 TL ve üzeri siparişlerde kargo bedava*</p>
        </div>
        <div className='flex flex-col items-center text-center mx-4'>
          <img src="https://cdn.myikas.com/images/theme-images/9a98ee6b-dd5a-48a3-8f0e-654dd1bfa07f/image_180.webp" alt="" className='w-16 h-16 object-contain' />
          <p className='text-[13px]'>15 iş günü içerisinde iade</p>
        </div>
      </div>

      <p className='text-center'>*Yurt dışı <br /> siparişlerinde <br /> geçerli değildir</p>

    </main>
  )
}

export default Main