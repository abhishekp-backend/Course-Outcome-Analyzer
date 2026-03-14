// Simple logger for Redux state changes (development only)
export const logStateChange = (action, state) => {
  if (process.env.NODE_ENV === 'development') {
    console.group('Redux State Change');
    console.groupEnd();
  }
};

// Log authentication state changes
export const logAuthState = (isAuthenticated, user) => {
  if (process.env.NODE_ENV === 'development') {
    console.log("Logged in user!");
  }
}; 