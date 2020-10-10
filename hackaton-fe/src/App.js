import React, {Fragment} from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';

import Navbar from './component/Navbar';
import Login from './container/Login';
import Register from './container/Register';

import Dashboard from './container/dashboard/index';

import Profile from './container/profile/index';
import ProfileEdit from './container/profile/edit';

function tes() {
  return (
    <div> yeeahh </div>
  )
}

function App() {
  return (
    <div className="">
     <Router>
         <section className='section'>
           <Switch>
             <Route exact path="/login" component={Login}/>
             <Route exact path="/register" component={Register}/>
             <Fragment>
                 {/* <Header /> */}
                 <div style={{display: 'flex'}}>
                   <Navbar>
                     <Switch>
                         <PrivateRoute exact path="/dashboard/" accessName='Event' component={Dashboard} />

                         <PrivateRoute exact path="/profile/" accessName='Event' component={Profile} />
                         <PrivateRoute exact path="/profile-edit" accessName='Event Type' component={ProfileEdit} />

                         <Route render={() => <Redirect to="/login" />} />
                     </Switch>
                   </Navbar>
                 </div>
                 {/* <Footer /> */}
             </Fragment>
           </Switch>
         </section>
     </Router>
   </div>
 );
}

export default App;
