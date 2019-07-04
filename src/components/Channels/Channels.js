import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setCurrentChannel } from '../../actions'
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react'
import firebase from '../../firebase';

const Channels = props => {

    const { currentUser } = props;

    const [channels, setChannels] = useState([]);
    const [channelName, setChannelName] = useState('');
    const [channelDetails, setChannelDetails] = useState('');
    const [modal, setModal] = useState(false);
    const [channelsRef, setChannelsRef] = useState(firebase.database().ref('channels'));
    const [user, setUser] = useState(currentUser);


    const modalCloseHandler = () => {
        setModal(false);
    };

    const openModal = () => {
        setModal(true);
    }

    const handleSubmit = e => {
        e.preventDefault();
        if (isFormValid(channelName, channelDetails)){
            addChannel();
        }       
    }

    const addListeners = () => {
        let loadedChannels = [];
        channelsRef.on('child_added', snap => {
            loadedChannels.push(snap.val());
            setChannels([...loadedChannels]);
        })
    };

    const displayChannels = channels => {
        return channels.length > 0 && channels.map(channel => (
            <Menu.Item key={channel.id} onClick={() => changeChannel(channel)} name={channel.name} style={{opacity: 0.7}}>
                # {channel.name}
            </Menu.Item>
        ));
    }

    const changeChannel = channel => {
        props.setCurrentChannel(channel);
    }

    useEffect(() => {
        addListeners();
    }, []);
    
    const isFormValid = (channelName, channelDetails) => channelName && channelDetails;

    const addChannel = () => {
        const key = channelsRef.push().key;
        const newChannel = {
            id: key,
            name: channelName,
            details: channelDetails,
            createdBy: {
                name: user.displayName,
                avatar: user.photoURL,
            }
        };

        channelsRef
        .child(key)
        .update(newChannel)
        .then(() => {
            setChannelName('');
            setChannelDetails('');
            modalCloseHandler();
            console.log('channel added!');
        })
        .catch(err => console.error(err));
    }

    return (
    <React.Fragment>
        <Menu.Menu style ={{
            paddingBottom: '2em',
            paddingTop: "1em",
            }}>
            <Menu.Item>
                <span>
                    <Icon name="exchange" /> CHANNELS
                </span>{'   '}
                ({channels.length}) <Icon name="add" onClick={openModal} />
            </Menu.Item>
            {displayChannels(channels)}
        </Menu.Menu>

        <Modal basic open={modal} onClose={modalCloseHandler}>
            <Modal.Header>
                Add a channel
            </Modal.Header>
            <Modal.Content>
                <Form onSubmit={handleSubmit}>
                    <Form.Field>
                        <Input 
                            fluid
                            label="Name of Channel"
                            name="nameChannel"
                            onChange={e => setChannelName(e.target.value)}
                        />
                    </Form.Field>
                    <Form.Field>
                        <Input 
                            fluid
                            label="Channel Details"
                            name="detailsChannel"
                            onChange={e => setChannelDetails(e.target.value)}
                        />
                    </Form.Field>
                </Form>
            </Modal.Content>
            <Modal.Actions>
              <Button color="green" inverted onClick={handleSubmit}>
                <Icon name="checkmark" /> Add 
              </Button>  
              <Button color="red" inverted onClick={modalCloseHandler}>
                <Icon name="remove" /> Cancel 
              </Button>  
            </Modal.Actions>
        </Modal>
    </React.Fragment>
    )
};

const mapStateToProps = state => {
    return {
        currentChannel: state.channel.currentChannel
    }
}

export default connect(mapStateToProps, { setCurrentChannel })(Channels);
