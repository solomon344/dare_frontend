import './Login.css'
import React,{useEffect,useState} from 'react';
import { Input } from 'antd';
import {Image,Input as Inpt,Button,Card,CardBody,CardFooter,CardHeader,Divider} from '@nextui-org/react'
import $ from 'jquery'
import { useSelector,useDispatch } from 'react-redux';
import { change } from '../../states/userSlice/UserSlice';
import axios from 'axios'
import Cookies from 'js-cookie'

const Login = ()=>{
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const user = useSelector(state=>state.user)
  const dispatch = useDispatch()
    return (
        <>
        <title>Login | Daregames</title>
        <div id='side1' className='relative w-[100dvw] h-[100dvh]'>
            <div className='flex flex-col gap-1 font-bold text-white text-pretty text-[50px] w-full fixed top-[20%] left-[20%]'>
                <p>Truth</p>
                <p>Or</p>
                <p>Dare</p>
            </div>
            <div className='w-[25%] fixed top-[20%] right-[30%] '>
            <Card shadow='none' className=''>
                        <CardHeader>
                          <p>Login</p>
                        </CardHeader>
                        <CardBody>
                            <form onSubmit={e=>{
                                 const csrftoken = Cookies.get('csrftoken')
                                 e.preventDefault()
                                 axios({
                                    method:"post",
                                    url:'http://localhost:8000/api/login',
                                    data:{email:email,password:password},
                                    headers:{
                                        'X-CSRFToken':csrftoken,
                                    },
                                    withCredentials:true
                                })
                                 .then(response=>{
                                    dispatch(change({isAuthenticated:true,data:response.data.user}))
                                    window.location.pathname = '';
                                 })
                                 .catch(error=>alert(error))
                                //  $.ajax({
                                //      type:'POST',
                                //      url:,
                                //      xhrFields:{
                                //         withCredentials: true
                                //      },
                                //     //  headers:{
                                //     //     //  'csrfmiddlewaretoken':csrftoken,
                                //     //     //  'csrftoken':csrftoken,
                                //     //     //  'csrfToken':csrftoken,
                                //     //      "X-CSRFToken":csrftoken,
                                //     //  },
                                //      data:$('form#loginform').serialize(),
                                //      success:response=>{
                                //          console.log(response)
                                //      },
                                //      error:response=>{
                                //          alert(response)
                                //      }
                                //  })
                            }} id='loginform' action="">
                            <div className='flex flex-col gap-2'>
                            <div>
                                <Inpt onChange={e=>setEmail(e.target.value)} placeholder='email' name='email' size='xs'/>
                            </div>
                            <div>
                                <Inpt onChange={e=>setPassword(e.target.value)} placeholder='password' name='password' size='xs'/>
                            </div>
                            <div className='w-full'>
                                <Button type='submit' color='primary' variant='ghost' fullWidth>Login</Button>
                            </div>
                            </div>
                            </form>
                            <div className='flex items-center w-full gap-2 mt-4 mb-4'>
                                <span className='h-[1px] grow bg-gray-200'></span>
                                <p>Or</p>
                                <span className='h-[1px] grow bg-gray-200'></span>
                            </div>
                        </CardBody>
                    </Card>
                
            </div>

        </div>
        </>
    )
}

export default Login