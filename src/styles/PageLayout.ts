import { styled } from "styled-components";

const PageLayout = styled.div`
  height: 100vh;
  justify-content: center;
  align-items: center;
  padding: 5rem;
`;

const ContentGrid = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
    
  @media (max-width: 768px) {
    flex-direction: column;
  }

  @media (max-width: 1024px) {
    flex-direction: column;
  }

  @media (max-width: 1440px) {
    flex-direction: column;
  }

`;

const ContentBox = styled.div`
display: flex;
justify-content: center;
align-items: center;
justify-items: center;
padding: 1rem;
`;

export {PageLayout, ContentGrid, ContentBox};