import React, { useState, useEffect, Component } from 'react';
import { Grid, Form, Segment, Message, Button, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import md5 from 'md5';

class Register extends Component {

    constructor(props){
        super(props);
    };

    state = {
        username: '',
        email: '',
        password: '',
        passwordConfirmation: '',
        errors: [],
        loading: false,
        usersRef: firebase.database().ref('users'),
    };

    handleSubmit = e => {
        if (this.isFormValid()){
            e.preventDefault();
            this.setState({
                errors: [],
                loading: true,
            });
            firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(createdUser => {
                console.log(createdUser);
                createdUser.user.updateProfile({
                    displayName: this.state.username,
                    photoURL: `https://www.gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon`
                })
                .then(() => {
                    this.saveUser(createdUser).then(() => console.log('user saved'));
                    this.setState({
                        loading: false
                    })
                })
                .catch(e => {
                    console.error(e.message);
                    this.setState({
                        errors: this.state.errors.concat(e),
                        loading: false,
                    });
                });
            })
            .catch(e => {
                console.error(e.message);
                this.setState({
                    loading: false,
                    errors: [e],
                })
            });
        }
    };

    saveUser = (createdUser) => {
        return this.state.usersRef.child(createdUser.user.uid).set({
            name: createdUser.user.displayName,
            avatar: createdUser.user.photoURL,
        });
    }

    isFormValid = () => {
        if (this.isFormEmpty()){
            this.setState({errors: [{message: 'Fill all fields'}]});
            return false;
        } else if (!this.isPasswordValid()){
            this.setState({errors: [{message: 'Password is not valid'}]});
            return false;
        } else {
            return true;
        }
    }

    isFormEmpty = () => {
        return !this.state.username.length || !this.state.email.length || !this.state.password.length || !this.state.passwordConfirmation.length; 
    }

    isPasswordValid = () => {
        if (this.state.password.length < 6 || this.state.passwordConfirmation.length < 6){
            return false;
        } else {
            return this.state.password === this.state.passwordConfirmation;
        }
    }

    displayErrors = () => {
        return this.state.errors.map((error, i) => (
            <p key={i}>{error.message}</p>
        ));
    }

    setUsername = username => {
        this.setState({
            username,
        });
    }
    
    setEmail = email => {
        this.setState({
            email,
        });
    }

    setPassword = password => {
        this.setState({
            password,
        });
    }

    setPasswordConfirmation = passwordConfirmation => {
        this.setState({
            passwordConfirmation,
        });
    }

    render(){
        return (
            <Grid textAlign="center" verticalAlign="middle">
                <Grid.Column style ={{ maxWidth: 450 }}>
                    <Header 
                        as="h1" 
                        icon 
                        color="orange" 
                        textAlign="center"
                    >
                        <Icon 
                            name="react" 
                            color="orange"
                        />
                        Register for ReactChat
                    </Header>
                    <Form size="large" onSubmit={this.handleSubmit}>
                        <Segment stacked>
                        <Form.Input 
                                fluid
                                name="username"
                                icon="user"
                                iconPosition="left"
                                placeholder="Username"
                                onChange={e => this.setUsername(e.target.value)}
                                value={this.state.username}
                                type="text"
                            />
                            <Form.Input 
                                fluid
                                name="email"
                                icon="mail"
                                iconPosition="left"
                                placeholder="Email Adress"
                                onChange={e => this.setEmail(e.target.value)}
                                value={this.state.email}
                                type="email"
                            />
                            <Form.Input 
                                fluid
                                name="password"
                                icon="lock"
                                iconPosition="left"
                                placeholder="Password"
                                onChange={e => this.setPassword(e.target.value)}
                                value={this.state.password}
                                type="password"
                            />
                            <Form.Input 
                                fluid
                                name="passwordConfirmation"
                                icon="repeat"
                                iconPosition="left"
                                placeholder="Password Confirmation"
                                onChange={e => this.setPasswordConfirmation(e.target.value)}
                                value={this.state.passwordConfirmation}
                                type="password"
                            />
                            <Button 
                                color="orange" 
                                fluid 
                                size="large"
                                loading={this.state.loading}
                                disabled={this.state.loading}
                            >
                                Submit
                            </Button>
                        </Segment>        
                    </Form>
                    {this.state.errors.length > 0 && (
                        <Message>
                            <h3>Error</h3>
                            {this.displayErrors()}
                        </Message>
                    )}
                    <Message>
                        Already a user? <Link to="/login">Log in</Link>
                    </Message>
                </Grid.Column>
            </Grid>
        )  
    }
    
};

export default Register;