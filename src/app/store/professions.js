import { createSlice } from "@reduxjs/toolkit";
import professionService from "../../services/profession.service";

const professionsSlice = createSlice({
    name: "professions",
    initialState: {
        entities: null,
        isLoading: true,
        error: null,
        lastFetch: null
    },
    reducers: {
        professionsRequested: (state) => {
            state.isLoading = true;
        },
        professionsReceived: (state, action) => {
            state.entities = action.payload;
            state.lastFetch = Date.now();
            state.isLoading = false;
        },
        professionsRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        }
    }
});

const { reducer: professionsReducer, actions } = professionsSlice;
const { professionsRequestFailed, professionsReceived, professionsRequested } = actions;

export const getProfessions = () => (state) => state.professions.entities;
export const getProfessionsLoadingStatus = () => (state) => state.professions.isLoading;
export const loadProfessionsList = () => async (dispatch) => {
    try {
        dispatch(professionsRequested());
        const { content } = await professionService.get();
        dispatch(professionsReceived(content));
    } catch (e) {
        dispatch(professionsRequestFailed(e.message));
    }
};
export const getProfessionById = (professionId) => (state) => {
    if (state.professions.entities) {
        return state.professions.entities.find(profession => profession._id === professionId);
    }
};

export default professionsReducer;
