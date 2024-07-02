import { db } from "../data/db"
import { CartItem, Guitar } from "../types"

// ? Para useReducer es necesario declarar Actions, State, un Estado Inicial
// ? Los Actions son algo como la declaracion de las Funciones y sus Parametros de nuestro Hook
export type CartActions = 
    { type: 'ADD_TO_CART', payload: {item: Guitar} } |
    { type: 'REMOVE_CART', payload: {itemId: Guitar['id']} } |
    { type: 'DECREASE_QUANTITY', payload: {itemId: Guitar['id']} } |
    { type: 'DECREASE_QUANTITY', payload: {itemId: Guitar['id']} } |
    { type: 'CLEAR_CART' }

// ? Los States vendrian siendo las variables que se usan como globalmente State en pocas palabras
// ? en este caso la base de datos y [Cart] nuestro State de Carrito
export type CartState = {
    data: Guitar[]
    cart: CartItem[]
}

// ? Estado inicial del State, en este caso como es que se llenaran las variables del State
export const initialState : CartState = {
    data: db,
    cart: []
}