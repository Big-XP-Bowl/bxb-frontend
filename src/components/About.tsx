import { PageLayout } from "../styles/PageLayout";
import { Card2Breakline, Card2Title, Card2Details, Card2Info,  } from '../styles/Cards';
import { FaPhone, FaEnvelope } from "react-icons/fa";
import styled from "styled-components";

const Card4 = styled.div`
  background: none;
  min-width: 300px;
  min-height: 400px;
  border-radius: 10px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  width: 30%;
  padding: 20px;
  text-align: left;

  img {
  width: 100%;
  height: 200px; /* Set a fixed height */
  object-fit: cover; /* Maintain aspect ratio and cover the given area */
  border-radius: 10px;
  margin-bottom: 15px;
  }
`

export default function About() {
  return (
    <PageLayout>
      <h1
          style={{
            fontSize: "3rem",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            margin: 0,
            paddingBottom: '50px'
          }}
        >
        FEIN BOWLINGHAL
      </h1>
       <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-around", alignItems: "center", gap: "20px", minHeight: '200px'  }}>
        <Card4>
          <Card2Title>Om Os</Card2Title>
          <Card2Breakline />
 
            <Card2Info>Vores bowling er baseret på et værdisæt, der sætter fællesskab,
                behagelige omstændigheder og plads til prima bowling i højsædet</Card2Info>
                 
            <Card2Info>Vi glæder os til at tage i mod jeres selskab for sammen at skabe en uforglemmelig oplevelse</Card2Info>
        </Card4>
        <Card4>
          <Card2Title>Åbningstider</Card2Title>
          <Card2Breakline />
            <Card2Details>Mandag - Søndag</Card2Details>
            <Card2Info>10:00 - 22:00</Card2Info>
            <Card2Breakline />

            <Card2Details>Bowling Bane 1 - 14 Er reserveret til vores bowling klub Big Bowlsers hverdage</Card2Details>
            <Card2Info>10:00 - 17:00</Card2Info>
        </Card4>
        <Card4>
          <Card2Title>Reservationer</Card2Title>
          <Card2Breakline />
            <Card2Info>Vi tager imod reservationer pr. telefon i åbningstiden</Card2Info>
            <div style={{display: "flex", gap: "10px",  alignItems: "center"}}>
            <FaPhone size={24} /><Card2Info>11 26 78 31</Card2Info>
            </div>
            <div style={{display: "flex", gap: "10px",  alignItems: "center"}}>
            <FaEnvelope size={24} style={{paddingTop: '0.8em'}} /><Card2Info>kontakt@bxb.dk</Card2Info>
            </div>
        </Card4>
        </div>
    </PageLayout>
    
  );


}
