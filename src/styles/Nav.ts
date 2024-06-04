// src/styles/Nav.ts
import styled from "styled-components";

const Nav = styled.div<{ menuOpen: boolean }>`
  background-color: #1999;
  overflow: hidden;
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  margin: 0;
  // here we define the height of the navigation bar depending on vh so that it's only there if the user is on mobile device

  @media (max-width: 768px) {
    height: ${({ menuOpen }) => (menuOpen ? "100vh" : "60px")};
  }
  transition: height 0.3s ease;

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }

  .menu-icon {
    display: none;
  }

  ul {
    list-style-type: none;
    display: flex;
    justify-content: flex-end;
    padding: 0;
    margin: 0;
  }

  li {
    padding: 1rem;
  }

  a {
    text-decoration: none;
    color: #f9abab;
    outline: 1px solid transparent;
    outline-offset: 2px;

    &:hover {
      color: #d9d9d9;
    }

    &:active {
      color: #f9abab;
    }
  }

  @media (max-width: 768px) {
    .menu-icon {
      display: block;
      cursor: pointer;
    }

    ul {
      flex-direction: column;
      align-items: center;
      position: absolute;
      top: 60px;
      left: 0;
      width: 100%;
      height: calc(100vh - 60px);
      background-color: #1999;
      display: none;
    }

    ul.nav-menu.active {
      display: flex;
    }

    li {
      padding: 0.5rem;
    }
  }

  @media (max-width: 480px) {
    li {
      padding: 0.25rem;
    }
  }
`;

export default Nav;
