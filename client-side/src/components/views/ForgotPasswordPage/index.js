import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Title from "antd/lib/typography/Title";
import { Button, Form, Icon, Input, notification } from "antd";
import { useHistory } from "react-router-dom";
import { USER_SERVER } from "../../Config";

const ForgotPasswordPage = () => {
  const history = useHistory();
  const [isOTPSent, setIsOTPSent] = useState(false);
  const [user, setUser] = useState({
    email: "",
    otp: ""
  });

  useEffect(() => {
    if (isOTPSent) {
      notification.success({
        message: "OTP Sent",
        description:
          "OTP to reset your password is sent successfully! Please check your email"
      });
    }
  }, [isOTPSent]);

  return isOTPSent ? (
    <Formik
      initialValues={{
        otp: ""
      }}
      validationSchema={Yup.object().shape({
        otp: Yup.string()
          .length(6, "Max length of OTP is 6")
          .required("OTP is required")
      })}
      onSubmit={(values, { setSubmitting }) => {
        if (values.otp === user.otp) {
          console.info("OTP Confirmed", values);
          setSubmitting(false);

          history.push({
            pathname: "/login/reset",
            state: {
              userEmail: user.email
            }
          });
        }
      }}
    >
      {({
        values,
        touched,
        errors,
        handleSubmit,
        handleChange,
        isSubmitting
      }) => (
        <div className='app'>
          <Title level={2}>Forgot Password</Title>
          <form onSubmit={handleSubmit} style={{ width: "350px" }}>
            <Form.Item required>
              <Input
                id='otp'
                placeholder='Confirm OTP'
                type='otp'
                value={values.otp}
                onChange={handleChange}
                className={
                  errors.otp && touched.otp ? "text-input error" : "text-input"
                }
              />
              {errors?.otp && (
                <div className='input-feedback'>{errors.otp}</div>
              )}
            </Form.Item>
            <div>
              <Button
                type='primary'
                htmlType='submit'
                className='login-form-button'
                style={{ minWidth: "100%" }}
                disabled={
                  isSubmitting ||
                  Object.keys(errors).length ||
                  !values?.otp?.length
                }
                onSubmit={handleSubmit}
              >
                Submit
              </Button>
            </div>
          </form>
        </div>
      )}
    </Formik>
  ) : (
    <Formik
      initialValues={{
        email: ""
      }}
      validationSchema={Yup.object().shape({
        email: Yup.string()
          .email("Email is invalid")
          .required("Email is required")
      })}
      onSubmit={(values, { setSubmitting }) => {
        console.log("OTP sent to:", values);

        axios
          .post(`${USER_SERVER}/getOTP`, {
            email: values.email
          })
          .then((res) => {
            setUser({
              email: values.email,
              otp: res?.data?.OTP
            });
            setIsOTPSent(true);
          })
          .catch((e) => {
            console.error(e);
          })
          .finally(() => {
            setSubmitting(false);
          });
      }}
    >
      {({
        values,
        touched,
        errors,
        handleSubmit,
        handleChange,
        isSubmitting
      }) => (
        <div className='app'>
          <Title level={2}>Forgot Password</Title>
          <form onSubmit={handleSubmit} style={{ width: "350px" }}>
            <Form.Item required>
              <Input
                id='email'
                prefix={
                  <Icon type='user' style={{ color: "rgba(0,0,0,.25)" }} />
                }
                placeholder='Enter your email'
                type='email'
                value={values.email}
                onChange={handleChange}
                className={
                  errors.email && touched.email
                    ? "text-input error"
                    : "text-input"
                }
              />
              {errors.email && (
                <div className='input-feedback'>{errors.email}</div>
              )}
            </Form.Item>
            <div>
              <Button
                type='primary'
                htmlType='submit'
                className='login-form-button'
                style={{ minWidth: "100%" }}
                disabled={
                  isSubmitting ||
                  Object.keys(errors).length ||
                  !values?.email?.length
                }
                onSubmit={handleSubmit}
              >
                Get OTP
              </Button>
            </div>
          </form>
        </div>
      )}
    </Formik>
  );
};

export default ForgotPasswordPage;
