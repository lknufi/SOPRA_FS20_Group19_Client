import React from 'react';
import styled from 'styled-components';
import { api, handleError } from '../../helpers/api';
import User from '../shared/models/User';
import { withRouter } from 'react-router-dom';
import '../../views/Map/BackgroundMap.css';
import '../../views/variables/ZurichEmblem.css';
import Spinner from "react-bootstrap/Spinner";
import UserListItem from "../../views/Users/UserListItem";
import { ButtonForLogin } from '../../views/variables/ButtonForLogin';
import HeaderForLogin from "../../views/UserInformation/HeaderForLogin";
import Header from "../../views/Map/Header";
import SidebarUsers from "../../views/Users/SidebarUsers";

const UsersList = styled.ul`
  list-style: none;
  padding-left: 0;
`;

const UserContainer = styled.li`
  display: flex;
  flex-direction: column;
  align-items: top;
  justify-content: center;
`;

const ScrollContainer = styled.div`
  display: flex;
  align-items: top;
  justify-content: center;
  max-height: 550px;
  overflow: scroll;
  width: 100%;
  grid-column: 1;
  grid-row: 3;
`;

const MainContainer = styled.div`
  display: grid;
  grid-template-rows: auto auto auto;
  grid-column-gap: 10px;
  grid-row-gap: 15px;
  align-items: top;
  justify-content: center;
  margin-top: 75px;
`;

const Title = styled.div`
  font-weight: bolder;
  font-size: 30px;
  letter-spacing: 0.1em;
  line-height: 1.1em;
  grid-column: 1;
  grid-row: 1;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  grid-column: 1;
  grid-row: 2;
`;

const SearchBar = styled.input`
  &::placeholder {
    color: black;
  }
  height: 35px;
  width: 50%;
  padding-left: 15px;
  border: 2px solid #003068;
  background: white;
  color: #000000;
`;

const Button = styled.button`
  padding: 6px;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 13px;
  text-align: center;
  color: black;
  width: 250px;
  height: 35px;
  border-bottom: 2px solid black;
  border: 2px transparent;
  border-radius: 0px;
  cursor: ${props => (props.disabled ? "default" : "pointer")};
  opacity: ${props => (props.disabled ? 0.4 : 1)};
  background: white;
  transition: all 0.3s ease;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 250px;
`;

class Users extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            users: null,
            searchValue: null,
            filterFriends: false,
        };
    }

    componentDidMount(): void {
        this.getUsers();
    }

    async getUsers() {
        try {
            const response = await api.get('/users');

            this.setState({ users: response.data });
        } catch (error) {
            alert(`Something went wrong while fetching the users: \n${handleError(error)}`);
        }
    }

    goToProfile(userId){
        this.props.history.push(`/user/` + userId);
    }

    handleInputChange(key, value) {
        // Example: if the key is username, this statement is the equivalent to the following one:
        // this.setState({'username': value});
        this.setState({ [key]: value });
    }

    filterFriends(){
        this.setState({ filterFriends: !this.state.filterFriends });
    }

    // DO NOT CHANGE != to !==
    render() {
        return (
            <MainContainer>
                <Header/>
                <SidebarUsers avatarNr={localStorage.getItem("userAvatar")} />
                <Title>Find other people to get to Know Your City with!</Title>
                <SearchContainer>
                    <SearchBar
                        placeholder="Search other users by their username"
                        onChange={e => {this.handleInputChange('searchValue', e.target.value);}}
                    />
                    <ButtonContainer>
                        <Button
                            variant="outline-secondary"
                            height="100%"
                            onClick={() => {
                                this.filterFriends();
                            }}
                        >
                            Show your friends only</Button>
                    </ButtonContainer>
                </SearchContainer>
                {!this.state.users ? (
                    <Spinner />
                ) : (
                    <ScrollContainer>
                        <UsersList>
                            {this.state.users.map(user => {
                                if (this.state.searchValue === null && user.id != localStorage.getItem("userId")){
                                    return (
                                        <UserContainer key={user.id}>
                                            <UserListItem user={user} goToProfile={this.goToProfile.bind(this)}/>
                                        </UserContainer>
                                    );
                                }
                                else if (user.username.includes(this.state.searchValue) && user.id != localStorage.getItem("userId")){
                                    return (
                                        <UserContainer key={user.id}>
                                            <UserListItem user={user} goToProfile={this.goToProfile.bind(this)}/>
                                        </UserContainer>
                                    );
                                }
                            })}
                        </UsersList>
                    </ScrollContainer>
                )}
            </MainContainer>
        );
    }

}

export default withRouter(Users);