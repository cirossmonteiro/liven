import { createSlice } from '@reduxjs/toolkit';

import { RootState } from '../app/store';

export interface cartState {
  products: {
    id: number;
    quantity: number;
  }[];
}

const initialState: cartState = {
  products: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increment(state, action) {
      const product = state.products.find(product => product.id === action.payload);
      console.log(22, action);
      if (product) {
        product.quantity++;
      } else {
        state.products.push({
          id: action.payload,
          quantity: 1
        })
      }
    },
    decrement(state, action) {
      const product = state.products.find(product => product.id === action.payload);
      if (product) {
        product.quantity--;
        if (product.quantity === 0) {
          state.products = state.products.filter(p => p.id !== action.payload);
        }
      }
    },
  }
});

export const {
  increment,
  decrement
} = cartSlice.actions;

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectCartProducts = (state: RootState) => state.cart.products;

export default cartSlice.reducer;
