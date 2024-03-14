import React, { useState, useEffect, useMemo, useRef } from "react";
import './home.css'
import { Button as Bt, Popover, Empty, message } from "antd";
import { Card, CardHeader, CardBody, CardFooter, Textarea, User, Chip, Button, Image, Avatar, Select, SelectItem, AvatarGroup, Skeleton } from '@nextui-org/react'
import Profile from './download.png'
import EmojiPicker, { Emoji } from "emoji-picker-react";
import { AudioOutlined, AudioMutedOutlined } from "@ant-design/icons";
import { BsCameraVideo, BsCameraVideoOff } from "react-icons/bs"
import Logo from '../../assets/logo.svg'
import { MyMessage, PeerMessage } from "../../components/nav/Meesage/Peer";
import { Success, error, loading } from "../../components/alerts/messages";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { add } from "../../states/messageSlice/MessageSlice";
import $ from 'jquery'
import EventEmmiter from 'events'
import axios from "axios";



var event = new EventEmmiter()
const items = [
    {
        name: 'solomon',
        pic: <Avatar key={'solomon'} title='solomon' size="sm" src={Profile} />
    },
    {
        name: 'lucrisher',
        pic: <Avatar key={'lucrisher'} title='lucrisher' size="sm" src={Profile} />
    },
    {
        name: 'awa',
        pic: <Avatar key={'awa'} title='awa' size="sm" src={Profile} />
    },
    {
        name: 'isha',
        pic: <Avatar key={'isha'} title='isha' size="sm" src={Profile} />
    },
    {
        name: 'anna',
        pic: <Avatar key={'anna'} title='anna' size="sm" src={Profile} />
    }
]

const Play = () => {
    const [message_list, setMessage_List] = useState([])
    const [myTurn, setMyTurn] = useState(false)
    const [open, setOpen] = useState(false);
    const [socket_open, setSocket_Open] = useState(false);
    const [micEnabled, setMicEnabled] = useState(false);
    const [vidEnabled, setVidEnabled] = useState(false);
    const [messageApi, ContextHolder] = message.useMessage()
    const [words, setWords] = useState('')
    const messages = useSelector(state => state.message)
    const dispatch = useDispatch();
    const user = useSelector(state => state.user)
    const { room_id } = useParams()
    const [room_members, setRoom_Members] = useState([1,2])
    const [peerConnections, setPeerConnections] = useState([])
    const [track_list,setTrack_List] = useState([])


    //  the urls of the stun servers for RTC PeerConnectivity
    const servers = {
        'iceServers': [
            { 'urls': 'stun:stun.l.google.com:19302' },
            { 'urls': 'stun:stun2.1.google.com:19302' },
            { 'urls': 'stun:stun3.l.google.com:19302' },
            { 'urls': 'stun:stun4.l.google.com:19302' },
            { 'urls': 'stun:stun.chathelp.ru:3478' },
            { 'urls': 'stun:stun.cloopen.com:3478' },
            { 'urls': 'stun:stun.datamanagement.it:3478' },
            { 'urls': 'stun:stun.cryptonit.net:3478' },
            { 'urls': 'stun:stun.drogon.net:3478' },
            { 'urls': 'stun:stun.duocom.es:3478' }
        ]
    }


   

    // useEffect(()=>{
        
    // },[])

    
    



    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };




    //    create answer when an offer is recieved

    // scroll the chat container element to the bottom 
    useEffect(() => {
        
        const chat_container = document.getElementById('chat-cont')
        chat_container.scrollTop = chat_container.scrollHeight
    }, [words])

   

    //  this is the websocket of our app
    useEffect(() => {
        
        let socket;
        let localStream;
        let remoteStream;


        const initChat = async ()=>{
            await navigator.mediaDevices.getUserMedia({video:true}).then(stream=>localStream = stream).then(()=>event.emit('done')).then(()=>console.log(localStream))
            // const localpeer =  document.getElementById('localpeer')
            // localpeer.scrObject = localStream
        }


        event.on('newUser',(userobject)=>{
            console.log('new user joined')
            let find  = room_members.filter((member)=>member.id === userobject.id)
            
            if (find.length < 1 && userobject.id !== user.data.id ){
                setRoom_Members(members=>[...members,userobject])

            }else{
                console.log('user already exixted or is me')
            }
            
        })

        const CreateOffer = async (peerConnection,to_id)=>{

            peerConnection.ontrack = async e=>{
                const Media = new MediaStream()
                await e.streams[0].getTracks().forEach(track=>{
                    Media.addTrack(track)
                })
                setTrack_List(tracks=>[...tracks,Media])
            }

            await localStream.getTracks().forEach(async track=>await peerConnection.addTrack(track,localStream))
            
            const offer = peerConnection.createOffer()
            await peerConnection.setLocalDescription(offer)
            peerConnection.onicecandidate = async e=>{
                if (e.candidate){
                    console.log('ice candidate added')
                }else{
                    send_message({offer:peerConnection.localDescription},user.data.id,to_id,1,'fdf','offer')
                    setPeerConnections(connections=>[...connections,{peerConnection:peerConnection,user:to_id}])
                    console.log('offer created and was sent to '+to_id)
                
                }
            }
        }


        const createAnswer = async (from_id,for_id,offer)=>{
            if (user.data.id === for_id && user.data.id !== from_id){
                const peerConnection = new RTCPeerConnection(servers)

            peerConnection.ontrack = e=>{
                const Media = new MediaStream()
                e.streams[0].getTracks().forEach(track=>{
                    Media.addTrack(track)
                })
                setTrack_List(tracks=>[...tracks,Media])
            }

            const answer = peerConnection.createAnswer()
            await peerConnection.setLocalDescription(answer)
            await peerConnection.setRemoteDescription(offer)

            peerConnection.onicecandidate  = async e=>{
                if (e.candidate){
                    console.log('candidate generated for user'+' '+from_id)
                }else{
                    send_message({answer:peerConnection.localDescription},user.data.id,from_id,1,'fdf','answer')
                    setPeerConnections(connections=>[...connections,{peerConnection:peerConnection,user:from_id}])
                    console.log('answer created and sent to '+from_id)
                }
            }
            }else{
                console.log('this offer is not for me, or it is my own offer')
            }

        }

        const HandleAnswer = (for_user,from_user,answer)=>{

            if (user.data.id === for_user && user.data.id !== from_user){

                const find_connection = peerConnections.filter(connection=>connection.user === from_user)
                const peerConnection = find_connection[0]
                peerConnection.setRemoteDescription(answer)
            }else{
                console.log('not my answer')
            }
        }
       
       event.on('done',(e)=>{
        room_members.map(member=>{
            const peerConnection = new RTCPeerConnection(servers)
            CreateOffer(peerConnection,member)
            
        })
       })
        //  Initiating a mediaStream of the current(local) user
         
        const HandleNew = (user_id)=>{
            event.emit('newUser',{id:user_id})
            console.log('emitted newUser event')
        }
        function sendUserJoinNotification(){
            setTimeout(()=>{
                socket.send(JSON.stringify({ 'message':'new', 'from_id':user.data.id,'to_id':1,'group_id': 1,'msg_type':'new' }))
                console.log('sent user join message')
                clearTimeout()
            },7000)
    
            return clearTimeout()
           }

           initChat()



        const start = () => {
            
            socket = new WebSocket('ws://localhost:8000/ws/play/test/')
            

            socket.onopen = () => {
                messageApi.open({
                    key: 'updatable',
                    type: 'success',
                    content: 'connected'
                })
                sendUserJoinNotification()
                // console.log('connected')
            }

            socket.onmessage = (msg) => {
                const prepared_msg = JSON.parse(msg.data)
                switch (prepared_msg.msg_type) {
                    case 'answer':
                        HandleAnswer(prepared_msg.to_id,prepared_msg.from_id,prepared_msg.message.answer)
                        break;
                    case 'offer':
                        createAnswer(prepared_msg.from_id,prepared_msg.to_id,prepared_msg.message.offer)
                        break;
                    case 'msg':
                        dispatch(add(prepared_msg))
                        break;
                    case 'new':
                        HandleNew(prepared_msg.from_id)
                        
                }

                // alert(JSON.parse(msg).message)
                // dispatch(add(prepared_msg))
            }

            socket.onclose = (e) => {
                messageApi.open({
                    key: 'updatable',
                    type: 'loading',
                    content: 'reconnecting...',
                    duration: 50000

                })
                socket.close()
                start()
            }
            $('form#messageForm').on('submit', (e) => {
                e.preventDefault()
                socket.send(JSON.stringify({ 'message': $('#formInput').val(), 'from_id': user.data.id,'to_id':1,'group_id': 1,'msg_type':'msg' }))
                setWords('')


            })
        }

       start()

       

        function send_message(message_string, from_id,to_id,group_id, image_url,type) {
            socket.send(JSON.stringify({ 'message': message_string, 'from_id': from_id,'to_id':to_id,'group_id': group_id, 'image': image_url,'msg_type':type }))
        }

        return () => {
        //    socket.close()
        }
    },[])




    //  this function sends message to our websocket server
    


    return (
        <>
            {ContextHolder}
            <div className="bg-gray-100  w-[100dvw] h-[100dvh]">

                <div className="w-full h-full flex p-2 pb-0">

                    {/* section 1 */}
                    <div className="w-[17%] h-full pt-4 pb-0 grid grid-cols-1 grid-rows-2">
                        <Card fullWidth>
                            <CardHeader className="border-b text-white p-2 bg-pink-400">
                                <p>Room Name</p>
                            </CardHeader>
                            <CardBody className="chat-cont h-full overflow-y-auto">
                                <div className="h-full w-full ">
                                    <div className="w-full h-full flex flex-col gap-2">

                                        {
                                            items.map(item => {
                                                return (
                                                    <div key={item.name} className="w-full flex items-center gap-4 justify-start hover:bg-gray-100">
                                                        <Avatar size="xs" src={Profile} />
                                                        <div className="flex flex-col gap-1">
                                                            <div className='flex justify-between w-full items-center gap-2'>
                                                                <p className="font-bold">{item.name}</p>
                                                                <p size="xs" color='primary'>5</p>
                                                            </div>
                                                            <p className="font-thin">@A member</p>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </div>



                    {/* section 2 (middle section) */}
                    <div className="w-[50%] p-4 flex flex-col gap-2">
                        <div className="w-full flex items-center justify-between">
                            <Card shadow="none">
                                <CardBody>
                                    <div className="">
                                        <Image className="w-[100px]" src={Logo} />
                                    </div>
                                </CardBody>
                            </Card>
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col gap-1 items-center">
                                    <Avatar size="sm" src={Profile} />
                                    <p className="text-xs">solomon</p>
                                </div>
                                <i className="fa fa-arrow-right-long text-gray-600"></i>
                                <div className="flex flex-col gap-1 items-center">
                                    <Avatar size="sm" src={Profile} />
                                    <p className="text-xs">lucrisher</p>
                                </div>
                            </div>
                            <Button className='text-white  bg-pink-400 shadow-md' isIconOnly color="none" radius='full'>
                                <i className="fa fa-add"></i>
                            </Button>
                        </div>
                        <div className="h-5/6 w-full ">
                            <Card shadow="none" className="h-full p-0">
                                <CardBody className="p-0">
                                    <div className="grid grid-cols-3 ">
                                        {/* <div className="h-full w-full">
                                            <video className="h-full w-full"  id="localpeer"></video>
                                            <video className="h-full w-full"  id="remotepeer"></video>
                                        </div> */}
                                        {
                                            track_list.map(item => {
                                                return (
                                                    <div>
                                                        <video className="video" src={item} />
                                                    </div>
                                                )
                                            })
                                        }

                                    </div>

                                </CardBody>
                                <CardFooter className="bg-pink-400">
                                    <div className="flex gap-2 w-full justify-center">
                                        <div>
                                            <Button onClick={() => setMicEnabled(!micEnabled)} color="none" className='text-white text-lg font-bold' isIconOnly>
                                                {
                                                    micEnabled === true ? <AudioOutlined /> : <AudioMutedOutlined />
                                                }
                                            </Button>
                                        </div>

                                        <div>
                                            <Button onClick={() => setVidEnabled(!vidEnabled)} color="none" isIconOnly>
                                                {
                                                    vidEnabled === true ? <BsCameraVideo className='text-white text-xl font-bolder' /> : <BsCameraVideoOff className='text-white text-xl font-bolder' />
                                                }
                                            </Button>
                                        </div>


                                    </div>
                                </CardFooter>
                            </Card>
                        </div>

                        <div className="w-full rounded-md bg-white box-shadow p-2">
                            <div className="flex gap-2 w-full">
                                <form action="" className="p-0 overflow-hidden grow">
                                    {
                                        myTurn === true ? <textarea style={{ resize: 'none' }} placeholder='enter question' rows={1} className="p-2 w-full bg-inherit outline-none">

                                        </textarea> : <textarea disabled style={{ resize: 'none' }} placeholder='enter question' rows={1} className="p-2 w-full h-full bg-inherit outline-none">

                                        </textarea>
                                    }
                                </form>
                                <Select label='answer type' size="sm" className="w-1/5 " items={items}>
                                    {
                                        item => <SelectItem key={item.name}>{item.name}</SelectItem>
                                    }
                                </Select>
                            </div>
                        </div>
                    </div>



                    {/* section 3 */}
                    <div className="w-[33%] h-full">
                        <Card shadow="none" className="h-full rounded-lg  rounded-b-none p-0 relative">
                            <CardHeader prefix="hello" className="border-b  text-white p-2 bg-pink-400 flex justify-between">
                                <p>Room Name</p>
                                <div>
                                    <AvatarGroup max={3}>
                                        {
                                            items.map(item => item.pic)
                                        }
                                    </AvatarGroup>
                                </div>
                            </CardHeader>

                            <CardBody id="chat-cont" className="p-2 pb-0 pt-0 chat-cont h-5/6 w-full overflow-x-hidden overflow-y-auto">
                                <div className="flex flex-col h-full w-full  gap-2 ">
                                    {
                                        messages.length > 0 ? messages.map(msg => {
                                            const key = Math.random()
                                            return (
                                                <MyMessage key={key} message={msg.message} image={Profile} />
                                            )
                                        }) : <div className="w-full h-full flex justify-center items-center"><Empty description={
                                            <p className="text-gray-400">
                                                Start Messaging
                                            </p>
                                        } image={<i className="fa fa-envelope text-gray-200"></i>} /></div>

                                    }

                                </div>
                            </CardBody>

                            <CardFooter className="border-t ">
                                <form id='messageForm' className="w-full h-full">
                                    <div className="w-full p-0 flex items-center gap-2 h-full">
                                        <Popover
                                            content={<EmojiPicker searchDisabled={true} onEmojiClick={emoji => setWords(words, <Emoji unified={emoji.unified} />)} reactionsDefaultOpen={true} emojiStyle="facebook" />}
                                            trigger="hover"

                                            onOpenChange={handleOpenChange}
                                        >
                                            <Button color='none' isIconOnly><i className="fa-regular fa-smile text-gray-600"></i></Button>
                                        </Popover>
                                        <textarea id='formInput' value={words} onChange={item => setWords(item.target.value)} style={{ resize: 'none' }} rows={1} className="border-0 chat-cont h-full  outline-none w-full border-l p-1" placeholder="enter message">

                                        </textarea>
                                        <Button color='none' type='submit' isIconOnly><i className="fa-regular fa-paper-plane  text-gray-600"></i></Button>
                                    </div>
                                </form>
                            </CardFooter>
                        </Card>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Play