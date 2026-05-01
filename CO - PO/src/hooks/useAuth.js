import { useSelector, useDispatch } from 'react-redux';
import { 
  loginUser,  
  logoutUser, 
  checkAuthStatus,
  clearError 
} from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error, isAuthenticating } = useSelector(
    (state) => state.auth
  );

  const login = (credentials) => {
    return dispatch(loginUser(credentials));
  };

  const logout = () => {
    return dispatch(logoutUser());
  };

  const checkAuth = () => {
    if (!isAuthenticated && !isAuthenticating) {
      return dispatch(checkAuthStatus());
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
    isAuthenticating
  };
}; 