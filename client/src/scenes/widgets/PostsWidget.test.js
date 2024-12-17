import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../../state'; // Your posts slice/reducer
import PostsWidget from './PostsWidget';

// Mock fetch globally
global.fetch = jest.fn();

// Mock child component to simplify testing
jest.mock('./PostWidget', () => ({
  __esModule: true,
  default: ({ postId, name, description }) => (
    <div data-testid='post-widget'>
      <p>{postId}</p>
      <p>{name}</p>
      <p>{description}</p>
    </div>
  ),
}));

// Define a custom theme for testing
// const theme = createTheme({
//   palette: {
//     primary: { main: '#3f50b5' },
//     neutral: { main: '#666' },
//   },
// });

const theme = createTheme({});

describe('PostsWidget Component', () => {
  let store;

  beforeEach(() => {
    // Create a Redux store with two reducers: one for posts, one for token
    store = configureStore({
      reducer: {
        posts: postsReducer,
        token: (state = 'mock-token') => state,
      },
      preloadedState: {
        posts: [],
        token: 'mock-token', // Ensure token is present
      },
    });

    jest.clearAllMocks(); // Reset all mocks before each test
  });

  it('fetches all posts and dispatches setPosts when isProfile is false', async () => {
    // The slice expects { posts: data }, so our mock "data" must be an array
    const mockPosts = [
      { _id: 'post1', firstName: 'John', lastName: 'Doe', description: 'Post 1' },
      { _id: 'post2', firstName: 'Jane', lastName: 'Smith', description: 'Post 2' },
    ];

    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockPosts),
    });

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <PostsWidget
            userId='user123'
            isProfile={false}
          />
        </ThemeProvider>
      </Provider>
    );

    // Wait for the fetch call
    await waitFor(() =>
      expect(fetch).toHaveBeenCalledWith('http://localhost:3001/posts', {
        method: 'GET',
        headers: { Authorization: 'Bearer mock-token' },
      })
    );

    // Check PostWidgets
    const postWidgets = screen.getAllByTestId('post-widget'); // if the code & slice are correct, this should find 2
    expect(postWidgets).toHaveLength(2);
    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Post 2')).toBeInTheDocument();
  });

  // it('fetches user posts and dispatches setPosts when isProfile is true', async () => {
  //   // Mock response for "user posts"
  //   const mockUserPosts = [{ _id: 'userPost1', firstName: 'User', lastName: 'One', description: 'User Post 1' }];

  //   fetch.mockResolvedValue({
  //     ok: true,
  //     json: jest.fn().mockResolvedValue(mockUserPosts),
  //   });

  //   render(
  //     <Provider store={store}>
  //       <ThemeProvider theme={theme}>
  //         <PostsWidget
  //           userId='user123'
  //           isProfile
  //         />
  //       </ThemeProvider>
  //     </Provider>
  //   );

  //   // Assert fetch call
  //   await waitFor(() =>
  //     expect(fetch).toHaveBeenCalledWith('http://localhost:3001/posts/user123/posts', {
  //       method: 'GET',
  //       headers: { Authorization: 'Bearer mock-token' },
  //     })
  //   );

  //   // Check if PostWidget item is rendered
  //   const postWidgets = screen.getAllByTestId('post-widget');
  //   expect(postWidgets).toHaveLength(1);
  //   expect(screen.getByText('User Post 1')).toBeInTheDocument();
  // });

  it('renders no PostWidget when posts array is empty', () => {
    // We do NOT mock fetch here, so no posts are fetched
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <PostsWidget
            userId='user123'
            isProfile={false}
          />
        </ThemeProvider>
      </Provider>
    );

    // Assert that no PostWidget is rendered
    const postWidgets = screen.queryAllByTestId('post-widget');
    expect(postWidgets).toHaveLength(0);
  });
});
