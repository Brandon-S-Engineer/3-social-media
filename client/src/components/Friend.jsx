// Icons for adding and removing a person (friend)
import { PersonAddOutlined, PersonRemoveOutlined } from '@mui/icons-material';

// UI components: Box for layout, IconButton for clickable icons, Typography for text, and useTheme for theming
import { Box, IconButton, Typography, useTheme } from '@mui/material';

// Redux hooks for dispatching actions and accessing state
import { useDispatch, useSelector } from 'react-redux';

// Hook for navigation between routes
import { useNavigate } from 'react-router-dom';

// Action to update friends state in the Redux store
import { setFriends } from 'state';

// Custom layout component for evenly spacing child elements
import FlexBetween from './FlexBetween';

// Custom component to display user images
import UserImage from './UserImage';
