import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DashboardStats } from "@repo/types";

export interface StatsState {
  data: DashboardStats;
}

const initialState: StatsState = {
  data: {
    netWorth: 0,
    totalAssets: 0,
    totalLiabilities: 0,
    netWorthHistory: [],
    assetAllocation: [],
    goalPacing: [],
  },
};

export const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    updateStats: (state, action: PayloadAction<Partial<DashboardStats>>) => {
      state.data = { ...state.data, ...action.payload };
    },
  },
});

export const { updateStats } = statsSlice.actions;
export default statsSlice.reducer;
