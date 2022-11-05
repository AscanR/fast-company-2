import { createAction, createSlice } from "@reduxjs/toolkit";
import userService from "../../services/user.service";
import authService from "../../services/auth.service";
import localStorageService from "../../services/localStorage.service";
import { randomInt } from "../utils/randomInt";
import history from "../utils/history";

const initialState = localStorageService.getAccessToken()
      ? {
          entities: null,
          isLoading: true,
          error: null,
          auth: { userId: localStorageService.getUserId() },
          isLoggedIn: true,
          dataLoaded: false
      }
      : {
          entities: null,
          isLoading: false,
          error: null,
          auth: null,
          isLoggedIn: false,
          dataLoaded: false
      }
;

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        usersRequested: (state) => {
            state.isLoading = true;
        },
        usersReceived: (state, action) => {
            state.entities = action.payload;
            state.dataLoaded = true;
            state.isLoading = false;
        },
        usersRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        authRequestSuccess: (state, action) => {
            state.auth = action.payload;
            state.isLoggedIn = true;
        },
        authRequestFailed: (state, action) => {
            state.error = action.payload;
        },
        userCreated: (state, action) => {
            if (!Array.isArray(state.entities)) {
                state.entities = [];
            }
            state.entities.push(action.payload);
        },
        userLoggedOut: (state) => {
            state.entities = null;
            state.isLoggedIn = false;
            state.auth = null;
            state.dataLoaded = false;
        },
        userUpdated: (state, action) => {
            state.entities[
                  state.entities.findIndex((user) => user._id === action.payload._id)
                  ] = action.payload;
        },
        userUpdatedFailed: (state, action) => {
            state.error = action.payload;
        }
    }
});

const { reducer: usersReducer, actions } = usersSlice;
const {
    usersReceived,
    usersRequested,
    usersRequestFailed,
    authRequestSuccess,
    authRequestFailed,
    userCreated,
    userLoggedOut,
    userUpdated,
    userUpdatedFailed
} = actions;

const authRequested = createAction("users/authRequested");
const userCreateRequested = createAction("users/userCreateRequested");
const createUserFailed = createAction("user/createUserFailed");
const userUpdateRequested = createAction("users/userUpdateRequested");

export const login = ({ payload, redirect }) => async (dispatch) => {
    const { email, password } = payload;
    dispatch(authRequested());
    try {
        const data = await authService.login({ email, password });
        dispatch(authRequestSuccess({ userId: data.localId }));
        localStorageService.setTokens(data);
        history.push(redirect);
    } catch (e) {
        dispatch(authRequestFailed(e.message));
    }
};

export const signUp = ({ email, password, ...rest }) => async (dispatch) => {
    dispatch(authRequested());
    try {
        const data = await authService.register({ email, password });
        localStorageService.setTokens(data);
        dispatch(authRequestSuccess({ userId: data.localId }));
        dispatch(createUser({
            _id: data.localId,
            email,
            rate: randomInt(1, 5),
            completedMeetings: randomInt(0, 200),
            image: `https://avatars.dicebear.com/api/avataaars/${(
                  Math.random() + 1
            )
                  .toString(36)
                  .substring(7)}.svg`,
            ...rest
        }));
    } catch (e) {
        dispatch(authRequestFailed(e.message));
    }
};

export const logOut = () => dispatch => {
    localStorageService.removeAuthData();
    dispatch(userLoggedOut());
    history.push("/");
};

function createUser(payload) {
    return async function (dispatch) {
        dispatch(userCreateRequested());
        try {
            const { content } = await userService.create(payload);
            dispatch(userCreated(content));
            history.push("/users");
        } catch (e) {
            dispatch(createUserFailed(e.message));
        }
    };
};

export const updateUser = (payload) => async (dispatch) => {
    dispatch(userUpdateRequested());
    try {
        const { content } = await userService.updateUser(payload);
        dispatch(userUpdated(content));
        history.push(`/users/${payload._id}`);
    } catch (e) {
        dispatch(userUpdatedFailed(e.message));
    }
};

export const loadUsersList = () => async (dispatch) => {
    try {
        dispatch(usersRequested());
        const { content } = await userService.get();
        dispatch(usersReceived(content));
    } catch (e) {
        dispatch(usersRequestFailed(e.message));
    }
};

export const getUsersList = () => state => state.users.entities;

export const getUserById = (userId) => state => {
    if (state.users.entities) {
        return state.users.entities.find(
              user => user._id === userId
        );
    }
};

export const getCurrentUserData = () => state => {
    return state.users.entities
          ? state.users.entities.find(user => user._id === state.users.auth.userId)
          : null;
};

export const getIsLoggedIn = () => state => state.users.isLoggedIn;

export const getDataLoadingStatus = () => state => state.users.dataLoaded;

export const getCurrentUserId = () => state => state.users.auth.userId;

export const getUsersLoadingStatus = () => state => state.users.isLoading;

export default usersReducer;
