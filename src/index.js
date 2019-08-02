import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css'
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';

import {BrowserRouter as Router, Switch, Route, withRouter} from 'react-router-dom';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Spinner from './components/Spinner/Spinner';
import firebase from './firebase';
import { createStore } from 'redux';
import { Provider, connect } from 'react-redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './reducer';
import { setUser, clearUser } from './actions'

const store = createStore(rootReducer, composeWithDevTools());
//let controller = new window.AbortController(); 

const Root = (props) => {
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                props.setUser(user);
                props.history.push('/');
            } else {
                props.history.push('/login');
                props.clearUser();
            }
        });
    }, []);
    return props.isLoading ? <Spinner /> : (
        <Switch>
            <Route exact path='/' component={App} />
            <Route  path='/login' component={Login}/>
            <Route  path='/register' component={Register}/>
        </Switch>
    );
};

const mapStateToProps = state => ({
    isLoading: state.user.isLoading
});

const RootWithAuth = withRouter(connect(mapStateToProps, { setUser, clearUser })(Root));

ReactDOM.render(
    <Provider store={store}>
        <Router>
            <RootWithAuth />
        </Router>
    </Provider>, 
    document.getElementById('root')
);
registerServiceWorker();
