import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Routes from './components/routing/Routes';
import Navbar from './components/Layout/Navbar';
import Notification from './components/Layout/Notification';
import './App.css';

// import { ToastProvider } from 'react-toast-notifications';

// Redux
import { Provider } from 'react-redux';
import store from './store';

const App = () => {
  //Gotcha - When state updates useEffect whill be a constant loop and will always run
  //Add empty array as second param to stop this!

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <Route component={Routes} />
          </Switch>
        </Fragment>
      </Router>
      <Notification />
    </Provider>
  );
};

export default App;
