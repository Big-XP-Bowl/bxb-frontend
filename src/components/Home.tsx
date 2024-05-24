import HERO from "/HERO.mp4";
import { HeroCard, HeroVideoCard } from "../styles/Cards";
import Activities from "./Activities";
import About from "./About";
import {
  WavesSection,
  WaveWrapperTop,
  WaveWrapperBottom,
} from "../styles/Curves";
import { WaveTop, WaveBottom } from "../styles/Waves";

const Home = () => {
  return (
    <>
      <HeroVideoCard>
        <video autoPlay muted loop>
          <source src={HERO} type="video/mp4" />
        </video>
      </HeroVideoCard>
      <HeroCard
        id="home"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          color: "#f9abab",
          width: "102%",
          left: "-1%",
          top: "48px",
          background: "transparent",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            margin: 0,
          }}
        >
          VELKOMMEN TIL FEIN BOWLINGHAL
        </h1>
      </HeroCard>
      <WavesSection>
        <WaveWrapperTop>
          <WaveTop />
        </WaveWrapperTop>
        <HeroCard id="about">
          <About />
        </HeroCard>
        <WaveWrapperBottom>
          <WaveBottom />
        </WaveWrapperBottom>
      </WavesSection>
      <WavesSection>
        <WaveWrapperTop>
          <WaveTop />
        </WaveWrapperTop>
        <HeroCard id="activities">
          <Activities />
        </HeroCard>
        <WaveWrapperBottom>
          <WaveBottom />
        </WaveWrapperBottom>
      </WavesSection>
    </>
  );
};

export default Home;
