import React from "react";
import "./button.style.scss";

const Button = ({ children, onClick }) => {
  return <button onClick={onClick}> {children}</button>;
};

export default Button;
