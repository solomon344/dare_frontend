import React, { useState,useEffect } from 'react';
import NavBar from '../../components/nav/Navbar';
import { Button, CardBody, CardHeader, CardFooter,Skeleton, Spinner,Card, Image, Avatar, Input } from '@nextui-org/react';
import axios from 'axios';
import { LockOutlined,UnlockOutlined,InfoOutlined,InfoCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Home_Page = ()=>{
    const [rooms,setRooms] = useState([])
    useEffect(()=>{
        axios.get('http://localhost:8000/api/rooms/all',{withCredentials:true,withXSRFToken:true})
        .then(response=>{setRooms(response.data); console.log(response.data)})
        .catch(err=>alert(err))
    },[])
    return (
        <>
        <title>Daregames home</title>
        <div className='flex flex-col bg-slate-100 bg-slate-75 h-[100dvh] items-start'>
            <NavBar/>
            <div className='w-2/4 grow overflow-y-auto overflow-x-hidden flex flex-col p-2 gap-2'>
                <Input type='search' placeholder='search rooms' variant='underlined' endContent={<i  className='fa fa-search text-gray-300'></i>}/>
                <div>
                    <p className='text-lg text-gray-500 font-bold'>
                        rooms
                    </p>
                </div>
               <div className='flex flex-col gap-2 w-full h-full'>
               {
                  rooms.length < 1?<div className='w-full h-full flex items-center justify-center'><Spinner/></div>: rooms.map(room=>{
                    return (
                        <Card className='' shadow='none'>
                            <CardHeader>
                                <div className='flex w-full justify-between'>
                                <div className='flex items-center gap-2'>
                                    <Avatar  src={`http://localhost:8000${room.created_by.profile.picture}`}/>
                                    <p className='transition delay-75 hover:underline cursor-pointer text-blue-400'>{room.created_by.username}</p>
                                </div>
                                <p>{room.name}</p>
                                <div>
                                    <InfoCircleOutlined/>
                                </div>
                                </div>
                            </CardHeader>
                            <CardBody className='pl-[3rem]'>
                                <div className=''>
                                    <p>{room.description}</p>
                                </div>
                            </CardBody>
                            <CardFooter>
                                <div className='w-full grid grid-cols-2 pl-[2rem]'>
                                    <div className='grid grid-cols-2'>
                                        <div className='flex gap-2 items-center'>
                                            {
                                                room.isprivate === true?<div className='flex items-center gap-1  '>
                                                    <LockOutlined/>
                                                    <p className='text-orange-400'>private</p>
                                                    </div>:<div className='flex items-center gap-1  '>
                                                    <UnlockOutlined/>
                                                    <p className='text-green-500'>public</p>
                                                    </div>
                                                
                                            }
                                            <p className='test-gray-300 test-sm'>
                                                {room.members.length} join(s)
                                            </p>
                                        </div>
                                        <div>
                                            
                                        </div>
                                    </div>
                                    <div className='flex justify-end items-center'>
                                        {
                                            room.isprivate === true?<div>
                                                <Button href={'http://'+location.host+'/room/'+room.room_id} size='sm' color='primary' variant='ghost'>request join</Button>
                                            </div>:<div>
                                               <Link to={'http://'+location.host+'/room/'+room.room_id}>
                                               <Button   size='sm' className='border' color='primary' variant='ghost'>join</Button>
                                                </Link> 
                                            </div>
                                        }
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    )
                  })
                   
                   
                }
               </div>
            </div>
            <Button isIconOnly radius='full' className='fixed bottom-5 bg-pink-500 right-4'><i className='fa fa-add  text-white'></i></Button>
        </div>
        </>
        
    )
}

export default Home_Page