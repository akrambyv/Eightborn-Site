import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { RiShoppingBagLine } from 'react-icons/ri'
import { useTranslation } from 'react-i18next'

function Card({ product }) {
	const [isHovered, setIsHovered] = useState(false)
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

	if (!product) return null

	const primaryImageUrl = Array.isArray(product.image_urls) && product.image_urls.length > 0
		? product.image_urls[0]
		: ''

	const formatPrice = (price, currency) => {
		switch (currency) {
			case 'TRY':
				return `₺ ${Number(price).toFixed(2)}`
			default:
				return `${Number(price).toFixed(2)} ${currency || ''}`
		}
	}

	const normalizeCategory = (category) => {
		if (!category) return ''
		return category.toLowerCase().replace(/_/g, '-').replace(/\s+/g, '-')
	}

	const handleProductClick = (e) => {
		if (e.target.closest('.add-to-cart-btn')) {
			return
		}

		const categorySlug = normalizeCategory(product.category || product.kategori)
		const productSlug = product.name.toLowerCase()
			.replace(/[^a-z0-9\s-]/g, '')
			.replace(/\s+/g, '-')
			.replace(/-+/g, '-')

		navigate(`/${categorySlug}/${productSlug}`)
	}

	// Səbətə əlavə etmək funksiyası
	const handleAddToCart = (e) => {
		e.stopPropagation()

		console.log('Məhsul səbətə əlavə edildi:', product)

		const existingCart = JSON.parse(localStorage.getItem('cart') || '[]')
		const existingItem = existingCart.find(item => item.id === product.id)

		if (existingItem) {
			existingItem.quantity += 1
		} else {
			existingCart.push({ ...product, quantity: 1 })
		}

		localStorage.setItem('cart', JSON.stringify(existingCart))

		window.dispatchEvent(new Event('cartUpdated'))
	}

	return (
		<div
			className='bg-white rounded-lg shadow-md overflow-hidden cursor-pointer relative group transition-all duration-300 hover:shadow-lg'
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={handleProductClick}
		>
			<div className="relative overflow-hidden">
				{primaryImageUrl && (
					<img
						src={primaryImageUrl}
						alt={product.name}
						className='w-full min-h-45 object-cover transition-transform duration-300 group-hover:scale-105'
					/>
				)}

				<div className={`absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center transition-all duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'
					}`}>
					<button
						onClick={handleAddToCart}
						className="add-to-cart-btn cursor-pointer bg-white text-black px-6 py-3 rounded-md font-semibold flex items-center gap-2 hover:bg-gray-100 transition-colors duration-200 transform hover:scale-105"
					>
						<RiShoppingBagLine className="text-lg" />
						{t('Card1')}
					</button>
				</div>
			</div>

			<div className='p-3'>
				<p className='font-medium text-sm mb-2 line-clamp-2'>{product.name}</p>
				<span className='font-bold text-green-600'>
					{formatPrice(product.price, product.currency)}
				</span>
			</div>
		</div>
	)
}

export default Card