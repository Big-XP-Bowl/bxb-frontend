import HERO from "/HERO.mp4";
import { HeroCard, HeroVideoCard } from "../styles/Cards";
import Activities from "./Activities";
import About from "./About";
import Products from "./Products";

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
        }}
      >
        <h1>VELKOMMEN TIL FEIN BOWLINGHAL</h1>
      </HeroCard>

      <HeroCard id="about">
        <About />
      </HeroCard>
      <HeroCard id="activities">
        <Activities />
      </HeroCard>
      <HeroCard id="products">
        <Products />
      </HeroCard>
    </>
  );
};

export default Home;
