import styled from "styled-components";

const WavesSection = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  padding-bottom: 50px;
`;
const WaveWrapperTop = styled.div`
  position: static;
  top: 0;
  width: 100%;
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
`;
const WaveWrapperBottom = styled.div`
  position: static;
  bottom: 0;
  width: 100%;
  z-index: 100;
  svg {
    display: block;
    width: 100%;
    height: auto;
  }
`;

export { WavesSection, WaveWrapperTop, WaveWrapperBottom };
