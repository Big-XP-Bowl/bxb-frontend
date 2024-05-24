import style, { styled } from "styled-components";
import BowlingColors from "./BowlingColors";

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
  z-index: -100;

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

const HeroCard = styled.div`
  position: relative;
  background-size: cover;
  background-position: center;
  background-color: ${BowlingColors.ThirdColor};
  height: auto;
  min-height: 100vh;
  justify-content: center;
  align-items: center;
  color: #fff;
  object-fit: cover;
  padding: 2rem;
  z-index: 1;
`;

const Card2Grid = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  max-width: 1200px;
`;

const Card2 = styled.div`
  background: #fff;
  min-width: 300px;
  border-radius: 10px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  width: 30%;
  padding: 20px;
  text-align: center;

  img {
  width: 100%;
  height: 200px; /* Set a fixed height */
  object-fit: cover; /* Maintain aspect ratio and cover the given area */
  border-radius: 10px;
  margin-bottom: 15px;
  }
`;

const Card2Breakline = styled.hr`
  border: 0;
  height: 1px;
  background: #333;
  background-image: linear-gradient(to right, #ccc, #333, #ccc);
  margin: 20px 0;
  `;

const Card2Title = styled.h2`
  font-size: 1.5em;
  margin-bottom: 10px;
`;

const Card2Info = styled.p`
  font-size: 1.2em;
  margin-bottom: 10px;
`;

const Card2Details = styled.p`
  font-size: 0.8em;
  margin-bottom: 10px;
`;


export { Card1, HeroVideoCard, HeroCard, Card2Grid, Card2, Card2Breakline, Card2Title, Card2Details, Card2Info};
