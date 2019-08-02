import React, { useState, useEffect } from 'react';
import { Segment, Comment } from 'semantic-ui-react';
import firebase from '../../firebase';

import MessagesHeader from './MessagesHeader';
import MessageForm from './MessageForm';
import Message from './Message';

const Messages = (props) => {

    const [messagesRef] = useState(firebase.database().ref('messages'));
    const [user] = useState(props.currentUser);
    const [privateMessagesRef] = useState(firebase.database().ref('privateMessages'));
    const [isPrivateChannel] = useState(props.isPrivateChannel);
    const [messages, setMessages] = useState([]);
    const [messagesLoading, setMessagesLoading] = useState(true);
    const [channel] = useState(props.currentChannel);
    const [numberUniqueUsers, setNumberUniqueUsers] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState('');
    const [searchLoading, setsearchLoading] = useState(false);

    useEffect(() => {
        if (channel && user) {
            addListeners(channel.id);
        }
    }, []);

    const addListeners = channelID => {
        addMessageListener(channelID);
    }

    const addMessageListener = channelID => {
        let loadedMessages = [];
        const ref = getMessagesRef();
        ref.child(channelID).on('child_added', snap => {
            loadedMessages.push(snap.val());
            setMessages([...loadedMessages]);
            setMessagesLoading(false);
        }); 
        countUniqueUsers(loadedMessages);
    };

    const getMessagesRef = () => {
        return isPrivateChannel ? privateMessagesRef : messagesRef;
    };

    const displayChannelName = channel => (
        channel ? `#${isPrivateChannel ? '#' : '@'}${channel.name}` : ''
    );

    const countUniqueUsers = messages => {
        const uniqueUsers = messages.reduce((acc, message) => {
            if (!acc.includes(message.user.name)) {
                acc.push(message.user.name);
            }
            return acc;
        }, []);
        const plunary = uniqueUsers.length > 1 || uniqueUsers.length === 0;
        const numUniqueUsers = `${uniqueUsers.length} user${plunary ? 's' : ''}`;
        setNumberUniqueUsers(numUniqueUsers);
    };   

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setsearchLoading(true);
    }

    useEffect(() => {
        handleSearchMessages();
    }, [searchTerm])

    const handleSearchMessages = () => {
        const channelMessages = [...messages];
        const regex = new RegExp(searchTerm, 'gi');
        const searchResults = channelMessages.reduce((acc, message) => {
            if (message.content && message.content.match(regex) || message.user.name && message.user.name.match(regex) ){
                acc.push(message);
            }
            return acc;
        }, []);
        setSearchResults(searchResults);
        setTimeout(() => {setsearchLoading(false)}, 1000);
    }
   const displayMessages = messages => {
        return messages.length > 0 && messages.map(message => (
            <Message 
                key={message.timestamp}
                message={message}
                user={user}
            />
        ));
    }

   

    return (
       <React.Fragment>
           <MessagesHeader 
              channelName={displayChannelName(channel)}
              numUniqueUsers={numberUniqueUsers}
              handleSearchChange={handleSearchChange}
              searchLoading={searchLoading}
              isPrivateChannel={isPrivateChannel}
           />
           <Segment>
               <Comment.Group className="messages">
                    {searchTerm ? displayMessages(searchResults) : 
                        displayMessages(messages)
                    }
               </Comment.Group>
           </Segment>

           <MessageForm 
            messagesRef={messagesRef}
            currentChannel={channel}
            currentUser={user}
            isPrivateChannel={isPrivateChannel}
            getMessagesRef={getMessagesRef}
           />
       </React.Fragment>
    );
}

export default Messages;