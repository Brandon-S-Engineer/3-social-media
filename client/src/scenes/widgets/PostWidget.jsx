// Icons for: chat, favorite (unfilled and filled), and share buttons
import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined } from '@mui/icons-material';
// UI components: Box for layout, Divider for separation, IconButton for clickable icons, Typography for text, and useTheme for theming
import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material';
import FlexBetween from 'components/FlexBetween';
import Friend from 'components/Friend';
import WidgetWrapper from 'components/WidgetWrapper';
import { useState } from 'react';
// Redux hooks to dispatch actions and access state
import { useDispatch, useSelector } from 'react-redux';
// Action to update the post state in the Redux store
import { setPost } from 'state';
