import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Form } from 'react-bootstrap';
import axiosInstance from 'axiosInstance';
import backgroundImage from '../../../assets/images/auth/tvs_background.avif';
const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // const handleVerify = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);
  //   setErrorMessage('');

  //   try {
  //     const mobile = localStorage.getItem('mobile');
  //     const response = await axiosInstance.post('/auth/verify-otp', { mobile, otp });

  //     if (response.data.success) {
  //       localStorage.setItem('token', response.data.token);
  //       console.log('token', response.data.token);
  //       localStorage.setItem('user', JSON.stringify(response.data.user));
  //       localStorage.setItem('userPermissions', JSON.stringify(response.user.permissions));
  //       console.log('user',response.data.user);
  //       console.log('userPermissions',response.user.permissions)
  //       navigate('/home');
  //     } else {
  //       setErrorMessage('Invalid OTP. Please try again.');
  //     }
  //   } catch (error) {
  //     setErrorMessage(error.response?.data?.message || 'Verification failed. Please try again.');
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleVerify = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  setErrorMessage('');

  try {
    const mobile = localStorage.getItem('mobile');
    const response = await axiosInstance.post('/auth/verify-otp', { mobile, otp });

    if (response.data.success) {
      // Store token
      localStorage.setItem('token', response.data.token);
      
      // Store user data
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // CORRECTED: Store permissions from response.data.user.permissions
      localStorage.setItem('userPermissions', JSON.stringify(response.data.user.permissions));
      
      console.log('Login successful', {
        token: response.data.token,
        user: response.data.user,
        permissions: response.data.user.permissions
      });

      navigate('/home');
    } else {
      setErrorMessage('Invalid OTP. Please try again.');
    }
  } catch (error) {
    console.error('OTP verification error:', error);
    setErrorMessage(error.response?.data?.message || 'Verification failed. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div
      className="auth-wrapper"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          zIndex: 0
        }}
      />
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Card style={{ width: '400px' }} className="p-4">
          <h4 className="text-center mb-4">Verify OTP</h4>
          <Form onSubmit={handleVerify}>
            <Form.Group className="mb-3" controlId="otp">
              <Form.Label>Enter OTP</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter the OTP sent to your mobile"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </Form.Group>

            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Verifying...' : 'Verify OTP'}
              </Button>
            </div>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOTP;
