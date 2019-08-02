import React, { useState, useEffect } from 'react';
import firebase from '../../firebase';
import { Grid, Header, Icon, Dropdown, Image } from 'semantic-ui-react';

const UserPanel = (props) => {

    const [user, setUser] = useState(null);
    const username = user && user.displayName;
    const dropdownOptions = () => [
        {
            key: 'user',
            text: <span>Signed in as <strong>{username}</strong></span>,
            disabled: true
        },
        {
            key: 'avatar',
            text: <span>Change avatar</span>,
        },
        {
            key: 'signout',
            text: <span onClick={handleSignOut}>Sign out</span>,
        }
    ];

    const handleSignOut = () => {
        firebase
        .auth()
        .signOut()
        .then(() => console.log('signed out!'))
    }

    useEffect(() => {
        setUser(props.currentUser);
    }, []);


    return (
       <Grid style={{ background: '#4c3c4c' }}>
           <Grid.Column>
               <Grid.Row style={{paddingTop: '0.9em', margin: 0}}>
                    <Header inverted floated="left" as="h2">
                        <Header.Content>
                            <Icon name="react" style={{ textAlign: 'center'}}/>
                            ReactChat
                        </Header.Content>
                    </Header>
                </Grid.Row>
                <Header style={{ paddingTop: '1.25em' }} as="h4" inverted>
                    <Dropdown trigger={
                        <span>
                            <Image src={user && user.photoURL} spaced="right" avatar/>
                            {username}
                        </span>
                    } options={dropdownOptions()}/>
                </Header>
           </Grid.Column>
       </Grid>
    );
}

export default UserPanel;