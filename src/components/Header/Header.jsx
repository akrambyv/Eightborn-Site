import { useEffect, useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoPersonOutline, IoSearch, IoLogOutOutline } from 'react-icons/io5'
import { RiShoppingBagLine } from 'react-icons/ri'
import { IoClose } from 'react-icons/io5'
import { IoIosArrowDown, IoIosArrowForward } from 'react-icons/io'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

function Header() {
  const { t, i18n } = useTranslation() // i18n hook
  const [isFixed, setIsFixed] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const navigate = useNavigate()

  const changeLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    setShowLangDropdown(false);
  };

  const getCurrentLanguageLabel = () => {
    const langMap = {
      'tr': 'TR',
      'en': 'EN',
      'az': 'AZ',
      'ru': 'RU'
    };
    return langMap[i18n.language] || 'TR';
  };

  // Səbət elementlərinin sayını yenilə
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const totalCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
    setCartItemCount(totalCount);
  };

  useEffect(() => {
    updateCartCount();

    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cartUpdated', handleCartUpdate);

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    fetch("/data/data.json")
      .then(res => res.json())
      .then(data => {
        if (data?.products) {
          const allProducts = [];
          Object.keys(data.products).forEach(category => {
            data.products[category].forEach(product => {
              allProducts.push(product);
            });
          });
          setProducts(allProducts);
        }
      })
      .catch(error => console.error('Ürün verileri yüklenemedi:', error));
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts([]);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().replace('_', ' ').includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().replace('-', ' ').includes(searchQuery.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchQuery, products]);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const loggedInUser = localStorage.getItem("loggedInUser");
    if (loggedInUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    window.location.reload();
  };

  useEffect(() => {
    const handleScroll = () => {
      const firstDivHeight = 48;
      if (window.scrollY > firstDivHeight) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery('');
        setFilteredProducts([]);
      }
    };

    if (isSearchOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isSearchOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (isMenuOpen) {
      setIsCategoriesOpen(false);
    }
  };

  const toggleCategories = () => {
    setIsCategoriesOpen(!isCategoriesOpen);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setFilteredProducts([]);
  };

  const handleProductClick = (product) => {
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
    handleSearchClose()
  };

  const renderProductGrid = () => {
    if (searchQuery.trim() === '') {
      return (
        <div className="text-center text-gray-500 mt-20">
          <IoSearch className="text-6xl mx-auto mb-4 opacity-30" />
          <p className="text-xl">{t('search_placeholder')}</p>
        </div>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <div className="text-center text-gray-500 mt-20">
          <p className="text-xl">"{searchQuery}" {t('search_no_results')}</p>
          <p className="text-sm mt-2">{t('search_try_different')}</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 p-6">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
            onClick={() => handleProductClick(product)}
          >
            <div className="aspect-square overflow-hidden">
              <img
                src={product.image_urls?.[0] || '/placeholder-image.jpg'}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-800 text-sm mb-2 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-gray-500 mb-2 capitalize">
                {product.category.replace('_', ' ').replace('-', ' ')}
              </p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-gray-900">
                  ${product.price}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${product.stock === 'In Stock'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
                  }`}>
                  {product.stock === 'In Stock' ? t('in_stock') : t('out_of_stock')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const categories = [
    { label: t('category_bere'), slug: 'bere' },
    { label: t('category_gold_series'), slug: 'gold-series' },
    { label: t('category_hoodie'), slug: 'hoodie' },
    { label: t('category_hair_band'), slug: 'sac-bandi' },
    { label: t('category_socks'), slug: 'corap' }
  ]

  return (
    <header className='sticky top-0 z-[9999] isolate'>
      <div className='bg-[#d4fa86]'>
        <p className='text-[#8a87a9] font-bold text-center p-2'>{t('free_shipping_banner')}</p>
      </div>
      {/* Placeholder div to prevent layout shift */}
      {isFixed && <div className='h-[72px] transition-all duration-500 ease-out opacity-100'></div>}
      <div className={`${isFixed ? 'fixed top-0 left-0 right-0 transform translate-y-0 scale-100 opacity-100' : 'transform translate-y-0 scale-100 opacity-100'} bg-white shadow-md z-50 flex justify-between xl:justify-around p-4 items-center transition-all duration-500 ease-out`}>
        <div className='flex md:hidden gap-3 items-center'>
          <GiHamburgerMenu
            className='cursor-pointer text-[25px]'
            onClick={toggleMenu}
          />
          <Link to="/" className='cursor-pointer text-[22px] transition-colors duration-200'>
            EIGHTBORN
          </Link>
        </div>
        {/* DESKTOP HEADER */}
        <div className='md:flex hidden items-center gap-4'>
          <Link to="/" className='cursor-pointer md:text-[22px] lg:text-[35px] lg:font-bold transition-colors duration-200'>
            EIGHTBORN
          </Link>
          <Link to="/" className='cursor-pointer text-[15px] transition-colors duration-200'>
            {t('home')}
          </Link>
          {/* Kategoriler Hover Dropdown */}
          <div
            className='relative flex items-center gap-1'
            onMouseEnter={() => setIsCategoriesDropdownOpen(true)}
            onMouseLeave={() => setIsCategoriesDropdownOpen(false)}
          >
            <span
              className='cursor-pointer text-[15px] flex items-center gap-1'
              onClick={() => navigate('/ust-giyim')}
            >
              {t('categories')}
              <IoIosArrowDown className={`transition-transform duration-300 ${isCategoriesDropdownOpen ? 'rotate-180' : ''}`} />
            </span>
            {/* Dropdown */}
            <div
              className={`absolute left-0 top-full mt-2 bg-white shadow-lg rounded-md min-w-[180px] overflow-hidden transition-all duration-300 ${isCategoriesDropdownOpen ? 'max-h-96 opacity-100 visible' : 'max-h-0 opacity-0 invisible'
                }`}
              style={{ zIndex: 9999 }}
            >
              <ul>
                {categories.map((cat, idx) => (
                  <li
                    key={idx}
                    className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
                    onClick={() => {
                      setIsCategoriesDropdownOpen(false)
                      navigate(`/ust-giyim/${cat.slug}`)
                    }}
                  >
                    {cat.label}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        {/* DESKTOP HEADER END */}
        <div className=' flex items-center gap-4'>
          <div className="relative cursor-pointer">
            <button
              className="flex cursor-pointer items-center gap-1 py-1 rounded hover:bg-gray-100 transition"
              onClick={() => setShowLangDropdown(prev => !prev)}
            >
              <span className="font-semibold">{getCurrentLanguageLabel()}</span>
              <IoIosArrowDown className="text-sm" />
            </button>
            {showLangDropdown && (
              <div className="absolute right-0 mt-2 bg-white shadow-lg rounded z-[9999] min-w-[60px]">
                <ul>
                  <li
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${i18n.language === 'az' ? 'bg-gray-100 font-bold' : ''}`}
                    onClick={() => changeLanguage('az')}
                  >AZ</li>
                  <li
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${i18n.language === 'en' ? 'bg-gray-100 font-bold' : ''}`}
                    onClick={() => changeLanguage('en')}
                  >EN</li>
                  <li
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${i18n.language === 'ru' ? 'bg-gray-100 font-bold' : ''}`}
                    onClick={() => changeLanguage('ru')}
                  >RU</li>
                  <li
                    className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${i18n.language === 'tr' ? 'bg-gray-100 font-bold' : ''}`}
                    onClick={() => changeLanguage('tr')}
                  >TR</li>
                </ul>
              </div>
            )}
          </div>
          <IoSearch className='cursor-pointer text-[25px]' onClick={() => setIsSearchOpen(true)} />
          {isLoggedIn ? (
            <IoLogOutOutline
              className='text-[25px] cursor-pointer'
              onClick={handleLogout}
              title={t('logout')}
            />
          ) : (
            <Link to={"/account/login"}>
              <IoPersonOutline className='text-[25px]' title={t('login')} />
            </Link>
          )}
          <div className='relative'>
            <RiShoppingBagLine
              className='cursor-pointer text-[25px]'
              onClick={() => navigate('/cart')}
            />
            {cartItemCount > 0 && (
              <span className='absolute -top-2 -right-2 bg-[#000] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold'>
                {cartItemCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Burger Menu Overlay */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-500 ease-in-out ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}>
        <div className={`absolute top-0 left-0 w-full h-full bg-white transform transition-transform duration-500 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
          {/* Header Section */}
          <div className='flex justify-between items-center p-4 border-b border-gray-200'>
            <div className='flex items-center gap-3'>
              <IoClose
                className='cursor-pointer text-[25px] text-gray-600'
                onClick={toggleMenu}
              />
              <Link onClick={toggleMenu} className='font-bold' to={"/account/login"}>{t('login')}</Link>
              <span className='text-gray-600'>|</span>
              <Link onClick={toggleMenu} className='font-bold' to={"/account/register"}>{t('register1')}</Link>
            </div>
            <div className='relative'>
              <RiShoppingBagLine
                className='cursor-pointer text-[25px]'
                onClick={() => {
                  setIsMenuOpen(false)
                  navigate('/cart')
                }}
              />
              {cartItemCount > 0 && (
                <span className='absolute -top-2 -right-2 bg-[#000] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold'>
                  {cartItemCount}
                </span>
              )}
            </div>
          </div>

          {/* Main Menu Items */}
          <div className='p-4'>
            <div className='space-y-6'>
              <div className='cursor-pointer'>
                <Link
                  to="/"
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsCategoriesOpen(false);
                  }}
                  className='text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors duration-200 cursor-pointer'
                >
                  {t('home')}
                </Link>
              </div>

              <div>
                <div
                  className='flex justify-between items-center cursor-pointer'
                  onClick={toggleCategories}
                >
                  <p className='text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors duration-200'>
                    {t('categories')}
                  </p>
                  <IoIosArrowForward
                    className={`text-gray-600 transition-transform duration-300 ${isCategoriesOpen ? 'rotate-90' : ''
                      }`}
                  />
                </div>

                {/* Categories Dropdown */}
                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isCategoriesOpen ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                  }`}>
                  <div className='pl-4 space-y-3'>
                    {categories.map((category, index) => (
                      <p
                        key={index}
                        className='text-gray-600 hover:text-gray-800 cursor-pointer transition-colors duration-200'
                        onClick={() => {
                          setIsMenuOpen(false)
                          setIsCategoriesOpen(false)
                          navigate(`/ust-giyim/${category.slug}`)
                        }}
                      >
                        {category.label}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      <div className={`fixed inset-0 bg-white z-[70] transition-opacity duration-500 ease-in-out ${isSearchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className='h-full flex flex-col'>
          {/* Header Section */}
          <div className='flex justify-between items-center p-6 border-b border-gray-200'>
            <Link
              to="/"
              onClick={handleSearchClose}
              className='text-2xl font-bold text-gray-800 hover:text-gray-600 transition-colors duration-200 cursor-pointer'
            >
              EIGHTBORN
            </Link>

            <div className='flex-1 max-w-2xl mx-8'>
              <div className='relative'>
                <div className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'>
                  <IoSearch className='text-xl' />
                </div>
                <input
                  type='text'
                  placeholder={t('search_input_placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent'
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setFilteredProducts([]);
                    }}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200'
                  >
                    <IoClose className='text-xl cursor-pointer' />
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={handleSearchClose}
              className='text-gray-600 cursor-pointer hover:text-gray-800 transition-colors duration-200'
            >
              <IoClose className='text-3xl' />
            </button>
          </div>

          {/* Search Results */}
          <div className='flex-1 overflow-y-auto bg-gray-50'>
            {searchQuery.trim() && (
              <div className='p-6'>
                <div className='mb-4'>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    "{searchQuery}" {t('search_results_count', { count: filteredProducts.length })}
                  </h3>
                </div>
              </div>
            )}
            {renderProductGrid()}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header