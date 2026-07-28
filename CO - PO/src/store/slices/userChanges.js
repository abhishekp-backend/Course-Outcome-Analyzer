import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../reqURL";

/*
This slice will track all Subject and Course Outcome data changes by FIELDS and will update the changes to the database
*/

const initialState = {
  coPos: {
    cos: [],
    values: {},
  },

  assess: {},

  marks: {},

  classId: null,

  error: "",
};

export const updateMarks = createAsyncThunk(
  "userChanges/updateMarks",

  async (_, { rejectWithValue, getState }) => {
    try {
      const { userChanges } = getState();

      const response = await api.put(
        `/api/students/${userChanges.classId}`,
        {
          students: userChanges.marks,
        },
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update marks",
      );
    }
  },
);

export const updateCOPO = createAsyncThunk(
  "userChanges/updateCOPO",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { userChanges } = getState();
      const response = await api.post("/api/cos/updateCO", {
        cos: userChanges.coPos.cos,
        assess: userChanges.assess,
        classId: userChanges.classId,
        tws: userChanges?.tws,
        values: userChanges?.coPos?.values,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Something went wrong!",
      );
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
      state.classId = action.payload.classId[0];
    },

    updateCOValues(state, action) {
      const { classId, field, value } = action.payload;

      state.classId = classId;

      if (!state.coPos.values) {
        state.coPos.values = {};
      }

      if (field === "target") {
        state.coPos.values.target = value;
        return;
      }

      if (!state.coPos.values.levels) {
        state.coPos.values.levels = {};
      }

      state.coPos.values.levels[field] = value;
    },

    updateSAField(state, action) {
      const { updates, classId } = action.payload;
      state.classId = classId;
      state.assess[Object.keys(updates)[0]] = Object.values(updates)[0];
    },

    removeCoPos(state, action) {
      const docId = action.payload;
      state.coPos = state.coPos.filter((c) => c._id !== docId);
    },

    updateTWField(state, action) {
      const { updates, classId } = action.payload;
      // 🔥 attach classId for backend
      state.classId = classId;
      
      if (!state.assess) state.assess = {};
      if (!state.assess.tw) state.assess.tw = {};
      
      for (const key in updates) {
        if (key !== "tws") {
          state.assess.tw[key] = updates[key];
        } else {
          state.assess.tws = updates["tws"];
        }
      }
      console.log(state.assess.tw)
    },

    updateMarksField(state, action) {
      const { classId, docId, prn, field, value } = action.payload;

      state.classId = classId;

      if (!state.marks) {
        state.marks = {};
      }

      // Create student entry if it doesn't exist
      if (!state.marks[docId]) {
        state.marks[docId] = {
          prn,
          values: {},
        };
      }

      // Store only changed field
      state.marks[docId].values[field] = value;
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
        clearCos(state);
        state.classId = null;
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
  updateTWField,
  updateCOValues,
  updateMarksField,
} = userChanges.actions;
export default userChanges.reducer;
