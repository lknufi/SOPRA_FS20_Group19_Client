import styled from "styled-components";

export const Button = styled.button`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 6px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: #003068;
  width: ${props => props.width || null};
  height: 35px;
  border: 2px solid #003068;
  border-radius: 5px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: #66A3E0;
  transition: all 0.3s ease;
  @media only screen and (max-width: 700px){
    font-size: 10px;
    height: 25px;
    padding: 3px;
    border: 1.5px solid #003068;
  }
  @media only screen and (max-width: 500px){
    font-size: 10px;
    height: 25px;
    padding: 3px;
    border: 1.5px solid #003068;
    width: 130px;
  }
`;
