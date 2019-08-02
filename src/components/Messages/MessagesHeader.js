import React, { useState, useEffect } from 'react';
import { Header, Segment, Input, Icon } from 'semantic-ui-react';

const MessagesHeader = ({
    channelName, 
    numUniqueUsers, 
    handleSearchChange,
    searchLoading,
    isPrivateChannel
}) => {

    //const [channelName] = useState(props.channelName);
    //const [numUniqueUsers, setNumUniqueUsers] = useState('props');

    const [usersCount, setUsersCount] = useState('');

    useEffect(() => {
        setUsersCount(numUniqueUsers);
    }, [numUniqueUsers]);

    return (
        <Segment clearing>
            {/* Channel Title */}
            <Header 
                fluid="true" 
                as="h2" 
                floated="left"
                style={{ marginBottom: 0 }}
            >
                {channelName}
            {!isPrivateChannel && <Icon name={"star outline"} color="black" />}
            <Header.Subheader>
               {usersCount}
            </Header.Subheader>
            </Header>

            {/* Channel Search Input */}
            <Header floated="right">
                <Input 
                    size="mini"
                    icon="search"
                    name="searchTerm"
                    onChange={handleSearchChange}
                    loading={searchLoading}
                />
            </Header>
        </Segment>
    )
}

export default MessagesHeader;