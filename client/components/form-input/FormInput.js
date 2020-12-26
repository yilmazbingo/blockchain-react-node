import React from "react";

import "./form-input.styles.scss";

const FormInput = (props) => {
  console.log("props input", props);
  const {
    meta: { touched, error },
    input,
  } = props;
  return (
    <section className="group">
      <input className="form-input" {...input} autoComplete="off" />
      <p> {touched && error ? error : ""}</p>
    </section>
  );
};

export default FormInput;
