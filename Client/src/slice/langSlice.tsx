import { createSlice } from "@reduxjs/toolkit";
export interface LanguageState {
  value: number;
}

let initialState: LanguageState;

if (typeof window !== "undefined") {
  const localStorageLang = localStorage.getItem("nepShopLang");
  initialState = {
    value: localStorageLang !== null ? Number(localStorageLang) : 1,
  };
} else {
  initialState = {
    value: 1,
  };
}
export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    changeToArabic: (state) => {
      localStorage.setItem("nepShopLang", "1");
      state.value = 1;
    },
    changeToEnglish: (state) => {
      localStorage.setItem("nepShopLang", "0");
      state.value = 0;
    },
  },
});

// Action creators are generated for each case reducer function
export const { changeToArabic, changeToEnglish } = languageSlice.actions;

export default languageSlice.reducer;
