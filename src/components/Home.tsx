import HERO from "/HERO.mp4";
import { HeroVideoCard } from "../styles/Cards";

const Home = () => {
  return (
    <>
      <HeroVideoCard>
        <video autoPlay muted loop>
          <source src={HERO} type="video/mp4" />
        </video>
      </HeroVideoCard>
    </>
  );
};

export default Home;
