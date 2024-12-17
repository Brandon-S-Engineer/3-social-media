import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { configureStore } from '@reduxjs/toolkit';
import postsReducer from '../../state'; // Your posts slice/reducer
import PostsWidget from './PostsWidget';

// Mock fetch globally
global.fetch = jest.fn();

// Mock PostWidget child component
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

const theme = createTheme();

describe('PostsWidget Component', () => {
  let store;

  const initializeStore = (initialPosts = []) => {
    store = configureStore({
      reducer: {
        posts: postsReducer,
        token: () => 'mock-token',
      },
      preloadedState: {
        posts: initialPosts,
        token: 'mock-token',
      },
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders no PostWidget when posts array is empty', () => {
    initializeStore([]); // Start with empty posts state

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

    // Assert no posts are rendered
    const postWidgets = screen.queryAllByTestId('post-widget');
    expect(postWidgets).toHaveLength(0);
  });
});
