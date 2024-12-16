// Icons for: chat, favorite (unfilled and filled), and share buttons
import { ChatBubbleOutlineOutlined, FavoriteBorderOutlined, FavoriteOutlined, ShareOutlined } from '@mui/icons-material';
// UI components: Box for layout, Divider for separation, IconButton for clickable icons, Typography for text, and useTheme for theming
import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material';
import FlexBetween from '../../components/FlexBetween';
import Friend from '../../components/Friend';
import WidgetWrapper from '../../components/WidgetWrapper';
import { useState } from 'react';
// Redux hooks to dispatch actions and access state
import { useDispatch, useSelector } from 'react-redux';
// Action to update the post state in the Redux store
import { setPost } from '../../state';

const PostWidget = ({ postId, postUserId, name, description, location, picturePath, userPicturePath, likes, comments }) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.token);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;

  // Access the theme palette
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    // Send a PATCH request to update the number of likes
    const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Sending the logged-in user's ID in the request body
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    // Dispatch an action to update the post likes in the Redux store
    dispatch(setPost({ post: updatedPost }));
  };

  return (
    <WidgetWrapper>
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />

      <Typography
        color={main}
        sx={{ mt: '1rem' }}>
        {description}
      </Typography>

      {picturePath && (
        <img
          width='100%'
          height='auto'
          alt='post'
          style={{ borderRadius: '0.75rem', marginTop: '0.75rem' }}
          src={`http://localhost:3001/assets/${picturePath}`}
        />
      )}

      <FlexBetween mt='0.25rem'>
        <FlexBetween gap='1rem'>
          {/* Like Section */}
          <FlexBetween gap='0.3rem'>
            <IconButton
              aria-label='like' // Testing
              onClick={patchLike}>
              {isLiked ? <FavoriteOutlined sx={{ color: primary }} /> : <FavoriteBorderOutlined />}
            </IconButton>
            {/* Like Count */}
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          {/* Comment Section */}
          <FlexBetween gap='0.3rem'>
            <IconButton
              aria-label='comment' // Testing
              onClick={() => setIsComments(!isComments)}>
              {/* Toggle comments */}
              <ChatBubbleOutlineOutlined />
            </IconButton>

            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        {/* Share Button */}
        {/* aria-label='share' for testing */}
        <IconButton aria-label='share'>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>

      {/* Check if comments should be displayed */}
      {isComments && (
        <Box mt='0.5rem'>
          {/* Map through the comments array */}
          {comments.map((comment, i) => (
            // Make a unique key for each comment
            <Box key={`${name}-${i}`}>
              <Divider />

              <Typography sx={{ color: main, m: '0.5rem 0', pl: '1rem' }}>{comment}</Typography>
            </Box>
          ))}

          <Divider />
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
