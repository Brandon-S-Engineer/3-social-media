import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import PostsWidget from './PostsWidget';
import { useDispatch, useSelector } from 'react-redux';

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

// Mock Redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Global fetch mock
global.fetch = jest.fn();

describe('PostsWidget Component', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);
    global.fetch.mockClear();

    // Suppress console errors to clean test output
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it('renders posts when Redux state has posts', async () => {
    const mockPosts = [
      { _id: '1', firstName: 'John', lastName: 'Doe', description: 'Post 1' },
      { _id: '2', firstName: 'Jane', lastName: 'Smith', description: 'Post 2' },
    ];

    // Mock Redux state
    useSelector.mockImplementation((selector) =>
      selector({
        posts: mockPosts,
        token: 'mock-token',
      })
    );

    // Mock fetch response
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockPosts,
    });

    render(
      <PostsWidget
        userId='testUserId'
        isProfile={false}
      />
    );

    // Wait for fetch to complete
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Check that posts are rendered
    const postWidgets = screen.getAllByTestId('post-widget');
    expect(postWidgets).toHaveLength(2);
    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Post 2')).toBeInTheDocument();
  });

  it('renders no posts when Redux state posts array is empty', async () => {
    // Mock Redux state with empty posts array
    useSelector.mockImplementation((selector) =>
      selector({
        posts: [],
        token: 'mock-token',
      })
    );

    // Mock fetch response with empty array
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    render(
      <PostsWidget
        userId='testUserId'
        isProfile={false}
      />
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Check that no posts are rendered
    const postWidgets = screen.queryAllByTestId('post-widget');
    expect(postWidgets).toHaveLength(0);
  });

  it('handles fetch failure gracefully', async () => {
    // Mock Redux state
    useSelector.mockImplementation((selector) =>
      selector({
        posts: [],
        token: 'mock-token',
      })
    );

    // Mock fetch failure
    global.fetch.mockRejectedValue(new Error('Network Error'));

    render(
      <PostsWidget
        userId='testUserId'
        isProfile={false}
      />
    );

    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));

    // Ensure no posts are rendered
    const postWidgets = screen.queryAllByTestId('post-widget');
    expect(postWidgets).toHaveLength(0);

    // Optionally, confirm that error handling was called
    expect(console.error).toHaveBeenCalledWith('Error fetching posts:', expect.any(Error));
  });
});
