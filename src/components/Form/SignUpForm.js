import "./signup-form.css";

import * as Yup from "yup";

import React from "react";
import { useFormik } from "formik";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Must be a valid email")
    .required("Email is required")
    .default(""),
  password: Yup.string()
    .required("Please enter your password")
    .matches(
      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
      "Password must contain at least 8 characters, one uppercase, one number and one special case character"
    )
    .default(""),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .default(""),
  petName: Yup.string().required("Please enter a name").default(""),
  petWeight: Yup.number()
    .typeError("Weight must be a number")
    .min(3)
    .max(180)
    .required("Weight must be at least 3 lbs or a max weight of 180 lbs")
    .default(3),
  idealPetWeight: Yup.number()
    .typeError("Weight must be a number")
    .min(3)
    .max(180)
    .default(3),
});

export default function SignUpForm() {
  const formik = useFormik({
    initialValues: validationSchema.cast(),
    validationSchema,
    onSubmit: async (values, onSubmitProps) => {
      onSubmitProps.setSubmitting(true);
      try {
        const res = await fetch(
          "https://5r2cql08l4.execute-api.us-east-1.amazonaws.com/register",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: values.email,
            }),
          }
        );
        const json = await res.json();
        if (res.status >= 400) {
          throw new Error(
            json.message ? json.message : "Something went wrong. Try Again!"
          );
        }
        onSubmitProps.resetForm();
      } catch (error) {
        window.alert(error.message);
      } finally {
        onSubmitProps.setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="form">
      <label htmlFor="email">Email:</label>
      <input
        id="email"
        type="email"
        className="input-container"
        {...formik.getFieldProps("email")}
      />
      {formik.touched.email && formik.errors.email ? (
        <p className="error">{formik.errors.email}</p>
      ) : null}
      <label htmlFor="password">Password:</label>
      <input
        id="password"
        type="password"
        className="input-container"
        {...formik.getFieldProps("password")}
      />
      {formik.touched.password && formik.errors.password ? (
        <p className="error">{formik.errors.password}</p>
      ) : null}
      <label htmlFor="confirmPassword">Confirm Password:</label>
      <input
        id="confirmPassword"
        type="password"
        className="input-container"
        {...formik.getFieldProps("confirmPassword")}
      />
      {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
        <p className="error">{formik.errors.confirmPassword}</p>
      ) : null}
      <label htmlFor="petName">Pet Name</label>
      <input
        id="petName"
        type="text"
        className="input-container"
        {...formik.getFieldProps("petName")}
      />
      {formik.touched.petName && formik.errors.petName ? (
        <p className="error">{formik.errors.petName}</p>
      ) : null}
      <label htmlFor="petWeight">Pet Weight</label>
      <input
        id="petWeight"
        type="text"
        className="input-container"
        {...formik.getFieldProps("petWeight")}
      />
      {formik.touched.petWeight && formik.errors.petWeight ? (
        <p className="error">{formik.errors.petWeight}</p>
      ) : null}
      <label htmlFor="idealPetWeight">Ideal Pet Weight</label>
      <input
        id="idealPetWeight"
        type="text"
        className="input-container"
        {...formik.getFieldProps("idealPetWeight")}
      />
      {formik.touched.idealPetWeight && formik.errors.idealPetWeight ? (
        <p className="error">{formik.errors.idealPetWeight}</p>
      ) : null}
      <button type="submit" disabled={!formik.isValid || formik.isSubmitting}>
        Submit
      </button>
    </form>
  );
}
