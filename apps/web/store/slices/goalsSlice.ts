import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FinancialGoal } from '@repo/types';

export interface GoalsState {
  items: FinancialGoal[];
}

const initialState: GoalsState = {
  items: [],
};

export const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    addGoal: (state, action: PayloadAction<FinancialGoal>) => {
      state.items.push(action.payload);
    },
    updateGoal: (state, action: PayloadAction<FinancialGoal>) => {
      const index = state.items.findIndex(g => g.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    }
  },
});

export const { addGoal, updateGoal } = goalsSlice.actions;
export default goalsSlice.reducer;
