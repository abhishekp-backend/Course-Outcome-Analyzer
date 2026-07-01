import { useSelector, useDispatch } from "react-redux";
import {
  loginUser,
  logoutUser,
  checkAuthStatus,
  clearError,
} from "../store/slices/authSlice";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token, isAuthenticated, loading, error, isAuthenticating } =
    useSelector((state) => state.auth);

  const login = (credentials) => {
    return dispatch(loginUser(credentials));
  };

  const logout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const checkAuth = async () => {
    if (isAuthenticated) return true;
    if (isAuthenticating) return false;

    try {
      await dispatch(checkAuthStatus()).unwrap();
      return true;
    } catch {
      return false;
    }
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    checkAuth,
    clearAuthError,
    isAuthenticating,
  };
};
