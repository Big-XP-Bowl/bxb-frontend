import { useEffect, useState } from "react";
import { IActivity } from "../types/types";
import useActivities from "../hooks/useActivities";
import { Card2, Card2Breakline, Card2Title, Card2Details, Card2Info,  } from '../styles/Cards';
import { PageLayout } from "../styles/PageLayout";

const Activities = () => {
  const { activities, fetchActivities } = useActivities();
  const [selectedType, setSelectedType] = useState<string>("");
  const filteredActivities = activities.filter(
    (activity) => activity.type === selectedType
  );

  const handleCardTypeClick = (type: string) => {
    setSelectedType(type);
  };

  useEffect(() => {
    // Fetch activities only once on initial render
    fetchActivities();
  }, []);

  const ActivityCard = ({ activity }: { activity: IActivity }) => {
    return (
      <Card2 key={activity.id} style ={{  backgroundColor: activity.closed ? '#f9abab' : '#fff'}}>
        <Card2Title>{activity.name}</Card2Title>
        {activity.type === "BowlingLane" ? (
          <img
            src={'https://images.pexels.com/photos/344029/pexels-photo-344029.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
            alt={activity.name}
            onError={(error) => console.error("Image failed to load:", error)} 
          />
        ) : activity.type === "Airhockey" ? (
          <img
            src={'https://images.pexels.com/photos/7234454/pexels-photo-7234454.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
            alt={activity.name}
            onError={(error) => console.error("Image failed to load:", error)}
          />
        ) : activity.type === "DiningTable" ? (
          <img
            src={'https://images.pexels.com/photos/2264036/pexels-photo-2264036.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
            alt={activity.name}
            onError={(error) => console.error("Image failed to load:", error)}
          />  
        ) : null}
        <Card2Details>
          {activity.closed ? "Lukket" : "Åben"}
        </Card2Details>
        <Card2Breakline />
        {activity.type === 'Airhockey' && (
                <>
                  <Card2Info>40 kr. pr. 30 min. </Card2Info>
                </>
              )}
              {activity.type === 'BowlingLane' && (
                <>
                  <Card2Info>100 kr. pr. time</Card2Info>
                </>
              )}
              {activity.type === 'DiningTable' && (
                <>
                  <Card2Info>200 kr. pr. person</Card2Info>
                  <Card2Info>120 kr. for børn under 12 år</Card2Info>
                  <Card2Info>Børn under 3 år gratis </Card2Info>
                </>
              )}
        <Card2Details>{activity.capacity} personer | {activity.duration} min.</Card2Details>
      </Card2>
    );
  };// Empty dependency array ensures fetching only once

  return (
    <PageLayout> 
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <button
          onClick={() => handleCardTypeClick("BowlingLane")}
          style={{
            backgroundColor: selectedType === "BowlingLane" ? "#f0f0f0" : "white",
            padding: "200px 160px",
            borderRadius: "5px",
            border: "1px solid white",
            cursor: "pointer",
            backgroundImage: 'url("https://images.pexels.com/photos/344029/pexels-photo-344029.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
            backgroundSize: 'cover',
          }}
        >
        <h1 style={{position: 'relative', color: 'white'}}>Bowling</h1>
        </button>

  
        <button
          onClick={() => handleCardTypeClick("Airhockey")}
          style={{
            backgroundColor: selectedType === "Airhockey" ? "#f0f0f0" : "white",
            padding: "200px 160px",
            borderRadius: "5px",
            border: "1px solid white",
            cursor: "pointer",
            backgroundImage: 'url("https://images.pexels.com/photos/7234454/pexels-photo-7234454.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
            backgroundSize: 'cover',
          }}
        >
          <h1 style={{position: 'relative', color: 'white'}}>Air Hockey</h1>
        </button>
        <button
          onClick={() => handleCardTypeClick("DiningTable")}
          style={{
            backgroundColor: selectedType === "DiningTable" ? "#f0f0f0" : "white",
            padding: "200px 160px",
            borderRadius: "5px",
            border: "1px solid white",
            cursor: "pointer",
            backgroundImage: 'url("https://images.pexels.com/photos/1850595/pexels-photo-1850595.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")',
            backgroundSize: 'cover',
          }}
        >
          <h1 style={{position: 'relative', color: 'white'}}>Restaurant</h1>
        </button>
      </div>
      {selectedType ? (
        <div>
          <h2></h2>
          <div style={{display: "flex", flexWrap: "wrap", justifyContent: "space-around", alignItems: "center", gap: "20px"  }}>
            {filteredActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </div>
      ) : (
        <p></p>
      )}
    </PageLayout>
  );
};

export default Activities;

  