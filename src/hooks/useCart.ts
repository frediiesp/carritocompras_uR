import { useState, useEffect, useMemo } from "react"
import { db } from "../data/db"
import type { Guitar, CartItem } from "../types"

export const useCart = () => {

    const maxItems = 5

    const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('cart')
        return localStorageCart ? 
            JSON.parse(localStorageCart) :
            []
    }
    // State
    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    // Functions
    function addToCart(item: Guitar) {
        const itemExist = cart.findIndex((guitar) => guitar.id === item.id)
        if (itemExist >= 0) {
            if (cart[itemExist].quantity >= maxItems) return
            // Codigo para no mutar el Array
            const updateCart = [...cart]
            updateCart[itemExist].quantity++
            setCart(updateCart)
        } else {
            const newItem : CartItem = {...item, quantity: 1}
            setCart([...cart, newItem]) // Para no mutar
        }
    }

    function removeFromCart(itemId: Guitar['id']) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== itemId))
    }

    function decreaseQuantity(itemId: Guitar['id']) {
        const updateCart = cart.map(item => {
            if (item.id === itemId && item.quantity > 1) {
                return {
                   ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updateCart)
    }

    function increaseQuantity(itemId: Guitar['id']) {
        const updateCart = cart.map(item => {
            if (item.id === itemId && item.quantity < maxItems) {
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item
        })
        setCart(updateCart)
    }

    function clearCart() {
        setCart([])
    }

    // State Derivado // useMemo para Performance
    const isEmpty = useMemo( () => cart.length === 0, [cart] )
    const cartTotal = useMemo( () => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart] )

    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isEmpty,
        cartTotal
    }
}