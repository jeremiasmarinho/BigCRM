import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { authAPI } from "../services";
import type {
  User,
  LoginFormData,
  RegisterData,
  AuthContextType,
} from "../types";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: { user: User; token: string } }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "UPDATE_USER"; payload: User };

const AuthContext = createContext<AuthContextType | null>(null);

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "UPDATE_USER":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr) as User;
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: { token, user },
        });
      } catch (error) {
        // Invalid JSON in localStorage, clear it
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: "SET_LOADING", payload: false });
      }
    } else {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const login = async (credentials: LoginFormData): Promise<any> => {
    try {
      const loginData: LoginFormData = {
        login: credentials.login, // Can be email or username
        password: credentials.password,
      };
      const response = await authAPI.login(loginData);
      const { token, user } = response; // response já é .data devido ao interceptor

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token, user },
      });

      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: RegisterData): Promise<any> => {
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response; // response já é .data devido ao interceptor

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      dispatch({
        type: "LOGIN_SUCCESS",
        payload: { token, user },
      });

      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
  };

  const updateUser = (userData: Partial<User>): void => {
    if (!state.user) return;

    const updatedUser = { ...state.user, ...userData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    dispatch({ type: "UPDATE_USER", payload: updatedUser });
  };

  const value: AuthContextType = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
