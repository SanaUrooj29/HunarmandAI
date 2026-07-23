'use client'
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import type { CartItem } from './mock/data'
import { MOCK_PRODUCTS, INITIAL_CART } from './mock/data'
import { getBuyerToken, getBuyerCart, addBuyerCartItem, updateBuyerCartItem, removeBuyerCartItem, clearBuyerCart } from './api'

type Action =
  | { type:'ADD'; productId:string }
  | { type:'REMOVE'; productId:string }
  | { type:'UPDATE'; productId:string; qty:number }
  | { type:'CLEAR' }

function reducer(items: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case 'ADD': {
      const ex = items.find((i) => i.productId === action.productId)
      if (ex) return items.map((i) => i.productId === action.productId ? { ...i, quantity: i.quantity + 1 } : i)
      const p = MOCK_PRODUCTS.find((p) => p.id === action.productId)
      if (!p) return items
      return [
        ...items,
        {
          id: `ci-${Date.now()}`,
          productId: action.productId,
          title: p.title,
          price: p.price,
          quantity: 1,
          seller: { ...p.seller, deliveryNote: p.deliveryNote || 'TCS delivery' },
        },
      ]
    }
    case 'REMOVE':
      return items.filter((i) => i.productId !== action.productId)
    case 'UPDATE':
      return action.qty <= 0 ? items.filter((i) => i.productId !== action.productId) : items.map((i) => i.productId === action.productId ? { ...i, quantity: action.qty } : i)
    case 'CLEAR':
      return []
    default:
      return items
  }
}

const Ctx = createContext<{items:CartItem[]; add:(id:string)=>Promise<void>; remove:(id:string)=>Promise<void>; update:(id:string,qty:number)=>Promise<void>; clear:()=>Promise<void>; totalItems:number; subtotal:number} | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(INITIAL_CART)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const currentToken = getBuyerToken()
    setToken(currentToken)
    if (currentToken) {
      getBuyerCart(currentToken)
        .then((cart) => setItems(cart.items))
        .catch((err) => console.warn('[CartProvider] failed to load cart:', err))
    }
  }, [])

  useEffect(() => {
    const handleTokenChange = () => {
      const currentToken = getBuyerToken()
      setToken(currentToken)
      if (currentToken) {
        getBuyerCart(currentToken)
          .then((cart) => setItems(cart.items))
          .catch((err) => console.warn('[CartProvider] failed to reload cart:', err))
      } else {
        setItems(INITIAL_CART)
      }
    }

    window.addEventListener('hunarmandai_buyer_token_change', handleTokenChange)
    return () => window.removeEventListener('hunarmandai_buyer_token_change', handleTokenChange)
  }, [])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const isBackendProductId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id)
  const hasBackendCart = token && items.some((item) => isBackendProductId(item.productId))

  const add = async (productId: string) => {
    if (!token || !isBackendProductId(productId)) {
      setItems((prev) => reducer(prev, { type: 'ADD', productId }))
      return
    }

    try {
      const cart = await addBuyerCartItem(productId, 1, token)
      setItems(cart.items)
    } catch (err) {
      console.warn('[CartProvider] failed to add item:', err)
      setItems((prev) => reducer(prev, { type: 'ADD', productId }))
    }
  }

  const remove = async (productId: string) => {
    if (!token || !isBackendProductId(productId)) {
      setItems((prev) => reducer(prev, { type: 'REMOVE', productId }))
      return
    }

    try {
      const cart = await removeBuyerCartItem(productId, token)
      setItems(cart.items)
    } catch (err) {
      console.warn('[CartProvider] failed to remove item:', err)
      setItems((prev) => reducer(prev, { type: 'REMOVE', productId }))
    }
  }

  const update = async (productId: string, qty: number) => {
    if (!token || !isBackendProductId(productId)) {
      setItems((prev) => reducer(prev, { type: 'UPDATE', productId, qty }))
      return
    }

    try {
      const cart = await updateBuyerCartItem(productId, qty, token)
      setItems(cart.items)
    } catch (err) {
      console.warn('[CartProvider] failed to update item quantity:', err)
    }
  }

  const clear = async () => {
    if (!hasBackendCart) {
      setItems([])
      return
    }

    try {
      const cart = await clearBuyerCart(token!)
      setItems(cart.items)
    } catch (err) {
      console.warn('[CartProvider] failed to clear cart:', err)
      setItems([])
    }
  }

  return (
    <Ctx.Provider value={{ items, add, remove, update, clear, totalItems, subtotal }}>
      {children}
    </Ctx.Provider>
  )
}

export const useCart = () => {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart outside CartProvider')
  return c
}
