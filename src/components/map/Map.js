import React from "react";
import Sidebar from "../../views/Map/Sidebar";
import {Button} from '../../views/variables/Button';
import {withRouter} from 'react-router-dom';
import MapService from "./MapService";
import styled from "styled-components";
import {api, handleError} from "../../helpers/api";
import Spinner from "react-bootstrap/Spinner";
import User from "../shared/models/User";
import Weather from "../../views/variables/Weather";
import HeaderMap from "../../views/Map/HeaderMap";

const Container = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  opacity: 1;
  padding-top: 0px;
  flex-direction: column;
  position:absolute;
`;

const WeatherContainer = styled.div`
    border-style: solid;
    border-radius: 5px;
    padding: 15px;
    margin: 10px;
    color: #003068;
    background-color: rgba(194,218,243,1);
`;

const MapContainer = styled.div`
  height: 100vh;
  width: 100vm;
  @media only screen and (max-width: 800px){
    height: 83vh;
    width: 100vm;
  }
`;

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locationsShown: null,
            currentPosition: [],
            currentCenter: [47.366950, 8.547200],
            loggedInUserId: localStorage.getItem("userId"),
            loggedInUser: new User(),
            loading: false,
            filterSpinner: false,
            zoom: 15,
        };
        this.firstTimeLoadingMap();
        this.getFilteredLocations();
        this.getFilteredLocations = this.getFilteredLocations.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.getCoordinates = this.getCoordinates.bind(this);
        this.getLocation();
        this.getUser();
    }

    firstTimeLoadingMap() {
        if (!localStorage.getItem("firstTime")) {
            localStorage.setItem('showFountains', true);
            localStorage.setItem('showFireplaces', true);
            localStorage.setItem('showRecyclingStations', true);
            localStorage.setItem('showToilets', true);
            localStorage.setItem('showTableTennis', true);
            localStorage.setItem('showBenches', true);
            localStorage.setItem("firstTime", true)
        }
    }

    //gets the logged in user in order to display the correct 
    async getUser() {
        try {
            this.setState({loading: true});
            if (this.state.loggedInUserId) {

                const url = '/users/' + this.state.loggedInUserId;

                const response = await api.get(url);

                const user = new User(response.data);

                this.setState({loggedInUser: user});
                localStorage.setItem("userAvatar", user.avatarNr);
            } else {
                const user = new User()
                this.setState({loggedInUser: user})
            }
            this.setState({loading: false});
        } catch (e) {
            alert(`Something went wrong while displaying the avatar: \n${handleError(e)}`);
        }
    }


    async getFilteredLocations() {
        this.setState({filterSpinner: true})
        try {
            const requestBody = JSON.stringify({
                fountains: localStorage.getItem('showFountains'),
                fireplaces: localStorage.getItem('showFireplaces'),
                recyclingStations: localStorage.getItem('showRecyclingStations'),
                toilets: localStorage.getItem('showToilets'),
                tableTennis: localStorage.getItem('showTableTennis'),
                bench: localStorage.getItem('showBenches')
            });

            const response = await api.post('/locations/filter', requestBody);

            // Get the returned users and update the state.
            this.setState({locationsShown: response.data});
            this.setState({filterSpinner: false})
        } catch (error) {
            alert(`Something went wrong while fetching the filtered locations: \n${handleError(error)}`);
        }
    }

    centerMapAtCurrentLocation() {
        this.setState({currentCenter: [this.state.currentPosition[0], this.state.currentPosition[1]]});
        localStorage.setItem("wantsCurrentLocation", true);
        localStorage.removeItem("currentLocationInformation");
        localStorage.removeItem("currentLocationInformationLat");
        localStorage.removeItem("currentLocationInformationLon");
        window.location.reload(false);
    }

    getCoordinates(position) {
        this.setState({
            currentPosition: [position.coords.latitude, position.coords.longitude]
        });
        if (position.coords.longitude > 8.4680486289
            && position.coords.longitude < 8.6191027275
            && position.coords.latitude > 47.3232261256
            && position.coords.latitude < 47.4308197123) {
            this.setState({
                currentCenter: [position.coords.latitude, position.coords.longitude]
            })
        }
        if (localStorage.getItem("currentLocationInformationLat") && localStorage.getItem("currentLocationInformationLon")) {
            this.setState({
                currentCenter:
                    [parseFloat(localStorage.getItem("currentLocationInformationLat")),
                        parseFloat(localStorage.getItem("currentLocationInformationLon"))]
            })
        }
        if (localStorage.getItem("wantsCurrentLocation")) {
            this.setState({currentCenter: [position.coords.latitude, position.coords.longitude]});
            localStorage.removeItem("wantsCurrentLocation");
        }
        if (localStorage.getItem("showLocation")) {
            this.setState({zoom: 30});
            localStorage.removeItem("showLocation");
        }
    }

    getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getCoordinates, this.handleLocationError);
        } else if (sessionStorage.getItem('alerted') !== true) {
            sessionStorage.setItem('alerted', true);
            alert("Geolocation is not supported by this browser.");
        }
    }

    handleLocationError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                localStorage.setItem('alerted', true);
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                localStorage.setItem('alerted', true);
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                localStorage.setItem('alerted', true);
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                localStorage.setItem('alerted', true);
                alert("An unknown error occurred.");
                break;
        }
    }

    render() {
        return (<div>
                {!this.state.locationsShown ? (
                    <Container>
                        <WeatherContainer>
                            <Weather/>
                            <Button variant="primary" disabled>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                Loading Map...
                            </Button>
                        </WeatherContainer>
                    </Container>) : (<MapContainer>
                    <MapService
                        currentLocation={this.state.currentPosition}
                        currentCenter={this.state.currentCenter}
                        locationsShown={this.state.locationsShown}
                        googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDdG-nTEZ_bGS064sMlgL_dBdA4uZ2h5c0`}
                        loadingElement={<div style={{height: `100%`}}/>}
                        containerElement={<div style={{height: `100%`}}/>}
                        mapElement={<div style={{height: `100%`}}/>}
                        loggedInUser={this.state.loggedInUser}
                        zoom={this.state.zoom}
                    >
                    </MapService>
                </MapContainer>)}
                <HeaderMap/>
                <Sidebar filterSpinner={this.state.filterSpinner}
                         centerMapAtCurrentLocation={this.centerMapAtCurrentLocation.bind(this)}
                         getFilteredLocations={this.getFilteredLocations.bind(this)}
                         avatarNr={this.state.loggedInUser.avatarNr}/>
            </div>
        );
    }
}

export default withRouter(Map);
