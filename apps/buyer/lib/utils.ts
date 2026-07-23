export const formatPKR = (n: number) => `PKR ${n.toLocaleString('en-PK')}`
export const cn = (...c: (string|undefined|null|false)[]) => c.filter(Boolean).join(' ')
export function starArray(r: number): ('full'|'half'|'empty')[] {
  return [1,2,3,4,5].map(i => r>=i?'full':r>=i-.5?'half':'empty')
}
export function groupBySeller<T extends {seller:{id:string;name:string;city:string;deliveryNote:string}}>(items:T[]) {
  const m = new Map<string,{sellerId:string;sellerName:string;city:string;deliveryNote:string;items:T[]}>()
  for(const item of items){
    const k=item.seller.id
    if(!m.has(k)) m.set(k,{sellerId:k,sellerName:item.seller.name,city:item.seller.city,deliveryNote:item.seller.deliveryNote,items:[]})
    m.get(k)!.items.push(item)
  }
  return Array.from(m.values())
}
export const clamp = (n:number,min:number,max:number) => Math.min(Math.max(n,min),max)
