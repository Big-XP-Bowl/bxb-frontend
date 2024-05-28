import styled from 'styled-components';

const Modal = styled.div`
  position: fixed;
  align-items: center;
  top: 20px;
  right: 20px;
  padding: 60px;
  background-color: lightgrey;
  opacity: 1;
  color: black;
  border-radius: 5px;
  z-index: 1001;
`;

const FormContainer = styled.form`
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
  display: block;
  font-weight: bold;
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

// import styled from 'styled-components';
// import {FaCheckCircle} from 'react-icons/fa';
// import DatePicker from "react-datepicker";

// export const FormContainer = styled.form`
//   display: flex;
//   flex-direction: column;
//   align-items: left;
//   border: none;
//   border-radius: 28px;
//   padding: 22px;
//   margin: 10px;
//   background-color: #F7F7F7;
//   width: 93%;
//   height: auto;
//   position: relative;
//   max-height: 500px; 
//   overflow-y: auto;
// `;

// const commonInputStyles = `
//   padding: 10px;
//   border: none;
//   background: #C2DFD3;
//   border-radius: 28px;
//   font-size: 16px;
//   color: inherit;
//   margin-bottom: 20px;
//   box-shadow: 0 1px 3px rgba(40, 36, 36, 0.12), 0 1px 2px rgba(78, 77, 77, 0.24);
//   width: 97%
// `;

// export const FormInput = styled.input`
//   ${commonInputStyles}
// `;

// export const StyledDatePicker = styled(DatePicker)`
//   ${commonInputStyles}
// `;

// export const FormTitle = styled.h2`
//   font-size: 24px;
//   margin-bottom: 40px;
// `;

// export const FormInputContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   margin-bottom: 10px;
// `;

// export const FormLabel = styled.label`
//   display: block;
//   font-size: 16px;
//   margin-bottom: 5px;
//   font-weight: bold;
//   text-align: left;
// `;

// export const FormIcon = styled.div`
//   position: absolute;
//   bottom: -1.2rem;
//   right: -0.5rem;
//   background-color: transparent;
//   font-size: 2rem;
//   cursor: pointer;
//   outline: none;
// `;

// export const CheckIcon = styled(FaCheckCircle)`
//   color: #2b2b2b;
// `;

// export const SubmitButton = styled.button`
//   position: relative;
//   background-color: #C2DFD3;
//   border: none;
//   border-radius: 28px;
//   font-size: large;
//   padding: 1rem;
//   font-weight: bold;
//   margin: 1rem auto;
//   display: block;
//   width: ${({ adaptiveWidth }) => adaptiveWidth ? 'auto' : '30%'};
//   box-shadow: 0 0.5px 1px rgba(40, 36, 36, 0.12), 0 1px 2px rgba(78, 77, 77, 0.24);
//   transition: 300ms linear;
//   cursor: pointer;

//   &:hover {
//     background-color: #2b2b2b;
//     color: #F7F7F7;
//     border-radius: 14px;
//   }
// `;

export { Modal, FormContainer, Form, InputContainer, Label, Input, ButtonContainer, HeaderContainer };