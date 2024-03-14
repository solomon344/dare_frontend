import React from 'react';
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

const CheckAuthenticated = ({Component})=>{
    const user =  useSelector(state=>state.user)
    const session  = Cookies.get('sessionid')
    const csrftoken = Cookies.get('csrftoken')
    if (user.isAuthenticated === true && session && csrftoken){
        return window.location.pathname = '';

    }else{
        return <Component/>
    }
}

export default CheckAuthenticated