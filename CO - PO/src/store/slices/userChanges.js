import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../reqURL";

/*
This slice will track all Subject and Course Outcome data changes by FIELDS and will update the changes to the database
*/

const initialState = {
  coPos: {
    cos: [],
  },
  assess: null,
  // {subjectId, arrayDocId, values}
};

export const updateCOPO = createAsyncThunk(
  "userChanges/updateCOPO",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { userChanges } = getState();
      const response = await api.post("/api/cos/updateCO", userChanges.coPos);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Something went wrong!");
    }
  },
);

const userChanges = createSlice({
  name: "userChanges",
  initialState,
  reducers: {
    // Partial update: provide docId (or index) and updated fields
    updateCoPosField(state, action) {
      state.coPos.classId = action.payload.classId;

      const updates = action.payload["cos._id"];

      for (const coId in updates) {
        let target = state.coPos.cos.find((co) => co._id === coId);

        if (target) {
          Object.assign(target, updates[coId]);
        } else {
          state.coPos.cos.push({
            _id: coId,
            ...updates[coId],
          });
        }
      }
      console.log(JSON.stringify(state.coPos))
    },
    updateSAField(state, action) {
      const { updates } = action.payload;
      state.assess[Object.keys(updates)[0]] = Object.values(updates)[0];
    },

    removeCoPos(state, action) {
      const docId = action.payload;
      state.coPos = state.coPos.filter((c) => c._id !== docId);
    },

    clearCos(state) {
      state.coPos = { cos: [] };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateCOPO.pending, (state) => {
        state.savingData = true;
      })
      .addCase(updateCOPO.fulfilled, (state) => {
        state.savingData = false;
      })
      .addCase(updateCOPO.rejected, (state) => {
        state.savingData = false;
      });
  },
});

export const {
  updateCoPosField,
  addCoPos,
  removeCoPos,
  clearCos,
  updateSAField,
} = userChanges.actions;
export default userChanges.reducer;
