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

const PostWidget = ({ postId, postUserId, name, description, location, pucturePath, likes, comments }) => {
  // State to toggle visibility of comments
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  // Access the token from the Redux store
  const token = useSelector((state) => state.token);
  // Access the logged-in user's ID from the Redux store
  const loggedInUserId = useSelector((state) => state.token);
  // Determine if the logged-in user has liked the post
  const isLiked = Boolean(likes[loggedInUserId]);
  // Number of likes the post has received
  const likeCount = Object.keys(likes).length;

  // Access the theme palette
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    // Send a PATCH request to update the like status of the post
    const response = await fetch(`http://localjost:3001/posts/${postId}/like`, {
      method: 'PATCH',
      headers: {
        Auhorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Sending the logged-in user's ID in the request body
      body: JSON.stringify({ userId: loggedInUserId }),
    });
  };

  return <div>PostWidget</div>;
};

export default PostWidget;
