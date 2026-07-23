export interface Product {
  id: string; title: string; price: number; originalPrice?: number
  seller: { id: string; name: string; city: string; verified: boolean; initials: string }
  rating: number; reviewCount: number; category: string
  isTopSeller?: boolean; inStock: boolean; listedAgo: string
  deliveryNote?: string; description?: string
  reviews?: Review[]
}
export interface Review {
  id: string; author: string; rating: number; date: string
  text: string; tags?: string[]; helpful?: number
}
export interface Seller {
  id: string; name: string; initials: string; city: string
  rating: number; reviewCount: number; bio: string
  products: number; sales: number; onTimeRate: number; categories: string[]
  joinedDate: string; verified: boolean
}
export interface Order {
  id: string; status: string; statusLabel: string; statusColor: string
  product: { title: string; seller: string; price: number }
  courierTrackingId?: string; estimatedDelivery?: string
  timeline?: { label: string; time: string; done: boolean; icon: string }[]
}
export interface CartItem {
  id: string; productId: string; title: string; price: number; quantity: number
  seller: { id: string; name: string; city: string; deliveryNote: string }
}

const GRADIENTS = [
  'linear-gradient(135deg,#E8D5C0 0%,#C8A882 100%)',
  'linear-gradient(135deg,#C8614A 0%,#E8896E 100%)',
  'linear-gradient(135deg,#2D7A7A 0%,#4A9A9A 100%)',
  'linear-gradient(135deg,#D9D0C4 0%,#FAF7F2 100%)',
  'linear-gradient(135deg,#4A9A9A 0%,#2D7A7A 100%)',
  'linear-gradient(135deg,#A84E3A 0%,#C8614A 100%)',
  'linear-gradient(135deg,#8C7D6B 0%,#C8A882 100%)',
  'linear-gradient(135deg,#2D7A7A 0%,#C8614A 100%)',
]
export const getGradient = (id: string) => GRADIENTS[parseInt(id, 36) % GRADIENTS.length] ?? GRADIENTS[0]

const SAMPLE_REVIEWS: Review[] = [
  { id:'r1', author:'Ayesha R.', rating:5, date:'Apr 24', text:'Stunning craftsmanship — bigger than expected and the colors are vibrant. The seller even included a handwritten note!', tags:['Great quality','Beautiful packaging'], helpful:12 },
  { id:'r2', author:'Mariam K.', rating:5, date:'Apr 18', text:'Absolutely beautiful. The embroidery detail is incredible. Will definitely order again.', tags:['As described','Fast delivery'], helpful:8 },
  { id:'r3', author:'Sarah B.', rating:4, date:'Apr 10', text:'Lovely piece. Delivery was a bit delayed but the product is worth the wait.', tags:['Great quality'], helpful:3 },
  { id:'r4', author:'Nadia Z.', rating:5, date:'Mar 28', text:'Exceeded my expectations. The quality of the thread and work is exceptional.', helpful:5 },
  { id:'r5', author:'Hira M.', rating:3, date:'Mar 15', text:'Nice product but description could have been more detailed about the size.', helpful:1 },
]

export const MOCK_PRODUCTS: Product[] = [
  { id:'1', title:'Hand-Embroidered Phulkari Dupatta — Cream', price:3200, seller:{id:'s1',name:"Fatima's Crafts",city:'Lahore',verified:true,initials:'FA'}, rating:4.8, reviewCount:47, category:'Embroidery', isTopSeller:true, inStock:true, listedAgo:'2d ago', deliveryNote:'Free pickup · Lahore', description:'Exquisite hand-embroidered phulkari dupatta in cream base with traditional floral motifs. Each piece is crafted over 5–7 days using authentic Punjab embroidery techniques passed down through generations. The intricate threadwork uses high-quality silk floss in vibrant colours.', reviews:SAMPLE_REVIEWS },
  { id:'2', title:'Beaded Clutch — Rust', price:1500, seller:{id:'s2',name:'Sumaira Crafts',city:'Lahore',verified:true,initials:'SU'}, rating:4.6, reviewCount:23, category:'Crafts', inStock:true, listedAgo:'5d ago', deliveryNote:'TCS delivery · 3–5 days', reviews:SAMPLE_REVIEWS.slice(0,3) },
  { id:'3', title:'Phulkari Cotton Stole', price:2100, seller:{id:'s3',name:'Saima Bibi',city:'Lahore',verified:true,initials:'SB'}, rating:5.0, reviewCount:23, category:'Embroidery', inStock:true, listedAgo:'1d ago', reviews:SAMPLE_REVIEWS.slice(0,4) },
  { id:'4', title:'Phulkari Shawl — Maroon', price:4800, originalPrice:5500, seller:{id:'s4',name:'Naheed K.',city:'Multan',verified:true,initials:'NK'}, rating:4.7, reviewCount:31, category:'Embroidery', inStock:true, listedAgo:'3d ago', deliveryNote:'TCS delivery', reviews:SAMPLE_REVIEWS },
  { id:'5', title:'Sindhi Ralli Quilt — King Size', price:8500, seller:{id:'s8',name:'Khadija Quilts',city:'Hyderabad',verified:true,initials:'KH'}, rating:4.9, reviewCount:62, category:'Crafts', inStock:true, listedAgo:'1w ago', reviews:SAMPLE_REVIEWS },
  { id:'6', title:'Kashida Cushion Cover Set (2pcs)', price:2800, seller:{id:'s6',name:'Amina Arts',city:'Karachi',verified:true,initials:'AA'}, rating:4.5, reviewCount:19, category:'Home', inStock:true, listedAgo:'4d ago', reviews:SAMPLE_REVIEWS.slice(1,4) },
  { id:'7', title:'Homemade Achaar Trio Pack', price:750, seller:{id:'s7',name:'Rukhsana Kitchen',city:'Rawalpindi',verified:true,initials:'RK'}, rating:4.8, reviewCount:84, category:'Food', inStock:true, listedAgo:'1d ago', reviews:SAMPLE_REVIEWS },
  { id:'8', title:'Mirror Work Blouse Fabric (3m)', price:3600, seller:{id:'s8',name:'Khadija Quilts',city:'Hyderabad',verified:true,initials:'KH'}, rating:5.0, reviewCount:41, category:'Embroidery', isTopSeller:true, inStock:true, listedAgo:'6h ago', reviews:SAMPLE_REVIEWS },
  { id:'9', title:'Handwoven Khaddar Kurta Fabric', price:2200, seller:{id:'s9',name:'Zarina Textile',city:'Faisalabad',verified:true,initials:'ZT'}, rating:4.6, reviewCount:28, category:'Textiles', inStock:true, listedAgo:'2d ago', reviews:SAMPLE_REVIEWS.slice(0,3) },
  { id:'10', title:'Lacquerware Bangle Set', price:1200, seller:{id:'s10',name:'Hina Crafts',city:'Hyderabad',verified:true,initials:'HC'}, rating:4.4, reviewCount:15, category:'Crafts', inStock:true, listedAgo:'1w ago', reviews:SAMPLE_REVIEWS.slice(0,2) },
  { id:'11', title:'Blue Pottery Chai Set (6 cups)', price:4500, originalPrice:5000, seller:{id:'s11',name:'Multan Mitti',city:'Multan',verified:true,initials:'MM'}, rating:4.9, reviewCount:37, category:'Home', isTopSeller:true, inStock:true, listedAgo:'3d ago', reviews:SAMPLE_REVIEWS },
  { id:'12', title:'Organic Dried Fruit Mix — 500g', price:950, seller:{id:'s7',name:'Rukhsana Kitchen',city:'Rawalpindi',verified:true,initials:'RK'}, rating:4.7, reviewCount:52, category:'Food', inStock:true, listedAgo:'2d ago', reviews:SAMPLE_REVIEWS.slice(0,4) },
]

export const MOCK_SELLERS: Seller[] = [
  { id:'s1', name:"Fatima's Crafts", initials:'FA', city:'Lahore', rating:4.8, reviewCount:47, bio:'Hand-embroidered Phulkari & block-print pieces. Each piece takes 5–7 days. Made with love in Lahore.', products:14, sales:108, onTimeRate:98, categories:['Embroidery','Crafts','New'], joinedDate:'Mar 2024', verified:true },
  { id:'s8', name:'Khadija Quilts', initials:'KH', city:'Hyderabad', rating:5.0, reviewCount:41, bio:'Traditional Sindhi ralli quilts and mirror work. Handcrafted in Hyderabad since 2019.', products:8, sales:67, onTimeRate:100, categories:['Embroidery','Crafts'], joinedDate:'Jan 2024', verified:true },
  { id:'s7', name:'Rukhsana Kitchen', initials:'RK', city:'Rawalpindi', rating:4.8, reviewCount:84, bio:'Authentic home-made pickles, chutneys, and dried fruits. All natural, no preservatives.', products:12, sales:143, onTimeRate:96, categories:['Food'], joinedDate:'Feb 2024', verified:true },
]

export const MOCK_ORDERS: Order[] = [
  { id:'OD-2841', status:'in_transit', statusLabel:'Arriving Tue', statusColor:'teal', product:{title:'Phulkari Dupatta',seller:"Fatima's Crafts",price:3200}, courierTrackingId:'TCS-PK-892341', estimatedDelivery:'Tue, 5 May', timeline:[{label:'Order placed',time:'Sun · 3:42 PM',done:true,icon:'check'},{label:'Pickup scheduled',time:'Mon · 10am–2pm window',done:true,icon:'calendar'},{label:'Picked up by courier',time:'Mon · 11:14 AM',done:true,icon:'package'},{label:'In transit',time:'Currently in Sahiwal hub',done:false,icon:'truck'},{label:'Delivered',time:'Est. Tue, 5 May',done:false,icon:'home'}] },
  { id:'OD-2839', status:'pickup_scheduled', statusLabel:'Pickup Tomorrow', statusColor:'amber', product:{title:'Mirror Cushion x2',seller:"Fatima's Crafts",price:3600}, estimatedDelivery:'Thu, 7 May', timeline:[{label:'Order placed',time:'Sat · 6:12 PM',done:true,icon:'check'},{label:'Pickup scheduled',time:'Tue · 10am–2pm window',done:false,icon:'calendar'},{label:'Picked up by courier',time:'',done:false,icon:'package'},{label:'In transit',time:'',done:false,icon:'truck'},{label:'Delivered',time:'',done:false,icon:'home'}] },
  { id:'OD-2818', status:'delivered', statusLabel:'Delivered Apr 24', statusColor:'green', product:{title:'Ralli Quilt',seller:'Khadija · Hyderabad',price:6800}, timeline:[] },
]

export const INITIAL_CART: CartItem[] = [
  { id:'ci1', productId:'1', title:'Phulkari Dupatta', price:3200, quantity:1, seller:{id:'s1',name:"Fatima's Crafts",city:'Lahore',deliveryNote:'Free pickup'} },
  { id:'ci2', productId:'mirror', title:'Mirror Cushion', price:1800, quantity:2, seller:{id:'s1',name:"Fatima's Crafts",city:'Lahore',deliveryNote:'Free pickup'} },
  { id:'ci3', productId:'4', title:'Phulkari Shawl — Maroon', price:4800, quantity:1, seller:{id:'s4',name:'Naheed K.',city:'Multan',deliveryNote:'Free pickup'} },
]

export const CATEGORIES = [
  {id:'all',label:'All',icon:'🌿'},
  {id:'embroidery',label:'Embroidery',icon:'🧵'},
  {id:'food',label:'Food',icon:'🫙'},
  {id:'crafts',label:'Crafts',icon:'🪡'},
  {id:'home',label:'Home',icon:'🏡'},
  {id:'textiles',label:'Textiles',icon:'🧶'},
]
