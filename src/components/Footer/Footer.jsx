import { useState } from 'react'
import { useTranslation } from 'react-i18next';
import { FiInstagram } from 'react-icons/fi'
import { Link } from 'react-router-dom'


function Footer() {
  const [openSections, setOpenSections] = useState({
    kategoriler: false,
    hesabim: false,
    kurumsal: false,
    musteriHizmetleri: false
  });
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

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const footerSections = [
    {
      id: 'kategoriler',
      title: 'Kategoriler',
      content: [
        'Gold Series',
        'Hoodie',
        'T-shirt',
        'Bere',
        'Çorap'
      ]
    },
    {
      id: 'hesabim',
      title: 'Hesabım',
      content: [
        'Giriş Yap',
        'Kayıt Ol',
        'Sipariş Takipi',
      ]
    },
    {
      id: 'kurumsal',
      title: 'Kurumsal',
      content: [
        'Hakkımızda',
        'İletişim',
        'S.S.S',
      ]
    },
    {
      id: 'musteriHizmetleri',
      title: 'Müşteri Hizmetleri',
      content: [
        'KVKK',
        'Bilgi Güvenliği Politikası',
        'Mesafeli Satış Sözleşmesi',
        'Ticari Elektronik İleti Onayı'
      ]
    }
  ];

  return (
    <footer className='mt-8'>
      <div className='bg-[#6d6b6b] min-h-[40vh] p-5'>
        {/* Logo Section */}
        <div className='mb-6 sm:flex sm: justify-around'>
          <img
            src="https://cdn.myikas.com/images/theme-images/68309e0c-1ecf-40c6-86b5-6c37bc493156/image_900.webp"
            alt="Eightborn Logo"
            className='w-11 h-auto'
          />
        </div>

        {/* Footer Sections */}
        <div className='sm:flex sm:text-[21px] sm:justify-center lg:justify-center xl:justify-center 2xl:justify-center sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl sm:mx-auto lg:mx-auto xl:mx-auto 2xl:mx-auto sm:gap-8 lg:gap-12 xl:gap-16 2xl:gap-20'>
          {footerSections.map((section) => (
            <div key={section.id} className='sm:px-4 lg:px-6 xl:px-8'>
              {/* Desktop: Always visible */}
              <div className='hidden pb-5 sm:block'>
                <div className='cursor-pointer flex justify-between px-3'>
                  <p className='text-[#fff] font-bold'>{section.title}</p>
                </div>
                <div className='px-3 p-3 space-y-2'>
                  {section.content.map((item, index) => (
                    <p key={index} className='text-[#fff] text-sm cursor-pointer'>
                      {item}
                    </p>
                  ))}
                </div>
              </div>

              {/* Mobile: Collapsible */}
              <div className='sm:hidden pb-3'>
                <div
                  className='cursor-pointer flex justify-between px-3'
                  onClick={() => toggleSection(section.id)}
                >
                  <p className='text-[#fff] font-bold'>{section.title}</p>
                  <span className='text-[#fff] text-[25px]'>+</span>
                </div>

                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSections[section.id] ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                  <div className='px-3'>
                    {section.content.map((item, index) => (
                      <p key={index} className='text-[#fff] text-sm cursor-pointer'>
                        {item}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='flex justify-between items-center sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl sm:mx-auto lg:mx-auto xl:mx-auto 2xl:mx-auto'>
          <Link
            to="https://www.instagram.com/eightborn/#"
            className='text-white hover:text-gray-300'
          >
            <FiInstagram className='w-8 h-8' />
          </Link>

          <div className='flex gap-3'>
            <img className='w-10 h-auto' src="https://cdn.myikas.com/sf/assets/ozy/images/Visa.svg" alt="Visa" />
            <img className='w-10 h-auto' src="https://cdn.myikas.com/sf/assets/ozy/images/Maestro.svg" alt="Maestro" />
            <img className='w-10 h-auto' src="https://cdn.myikas.com/sf/assets/ozy/images/Mastercard.svg" alt="Mastercard" />
            <img className='w-7 h-6' src="https://cdn.myikas.com/sf/assets/ozy/images/american_express.png" alt="American Express" />
          </div>
        </div>
      </div>

      <div className='bg-black py-6'>
        <p className='text-white text-sm text-center px-4 sm:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl sm:mx-auto lg:mx-auto xl:mx-auto 2xl:mx-auto'>
          ©{new Date().getFullYear()} Eightborn. <span>{t('footer_text')}</span>
        </p>
      </div>
    </footer>
  )
}

export default Footer