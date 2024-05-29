import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from 'scenes/homePage';
import LoginPage from 'scenes/loginPage';
import ProfilePage from 'scenes/profilePage';

// React and Redux hooks
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

// MUI theme functions and settings
import { createTheme } from '@mui/material/styles';
import { themeSettings } from 'theme';

// MUI components for theming and CSS baseline
import { ThemeProvider, CssBaseline } from '@mui/material';

function App() {
  // Connects your component to the Redux store: get the current theme mode
  const mode = useSelector((state) => state.mode);
  // Optimizes performance by avoiding unnecessary recalculations of the theme
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  // Checks if a valid token exists in Redux state.
  const isAuth = Boolean(useSelector((state) => state.token));

  return (
    <div className='app'>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route
              path='/'
              element={<LoginPage />}
            />

            <Route
              path='/home'
              element={isAuth ? <HomePage /> : <Navigate to='/' />}
            />

            <Route
              path='/profile/:userId'
              element={isAuth ? <ProfilePage /> : <Navigate to='/' />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
