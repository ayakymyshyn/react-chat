import React from 'react';
import { Menu } from 'semantic-ui-react';

import UserPanel from '../UserPanel/UserPanel';
import Channels from '../Channels/Channels';
import DirectMessages from './DirectMessages';

const SidePanel = (props) => {

  const { currentUser } = props;

    return (
      <Menu
        sile="large"
        inverted
        fixed="left"
        vertical
        style={{background: '#4c3c4c', fontSize: '1.2rem'}}
      >
        <UserPanel currentUser={ currentUser } />
        <Channels currentUser={currentUser} />
        <DirectMessages currentUser={currentUser} />
      </Menu>
    );
}

export default SidePanel;