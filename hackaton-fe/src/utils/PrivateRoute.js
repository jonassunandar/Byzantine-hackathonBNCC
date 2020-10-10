import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';
import { refreshToken, logout, getAccess } from './../actions/auth';

class PrivateRoute extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    
    // componentWillReceiveProps(nextProps){
    //     const time = Math.round((new Date()).getTime() / 1000);
    //     if (time > nextProps.expiredToken) this.props.logout();
    //     else if (time > nextProps.refreshTime) this.props.refreshToken();
    // }

    render(){
        // this.props.refreshAccess();
        // const time = Math.round((new Date()).getTime() / 1000);
        // const expireTimeArr = JSON.parse(localStorage.getItem('expired') || '[0,0]')
        // const refreshTime = expireTimeArr[0]
        // const expireTime = expireTimeArr[1]
        // const type = JSON.parse(localStorage.getItem('profile') || '{}').type
        // const accessList = JSON.parse(localStorage.getItem('accessRight') || '[]');

        
        // if (time > expireTime) this.props.logout();
        // else if (time > refreshTime) this.props.refreshToken();
        const authed = localStorage.getItem('authed') || 'true';
        return (
            <Route
                render={(props) => ( authed == 'true')
                ? <Route component={this.props.component} {...props}/>
                : <Redirect to={{pathname: '/login', from: {from: this.props.location.pathname}}} />}
            />
        )
    }
}

const mapStateToProps = state => ({
    // ...state,
})
const mapDispatchToProps = dispatch => ({
    refreshToken: () => dispatch(refreshToken()),
    logout: () => dispatch(logout()),
    refreshAccess: async () => dispatch(await getAccess())
})

export default connect(mapStateToProps, mapDispatchToProps)(PrivateRoute);