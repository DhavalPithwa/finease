import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Transaction } from '@repo/types';

export interface TransactionsState {
  items: Transaction[];
}

const initialState: TransactionsState = {
  items: [],
};

export const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.items.unshift(action.payload); // Add new to front
    },
    updateTransaction: (state, action: PayloadAction<Transaction>) => {
      const index = state.items.findIndex(t => t.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteTransaction: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(t => t.id !== action.payload);
    }
  },
});

export const { addTransaction, updateTransaction, deleteTransaction } = transactionsSlice.actions;
export default transactionsSlice.reducer;
