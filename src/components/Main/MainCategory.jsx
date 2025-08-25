import { useMemo, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { FiFilter } from 'react-icons/fi'
import { IoClose } from 'react-icons/io5'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import Card from './Card'
import { useTranslation } from 'react-i18next'

const subcategories = [
  { label: 'Bere', countKey: 'bere', slug: 'bere' },
  { label: 'Gold Series', countKey: 'gold-series', slug: 'gold-series' },
  { label: 'Hoodie', countKey: 'hoodie', slug: 'hoodie' },
  { label: 'Saç Bandı', countKey: 'sac-bandi', slug: 'sac-bandi' },
  { label: 'Çorap', countKey: 'corap', slug: 'corap' }
]

function MainCategory({ products }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSubcategoriesOpen, setIsSubcategoriesOpen] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const PRODUCTS_PER_PAGE = 16

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


  const navigate = useNavigate()
  const params = useParams()
  const selectedCategorySlug = params.category 

  // Bütün məhsulları düz siyahıya çeviririk
  const allProducts = useMemo(() => {
    if (!products) return []
    return Object.values(products).flat()
  }, [products])

  // Kateqoriyalara görə sayları hesablamaq üçün
  const categoryCounts = useMemo(() => {
    const counts = {}
    allProducts.forEach(p => {
      const cat = (p.category || p.kategori || p.type || '').toLowerCase()
      counts[cat] = (counts[cat] || 0) + 1
    })
    return counts
  }, [allProducts])

  // URL-dəki slug-a uyğun label tapırıq
  const selectedCategory = useMemo(() => {
    if (!selectedCategorySlug) return null
    const found = subcategories.find(
      s => s.slug === selectedCategorySlug.toLowerCase()
    )
    return found ? found.countKey : null
  }, [selectedCategorySlug])

  const filteredProducts = useMemo(() => {
    let arr = allProducts
    if (selectedCategory) {
      arr = arr.filter(
        p =>
          (p.category || p.kategori || p.type || '').toLowerCase() === selectedCategory
      )
    }
    if (search.trim()) {
      arr = arr.filter(p =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      )
    }
    return arr
  }, [allProducts, selectedCategory, search])

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [selectedCategory, search])

  const handleCategoryClick = (item) => {
    if (selectedCategory === item.label) {
      navigate('/ust-giyim')
    } else {
      navigate(`/ust-giyim/${item.slug}`)
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-2">
      <div className="m-3 flex flex-col lg:flex-row gap-6">
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-md shadow p-4">
            <button
              className="w-full flex items-center justify-between text-left"
              onClick={() => setIsSubcategoriesOpen(prev => !prev)}
            >
              <span className="cursor-pointer font-medium text-lg">{t('MC_altk')}</span>
              <span className={`transition-transform duration-300 ${isSubcategoriesOpen ? 'rotate-0' : 'rotate-180'}`}>
                {isSubcategoriesOpen ? (
                  <IoIosArrowUp className="cursor-pointer text-xl" />
                ) : (
                  <IoIosArrowDown className="cursor-pointer text-xl" />
                )}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ${isSubcategoriesOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                }`}
            >
              <ul className="space-y-3">
                {subcategories.map((item, idx) => (
                  <li
                    key={idx}
                    className={`flex items-center justify-between cursor-pointer px-2 py-1 rounded-md ${selectedCategory === item.label ? 'bg-black text-white' : 'hover:bg-gray-100'
                      }`}
                    onClick={() => handleCategoryClick(item)}
                  >
                    <span>{item.label}</span>
                    <span className="text-gray-500">
                      ({categoryCounts[item.countKey] || 0})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-5">
              <p className="text-[25px]">{t('MC_rn1')}</p>
              <span className="text-[#c1c1c1]">{filteredProducts.length} {t('MC_rn2')}</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                className="border w-full md:w-60 p-2 border-[#f4f4f4]"
                type="search"
                placeholder={t('search_input_placeholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div
                className="flex items-center cursor-pointer rounded-md p-3 bg-[#f4f4f4] gap-1 lg:hidden"
                onClick={() => setIsFilterOpen(true)}
              >
                <FiFilter />
                <p>Filtrele</p>
              </div>
            </div>
          </div>

          {/* Məhsullar grid */}
          <div className="p-1">
            {paginatedProducts.length === 0 ? (
              <p className="text-gray-500">{t('MCyk')}</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {paginatedProducts.map(product => (
                  <Card key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8 select-none">
              <button
                className="p-2 rounded-full cursor-pointer hover:bg-gray-200 disabled:opacity-50"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                aria-label="Əvvəlki"
              >
                <svg width="24" height="24" fill="none"><path d="M15 18l-6-6 6-6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  className={`w-8 h-8 cursor-pointer rounded-full flex items-center justify-center font-semibold ${currentPage === idx + 1
                    ? 'bg-black text-white'
                    : 'hover:bg-gray-200'
                    }`}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="p-2 rounded-full cursor-pointer hover:bg-gray-200 disabled:opacity-50"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                aria-label="Sonrakı"
              >
                <svg width="24" height="24" fill="none"><path d="M9 6l6 6-6 6" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobil filter paneli */}
      <div className={`fixed inset-0 z-[60] ${isFilterOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${isFilterOpen ? 'opacity-50' : 'opacity-0'}`}
          onClick={() => setIsFilterOpen(false)}
        ></div>
        <aside
          className={`absolute right-0 top-0 h-full bg-white w-[340px] max-w-full shadow-xl transform transition-transform duration-300 ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
        >
          <div className="flex items-center justify-between p-4">
            <h3 className="text-lg font-semibold">Filtrele</h3>
            <button aria-label="Kapat" onClick={() => setIsFilterOpen(false)}>
              <IoClose className="cursor-pointer text-2xl" />
            </button>
          </div>
          <hr />
          <div className="p-4 flex-1 overflow-auto">
            <button
              className="w-full flex items-center justify-between text-left"
              onClick={() => setIsSubcategoriesOpen(prev => !prev)}
            >
              <span className="cursor-pointer font-medium">Alt Kategoriler</span>
              <span className={`transition-transform duration-300 ${isSubcategoriesOpen ? 'rotate-0' : 'rotate-180'}`}>
                {isSubcategoriesOpen ? (
                  <IoIosArrowUp className="text-xl" />
                ) : (
                  <IoIosArrowDown className="text-xl" />
                )}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-500 ${isSubcategoriesOpen ? 'max-h-96 opacity-100 mt-3' : 'max-h-0 opacity-0'
                }`}
            >
              <ul className="space-y-3">
                {subcategories.map((item, idx) => (
                  <li
                    key={idx}
                    className={`flex items-center justify-between cursor-pointer px-2 py-1 rounded-md ${selectedCategory === item.label ? 'bg-black text-white' : 'hover:bg-gray-100'
                      }`}
                    onClick={() => handleCategoryClick(item)}
                  >
                    <span>{item.label}</span>
                    <span className="text-gray-500">
                      ({categoryCounts[item.countKey] || 0})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t">
            <button
              className="w-full hover:bg-[#242222] cursor-pointer text-[20px] bg-black text-white py-4 font-semibold"
              onClick={() => setIsFilterOpen(false)}
            >
              {filteredProducts.length} ürünü gör
            </button>
          </div>
        </aside>
      </div>
    </main>
  )
}

export default MainCategory