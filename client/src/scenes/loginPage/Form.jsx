import { useState } from 'react';

// MUI Components and Hooks
import { Box, Button, TextField, useMediaQuery, Typography, useTheme } from '@mui/material';

// MUI Icon
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

import { Formik } from 'formik'; // Library for building forms in React.
import * as yup from 'yup'; // Blueprint builder library for value parsing and validation.

import { useNavigate } from 'react-router-dom';

// Redux
import { useDispatch } from 'react-redux';
import { setLogin } from 'state';

import Dropzone from 'react-dropzone'; // Handle file uploads via drag-and-drop.
import FlexBetween from 'components/FlexBetween';
import { Password } from '@mui/icons-material';

// Validation Blueprint
const loginSchema = yup.object().shape({
  email: yup.string().email('invalid email').required('required'),
  password: yup.string().required('required'),
});

const initialValuesLogin = {
  email: '',
  password: '',
};

const registerSchema = yup.object().shape({
  firstName: yup.string().required('required'),
  lastName: yup.string().required('required'),
  email: yup.string().email('invalid email').required('required'),
  password: yup.string().required('required'),
  location: yup.string().required('required'),
  occupation: yup.string().required('required'),
  picture: yup.string().required('required'),
});

const initialValuesRegister = {
  firstName: '', // Has to be the same key on prop: name
  lastName: '',
  email: '',
  password: '',
  location: '',
  occupation: '',
  picture: '',
};

const Form = () => {
  const [pageType, setPageType] = useState('login');
  const isLogin = pageType === 'login';
  const isRegister = pageType === 'register';

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { palette } = useTheme();
  const isNonMobile = useMediaQuery('(min-width:600px)');

  const register = async (values, onSubmitProps) => {
    // Initialize and setup formData object
    const formData = new FormData();
    for (let value in values) {
      formData.append(value, values[value]);
    }
    formData.append('picturePath', values.picture.name);

    // Send POST request
    const savedUserResponse = await fetch('https://three-social-media.onrender.com/auth/register', {
      method: 'POST',
      body: formData,
    });

    // Process Response
    const savedUser = await savedUserResponse.json();
    onSubmitProps.resetForm(); // reset form

    // Switch to login page
    if (savedUser) {
      setPageType('login');
    }
  };

  const login = async (values, onSubmitProps) => {
    // POST request to login
    const loggedInResponse = await fetch('https://three-social-media.onrender.com/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    // Process response
    const loggedIn = await loggedInResponse.json();
    onSubmitProps.resetForm(); // reset form

    // Update Redux store and navigate
    if (loggedIn) {
      dispatch(
        setLogin({
          user: loggedIn.user,
          token: loggedIn.token,
        })
      );
      navigate('/home');
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isRegister) await register(values, onSubmitProps);
    if (isLogin) await login(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}>
      {/* Render Prop Pattern */}
      {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display='grid'
            gap='30px'
            gridTemplateColumns='repeat(2, minmax(0, 1fr))'
            sx={{
              '& > div': { gridColumn: isNonMobile ? undefined : 'span 2' },
            }}>
            {/* Register Interface */}
            {isRegister && (
              <>
                <TextField
                  label='First Name'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name='firstName' // specifies which key in Formik's state this field corresponds to
                  error={Boolean(touched.firstName) && Boolean(errors.firstName)} // true if Touched && Error
                  helperText={touched.firstName && errors.firstName} // Display the err message
                  sx={{ gridColumn: 'span 1' }}
                />
                <TextField
                  label='Last Name'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name='lastName'
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ gridColumn: 'span 1' }}
                />
                <TextField
                  label='Location'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name='location'
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ gridColumn: 'span 2' }}
                />
                <TextField
                  label='Occupation'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name='occupation'
                  error={Boolean(touched.occupation) && Boolean(errors.occupation)}
                  helperText={touched.occupation && errors.occupation}
                  sx={{ gridColumn: 'span 2' }}
                />
                <Box
                  gridColumn='span 2'
                  border={`1px solid ${palette.neutral.medium}`}
                  borderRadius='5px'
                  p='1rem'>
                  <Dropzone
                    acceptedFiles='.jpg,.jpeg,.png'
                    multiple={false}
                    onDrop={(acceptedFiles) => setFieldValue('picture', acceptedFiles[0])}>
                    {/* Render Prop Pattern */}
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        // Dropzone
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p='1rem'
                        sx={{ '&:hover': { cursor: 'pointer' } }}>
                        {/* File iput */}
                        <input {...getInputProps()} />

                        {/* Placeholder */}
                        {!values.picture ? (
                          <p>Add picture here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            <TextField
              label='Email'
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name='email'
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ gridColumn: 'span 2' }}
            />
            <TextField
              label='Password'
              type='password'
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name='password'
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              sx={{ gridColumn: 'span 2' }}
            />
          </Box>

          {/* Buttons */}
          <Box>
            <Button
              fullWidth
              type='submit'
              sx={{
                m: '2rem 0',
                p: '1rem',
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                '&:hover': { color: palette.primary.main },
              }}>
              {isLogin ? 'Login' : 'Register'}
            </Button>
            <Typography
              onClick={() => {
                setPageType(isLogin ? 'register' : 'login');
                resetForm();
              }}
              sx={{
                textDecoration: 'underline',
                color: palette.primary.main,
                '&:hover': {
                  cursor: 'pointer',
                  color: palette.primary.light,
                },
              }}>
              {isLogin ? 'Sign Up' : 'Log In'}
            </Typography>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
