import { Formik } from "formik";
import * as Yup from "yup";
import React, { useEffect } from "react";
import Title from "antd/lib/typography/Title";
import { Button, Form, Input, notification } from "antd";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { USER_SERVER } from "../../Config";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 }
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 }
  }
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0
    },
    sm: {
      span: 16,
      offset: 8
    }
  }
};

const ResetPasswordPage = () => {
  const history = useHistory();
  const location = useLocation();

  const showPasswordResetToast = () => {
    notification.success({
      message: "Password Reset",
      description: "Your password is reset successfully! Please login"
    });
  };

  return (
    <Formik
      initialValues={{
        password: "",
        confirmPassword: ""
      }}
      validationSchema={Yup.object().shape({
        password: Yup.string()
          .min(6, "Password must be at least 6 characters")
          .required("Password is required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref("password"), null], "Passwords must match")
          .required("Confirm Password is required")
      })}
      onSubmit={(values, { setSubmitting }) => {
        axios
          .put(`${USER_SERVER}/changePass`, {
            email: location.state.userEmail,
            password: values.password
          })
          .then((res) => {
            if (res.status === 200) {
              console.info("Password is reset:", values);
              showPasswordResetToast();
              history.push("/login");
            } else {
              console.error(res);
            }
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
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit
      }) => (
        <div className='app'>
          <Title level={2}>Reset Password</Title>
          <Form
            style={{ minWidth: "375px" }}
            {...formItemLayout}
            onSubmit={handleSubmit}
          >
            <Form.Item
              required
              label='Password'
              hasFeedback
              validateStatus={
                errors.password && touched.password ? "error" : "success"
              }
            >
              <Input
                id='password'
                placeholder='Enter your password'
                type='password'
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.password && touched.password
                    ? "text-input error"
                    : "text-input"
                }
              />
              {errors.password && touched.password && (
                <div className='input-feedback'>{errors.password}</div>
              )}
            </Form.Item>

            <Form.Item required label='Confirm' hasFeedback>
              <Input
                id='confirmPassword'
                placeholder='Enter your confirmPassword'
                type='password'
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={
                  errors.confirmPassword && touched.confirmPassword
                    ? "text-input error"
                    : "text-input"
                }
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <div className='input-feedback'>{errors.confirmPassword}</div>
              )}
            </Form.Item>

            <Form.Item {...tailFormItemLayout}>
              <Button
                onClick={handleSubmit}
                type='primary'
                disabled={
                  isSubmitting ||
                  !!Object.keys(errors).length ||
                  !values.confirmPassword ||
                  !values.password
                }
              >
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      )}
    </Formik>
  );
};

export default ResetPasswordPage;
