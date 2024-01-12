import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  value: 0,
  currentCompany: "",
  variables : []
};

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    getCompany: (state,action) => {
      state.currentCompany = action.payload;
    },
    getAnnualQuarterly: (state,action) => {
      state.variables = state;
    },
    
  },
  
});

export const { increment, decrement,getCompany, getAnnualQuarterly} = counterSlice.actions;
export default (counterSlice.reducer);