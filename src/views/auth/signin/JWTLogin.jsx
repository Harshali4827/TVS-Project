import React, { useState } from 'react';

import { Row, Col, Alert, Button } from 'react-bootstrap';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axiosInstance from 'axiosInstance';

const JWTLogin = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <>
      <Formik
        initialValues={{
          mobile: '',
          submit: null
        }}
        validationSchema={Yup.object().shape({
          mobile: Yup.string()
            .matches(/^[0-9]{10}$/, 'Invalid mobile number (must be 10 digits)')
            .required('Mobile number is required')
        })}
        onSubmit={async (values, { setSubmitting, setErrors }) => {
          try {
            const response = await axiosInstance.post('/auth/request-otp', {
              mobile: values.mobile
            });

            if (response.data.success) {
              localStorage.setItem('mobile', values.mobile);
              navigate('/verify-otp');
            } else {
              setErrorMessage('Failed to send OTP. Please try again.');
            }
          } catch (err) {
            setErrorMessage(err.response?.data?.message || 'Something went wrong. Try again.');
            setErrors({ submit: err.message });
          } finally {
            setSubmitting(false);
          }
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
          <form noValidate onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <input
                className="form-control"
                name="mobile"
                onBlur={handleBlur}
                onChange={handleChange}
                type="text"
                value={values.mobile}
                placeholder="Enter your mobile number"
              />
              {touched.mobile && errors.mobile && <small className="text-danger form-text">{errors.mobile}</small>}
            </div>

            {errorMessage && (
              <Col sm={12}>
                <Alert variant="danger">{errorMessage}</Alert>
              </Col>
            )}

            <Row>
              <Col>
                <Button className="btn-block mb-4" disabled={isSubmitting} type="submit" variant="primary">
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Sending...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </Col>
            </Row>
          </form>
        )}
      </Formik>
    </>
  );
};

export default JWTLogin;

// import React, { useState } from 'react';
// import { Row, Col, Alert, Button } from 'react-bootstrap';
// import * as Yup from 'yup';
// import { Formik } from 'formik';
// import { useNavigate } from 'react-router-dom';
// import axiosInstance from 'axiosInstance';

// const JWTLogin = () => {
//   const navigate = useNavigate();
//   const [errorMessage, setErrorMessage] = useState('');

//   return (
//     <>
//       <Formik
//         initialValues={{
//           mobile: '',
//           submit: null
//         }}
//         validationSchema={Yup.object().shape({
//           mobile: Yup.string()
//             .matches(/^[0-9]{10}$/, 'Invalid mobile number (must be 10 digits)')
//             .required('Mobile number is required'),
//         })}
//         onSubmit={async (values, { setSubmitting, setErrors }) => {
//           try {
//             const response = await axiosInstance.post('/users/login', {
//               mobile: values.mobile,
//             });

//             // Check if user is superadmin
//             if (response.data.user?.role === 'superadmin') {
//               localStorage.setItem('mobile', values.mobile);
//               navigate('/verify-otp');
//             }
//             // Handle non-superadmin users
//             else {
//               setErrorMessage('Access restricted to superadmin users only');
//             }
//           } catch (err) {
//             // Handle API errors
//             setErrorMessage(err.response?.data?.message || 'Login failed. Please try again.');
//             setErrors({ submit: err.message });
//           } finally {
//             setSubmitting(false);
//           }
//         }}
//       >
//        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
//     <form noValidate onSubmit={handleSubmit}>
//       <div className="form-group mb-3">
//         <input
//           className="form-control"
//           name="mobile"
//           onBlur={handleBlur}
//           onChange={handleChange}
//           type="text"
//           value={values.mobile}
//           placeholder="Enter your mobile number"
//         />
//         {touched.mobile && errors.mobile && <small className="text-danger form-text">{errors.mobile}</small>}
//       </div>

//       {errorMessage && (
//         <Col sm={12}>
//           <Alert variant="danger">{errorMessage}</Alert>
//         </Col>
//       )}

//       <Row>
//         <Col>
//           <Button
//             className="btn-block mb-4"
//             disabled={isSubmitting}
//             type="submit"
//             variant="primary"
//           >
//             {isSubmitting ? (
//     <>
//       <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
//       Sending...
//     </>
//   ) : (
//     'Send OTP'
//   )}
//           </Button>
//         </Col>
//       </Row>
//     </form>
//   )}
//       </Formik>
//     </>
//   );
// };

// export default JWTLogin;
