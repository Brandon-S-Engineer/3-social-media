// MUI Icons
import { ManageAccountsOutlined, EditOutlined, LocationOnOutlined, WorkOutlineOutlined } from '@mui/icons-material';

// MUI Components
import { Box, Typography, Divider, useTheme } from '@mui/material';

// Custom Components
import UserImage from 'components/UserImage';
import FlexBetween from 'components/FlexBetween';
import WidgetWrapper from 'components/WidgetWrapper';

// Hooks from React-Redux
import { useSelector } from 'react-redux';

// React
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserWidget = ({ userId, picturePath }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  // MUI Theme
  const { palette } = useTheme();
  // Redux store token
  const token = useSelector((state) => state.token);
  // Destructure theme colors
  const dark = palette.neutral.dark;
  const medium = palette.neutral.medium;
  const main = palette.neutral.main;

  // Function to fetch user data
  const getUser = async () => {
    // Make a GET request to fetch user data
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: 'GET', // HTTP method
      headers: { Authorization: `Bearer ${token}` }, // Authorization header with token
    });

    // Parse the response as JSON
    const data = await response.json();

    // Update the state with fetched user data
    setUser(data);
  };

  // useEffect hook to call getuser when the component mounts
  useEffect(() => {
    getUser();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Conditional rendering based on user state
  if (!user) {
    return null;
  }

  const { firstName, lastName, location, occupation, viewedProfile, impressions, friends } = user;

  return (
    <WidgetWrapper>
      {/* Row 1 */}
      <FlexBetween
        gap='0.5rem'
        pb='1.5rem'
        // Navigation on click
        onClick={() => navigate(`/profile/${userId}`)}>
        <FlexBetween gap='1rem'>
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant='h4'
              color={dark}
              fontWeight='500'
              sx={{
                '&:hover': {
                  color: palette.primary.light,
                  cursor: 'pointer',
                },
              }}>
              {firstName} {lastName}
            </Typography>

            <Typography color={medium}>{friends.length} friends</Typography>
          </Box>
        </FlexBetween>

        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* Row 2 */}
      <Box p='1rem 0'>
        <Box
          display='flex'
          alignItems='center'
          gap='1rem'
          mb='0.5rem'>
          <LocationOnOutlined
            fontSize='large'
            sx={{ color: main }}
          />
          <Typography color={medium}>{location}</Typography>
        </Box>
        <Box
          display='flex'
          alignItems='center'
          gap='1rem'>
          <WorkOutlineOutlined
            fontSize='large'
            sx={{ color: main }}
          />
          <Typography color={medium}>{occupation}</Typography>
        </Box>
      </Box>

      <Divider />

      {/* Row 3 */}
      <Box p='1rem 0'>
        <FlexBetween mb='0.5rem'>
          <Typography color={medium}>Who's viewed your profile</Typography>
          <Typography
            color={main}
            fontWeight='500'>
            {viewedProfile}
          </Typography>
        </FlexBetween>
        <FlexBetween>
          <Typography color={medium}>Impressions of your post</Typography>
          <Typography
            color={main}
            fontWeight='500'>
            {impressions}
          </Typography>
        </FlexBetween>
      </Box>

      <Divider />

      {/* Row 4 */}
      <Box p='1rem 0'>
        <Typography
          fontSize='1rem'
          color={main}
          fontWeight='500'
          mb='1rem'>
          Social Profiles
        </Typography>

        <FlexBetween
          gap='1rem'
          mb='0.5rem'>
          <FlexBetween gap='1rem'>
            <img
              src='../assets/twitter.png'
              alt='twitter'
            />
            <Box>
              <Typography
                color={main}
                fontWeight='500'>
                Twitter
              </Typography>
              <Typography color={medium}>Social Network</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>

        <FlexBetween gap='1rem'>
          <FlexBetween gap='1rem'>
            <img
              src='../assets/linkedin.png'
              alt='linkedin'
            />
            <Box>
              <Typography
                color={main}
                fontWeight='500'>
                Linkedin
              </Typography>
              <Typography color={medium}>Network Platform</Typography>
            </Box>
          </FlexBetween>
          <EditOutlined sx={{ color: main }} />
        </FlexBetween>
      </Box>
    </WidgetWrapper>
  );
};

export default UserWidget;
