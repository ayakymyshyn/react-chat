import React, { useState } from 'react';

import { Grid, Form, Segment, Message, Button, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';

const Register = () => {

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [errors, setErrors] = useState([]);

    const handleSubmit = e => {
        if (isFormValid()){
            e.preventDefault();
            firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(createdUser => console.log(createdUser))
            .catch(e => console.error(e.message));
        } else {
            console.log(errors);
        }
    };

    const isFormValid = () => {
        if (isFormEmpty()){
            setErrors([{message: 'Fill all fields'}, ...errors]);
            console.log(errors);
            return false;
        } else if (!isPasswordValid()){
            setErrors([{message: 'Password is not valid'}, ...errors]);
            return false
        } else {
            return true;
        }
    }

    const isFormEmpty = () => {
        return !username.length || !email.length || !password.length || !passwordConfirmation.length; 
    }

    const isPasswordValid = () => {
        if (password.length < 6 || passwordConfirmation.length < 6){
            return false;
        } else {
            return password === passwordConfirmation;
        }
    }
    
    return (
        <Grid textAlign="center" verticalAlign="middle">
            <Grid.Column style ={{ maxWidth: 450 }}>
                <Header 
                    as="h2" 
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
                <Form size="large" onSubmit={handleSubmit}>
                    <Segment stacked>
                    <Form.Input 
                            fluid
                            name="username"
                            icon="user"
                            iconPosition="left"
                            placeholder="Username"
                            onChange={e => setUsername(e.target.value)}
                            value={username}
                            type="text"
                        />
                        <Form.Input 
                            fluid
                            name="email"
                            icon="mail"
                            iconPosition="left"
                            placeholder="Email Adress"
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                            type="email"
                        />
                        <Form.Input 
                            fluid
                            name="password"
                            icon="lock"
                            iconPosition="left"
                            placeholder="Password"
                            onChange={e => setPassword(e.target.value)}
                            value={password}
                            type="password"
                        />
                        <Form.Input 
                            fluid
                            name="passwordConfirmation"
                            icon="repeat"
                            iconPosition="left"
                            placeholder="Password Confirmation"
                            onChange={e => setPasswordConfirmation(e.target.value)}
                            value={passwordConfirmation}
                            type="password"
                        />
                        <Button 
                            color="orange" 
                            fluid 
                            size="large"
                        >
                            Submit
                        </Button>
                    </Segment>        
                </Form>
                <Message>
                    Already a user? <Link to="/login">Log in</Link>
                </Message>
            </Grid.Column>
        </Grid>
    )
};

export default Register;