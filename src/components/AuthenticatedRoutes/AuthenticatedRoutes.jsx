import React from 'react';
import { useSelector } from 'react-redux'
import Login from '../../pages/Login/Login';
import Play from '../../pages/Play/play';
import { Route,useLocation,redirect } from 'react-router-dom';
import Cookies from 'js-cookie';

const AllowAuthenticatedOnly = ({Component})=>{
    const user = useSelector(state=>state.user)
    const session  = Cookies.get('sessionid')
    const csrftoken = Cookies.get('csrftoken')
    console.log(session)
    console.log(csrftoken)
    if(user.isAuthenticated === true && session && csrftoken){
       return <Component/>
    }else{
        return  window.location.pathname = '/login'
    }
    
}

export default AllowAuthenticatedOnly