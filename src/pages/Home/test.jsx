import { Button } from '@nextui-org/react';
import React,{useEffect} from 'react';

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

const Test = ()=>{
    let socket;
    let localStream;
    let remoteStream;
    let peerConnection
    


    const initChat = async ()=>{
        localStream = await navigator.mediaDevices.getUserMedia({video:true})
        const localpeer =  document.getElementById('localpeer')
        localpeer.srcObject = localStream
        console.log(localpeer.srcObject)
    }

    const createOffer = async()=>{
        peerConnection = new RTCPeerConnection(servers)
        const Mediastream = new MediaStream()
        const remotePeer = document.getElementById('remotepeer')
        await localStream.getTracks().forEach(track=>peerConnection.addTrack(track,localStream))
        peerConnection.ontrack = async e=>{
             e.streams[0].getTracks().forEach(track=>Mediastream.addTrack(track)) 
        }

       remotePeer.srcObject = Mediastream
       const offer = await peerConnection.createOffer()
       await peerConnection.setLocalDescription(offer)
       peerConnection.onicecandidate = async ice=>{
        const offercont = document.getElementById('offer')
        if (ice.candidate){
            offercont.value = JSON.stringify(peerConnection.localDescription)
            console.log(ice.candidate)
        }else{
            console.log('no ice candidate')
            console.log(ice.candidate)
        }
       }

       

    }
    
    
    const createAnswer = async()=>{
        peerConnection = new RTCPeerConnection(servers)
        const Mediastream = new MediaStream()
        const remotePeer = document.getElementById('remotepeer')
        await localStream.getTracks().forEach(track=>peerConnection.addTrack(track,localStream))
        peerConnection.ontrack = e=>{
            e.streams[0].getTracks().forEach(track=>Mediastream.addTrack(track)) 
        }
       
       
       remotePeer.srcObject = Mediastream
       const offer = document.getElementById('offer').value
       await peerConnection.setRemoteDescription(JSON.parse(offer))
       const answercont = document.getElementById('answer') 
       const answer =  peerConnection.createAnswer()
       await peerConnection.setLocalDescription(answer)
    

       peerConnection.onicecandidate = ice=>{
        if (ice.candidate){
           answercont.value = JSON.stringify(peerConnection.localDescription)
        }else{
            console.log('no ice candidate')
        }
       }

       console.log(peerConnection.localDescription)
    }

    const AddAnswer = async ()=>{
        const answer = document.getElementById('add_answer').value
        await peerConnection.setRemoteDescription(JSON.parse(answer))
    }
   
    useEffect(()=>{
        initChat()
        // const offer = document.getElementById('offer')
        // offer.value = 'hello world'
    },[])

    return (
        <>
        <div className='flex w-full justify-center p-2'>
        <div className=' flex items-center w-2/4 justify-between'>
            <video id='localpeer' autoPlay playsInline  className='w-[150px] h-[150px] border bg-gray-300'></video>
            <video id='remotepeer' autoPlay playsInline className='w-[150px] h-[150px] border bg-gray-300'></video>
        </div>
        </div>
        <div className='flex flex-col gap-2 items-center w-full'>
            <div className='w-2/4 flex flex-col gap-1'>
            <Button onClick={()=>createOffer()}>create offer</Button>
            <textarea name="" placeholder='waiting for offer' className='w-full h-12 outline-none border p-2' id="offer" cols="30" rows="10"></textarea>

            </div>
            <div className='w-2/4 flex flex-col gap-1'>
                <Button onClick={()=>createAnswer()}>create answer</Button>
                <textarea name="" placeholder='waiting for answer' className='w-full h-12 outline-none border p-2' id="answer" cols="30" rows="10"></textarea>
            </div>

            <div className='w-2/4 flex flex-col gap-1'>
                <Button onClick={()=>AddAnswer()}>add answer</Button>
                <textarea name="" placeholder='input answer here' className='w-full h-12 outline-none border p-2' id="add_answer" cols="30" rows="10"></textarea>
            </div>
        </div>
        </>
    )
}

export default Test