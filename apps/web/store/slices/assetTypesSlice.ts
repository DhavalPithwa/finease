import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AssetType {
  id: string;
  name: string;
  color: string;
}

export interface AssetTypesState {
  items: AssetType[];
}

const initialState: AssetTypesState = {
  items: [
    { id: 'ast-[1]', name: 'Equity', color: 'bg-indigo-500' },
    { id: 'ast-[2]', name: 'Mutual Funds', color: 'bg-emerald-500' },
    { id: 'ast-[3]', name: 'Fixed Deposit', color: 'bg-orange-500' },
    { id: 'ast-[4]', name: 'Crypto', color: 'bg-purple-500' },
    { id: 'ast-[5]', name: 'Gold', color: 'bg-amber-500' },
  ],
};

export const assetTypesSlice = createSlice({
  name: 'assetTypes',
  initialState,
  reducers: {
    addAssetType: (state, action: PayloadAction<AssetType>) => {
      state.items.push(action.payload);
    },
    updateAssetType: (state, action: PayloadAction<AssetType>) => {
      const index = state.items.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    removeAssetType: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(a => a.id !== action.payload);
    }
  },
});

export const { addAssetType, updateAssetType, removeAssetType } = assetTypesSlice.actions;
export default assetTypesSlice.reducer;
