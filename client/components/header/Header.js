import React from "react";
import NavBar from "../navbar/NavBar";
// import "./header.style.scss";
import {
  StyledLogo,
  Github,
  HeaderContainer,
  StyledImage,
  Brand,
  GithubLink,
} from "./header.styled";

const Header = ({ headerType }) => {
  const url = `${document.location.origin}`;

  return (
    <HeaderContainer headerType={headerType}>
      <div>
        <Brand>BINGOCHAIN</Brand>

        <StyledLogo to="/">
          <StyledImage src="/images/logo.gif" alt="graphql-icon" />
        </StyledLogo>
      </div>

      <NavBar />

      <GithubLink
        href="https://github.com/yilmazbingo/react-graphql-express"
        target="_blank"
      >
        <Github />
      </GithubLink>
    </HeaderContainer>
  );
};

export default Header;

// return (
//   <header className={`${headerType}` ? "header-home" : "header"}>
//     <Link to="/">
//       <img className="img" src="/images/graphql.jpeg" alt="graphql-icon" />
//     </Link>

//     <a href={url}>
//       <h4>GraphQL-Server</h4>
//     </a>
//     <a
//       href="https://github.com/yilmazbingo/react-graphql-express"
//       target="_blank"
//     >
//       <AiOutlineGithub className="github-icon" />
//     </a>
//   </header>
// );
