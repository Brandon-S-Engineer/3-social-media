import React from 'react';
import { render, screen } from '@testing-library/react';
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

describe('PostsWidget Component', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);

    // Mock global fetch to avoid unhandled fetch calls
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]), // Default mock response
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders posts when Redux state has posts', async () => {
    const mockPosts = [
      { _id: '1', firstName: 'John', lastName: 'Doe', description: 'Post 1' },
      { _id: '2', firstName: 'Jane', lastName: 'Smith', description: 'Post 2' },
    ];

    // Mock the Redux state returned by useSelector
    useSelector.mockImplementation((selector) =>
      selector({
        posts: mockPosts,
        token: 'mock-token',
      })
    );

    render(
      <PostsWidget
        userId='testUserId'
        isProfile={false}
      />
    );

    // Ensure posts are rendered
    const postWidgets = screen.getAllByTestId('post-widget');
    expect(postWidgets).toHaveLength(2);
    expect(screen.getByText('Post 1')).toBeInTheDocument();
    expect(screen.getByText('Post 2')).toBeInTheDocument();
  });

  it('renders no posts when Redux state posts array is empty', async () => {
    // Mock empty Redux posts array
    useSelector.mockImplementation((selector) =>
      selector({
        posts: [],
        token: 'mock-token',
      })
    );

    render(
      <PostsWidget
        userId='testUserId'
        isProfile={false}
      />
    );

    // Check that no PostWidget components are rendered
    const postWidgets = screen.queryAllByTestId('post-widget');
    expect(postWidgets).toHaveLength(0);
  });
});
