import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
    id: number;
    email: string;
    nombre?: string;
    apellido?: string;
    matricula?: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
}

const initialState: AuthState = {
    user: null,
    token: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },
        setToken: (state, action: PayloadAction<string | null>) => {
            state.token = action.payload;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
        },
    },
});

export const { setUser, setToken, logout } = authSlice.actions;

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;