import { styled } from "styled-components";

const PageLayout = styled.div`
  height: 100vh;
  justify-content: center;
  align-items: center;
  padding: 5rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 80%;
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

const ProductContentBox = styled.div`
  background-color: white;
  border: 1px solid black;
  padding: 1rem;
  border-radius: 5px;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

const CartContentBox = styled.div`
  background-color: white;
  border: 1px solid black;
  padding: 1rem;
  border-radius: 5px;

  @media (max-width: 768px) {
    margin-bottom: 2rem;
  }
`;

export { PageLayout, ContentGrid, ContentBox, ProductContentBox, CartContentBox };