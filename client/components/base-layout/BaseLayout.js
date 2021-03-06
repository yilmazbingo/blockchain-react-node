import React from "react";
import Header from "../header/Header";
import "./base-layout.style.scss";
const BaseLayout = (props) => {
  const { children, className, headerType } = props;
  return (
    <React.Fragment>
      <div>
        <Header headerType={headerType}></Header>
        <main className={`baselayout ${className}`}>{children}</main>
      </div>
    </React.Fragment>
  );
};

export default BaseLayout;
