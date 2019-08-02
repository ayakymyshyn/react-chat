import React, { useState, useEffect } from 'react';
import uuidv4 from 'uuid/v4';
import { Segment, Button, Input } from 'semantic-ui-react';
import firebase from '../../firebase';
import FileModal from './FileModal';
import ProgressBar from './ProgressBar';

const MessageForm = (props) => {

    const [msg, setMessage] = useState('');
    const [messagesRef] = useState(props.messagesRef);
    const [loading, setLoading] = useState(false);
    const [channel] = useState(props.currentChannel);
    const [user] = useState(props.currentUser);
    const [errors, setErrors] = useState([]);
    const [modal, setModal] = useState(false);
    const [uploadState, setUploadState] = useState('');
    const [uploadTask, setUploadTask] = useState(null);
    const [storageRef] = useState(firebase.storage().ref());
    const [percentUploaded, setPercentUploaded] = useState(0);
    
    const closeModal = () => {
        setModal(false);
    }

    const openModal = () => {
        setModal(true);
    }

    const getPath = () => {
        if (props.isPrivateChannel) {
            return `chat/private-${channel.id}`;
        } else {
            return 'chat/public';
        }
    }

    const uploadFile = (file, metadata) => {
        const filePath = `${getPath()}${uuidv4()}.jpg`;
        const ref = props.getMessagesRef();
        setUploadTask(storageRef.child(filePath).put(file, metadata));
    }

    useEffect(() => {
        uploadTask && uploadTask.on('state_changed', snap => {
            const percentsUploaded = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
            setPercentUploaded(percentsUploaded);
            setUploadState('uploading');
        }, 
        err => {
            console.error(err);
            setErrors(err, ...errors);
            setUploadState('error');
            setUploadTask(null);
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
                messagesRef.child(channel.id)
                .push()
                .set(createMessage(downloadURL))
                .then(() => {
                    setUploadState('done');
                })
                .catch(err => {
                    console.error(err);
                    setErrors(err, ...errors);
                });
            })
            .catch(err => {
                console.error(err);
                setErrors(err, ...errors);
            })
        }); 
    }, [uploadTask]);

    const createMessage = (fileUrl = null) => {
       const message = {
           timestamp: firebase.database.ServerValue.TIMESTAMP,
           user: {
              id: user.uid,
              name: user.displayName,
              avatar: user.photoURL,
           },
       };
       if (fileUrl !== null) {
            message.image = fileUrl;
        } else {
            message.content = msg;
        }
       console.log(message);
       return message;
    }
    
    const sendMessage = () => {
        if (msg){ 
            setLoading(true);
            props.getMessagesRef()
            .child(channel.id)
            .push()
            .set(createMessage())
            .then(() => {
                setLoading(false);
                setMessage('');
                setErrors([]);
            })
            .catch(e => {
                setLoading(false);
                setErrors([e, ...errors])
            })
        } else {
            setErrors([{ message: 'Add a message' }]);
        }
    }

    return (
        <Segment className="message__form">
            <Input 
                fluid
                name="message"
                value={msg}
                style={{ marginBottom: '0.7em' }}
                label={<Button icon={'add'}/>}
                labelPosition="left"
                //placeholder={errors.some(error => error.message.includes('message')) ? 'Set the message!' : 'Write your message'}
                onChange={e => setMessage(e.target.value)}
                className={
                    errors.some(error => error.message.includes('message')) ? 'error' : ''
                }
            />
            <Button.Group icon widths="2">
                <Button 
                    onClick={sendMessage}
                    disabled={loading}
                    color="orange"
                    content="Add Reply"
                    labelPosition="left"
                    icon="edit"
                />
                <Button 
                   color="teal"
                   labelPosition="right"
                   icon="cloud upload" 
                   content="Upload Media"
                   onClick={openModal}
                   disabled={uploadState === 'uploading'}
                />
                <FileModal 
                    modal={modal}
                    closeModal={closeModal}
                    uploadFile={uploadFile}
                />
            </Button.Group>
            <ProgressBar 
                uploadState={uploadState}
                percentUploaded={percentUploaded}
            />
        </Segment>
    );
}

export default MessageForm;