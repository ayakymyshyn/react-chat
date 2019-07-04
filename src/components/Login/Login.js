import React, { useState } from 'react';

import { Grid, Form, Segment, Message, Button, Header, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';


const Login = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState([]);
    const [loading, setLoading] = useState(false);


    const handleSubmit = e => {
      if (isFormValid(email, password)){
         e.preventDefault();
         setErrors([]);
         setLoading(true);
         console.log(errors);
         firebase
         .auth()
         .signInWithEmailAndPassword(email, password)
         .then(signedUser => console.log('signed in!', signedUser))
         .catch(e => {
            console.error(e.message);
            setErrors([e, ...errors]);
            setLoading(false);
         });
      } else {
         console.log(errors);
      }
   };

   

    const displayErrors = () => {
        return errors.map((error, i) => (
            <p key={i}>{error.message}</p>
        ));
    }

    const isFormValid = (email, password) => email && password;
       
    return (
        <Grid textAlign="center" verticalAlign="middle">
            <Grid.Column style ={{ maxWidth: 450 }}>
                <Header 
                    as="h1" 
                    icon 
                    color="violet" 
                    textAlign="center"
                >
                    <Icon 
                        name="code branch" 
                        color="violet"
                    />
                    Login to ReactChat
                </Header>
                <Form size="large" onSubmit={handleSubmit}>
                    <Segment stacked>
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
                        <Button 
                            color="violet" 
                            fluid 
                            size="large"
                            loading={loading}
                            disabled={loading}
                        >
                            Submit
                        </Button>
                    </Segment>        
                </Form>
                {errors.length > 0 && (
                    <Message>
                        <h3>Error</h3>
                        {displayErrors()}
                    </Message>
                )}
                <Message>
                   Dont have an account? <Link to="/register">Register</Link>
                </Message>
            </Grid.Column>
        </Grid>
    )
};

export default Login;