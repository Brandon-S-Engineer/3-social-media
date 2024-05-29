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

const UserWidget = ({ iserId, picturepath }) => {
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

  // Async func to Fetch user data
  const getUser = async () => {};

  // useEffect hook to call getuser when the component mounts
  useEffect(() => {
    getUser();
  }, []);

  if (!user) {
    return null;
  }

  const { firstName, lastName, location, occupation, viewedProfile, impressions, friends } = user;

  return (
    <WidgetWrapper>
      {/* Row 1 */}
      <FlexBetween>
        <FlexBetween>
          <UserImage />
          <Box>
            <Typography>
              {firstName} {lastName}
            </Typography>

            <Typography>{friends.length} friends</Typography>
          </Box>
        </FlexBetween>

        <ManageAccountsOutlined />
      </FlexBetween>

      <Divider />

      {/* Row 2 */}
    </WidgetWrapper>
  );
};

export default UserWidget;
