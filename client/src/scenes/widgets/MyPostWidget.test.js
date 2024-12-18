import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import MyPostWidget from './MyPostWidget';
import { useDispatch, useSelector } from 'react-redux';
import '@testing-library/jest-dom';
import { useTheme } from '@mui/material/styles';

// Mock necessary components
jest.mock('../../components/FlexBetween', () => ({ children }) => <div>{children}</div>);
jest.mock('../../components/UserImage', () => () => <div data-testid='user-image'>User Image</div>);
jest.mock('../../components/WidgetWrapper', () => ({ children }) => <div>{children}</div>);

jest.mock('react-dropzone', () => ({
  __esModule: true,
  default: ({ onDrop }) => (
    <div
      data-testid='dropzone'
      onClick={() => onDrop([{ name: 'test-image.jpg' }])}>
      <p>Dropzone Mock</p>
    </div>
  ),
}));

// Mock Redux hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

// Mock Material-UI useTheme
jest.mock('@mui/material/styles', () => ({
  ...jest.requireActual('@mui/material/styles'),
  useTheme: jest.fn(),
}));

// Mock fetch globally
global.fetch = jest.fn();

describe('MyPostWidget Component', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useDispatch.mockReturnValue(mockDispatch);

    // Mock initial Redux state
    useSelector.mockImplementation((selector) =>
      selector({
        user: { _id: 'user123' },
        token: 'mock-token',
        posts: [],
      })
    );

    // Mock theme
    useTheme.mockReturnValue({
      palette: {
        neutral: {
          mediumMain: '#666',
          medium: '#888',
          light: '#f0f0f0',
        },
        primary: {
          main: '#007bff',
        },
        background: {
          alt: '#ffffff',
        },
      },
    });
  });

  it('renders input field and user image', () => {
    render(<MyPostWidget picturePath='user.jpg' />);

    expect(screen.getByTestId('user-image')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Create a Post')).toBeInTheDocument();
  });

  it('updates the input value on typing', () => {
    render(<MyPostWidget picturePath='user.jpg' />);

    const inputField = screen.getByPlaceholderText('Create a Post');
    fireEvent.change(inputField, { target: { value: 'New Post' } });

    expect(inputField.value).toBe('New Post');
  });

  it('renders the main elements', () => {
    render(<MyPostWidget picturePath='user.jpg' />);

    // Check for the user image
    expect(screen.getByTestId('user-image')).toBeInTheDocument();

    // Check for the input field
    expect(screen.getByPlaceholderText('Create a Post')).toBeInTheDocument();

    // Check for the "Post" button
    expect(screen.getByRole('button', { name: /Post/i })).toBeInTheDocument();
  });

  it('calls handlePost and clears input after posting', async () => {
    // Mock fetch response
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        _id: 'post123',
        description: 'New Post',
      }),
    });

    render(<MyPostWidget picturePath='user.jpg' />);

    const inputField = screen.getByPlaceholderText('Create a Post');
    const postButton = screen.getByRole('button', { name: 'Post' });

    fireEvent.change(inputField, { target: { value: 'New Post' } });

    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      fireEvent.click(postButton);
    });

    // Check fetch call
    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/posts',
      expect.objectContaining({
        method: 'POST',
        headers: { Authorization: 'Bearer mock-token' },
      })
    );

    // Check that input is cleared after posting
    expect(inputField.value).toBe('');
  });

  it('disables Post button when input is empty', () => {
    render(<MyPostWidget picturePath='user.jpg' />);

    const postButton = screen.getByRole('button', { name: 'Post' });
    expect(postButton).toBeDisabled();
  });
});
