// *** 1) Top-level mock of react-router-dom ***
jest.mock('react-router-dom', () => {
  const originalModule = jest.requireActual('react-router-dom');
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Friend from './Friend';
import { useNavigate } from 'react-router-dom';

// Mocking child components
jest.mock('./UserImage', () => {
  const MockUserImage = ({ image, size }) => (
    <div data-testid='user-image'>
      Mocked Image - {image}, Size: {size}
    </div>
  );
  return MockUserImage;
});

jest.mock('./FlexBetween', () => ({ children }) => <div data-testid='flex-between'>{children}</div>);

describe('Friend Component', () => {
  const mockStore = configureStore();
  let store;
  let mockNavigate;

  // Mock theme
  const mockTheme = createTheme({
    palette: {
      primary: {
        light: '#f0f0f0',
        dark: '#303030',
        main: '#606060',
      },
      neutral: {
        main: '#909090',
        medium: '#b0b0b0',
      },
    },
  });

  beforeEach(() => {
    store = mockStore({
      user: {
        _id: '123',
        friends: [{ _id: 'friend123' }],
      },
      token: 'mockToken',
    });

    // *** 3) Reset and attach the mockNavigate to useNavigate ***
    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    jest.clearAllMocks();

    // mockNavigate = jest.fn();
    // jest.mock('react-router-dom', () => ({
    //   ...jest.requireActual('react-router-dom'),
    //   useNavigate: () => mockNavigate,
    // }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  //! /////////////////////////////////////////////////////////////////////////

  it('should navigate to the friend’s profile and refresh', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={mockTheme}>
            <Friend
              friendId='friend123'
              name='John Doe'
              subtitle='Best Friend'
              userPicturePath='path/to/image.jpg'
            />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    // *** 4) Click "John Doe" to trigger navigate calls ***
    const nameElement = screen.getByText('John Doe');
    fireEvent.click(nameElement);

    // *** 5) The component calls navigate() TWICE: '/profile/friend123' and 0 ***
    expect(mockNavigate).toHaveBeenCalledTimes(2);

    // The FIRST call should be "/profile/friend123"
    expect(mockNavigate.mock.calls[0][0]).toBe('/profile/friend123');

    // The SECOND call is "navigate(0)" - force re-render
    expect(mockNavigate.mock.calls[1][0]).toBe(0);
  });

  // it('should navigate to the friend’s profile and simulate re-render', () => {
  //   render(
  //     <Provider store={store}>
  //       <BrowserRouter>
  //         <ThemeProvider theme={mockTheme}>
  //           =
  //           <Friend
  //             friendId='friend123'
  //             name='John Doe'
  //             subtitle='Best Friend'
  //             userPicturePath='path/to/image.jpg'
  //           />
  //         </ThemeProvider>
  //       </BrowserRouter>
  //     </Provider>
  //   );

  //   const nameElement = screen.getByText('John Doe');
  //   fireEvent.click(nameElement);

  //   expect(mockNavigate).toHaveBeenCalledWith('/profile/friend123');
  //   expect(mockNavigate).toHaveBeenCalledTimes(1);
  // });

  it('should change text color on hover', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={mockTheme}>
            <Friend
              friendId='friend123'
              name='John Doe'
              subtitle='Best Friend'
              userPicturePath='path/to/image.jpg'
            />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    const nameElement = screen.getByText('John Doe');
    fireEvent.mouseOver(nameElement);

    expect(nameElement).toHaveStyle('color: #f0f0f0');
  });

  it('should render PersonRemoveOutlined if the user is a friend', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={mockTheme}>
            <Friend
              friendId='friend123'
              name='John Doe'
              subtitle='Best Friend'
              userPicturePath='path/to/image.jpg'
            />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    const removeIcon = screen.getByTestId('PersonRemoveOutlinedIcon'); // Specific to MUI icons
    expect(removeIcon).toBeInTheDocument();
  });

  it('should render PersonAddOutlined if the user is not a friend', () => {
    store = mockStore({
      user: {
        _id: '123',
        friends: [],
      },
      token: 'mockToken',
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={mockTheme}>
            <Friend
              friendId='friend456'
              name='Jane Doe'
              subtitle='Colleague'
              userPicturePath='path/to/another-image.jpg'
            />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    const addIcon = screen.getByTestId('PersonAddOutlinedIcon'); // Specific to MUI icons
    expect(addIcon).toBeInTheDocument();
  });

  it('should call patchFriend and handle success', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([{ _id: 'friend123', name: 'Updated Friend List' }]),
      })
    );

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={mockTheme}>
            <Friend
              friendId='friend123'
              name='John Doe'
              subtitle='Best Friend'
              userPicturePath='path/to/image.jpg'
            />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/users/123/friend123',
        expect.objectContaining({
          method: 'PATCH',
          headers: {
            Authorization: 'Bearer mockToken',
            'Content-Type': 'application/json',
          },
        })
      );
    });
  });

  it('should handle patchFriend failure gracefully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.reject(new Error('Failed to update')),
      })
    );

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={mockTheme}>
            <Friend
              friendId='friend123'
              name='John Doe'
              subtitle='Best Friend'
              userPicturePath='path/to/image.jpg'
            />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    // Separate `waitFor` for fetch
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });

    // Separate `waitFor` for console.error
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Error updating friend relationship:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  it('should handle an empty friends list', () => {
    store = mockStore({
      user: {
        _id: '123',
        friends: [],
      },
      token: 'mockToken',
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={mockTheme}>
            <Friend
              friendId='friend123'
              name='John Doe'
              subtitle='Best Friend'
              userPicturePath='path/to/image.jpg'
            />
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    );

    const addIcon = screen.getByTestId('PersonAddOutlinedIcon');
    expect(addIcon).toBeInTheDocument();
  });
});
