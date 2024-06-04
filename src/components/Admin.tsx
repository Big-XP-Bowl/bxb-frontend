import { useNavigate } from "react-router-dom";
import { Grid2 } from "../styles/Grids";
import { Card2, Card2Breakline, Card2Title, Card2Details, Card2Info } from '../styles/Cards';
import { PageLayout } from "../styles/PageLayout";
import { useAuth } from "../security/AuthProvider";

const AdminPage = () => {
  const navigate = useNavigate();
  const { isLoggedInAs } = useAuth();
  return (

    <PageLayout>
      <h2>Admin</h2>
      {isLoggedInAs(["ADMIN", "BAR", "USER"]) && ( 
        
      <Grid2>
   
     
          <Card2>
            <Card2Title>Reservationer</Card2Title>
            <img
              src={'https://images.pexels.com/photos/344034/pexels-photo-344034.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
              alt={'reservation_img'}
              onError={(error) => console.error('Image failed to load:', error)}
            />
            <Card2Breakline />
            <Card2Details>
              <Card2Info> <button onClick={() => navigate("/reservations")}>Se alle Reservationer</button></Card2Info>
   
            </Card2Details>
          </Card2>

          <Card2>
            <Card2Title>Vedligehold</Card2Title>
            <img
              src={'https://images.pexels.com/photos/5952942/pexels-photo-5952942.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
              alt={'maintenance_img'}
              onError={(error) => console.error('Image failed to load:', error)}
            />
            <Card2Breakline />
            <Card2Details>
              <Card2Info> <button onClick={() => navigate("/maintenance")}>Vedligehold</button></Card2Info>
            </Card2Details>
          </Card2>

          <Card2>
            <Card2Title>Bar</Card2Title>
            <img
              src={'https://images.pexels.com/photos/17299780/pexels-photo-17299780/free-photo-of-closeup-of-beer-labels-in-a-row.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
              alt={'bar_img'}
              onError={(error) => console.error('Image failed to load:', error)}
            />
            <Card2Breakline />
            <Card2Details>
              <Card2Info> <button onClick={() => navigate("/products")}>Bar</button></Card2Info>
            </Card2Details>
          </Card2>

          <Card2>
            <Card2Title>Medarbejdere</Card2Title>
            <img
              src={'https://images.pexels.com/photos/3184396/pexels-photo-3184396.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
              alt={'employees_img'}
              onError={(error) => console.error('Image failed to load:', error)}
            />
            <Card2Breakline />
            <Card2Details>
              <Card2Info><button onClick={() => navigate("/employees")}>Medarbejdere</button></Card2Info>
            </Card2Details>
          </Card2>
         
          <Card2>
            <Card2Title>Vagtplan</Card2Title>
            <img
              src={'https://images.pexels.com/photos/636246/pexels-photo-636246.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
              alt={'employees_img'}
              onError={(error) => console.error('Image failed to load:', error)}
            />
            <Card2Breakline />
            <Card2Details>
              <Card2Info><button onClick={() => navigate("/schedule")}>Skema</button></Card2Info>
            </Card2Details>
          </Card2>

        </Grid2>
      )} 
    </PageLayout>
  );
}

export default AdminPage;