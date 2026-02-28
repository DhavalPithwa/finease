import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface CategoriesState {
  items: Category[];
}

const initialState: CategoriesState = {
  items: [
    { id: 'cat-1', name: 'Housing', color: 'bg-indigo-500' },
    { id: 'cat-2', name: 'Food & Dining', color: 'bg-orange-500' },
    { id: 'cat-3', name: 'Transport', color: 'bg-blue-500' },
    { id: 'cat-4', name: 'Shopping', color: 'bg-pink-500' },
    { id: 'cat-5', name: 'Salary', color: 'bg-emerald-500' },
    { id: 'cat-6', name: 'Investment', color: 'bg-purple-500' },
  ],
};

export const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    addCategory: (state, action: PayloadAction<Category>) => {
      state.items.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.items.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(c => c.id !== action.payload);
    }
  },
});

export const { addCategory, updateCategory, removeCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;
