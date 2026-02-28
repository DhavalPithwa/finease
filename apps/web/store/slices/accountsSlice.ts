import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Account } from '@repo/types';

export interface AccountsState {
  items: Account[];
}

const initialState: AccountsState = {
  items: [],
};

export const accountsSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    addAccount: (state, action: PayloadAction<Account>) => {
      state.items.push(action.payload);
    },
    updateAccount: (state, action: PayloadAction<Account>) => {
      const index = state.items.findIndex(acc => acc.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeAccount: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(acc => acc.id !== action.payload);
    }
  },
});

export const { addAccount, updateAccount, removeAccount } = accountsSlice.actions;
export default accountsSlice.reducer;
