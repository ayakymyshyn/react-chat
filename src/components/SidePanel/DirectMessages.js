import React, { useState, useEffect } from 'react';
import {Menu, Icon } from 'semantic-ui-react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions'
import firebase from '../../firebase';


class DirectMessages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: [],
            user: props.currentUser,
            usersRef: firebase.database().ref('users'),
            connectedRef: firebase.database().ref('.info/connected'),
            presenceRef: firebase.database().ref('presence'),
            activeChannel: ''
        };
    }

    componentDidMount(){
        if (this.state.user) {
            this.addListeners(this.state.user.uid);
        }
    };

    addListeners = currentUserUid => {
        let { usersRef, connectedRef, presenceRef } = this.state;
        let loadedUsers = [];
        usersRef.on('child_added', snap => {
            if (currentUserUid !== snap.key){
                let user = snap.val();
                user['uid'] = snap.key;
                user['status'] = 'offline';
                loadedUsers.push(user);
                this.setState({
                    users: loadedUsers,
                });
            }
        });
        connectedRef.on('value', snap => {
            if (snap.val() === true) {
                let ref = presenceRef.child(currentUserUid);
                ref.set(true);
                ref.onDisconnect().remove(err => {
                    err !== null && console.error(err);
                });
            }
        }); 
        presenceRef.on('child_added', snap => {
            if (currentUserUid !== snap.key) {
                this.addStatusToUser(snap.key)
            }
        });
        presenceRef.on('child_removed', snap => {
            if (currentUserUid !== snap.key) {
                this.addStatusToUser(snap.key, false);
            }
        });
    };

        addStatusToUser = (userId, connected = true) => {
            const updatedUsers = this.state.users.reduce((acc, user) => {
                if (user.uid === userId) {
                    user['status'] = `${connected ? 'online' : 'offline'}`;
                }
                return acc.concat(user);
            }, []);
        };
        
        isUserOnline = user => user.status === 'online';

        changeChannel = user => {
            const channelId = this.getChannelId(user.uid);
            const channelData = {
                id: channelId,
                name: user.name,
            };
            this.props.setCurrentChannel(channelData);
            this.props.setPrivateChannel(true);
            this.setActiveChannel(user.uid);
        }

        setActiveChannel = userId => {
            this.setState({activeChannel: userId})
        }

        getChannelId = userId => {
            const currentUserId = this.state.user.uid;
            return  userId < currentUserId ? `${userId}/${currentUserId}` : `${currentUserId}/${userId}`;
        }


        render() {
            let { users, activeChannel } = this.state;
            return (
                <Menu.Menu className="menu">
                    <Menu.Item>
                        <span onClick={() => {console.log(users)}}>
                            <Icon name="mail"/> DIRECT MESSAGES
                        </span>
                        ({users.length})
                    </Menu.Item>
                    {users.map((user) => (
                        <Menu.Item
                            style={{opacity: 0.7, fontStyle: 'italic'}}
                            key={user.uid}
                            active={user.uid === activeChannel}
                            onClick={() => {
                                this.changeChannel(user);
                            }}
                        >
                            <Icon 
                                name="circle"
                                color={this.isUserOnline(user) ? 'green' : 'grey'}
                            />
                            @{user.name}
                        </Menu.Item>
                    ))}
                </Menu.Menu>
            );
        }

}

export default connect(null, { setCurrentChannel, setPrivateChannel })(DirectMessages);