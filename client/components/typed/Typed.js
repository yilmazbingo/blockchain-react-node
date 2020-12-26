import React, { Component } from "react";
import Typed from "react-typed";

const TechStack = () => {
  return (
    <Typed
      strings={["Blockchain", "React", "Webpack", "Node.js", "Redis"]}
      typeSpeed={40}
      backSpeed={50}
      attr="placeholder"
      loop
    >
      <input type="text" />
    </Typed>
  );
};

export default TechStack;
