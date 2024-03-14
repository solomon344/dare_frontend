import React from "react";
import { Avatar } from "antd";
import { Emoji } from "emoji-picker-react";
export const PeerMessage = ({message,image}) =>{

    return (
        <div className="w-full flex justify-start p-1">
            <div className="max-w-[75%]  flex gap-2 items-center">
                <div>
                    <Avatar  src={image} name="SW"/>
                </div>
                <div className="text-sm text-white bg-pink-400 p-2 rounded-lg">
                    <p>
                        {message || <Emoji unified="1f423"/>}
                    </p>
                </div>
            </div>
        </div>
    )
}

export const MyMessage = ({message,image}) =>{

    return (
        <div className="w-full flex justify-end p-1">
            <div className="max-w-[75%] flex gap-2 items-center ">
                <div className="text-sm text-white bg-blue-400 p-2 rounded-lg">
                    <p>
                        {message || <Emoji unified="1f423"/>}
                    </p>
                </div>
                <div>
                    <Avatar  src={image}  name="SW"/>
                </div>
            </div>
        </div>
    )
}

