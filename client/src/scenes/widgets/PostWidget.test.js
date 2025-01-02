import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import configureStore from 'redux-mock-store';
import PostWidget from './PostWidget';

// Mock Redux store
const mockStore = configureStore([]);

// Mock fetch globally
global.fetch = jest.fn();

// Mock Redux action
jest.mock('../../state', () => ({
  setPost: jest.fn(),
}));

// Define a custom theme that includes the neutral palette
const theme = createTheme({
  palette: {
    neutral: {
      main: '#666', // Mock color
    },
    primary: {
      main: '#3f50b5', // Mock color
    },
  },
});

// Mock child components to simplify testing
jest.mock('../../components/Friend', () => ({ name, subtitle, userPicturePath }) => (
  <div data-testid='friend'>
    <p>{name}</p>
    <p>{subtitle}</p>
    <img
      src={userPicturePath}
      alt='friend'
    />
  </div>
));
jest.mock('../../components/FlexBetween', () => ({ children }) => <div>{children}</div>);
jest.mock('../../components/WidgetWrapper', () => ({ children }) => <div>{children}</div>);

describe('PostWidget Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      token: 'mock-token',
    });

    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        id: '1',
        likes: { 'mock-token': true },
        comments: [],
      }),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with given props', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <PostWidget
            postId='1'
            postUserId='user-1'
            name='John Doe'
            description='This is a test post.'
            location='New York'
            picturePath='path/to/image.jpg'
            userPicturePath='path/to/user.jpg'
            likes={{ 'user-1': true }}
            comments={['Nice post!', 'Great!']}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('New York')).toBeInTheDocument();
    expect(screen.getByText('This is a test post.')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument(); // 2 comments
    expect(screen.getByAltText('post')).toBeInTheDocument();
  });

  it('toggles like state and sends correct API request', async () => {
    // Mock the updated post to match what your test expects
    const mockUpdatedPost = {
      id: '1',
      likes: { 'mock-token': true },
      comments: [],
    };

    // Fix the fetch mock to return the aligned updated post
    fetch.mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(mockUpdatedPost),
    });

    // Also ensure setPost returns a valid action
    const { setPost } = require('../../state');
    setPost.mockImplementation(({ post }) => ({
      type: 'SET_POST',
      payload: post,
    }));

    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <PostWidget
            postId='1'
            postUserId='user-1'
            name='John Doe'
            description='This is a test post.'
            location='New York'
            userPicturePath='path/to/user.jpg'
            likes={{}}
            comments={[]}
          />
        </ThemeProvider>
      </Provider>
    );

    // Find and click the 'like' button
    const likeButton = screen.getByRole('button', { name: /like/i });
    fireEvent.click(likeButton);

    // Separate the assertions to adhere to ESLint rule (no multiple assertions in `waitFor`)
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('https://three-social-media.onrender.com/posts/1/like', {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer mock-token',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 'mock-token' }),
      });
    });

    await waitFor(() => {
      expect(setPost).toHaveBeenCalledWith({ post: mockUpdatedPost });
    });
  });

  it('toggles comments section', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <PostWidget
            postId='1'
            postUserId='user-1'
            name='John Doe'
            description='This is a test post.'
            location='New York'
            userPicturePath='path/to/user.jpg'
            likes={{}}
            comments={['Nice post!']}
          />
        </ThemeProvider>
      </Provider>
    );

    const commentButton = screen.getByRole('button', { name: /comment/i });
    fireEvent.click(commentButton);

    expect(screen.getByText('Nice post!')).toBeInTheDocument();

    fireEvent.click(commentButton);
    expect(screen.queryByText('Nice post!')).not.toBeInTheDocument();
  });

  it('renders comments when expanded', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <PostWidget
            postId='1'
            postUserId='user-1'
            name='John Doe'
            description='This is a test post.'
            location='New York'
            userPicturePath='path/to/user.jpg'
            likes={{}}
            comments={['Nice post!', 'Great!']}
          />
        </ThemeProvider>
      </Provider>
    );

    const commentButton = screen.getByRole('button', { name: /comment/i });
    fireEvent.click(commentButton);

    expect(screen.getByText('Nice post!')).toBeInTheDocument();
    expect(screen.getByText('Great!')).toBeInTheDocument();
  });

  it('renders share button', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <PostWidget
            postId='1'
            postUserId='user-1'
            name='John Doe'
            description='This is a test post.'
            location='New York'
            userPicturePath='path/to/user.jpg'
            likes={{}}
            comments={[]}
          />
        </ThemeProvider>
      </Provider>
    );

    const shareButton = screen.getByRole('button', { name: /share/i });
    expect(shareButton).toBeInTheDocument();
  });

  it('renders without crashing when picturePath is not provided', () => {
    render(
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <PostWidget
            postId='1'
            postUserId='user-1'
            name='John Doe'
            description='This is a test post.'
            location='New York'
            userPicturePath='path/to/user.jpg'
            likes={{}}
            comments={[]}
          />
        </ThemeProvider>
      </Provider>
    );

    expect(screen.queryByAltText('post')).not.toBeInTheDocument();
  });
});
