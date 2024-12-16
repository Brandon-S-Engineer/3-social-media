import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import UserWidget from './UserWidget';

// Mock Redux store
const mockStore = configureStore([]);

// Define a custom theme that includes the neutral palette
const theme = createTheme({
  palette: {
    neutral: {
      dark: '#333', // Mock dark color
      medium: '#666', // Mock medium color
      main: '#999', // Mock main color
    },
  },
});

// Mock fetch
global.fetch = jest.fn();

describe('UserWidget Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      token: 'mock-token',
    });

    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        firstName: 'John',
        lastName: 'Doe',
        location: 'New York',
        occupation: 'Software Engineer',
        viewedProfile: 150,
        impressions: 1200,
        friends: [{ id: 1 }, { id: 2 }],
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with given props', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <UserWidget
              userId='1'
              picturePath='path/to/picture.jpg'
            />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );

    expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/2 friends/i)).toBeInTheDocument();
  });

  it('fetches user data from the API', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <UserWidget
              userId='1'
              picturePath='path/to/picture.jpg'
            />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );

    await screen.findByText(/John Doe/i); // Ensure fetch is called before testing
    expect(fetch).toHaveBeenCalledWith('http://localhost:3001/users/1', {
      method: 'GET',
      headers: { Authorization: 'Bearer mock-token' },
    });
  });

  it("navigates to the user's profile on click", async () => {
    const mockNavigate = jest.fn();
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
    }));

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <UserWidget
              userId='1'
              picturePath='path/to/picture.jpg'
            />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );

    const userName = await screen.findByText(/John Doe/i);
    fireEvent.click(userName);
    expect(mockNavigate).toHaveBeenCalledWith('/profile/1');
  });

  it('handles missing user data gracefully', async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(null),
    });

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <UserWidget
              userId='1'
              picturePath='path/to/picture.jpg'
            />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );

    const userName = screen.queryByText(/John Doe/i);
    expect(userName).not.toBeInTheDocument();
  });

  it('renders dynamic user data correctly', async () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <BrowserRouter>
            <UserWidget
              userId='1'
              picturePath='path/to/picture.jpg'
            />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );

    expect(await screen.findByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/New York/i)).toBeInTheDocument();
    expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/150/i)).toBeInTheDocument();
    expect(screen.getByText(/1200/i)).toBeInTheDocument();
  });
});
