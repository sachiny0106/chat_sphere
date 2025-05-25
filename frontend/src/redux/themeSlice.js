import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
  if (typeof window !== 'undefined' && window.localStorage) {
    const storedTheme = window.localStorage.getItem("daisyui-theme");
    if (storedTheme) {
      return storedTheme;
    }
    // Optional: Check system preference if no theme is stored
    // const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    // if (prefersDark) return 'dark';
  }
  return "light"; // Default theme
};

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    currentTheme: getInitialTheme(),
  },
  reducers: {
    setTheme: (state, action) => {
      const theme = action.payload;
      state.currentTheme = theme;
      if (typeof window !== 'undefined') {
        document.documentElement.setAttribute("data-theme", theme);
        window.localStorage.setItem("daisyui-theme", theme);
      }
    },
  },
});

export const { setTheme } = themeSlice.actions;
export default themeSlice.reducer;