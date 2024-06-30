import { Box, Typography, useTheme } from '@mui/material';
import Friend from 'components/Friend';
import WidgetWrapper from 'components/WidgetWrapper';
import { useEffect } from 'react';
// Redux hooks for dispatching actions and selecting state
import { useDispatch, useSelector } from 'react-redux';
import { setFriends } from 'state';

const FriendListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  // Selects token state from the store
  const token = useSelector((state) => state.token);
  // Selects friends state from the user state in the store
  const friends = useSelector((state) => state.user.friends);

  const getFriends = async () => {
    // Fetches friends data from the server for the given userId
    const response = await fetch(`http://localhost:3001/users/${userId}/friends`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setFriends({ friends: data })); // Dispatches action to update friends in the store
  };

  useEffect(() => {
    getFriends(); // Calls getFriends to fetch and update friends data on component mount
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // Empty dependency array ensures this runs only once on mount

  return (
    <WidgetWrapper>
      {/* Typography component for the Friend List title with styling */}
      <Typography
        color={palette.neutral.dark}
        variant='h5'
        fontWeight='500'
        sx={{ mb: '1.5rem' }}>
        Friend List
      </Typography>

      {/* Box component that displays the list of friends using flexbox layout */}
      <Box
        display='flex'
        flexDirection='column'
        gap='1.5rem'>
        {/* Maps through friends array to render each Friend component */}
        {friends.map((friend) => (
          <Friend
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default FriendListWidget;
