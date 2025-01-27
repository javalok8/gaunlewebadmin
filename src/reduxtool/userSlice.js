import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: null,
  adminType: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserId(state, action) {
      state.userId = action.payload;
    },
    clearUserId(state) {
      state.userId = null;
    },
    setAdminType(state, action) {
      state.adminType = action.payload;
    },
    clearAdminType(state) {
      state.adminType = null;
    },
  },
});

export const { setUserId, clearUserId, setAdminType, clearAdminType } =
  userSlice.actions;
export default userSlice.reducer;
