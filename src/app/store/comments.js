import { createAction, createSlice } from "@reduxjs/toolkit";
import commentService from "../../services/comment.service";

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        isLoading: true,
        error: null
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true;
        },
        commentsReceived: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentsRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        commentCreated: (state, action) => {
            state.entities.push(action.payload);
        },
        commentRemoved: (state, action) => {
            state.entities.filter(i => i._id !== action.payload);
        }
    }
});

const { reducer: commentsReducer, actions } = commentsSlice;
const {
    commentsRequestFailed,
    commentsReceived,
    commentsRequested,
    commentCreated,
    commentRemoved
} = actions;

const commentCreateRequested = createAction("comments/commentCreateRequested");
const commentRemovalRequested = createAction("comments/commentRemovalRequested");

export const createComment = (payload) => async (dispatch) => {
    dispatch(commentCreateRequested());
    try {
        const { content } = await commentService.createComment(payload);
        dispatch(commentCreated(content));
    } catch (e) {
        dispatch(commentsRequestFailed(e.message));
    }
};

export const removeComment = (payload) => async (dispatch) => {
    dispatch(commentRemovalRequested());
    try {
        const { content } = await commentService.removeComment(payload);
        if (content === null) {
            dispatch(commentRemoved(payload));
        }
    } catch (e) {
        dispatch(commentsRequestFailed(e.message));
    }
};

export const loadCommentsList = (userId) => async (dispatch) => {
    try {
        dispatch(commentsRequested());
        const { content } = await commentService.getComments(userId);
        dispatch(commentsReceived(content));
    } catch (e) {
        dispatch(commentsRequestFailed(e.message));
    }
};

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) => state.comments.isLoading;

export default commentsReducer;
