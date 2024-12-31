import { Box, useMediaQuery } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; // React Router hook for accessing URL parameters
import Navbar from 'scenes/navbar';
import FriendListWidget from 'scenes/widgets/FriendListWidget';
import MyPostWidget from 'scenes/widgets/MyPostWidget';
import PostsWidget from 'scenes/widgets/PostsWidget';
import UserWidget from 'scenes/widgets/UserWidget';

const ProfilePage = () => {
  const [user, setUser] = useState(null); // State to store user data, initialized to null
  const { userId } = useParams(); // Retrieves userId from the URL parameters
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery('(min-width:1000px');

  const getUser = async () => {
    // Fetches user data from the server for the given userId
    const response = await fetch(`https://3-social-media.vercel.app/users/${userId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    setUser(data); // Updates the user state with the fetched data
  };

  useEffect(() => {
    getUser(); // Calls getUser to fetch and update user data on component mount
  }, []);

  // If user data is not loaded yet, return null
  if (!user) return null;

  return (
    <Box>
      <Navbar />

      <Box
        width='100%'
        padding='2rem 6%'
        display={isNonMobileScreens ? 'flex' : 'block'} // Flexbox for large screens, block for smaller screens
        gap='2rem'
        justifyContent='center'>
        {/*  Sets flex basis for large screens */}
        <Box flexBasis={isNonMobileScreens ? '26%' : undefined}>
          <UserWidget
            userId={userId}
            picturePath={user.picturePath}
          />

          <Box m='2rem 0' />

          <FriendListWidget userId={userId} />
        </Box>

        <Box
          flexBasis={isNonMobileScreens ? '42%' : undefined}
          mt={isNonMobileScreens ? undefined : '2rem'}>
          <MyPostWidget picturePath={user.picturePath} />

          <Box m='2rem 0' />

          <PostsWidget
            userId={userId}
            isProfile
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
