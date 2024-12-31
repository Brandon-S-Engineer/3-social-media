import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import UserWidget from './UserWidget';

// Mock Redux store
const mockStore = configureStore([]);

// Mock useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Define a custom theme that includes the neutral palette
const theme = createTheme({
  palette: {
    neutral: {
      dark: '#333',
      medium: '#666',
      main: '#999',
    },
    primary: {
      light: '#757ce8',
      main: '#3f50b5',
      dark: '#002884',
    },
  },
});

// Mock fetch globally
global.fetch = jest.fn();

const mockUserData = {
  firstName: 'John',
  lastName: 'Doe',
  location: 'New York',
  occupation: 'Software Engineer',
  viewedProfile: 150,
  impressions: 1200,
  friends: [{ id: 1 }, { id: 2 }],
};

describe('UserWidget Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      token: 'mock-token',
    });

    fetch.mockResolvedValue({
      json: jest.fn().mockResolvedValue(mockUserData),
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

    await screen.findByText(/John Doe/i);
    expect(fetch).toHaveBeenCalledWith('https://3-social-media.vercel.app/users/1', {
      method: 'GET',
      headers: { Authorization: 'Bearer mock-token' },
    });
  });

  it("navigates to the user's profile on click", async () => {
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

    const userName = await screen.findByTestId('user-name');
    fireEvent.click(userName);
    expect(mockNavigate).toHaveBeenCalledWith('/profile/1');
  });

  it('handles missing user data gracefully', async () => {
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(null),
    });

    const { container } = render(
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

    expect(container).toBeEmptyDOMElement();
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

    const userName = await screen.findByText(/John Doe/i);
    expect(userName).toBeInTheDocument();
    expect(screen.getByText(/New York/i)).toBeInTheDocument();
    expect(screen.getByText(/Software Engineer/i)).toBeInTheDocument();
    expect(screen.getByText(/150/i)).toBeInTheDocument();
    expect(screen.getByText(/1200/i)).toBeInTheDocument();
  });
});
