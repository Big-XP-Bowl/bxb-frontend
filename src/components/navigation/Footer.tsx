import styled from "styled-components";

const FooterContainer = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
  padding: 1rem;
`;

export default function Footer() {
  return (
    <FooterContainer>
      <p>&copy; hjemmeside vedligeholdes af Ukendt Gruppe</p>
    </FooterContainer>
  );
}