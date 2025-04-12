import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export interface apiData {
  id: number;
  db_link: string;
  name: string;
  nameAr: string;
}
const initialState: apiData = {
  id: 0,
  db_link: "",
  name: "",
  nameAr: "",
};
export const apiSlice = createSlice({
  name: "apiData",
  initialState,
  reducers: {
    //Actions
    initializeApi(state, action) {
      state.id = action.payload.id;
      state.db_link = action.payload.db_link;
      state.name = action.payload.name;
      state.nameAr = action.payload.nameAr;
    },
  },
});

export const { initializeApi } = apiSlice.actions;
export default apiSlice.reducer;
