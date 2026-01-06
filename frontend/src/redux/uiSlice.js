import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  density: "cozy", // cozy | compact
  soundOn: true,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setDensity: (state, action) => {
      state.density = action.payload;
    },
    setSoundOn: (state, action) => {
      state.soundOn = action.payload;
    },
  },
});

export const { setDensity, setSoundOn } = uiSlice.actions;
export default uiSlice.reducer;
