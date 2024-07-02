import { db } from "../data/db"
import { CartItem, Guitar } from "../types"

// ? Para useReducer es necesario declarar Actions, State, un Estado Inicial y un Reducer
// ? Los Actions son algo como la declaracion de las Funciones y sus Parametros de nuestro Hook
export type CartActions = 
    { type: 'ADD_TO_CART', value: {item: Guitar} } |
    { type: 'REMOVE_CART', value: {itemId: Guitar['id']} } |
    { type: 'DECREASE_QUANTITY', value: {itemId: Guitar['id']} } |
    { type: 'INCREASE_QUANTITY', value: {itemId: Guitar['id']} } |
    { type: 'CLEAR_CART' }

// ? Los States vendrian siendo las variables que se usan como globalmente State en pocas palabras
// ? en este caso la base de datos y [Cart] nuestro State de Carrito
export type CartState = {
    data: Guitar[]
    cart: CartItem[]
}

const initialCart = () : CartItem[] => {
    const localStorageCart = localStorage.getItem('cart')
    return localStorageCart ? 
        JSON.parse(localStorageCart) :
        []
}

// ? Estado inicial del State, en este caso como es que se llenaran las variables del State
export const initialState : CartState = {
    data: db,
    cart: initialCart()
}

const maxItems = 5

// ? El Reducer es una funcion que se encarga de manejar los Actions y actualizar los States
// ? en pocas palabras dar funcionalidad
export const cartReducer = (
        state: CartState = initialState,
        action: CartActions
    ) => {
    switch (action.type) {
        case 'ADD_TO_CART':
            const itemExist = state.cart.find((guitar) => guitar.id === action.value.item.id)
            let updateCart: CartItem[] = []
            if (itemExist) {
                updateCart = state.cart.map(item => {
                    if (item.id === action.value.item.id && item.quantity < maxItems) {
                        return {...item, quantity: item.quantity + 1 }
                    } else {
                        return item
                    }
                })
            } else {
                const newItem : CartItem = {...action.value.item, quantity: 1}
                updateCart = [...state.cart, newItem] // Para no mutar
            }
            
            return {
                data: state.data,
                cart: updateCart
            }
        case 'REMOVE_CART':
            return {
                data: state.data,
                cart: state.cart.filter(item => item.id !== action.value.itemId)
            }
        case 'DECREASE_QUANTITY':
            const cartD = state.cart.map(item => {
                if (item.id === action.value.itemId && item.quantity > 1) {
                    return {
                        ...item,
                        quantity: item.quantity - 1
                    }
                }
                return item
            })
            return {
                data: state.data,
                cart: cartD
            }
        case 'INCREASE_QUANTITY':
            const cartI = state.cart.map(item => {
                if (item.id === action.value.itemId && item.quantity < maxItems) {
                    return {
                        ...item,
                        quantity: item.quantity + 1
                    }
                }
                return item
            })
            return {
                data: state.data,
                cart: cartI
            }
        case 'CLEAR_CART':
            return {
                data: state.data,
                cart: []
            }
        default:
            return state
    }
}