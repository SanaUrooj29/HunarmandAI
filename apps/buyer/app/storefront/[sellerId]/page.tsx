import { MOCK_SELLERS, MOCK_PRODUCTS } from '@/lib/mock/data'
import { StorefrontClient } from '@/features/storefront/StorefrontClient'

export default function StorefrontPage({ params }: { params: { sellerId: string } }) {
  const seller = MOCK_SELLERS.find(s => s.id === params.sellerId) || MOCK_SELLERS[0]
  const products = MOCK_PRODUCTS.filter(p =>
    p.seller.id === seller.id || p.seller.city === seller.city
  ).slice(0, 8)
  return <StorefrontClient seller={seller} allProducts={products} />
}
