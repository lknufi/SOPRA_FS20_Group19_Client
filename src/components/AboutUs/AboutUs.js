import React from 'react';
import styled from 'styled-components';
import {BaseContainer} from '../../helpers/layout';
import {api, handleError} from '../../helpers/api';
import {withRouter} from 'react-router-dom';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Carousel from "../../views/AboutUs/Carousel"
//import { Carousel } from 'react-responsive-carousel';
import HeaderForAboutUs from "../../views/AboutUs/HeaderForAboutUs";
import LogoutIcon from "../../views/variables/LogoutIcon.svg"
const BackgroundContainer = styled(BaseContainer)`
  min-height: 620px;
`;

const MainContainer = styled.div`
  color: #94BFE9;
  background: #94BFE9;
  flex-direction: row;
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
`;


const Container2 = styled.div`
  width: 100%;
  position: absolute;
  padding-top: 2%;
  padding-left: 15%;
  padding-right: 15%;
  left: 0%;
  background: #94BFE9;
`;

const BackgroundContainerAboutUs = styled.div`
   background-color: #94BFE9;
   width: 100%;
   height: 100%;
   background-repeat: repeat;
   justify-content: center;
`;

const ButtonContainer = styled.div`
  display: top-right;
  justify-content: top-right;
  margin-top: 0px;
  min-width: 240px;
`;

const ReturnToMapButton = styled.div`
  &:hover {
    transform: translateY(-2px);
  }
  padding: 0px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  transition: all 0.3s ease;
`;

// This component is responsible for the about us page
class AboutUs extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    render() {
        return (
            <MainContainer>
            <BackgroundContainerAboutUs>
                <HeaderForAboutUs/>
                <ButtonContainer>
                    <ReturnToMapButton
                        onClick={() => {
                            this.props.history.push(`/map`);
                        }}
                    >
                        <img src={LogoutIcon} width="4%" heigth= "4%"/>
                    </ReturnToMapButton>
                </ButtonContainer>
                <Container2>
                <Carousel/>
                </Container2>
            </BackgroundContainerAboutUs>
            </MainContainer>

        )
    }
}

export default withRouter(AboutUs);