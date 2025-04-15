import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductType {
  id: string;
  name: string;
  storage: string;
  color: string;
  installment: number;
  price: number;
  img: string;
}

interface ProductState {
  products: ProductType[];
  editingProduct: ProductType | null;
}

const initialState: ProductState = {
  products: [],
  editingProduct: null,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<ProductType[]>) => {
      state.products = action.payload;
    },
    addProduct: (state, action: PayloadAction<ProductType>) => {
      state.products.push(action.payload);
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        (product) => product.id !== action.payload
      );
    },
    startEditing: (state, action: PayloadAction<string>) => {
      const product = state.products.find((p) => p.id === action.payload);
      if (product) {
        state.editingProduct = product;
      }
    },
    cancelEditing: (state) => {
      state.editingProduct = null;
    },
    updateProduct: (state, action: PayloadAction<ProductType>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
      state.editingProduct = null;
    },
  },
});

export const {
  setProducts,
  addProduct,
  deleteProduct,
  startEditing,
  cancelEditing,
  updateProduct,
} = productSlice.actions;

export default productSlice.reducer;
