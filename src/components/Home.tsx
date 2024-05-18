import HERO from "../../public/HERO.mp4";
import { HeroVideoCard } from "../styles/Cards";


const Home = () => {
  return (
    <>
    <HeroVideoCard>
      <video autoPlay muted loop id="myVideo">
        <source src={HERO} type="video/mp4" />
      </video>
    </HeroVideoCard>
    </>
  );
}


export default Home;