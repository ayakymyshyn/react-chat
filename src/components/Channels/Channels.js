import React, { useState, useEffect, Component } from 'react';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions'
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react'
import firebase from '../../firebase';


class Channels extends Component {

    constructor(props){
        super(props);
    }

    state = {
        channels: [],
        channelName: '',
        channelDetails: '',
        modal: false, 
        channelsRef: firebase.database().ref('channels'),
        messagesRef: firebase.database().ref('messages'),
        notifications: [],
        user: this.props.currentUser,
        firstLoad: false,

    }

    modalCloseHandler = () => {
        this.setState({
            modal: false,
        });
    };

    openModal = () => {
        this.setState({
            modal: true,
        });
    }

    handleSubmit = e => {
        e.preventDefault();
        if (this.isFormValid(this.state.channelName, this.state.channelDetails)){
            this.addChannel();
        }       
    }

    addListeners = () => {
        let loadedChannels = [];
        this.state.channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            this.setState({
                channels: [...loadedChannels],
            }, () => {
                this.props.setCurrentChannel(this.state.channels[0]);
            });
            this.addNotificationListener(snap.key);
        });
    };

    addNotificationListener = channelId => {
        this.state.messagesRef.child(channelId).on('value', snap => {
            if (this.state.channel) {
                this.handleNotifications(channelId, this.state.channel.id, this.state.notifications, snap);
            }
        })
    };

    handleNotifications = (channelId, currentChannelId, notifications, snap) => {
        let lastTotal = 0;
        let index = notifications.findIndex(notification => notification.id === channelId);
        if (index !== -1) {
            if (channelId !== currentChannelId) {
                lastTotal = notifications[index].total;
                if (snap.numChildren() - lastTotal > 0) {
                    notifications[index].count = snap.numChildren() - lastTotal;
                }
            }
            notifications[index].lastKnownTotal = snap.numChildren();  
        } else {
            notifications.push({
                id: channelId,
                total: snap.numChildren(),
                lastKnownTotal: snap.numChildren(),
                count: 0
            });
        }
        //console.log(ads);
        this.setState({ notifications })
    }

    componentDidMount(){
        this.addListeners();
    }
    componentWillUnmount(){
        this.removeListeners();
    }
    
    removeListeners = () => {
        this.state.channelsRef.off();
    }

    displayChannels = (channels) => {
        return channels.length > 0 && channels.map(channel => (
            <Menu.Item key={channel.id} onClick={() => this.changeChannel(channel)} name={channel.name} style={{opacity: 0.7}}>
                # {channel.name}
            </Menu.Item>
        ));
    }

     changeChannel = channel => {
        this.props.setCurrentChannel(channel);
        this.props.setPrivateChannel(false);
        this.setState({ channel });
    }

    isFormValid = (channelName, channelDetails) => channelName && channelDetails;

     addChannel = () => {
        const key = this.state.channelsRef.push().key;
        const newChannel = {
            id: key,
            name: this.state.channelName,
            details: this.state.channelDetails,
            createdBy: {
                name: this.state.user.displayName,
                avatar: this.state.user.photoURL,
            }
        };

        this.state.channelsRef
        .child(key)
        .update(newChannel)
        .then(() => {
            this.setChannelName('');
            this.setChannelDetails('');
            this.modalCloseHandler();
            console.log('channel added!');
        })
        .catch(err => console.error(err));
    }

    render() {
        return (
            <React.Fragment>
                <Menu.Menu className="menu">
                    <Menu.Item>
                        <span>
                            <Icon name="exchange" /> CHANNELS
                        </span>{'   '}
                        ({this.state.channels.length}) <Icon name="add" onClick={this.openModal} />
                    </Menu.Item>
                    {this.displayChannels(this.state.channels)}
                </Menu.Menu>

                <Modal basic open={this.state.modal} onClose={this.modalCloseHandler}>
                    <Modal.Header>
                        Add a channel
                    </Modal.Header>
                    <Modal.Content>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Field>
                                <Input 
                                    fluid
                                    label="Name of Channel"
                                    name="nameChannel"
                                    onChange={e => this.setChannelName(e.target.value)}
                                />
                            </Form.Field>
                            <Form.Field>
                                <Input 
                                    fluid
                                    label="Channel Details"
                                    name="detailsChannel"
                                    onChange={e => this.setChannelDetails(e.target.value)}
                                />
                            </Form.Field>
                        </Form>
                    </Modal.Content>
                    <Modal.Actions>
                    <Button color="green" inverted onClick={this.handleSubmit}>
                        <Icon name="checkmark" /> Add 
                    </Button>  
                    <Button color="red" inverted onClick={this.modalCloseHandler}>
                        <Icon name="remove" /> Cancel 
                    </Button>  
                    </Modal.Actions>
                </Modal>
            </React.Fragment>
        )
    }
}

 const mapStateToProps = state => {
    return {
        currentChannel: state.channel.currentChannel
    }
}

export default connect(mapStateToProps, { setCurrentChannel, setPrivateChannel })(Channels);
