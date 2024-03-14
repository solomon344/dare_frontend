import './Login.css'
import React from 'react'
import {Image,Input as Inpt,Button,Card,CardBody,CardFooter,CardHeader,Divider} from '@nextui-org/react'
import { Input } from 'antd'

const Signup = ()=>{
   
    return (
        <>
        <div id='side1' className='relative w-[100dvw] h-[100dvh]'>
            <div className='flex flex-col gap-1 font-bold text-white text-pretty text-[50px] w-full fixed top-[20%] left-[20%]'>
                <p>Truth</p>
                <p>Or</p>
                <p>Dare</p>
            </div>
            <div className='w-[35%] fixed top-[20%] right-[30%] '>
            <Card shadow='none' className=''>
                        <CardHeader>
                          <p>Signup now and enjoy</p>
                        </CardHeader>
                        <CardBody>
                            <form action="">
                            <div className='flex flex-col gap-2'>
                            <div className='flex gap-2 items-center'>
                            <Inpt placeholder='first' size='xs'/>
                            <Inpt placeholder='last' size='xs'/>
                            </div>
                            <div>
                                <Inpt placeholder='username' size='xs'/>
                            </div>
                            <div>
                                <Inpt placeholder='email' type='email' size='xs'/>
                            </div>
                            <div className='flex gap-2 items-center '>
                                <Inpt placeholder='password' type='password' size='xs'/>
                                <Inpt placeholder='confirm password' type='password' size='xs'/>
                            </div>
                            <div className='w-full'>
                                <Button color='primary' variant='ghost' fullWidth>Signup now</Button>
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

export default Signup