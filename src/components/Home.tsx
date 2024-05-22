import HERO from "/HERO.mp4";
import { HeroCard, HeroVideoCard } from "../styles/Cards";
import Activities from "./Activities";
import About from "./About";
import Products from "./Products";
import { PageLayout } from "../styles/PageLayout";

const Home = () => {
  return (
    <>
      <HeroVideoCard>
        <video autoPlay muted loop>
          <source src={HERO} type="video/mp4" />
        </video>
      </HeroVideoCard>
      <PageLayout>
      <HeroCard></HeroCard>

      <Products />
      <HeroCard>
        <About />
      </HeroCard>
      <Activities />
      </PageLayout>
    </>
  );
};

export default Home;
