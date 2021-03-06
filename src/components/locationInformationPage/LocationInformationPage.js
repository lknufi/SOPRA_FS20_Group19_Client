import React from 'react';
import styled from 'styled-components';
import {api, handleError} from '../../helpers/api';
import {Button} from '../../views/variables/Button';
import {withRouter} from 'react-router-dom';
import SidebarInfoAndAddLocation from "../../views/InformationPage/SidebarInfoAndAddLocation";
import LocationInformation from "../../views/InformationPage/LocationInformation";
import LocationRating from "../../views/InformationPage/LocationRating";
import Chatbox from "../../views/InformationPage/Chatbox";
import Location from "../shared/models/Location";
import InformationHeader from "../../views/InformationPage/InformationHeader";
import Spinner from "react-bootstrap/Spinner";

const Container = styled.div`
  color: black;
  flex-direction: row;
  width: 100%;
  display: grid;
  grid-template-columns: auto auto 10%;
  grid-template-rows: auto auto auto auto auto;
  justify-content: left;
  grid-column-gap: 50px;
  margin-left: 20px;
  @media only screen and (max-width: 1215px){
    grid-column-gap: 25px;
  }

  @media only screen and (max-width: 900px){
    max-width: 800;
    display: block;
    margin-left: 15px;
  }
  @media only screen and (max-width: 800px){
    max-height: 88%;
    overflow: scroll;
    position: absolute;
    top: 0%;
  }
  @media only screen and (max-width: 500px){
    max-width: 500;
    display: block;
    margin-left: 0px;
  }
`;

const LoadingContainer = styled.div`
  height: 100%;
  width: 100%;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 1;
  position: absolute;
  top: 0;
  right: 0;
  padding-top: 0px;
`;

const ButtonSpinner = styled.button`
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
  }
`;

// This component is responsible for the edit profile page
class LocationInformationPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locationToBeShown: null,
            location: null,
            additionalInformation: null
        };
        this.getCurrentLocation();
    }

    // Get all the needed Information about the selected Location
    async getCurrentLocation() {
        try {
            const url = '/locations/' + this.props.match.params.locationId;
            const response = await api.get(url);

            const location = new Location(response.data);
            const additionalInformation = response.data.additionalInformation.map((textLine) => <li>{textLine}</li>);
            // Get the returned location and update the state.
            this.setState({locationToBeShown: location});
            this.setState({location: response.data, additionalInformation: additionalInformation});
        } catch (error) {
            alert(`Something went wrong while fetching the locations: \n${handleError(error)}`);
        }
    }

    // renders the page
    render() {
        return (
            <div>
                {!this.state.locationToBeShown ? (<LoadingContainer><ButtonSpinner variant="primary" disabled>
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                    Loading Location...
                </ButtonSpinner></LoadingContainer>) : (
                    <div>
                        <SidebarInfoAndAddLocation avatarNr={localStorage.getItem("userAvatar")} column={3}/>
                        <Container>
                            <InformationHeader type={this.state.locationToBeShown.locationType}
                                               locationId={this.props.match.params.locationId}/>
                            <LocationInformation
                                location={this.state.location}
                                id={this.state.locationToBeShown.id}
                                address={this.state.locationToBeShown.address}
                                information={this.state.additionalInformation}
                                longitude={this.state.locationToBeShown.longitude}
                                latitude={this.state.locationToBeShown.latitude}
                                coordinates={this.state.locationToBeShown.coordinates}
                            />
                            <LocationRating locationId={this.props.match.params.locationId}/>
                            <Chatbox locationId={this.props.match.params.locationId}/>

                        </Container>
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(LocationInformationPage);
