import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { AiOutlineGithub } from "react-icons/ai";

export const HeaderContainer = styled.header`
  display: flex;
  color: ${(props) => (props.headerType ? "blue" : " white")};
  align-items: center;
  /* height: ${(props) => (props.headerType ? "null" : "15vh")}; */
  height:13vh;
  justify-content:space-evenly;
  div:nth-child(1){
    display:flex;
    flex-direction:column;
    align-items:center;
  }
  
  
`;

export const StyledLogo = styled(Link)`
  height: 4rem;
  /* width: 7rem; */
  background-position: center;
  /* border-radius: 50%; */
`;

export const Github = styled(AiOutlineGithub)`
  height: 3rem;
  width: 3rem;
  color: white;
`;

export const Brand = styled.p`
  text-align: center;
  margin: 0 0;
`;

export const GithubLink = styled.a`
  /* right: 5%; */
  color: green;
`;
export const StyledImage = styled.img`
  height: 4rem;
  width: 6rem;
  background-position: center;
  border-radius: 50%;
`;
