import styled from 'styled-components';

const Modal = styled.div`
  position: fixed;
  align-items: center;
  top: 20px;
  right: 20px;
  padding: 60px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 5px;
  z-index: 1001;
`;

const FormContainer = styled.div`
  margin: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const InputContainer = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 10px;
`;

const Label = styled.label`
  grid-column: 1;
  justify-self: end;
`;

const Input = styled.input`
  grid-column: 2;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export { Modal, FormContainer, Form, InputContainer, Label, Input, ButtonContainer, HeaderContainer };