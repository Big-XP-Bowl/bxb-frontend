import style, { styled } from "styled-components";

const Card1 = style.div`
  padding: 1rem;
  margin: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  color: #333;
`;

const HeroVideoCard = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 101%;
  overflow: hidden;
  z-index: -1;

  video {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: translate(-50%, -50%);
    opacity: 0.85;
  }
`;

export { Card1, HeroVideoCard };
