import React from 'react';
import { render, screen } from '@testing-library/react';
import AdvertWidget from './AdvertWidget';
import { useTheme } from '@mui/material/styles';

// Mock components used inside AdvertWidget
jest.mock('../../components/FlexBetween', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid='flex-between'>{children}</div>,
}));

jest.mock('../../components/WidgetWrapper', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid='widget-wrapper'>{children}</div>,
}));

// Mock MUI's useTheme hook
jest.mock('@mui/material/styles', () => ({
  ...jest.requireActual('@mui/material/styles'),
  useTheme: jest.fn(),
}));

describe('AdvertWidget Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useTheme.mockReturnValue({
      palette: {
        neutral: {
          dark: '#000000',
          main: '#333333',
          medium: '#666666',
        },
      },
    });
  });

  it('renders with correct styles and theme colors', () => {
    render(<AdvertWidget />);

    // Check colors applied to Typography
    expect(screen.getByText('Sponsored')).toHaveStyle({ color: '#000000' });
    expect(screen.getByText('Create Ad')).toHaveStyle({ color: '#666666' });
    expect(screen.getByText('MikaCosmetics')).toHaveStyle({ color: '#333333' });
    expect(screen.getByText('mikacosmetics.com')).toHaveStyle({ color: '#666666' });

    // Check styles applied to the ad image
    const adImage = screen.getByAltText('advert');
    expect(adImage).toHaveStyle({
      borderRadius: '0.75rem',
      margin: '0.75rem 0',
    });
  });
});
