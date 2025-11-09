import { combineReducers, configureStore } from "@reduxjs/toolkit";
import clientApi from "../service/ClientService";


const rootReducer = combineReducers({
  [clientApi.reducerPath]:clientApi.reducer
});
const middleReducer = [
  clientApi.middleware
];
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({}).concat(...middleReducer),
});
