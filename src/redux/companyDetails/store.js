import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './companySlicer';


 
const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export default store