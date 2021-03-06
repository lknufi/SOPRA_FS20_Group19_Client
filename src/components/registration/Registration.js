import React from 'react';
import styled from 'styled-components';
import {api} from '../../helpers/api';
import User from '../shared/models/User';
import {withRouter} from 'react-router-dom';
import {Button} from '../../views/variables/Button';
import '../../views/Map/BackgroundMap.css';
import '../../views/variables/ZurichEmblem.css';
import {ButtonForLogin} from '../../views/variables/ButtonForLogin';
import HeaderForLogin from "../../views/UserInformation/HeaderForLogin";
import AboutUsQuestion1 from "../../views/AboutUs/AboutUsQuestion1.png";

const ErrorMessage = styled.div`
  font-weight: normal;
  font-size: 13px;
  margin-left: 0px;
  letter-spacing: 0.05em;
  margin-top:0px;
  padding-bottom: 5px;
  color: red;
  max-width: 215px;
  text-align: center;
`;
const BackgroundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 200px;
  justify-content: center;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 768px;
  min-width: 1366px;
  margin-bottom: fill;
  @media only screen and (max-width: 1215px){
    
  }
  
  @media only screen and (max-width: 900px){
    min-width: 700px;
  }
  @media only screen and (max-width: 500px){
    min-width: 300px;
    min-height: 100px;
  }
`;

const EmblemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 620px;
  justify-content: center;
  background-repeat: no-repeat;
  background-size: 450px;
  background-position: center;
  @media only screen and (max-width: 1215px){
    max-width: 1000;
    display: center;
  }
    
  @media only screen and (max-width: 900px){
    max-width: 800;
    display: center;
  }
  
  @media only screen and (max-width: 500px){
    max-width: 300;
    background-size: 320px;
    display: center;
  }
`;

const FormContainer = styled.div`
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 300px;
  justify-content: center;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 110%;
  height: 400px;
  font-size: 16px;
  font-weight: 300;
  padding-left: 37px;
  padding-right: 37px;
  border-radius: 5px;
  background: none;
  transition: opacity 0.5s ease, transform 0.5s ease;
`;

const InputField = styled.input`
  &::placeholder {
    color: black;
  }
  height: 35px;
  padding-left: 15px;
  margin-left: -4px;
  border: 2px solid #003068;
  margin-bottom: 9px;
  background: white;
  color: #000000;
  @media only screen and (max-width: 500px){
    margin-bottom: 4px;
  }
`;

const ContainerError = styled.div`
  display: flex;
  max-width: 300px;
  justify-content: center;
  margin-top: 20px;
  @media only screen and (max-width: 500px){
    margin-top: 10px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
  min-width: 240px;
  @media only screen and (max-width: 500px){
    margin-top: 10px;
  }
`;

const AboutUsButton = styled.div`
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

/**
 * Classes in React allow you to have an internal state within the class and to have the React life-cycle for your component.
 * You should have a class (instead of a functional component) when:
 * - You need an internal state that cannot be achieved via props from other parent components
 * - You fetch data from the server (e.g., in componentDidMount())
 * - You want to access the DOM via Refs
 * https://reactjs.org/docs/react-component.html
 * @Class
 */

function ValidationMessage(props) {
    if (!props.valid) {
        return (
            <ErrorMessage className='error-msg'>{props.message}</ErrorMessage>
        )
    }
    return null;
}

class Registration extends React.Component {
    /**
     * If you don’t initialize the state and you don’t bind methods, you don’t need to implement a constructor for your React component.
     * The constructor for a React component is called before it is mounted (rendered).
     * In this case the initial state is defined in the constructor. The state is a JS object containing two fields: name and username
     * These fields are then handled in the onChange() methods in the resp. InputFields
     */
    constructor() {
        super();
        this.state = {
            username: "",
            name: "",
            password: "",
            passwordConfirm: '',
            errorMsg: {},
            formValid: false,
            usernameValid: false,
            passwordValid: false,
            nameValid: false,
            passwordConfirmValid: false,
            hasNoErrorMessage: true,
            errorMsgError: "",
        };
    }

    /**
     * HTTP POST request is sent to the backend.
     * If the request is successful, a new user is returned to the front-end
     * and its token is stored in the localStorage.
     */
    async registration() {
        try {
            const requestBody = JSON.stringify({
                username: this.state.username,
                name: this.state.name,
                password: this.state.password
            });
            const response = await api.post('/users', requestBody);

            // Get the returned user and update a new object.
            new User(response.data);

            // Registration successfully worked --> navigate to the route /login in the AppRouter
            this.props.history.push(`/login`);
        } catch (error) {
            this.handleErrorDesigned(error);
            this.setState({hasNoErrorMessage: false});
        }
    }

    /**
     *  Every time the user enters something in the input field, the state gets updated.
     * @param key (the key of the state for identifying the field that needs to be updated)
     * @param value (the value that gets assigned to the identified state key)
     */

    handleErrorDesigned(error) {

        const response = error.response;

        // catch 4xx and 5xx status codes

        if (response && !!`${response.status}`.match(/^[4|5]\d{2}$/)) {
            if (response.data.status) {
                this.setState({errorMessageError: response.data.message})
            } else {
                this.setState({errorMessageError: response.data})
            }
        } else {
            if (error.message.match(/Network Error/)) {
                alert('The server cannot be reached. Did you start it?');
            }
            console.log('Something else happened.', error);
        }
    }

    updatePassword = (password) => {
        this.setState({password}, this.validatePassword);
    }

    updateUsername = (username) => {
        this.setState({username}, this.validateUsername)
    }

    updateName = (name) => {
        this.setState({name}, this.validateName)
    }

    updatePasswordConfirm = (passwordConfirm) => {
        this.setState({passwordConfirm}, this.validatePasswordConfirm)
    }

    handleInputChange(key, value) {
        this.setState({[key]: value});
        this.validateUsername();

    }

    validateForm = () => {
        const {usernameValid, nameValid, passwordValid, passwordConfirmValid} = this.state;
        this.setState({
            formValid: usernameValid && nameValid && passwordValid && passwordConfirmValid
        })
    }

    validateUsername = () => {
        const {username} = this.state;
        let usernameValid = true;
        let errorMsg = {...this.state.errorMsg}

        if (username.length < 4) {
            usernameValid = false;
            errorMsg.username = 'Must be at least 4 characters long'
        }
        this.setState({usernameValid, errorMsg}, this.validateForm)
    }

    validateName = () => {
        const {name} = this.state;
        let nameValid = true;
        let errorMsg = {...this.state.errorMsg}

        if (name.length < 4) {
            nameValid = false;
            errorMsg.name = 'Must be at least 4 characters long';
        }
        this.setState({nameValid, errorMsg}, this.validateForm);
    }

    validatePassword = () => {
        const {password} = this.state;
        let passwordValid = true;
        let errorMsg = {...this.state.errorMsg}

        if (password.length < 6) {
            passwordValid = false;
            errorMsg.password = 'Must be at least 6 characters long';
        }
        this.setState({passwordValid, errorMsg}, this.validateForm);
    }

    validatePasswordConfirm = () => {
        const {passwordConfirm, password} = this.state;
        let passwordConfirmValid = true;
        let errorMsg = {...this.state.errorMsg}

        if (password !== passwordConfirm) {
            passwordConfirmValid = false;
            errorMsg.passwordConfirm = 'Passwords do not match'
        }

        this.setState({passwordConfirmValid, errorMsg}, this.validateForm);
    }

    render() {
        return (
            //className html (BackgroundMap.css) and container (ZurichEmblem.css) are css files with the background images in it (map and emblem)
            <BackgroundContainer className={'html'}>
                <HeaderForLogin/>
                <EmblemContainer className={'container'}>
                    <FormContainer>
                        <Form>
                            <InputField
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        if (this.state.formValid === true) {
                                            this.registration();
                                        }
                                    }
                                }}
                                placeholder="Enter username here"
                                onChange={e => {
                                    this.updateUsername(e.target.value);
                                }}
                            />
                            <ValidationMessage valid={this.state.usernameValid} message={this.state.errorMsg.username}/>
                            <InputField
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        if (this.state.formValid === true) {
                                            this.registration();
                                        }
                                    }
                                }}
                                placeholder="Enter name here"
                                onChange={e => {
                                    this.updateName(e.target.value);
                                }}
                            />
                            <ValidationMessage valid={this.state.nameValid} message={this.state.errorMsg.name}/>
                            <InputField
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        if (this.state.formValid === true) {
                                            this.registration();
                                        }
                                    }
                                }}
                                type="password"
                                placeholder="Enter password here"
                                onChange={e => {
                                    this.updatePassword(e.target.value);
                                }}
                            />
                            <ValidationMessage valid={this.state.passwordValid} message={this.state.errorMsg.password}/>
                            <InputField
                                onKeyPress={e => {
                                    if (e.key === 'Enter') {
                                        if (this.state.formValid === true) {
                                            this.registration();
                                        }
                                    }
                                }}
                                type="password"
                                placeholder="Enter password again"
                                onChange={e => {
                                    this.updatePasswordConfirm(e.target.value);
                                }}
                            />
                            <ValidationMessage valid={this.state.passwordConfirmValid}
                                               message={this.state.errorMsg.passwordConfirm}/>
                            <ContainerError>
                                <ValidationMessage valid={this.state.hasNoErrorMessage}
                                                   message={this.state.errorMessageError}/>
                            </ContainerError>
                            <ButtonContainer>
                                <Button
                                    disabled={!this.state.formValid}
                                    width="75%"
                                    onClick={() => {
                                        this.registration();
                                    }}
                                >
                                    Register
                                </Button>
                            </ButtonContainer>
                            <ButtonContainer>
                                <ButtonForLogin
                                    width="75%"
                                    onClick={() => {
                                        this.props.history.push(`/map`);
                                    }}
                                >
                                    Continue as a guest
                                </ButtonForLogin>
                            </ButtonContainer>
                            <ButtonContainer>
                                <ButtonForLogin
                                    width="75%"
                                    onClick={() => {
                                        this.props.history.push(`/login`);
                                    }}
                                >
                                    Login here
                                </ButtonForLogin>
                            </ButtonContainer>
                            <ButtonContainer>
                                <AboutUsButton
                                    onClick={() => {
                                        localStorage.setItem('cameToAboutUsFrom', 'registration');
                                        this.props.history.push(`/aboutus`);
                                    }}
                                >
                                    <img src={AboutUsQuestion1} width="40%" heigth="40%"/>
                                </AboutUsButton>
                            </ButtonContainer>
                        </Form>
                    </FormContainer>
                </EmblemContainer>
            </BackgroundContainer>

        );
    }
}

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default withRouter(Registration);
