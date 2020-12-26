import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import "./navbar.scss";

const NavBar = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/wallet">Wallet</NavLink>
      <NavLink to="/blocks">Blocks</NavLink>
      <NavLink to="/transactions-pool">Transactions-Pool</NavLink>
    </nav>
  );
};

export default NavBar;
