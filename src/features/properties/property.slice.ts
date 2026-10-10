import { createSlice } from "@reduxjs/toolkit";
import { assignPropertyAgent, fetchAssignedProperties, fetchProperties, fetchProperty } from "./property.thunks";
import type { PropertyState } from "./property.types";
import { loggedOut } from "../auth/auth.slice";

const initialState: PropertyState = {
  items: [],
  assignedItems: [],
  selected: null,
  status: "idle",
  error: null,
};

const slice = createSlice({
  name: "properties",
  initialState,
  reducers: {
    clearSelectedProperty(s) {
      s.selected = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(loggedOut, (s) => { s.assignedItems = []; s.selected = null; s.status = "idle"; s.error = null; });
    b.addCase(fetchProperties.pending, (s) => {
      s.status = "loading";
      s.error = null;
    })
      .addCase(fetchProperties.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.items = a.payload;
      })
      .addCase(fetchProperties.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Could not load properties";
      });
    b.addCase(fetchProperty.pending, (s) => {
      s.status = "loading";
      s.error = null;
    })
      .addCase(fetchProperty.fulfilled, (s, a) => {
        s.status = "succeeded";
        s.selected = a.payload;
      })
      .addCase(fetchProperty.rejected, (s, a) => {
        s.status = "failed";
        s.error = a.payload ?? "Could not load property";
      });
    b.addCase(fetchAssignedProperties.pending, (s) => { s.status = "loading"; s.error = null; })
      .addCase(fetchAssignedProperties.fulfilled, (s, a) => { s.status = "succeeded"; s.assignedItems = a.payload; })
      .addCase(fetchAssignedProperties.rejected, (s, a) => { s.status = "failed"; s.error = a.payload ?? "Could not load assigned properties"; });
    b.addCase(assignPropertyAgent.fulfilled, (s, a) => {
      s.items = s.items.map((property) => property.id === a.payload.id ? a.payload : property);
      if (s.assignedItems.some((property) => property.id === a.payload.id)) {
        s.assignedItems = a.payload.agent_id
          ? s.assignedItems.map((property) => property.id === a.payload.id ? a.payload : property)
          : s.assignedItems.filter((property) => property.id !== a.payload.id);
      }
      if (s.selected?.id === a.payload.id) s.selected = a.payload;
    });
  },
});

export const { clearSelectedProperty } = slice.actions;
export default slice.reducer;
