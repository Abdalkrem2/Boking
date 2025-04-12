import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export interface Product {
  id: number;
  product_id: number;
  name: string;
  nameAr: string;
  price: number;
  discounted_price: number;
  description: string;
  descriptionAr: string;
  image: string;
  quantity: number;
  color: string;
  size: string;
}
export interface BasketState {
  items: Product[] | [];
  total: number;
}
const initialState: BasketState = {
  items: [],
  total: 0,
};
export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    //Actions
    addToBasket: (state, action) => {
      //when cart is empty
      if (state.items.length === 0) {
        state.items = [action.payload];
        if (action.payload.discounted_price == action.payload.price) {
          state.total = Number(state.total) + Number(action.payload.price);
        } else {
          state.total =
            Number(state.total) + Number(action.payload.discounted_price);
        }
        // Save to localStorage
        localStorage.setItem("cart", JSON.stringify(state.items));
        localStorage.setItem("cartTotal", state.total.toString());
        return;
      }

      //the cart is not empty -->> check if the cart has the product already
      for (let i = 0; i < state.items.length; i++) {
        if (
          state.items[i].product_id == action.payload.product_id &&
          state.items[i].size == action.payload.size &&
          state.items[i].color == action.payload.color
        ) {
          //the cart has the item already -->> increase the quantity by 1
          state.items[i].quantity = state.items[i].quantity + 1;
          if (action.payload.discounted_price == action.payload.price) {
            state.total = Number(state.total) + Number(action.payload.price);
          } else {
            state.total =
              Number(state.total) + Number(action.payload.discounted_price);
          }
          // Save to localStorage after quantity update
          localStorage.setItem("cart", JSON.stringify(state.items));
          localStorage.setItem("cartTotal", state.total.toString());
          return;
        }
      }

      //the cart doesn't have the product
      state.items = [...state.items, action.payload];
      if (action.payload.discounted_price == action.payload.price) {
        state.total = Number(state.total) + Number(action.payload.price);
      } else {
        state.total =
          Number(state.total) + Number(action.payload.discounted_price);
      }
      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify(state.items));
      localStorage.setItem("cartTotal", state.total.toString());
    },
    decreaseFromBasket: (state, action) => {
      const index = state.items.findIndex(
        (basketItem) => basketItem.id === action.payload.id
      );
      let newBasket = [...state.items];

      if (index >= 0) {
        if (state.items[index].quantity <= 1) {
          //decrease the total of cart
          if (action.payload.discounted_price == action.payload.price) {
            state.total = Number(state.total) - Number(action.payload.price);
          } else {
            state.total =
              Number(state.total) - Number(action.payload.discounted_price);
          }
          //remove the item
          newBasket.splice(index, 1);
        } else {
          //decrease the total of cart
          if (action.payload.discounted_price == action.payload.price) {
            state.total = Number(state.total) - Number(action.payload.price);
          } else {
            state.total =
              Number(state.total) - Number(action.payload.discounted_price);
          }
          //decrease the item quantity
          newBasket[index].quantity = newBasket[index].quantity - 1;
        }
        state.items = newBasket;
        // Save to localStorage after any quantity change
        localStorage.setItem("cart", JSON.stringify(state.items));
        localStorage.setItem("cartTotal", state.total.toString());
      } else {
        console.warn(
          `cant remove the item with id: ${action.payload.id}, because it's not found`
        );
      }
    },
    removeFromBasket: (state, action) => {
      const index = state.items.findIndex(
        (basketItem) => basketItem.id === action.payload.id
      );
      let newBasket = [...state.items];

      if (index >= 0) {
        //decrease the total of cart
        if (action.payload.discounted_price == action.payload.price) {
          state.total =
            Number(state.total) -
            Number(action.payload.price) * Number(action.payload.quantity);
        } else {
          state.total =
            Number(state.total) -
            Number(action.payload.discounted_price) *
              Number(action.payload.quantity);
        }
        //remove the item
        newBasket.splice(index, 1);
        state.items = newBasket;
        // Save to localStorage after removing item
        localStorage.setItem("cart", JSON.stringify(state.items));
        localStorage.setItem("cartTotal", state.total.toString());
      } else {
        console.warn(
          `cant remove the item with id: ${action.payload.id}, because it's not found`
        );
      }
    },
    initializeBasket(state, action) {
      state.items = action.payload.cart;
      state.total = action.payload.totalCart;
      // Initialize localStorage
      localStorage.setItem("cart", JSON.stringify(state.items));
      localStorage.setItem("cartTotal", state.total.toString());
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  addToBasket,
  removeFromBasket,
  decreaseFromBasket,
  initializeBasket,
} = basketSlice.actions;
// export const selectTotal = (state: RootState) => {
//   //@ts-ignore
//   if (Array.isArray(state.basket.items)) {
//     //@ts-ignore
//     state.basket.items.reduce(
//       (total: any, item: any) => total + item.price * item.quantity,
//       0
//     );
//   }
// };
export default basketSlice.reducer;
