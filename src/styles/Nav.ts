import styled from "styled-components";

const Nav = styled.div`
  background-color: #1999;
  overflow: hidden;
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  z-index: 1000;
  margin: 0;

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
    ul {
      flex-direction: column;
      align-items: center;
    }

    li {
      padding: 0.5rem;
    }
  }

  @media (max-width: 480px) {
    ul {
      flex-direction: column;
      align-items: center;
    }

    li {
      padding: 0.25rem;
    }
  }
`;

export default Nav;
