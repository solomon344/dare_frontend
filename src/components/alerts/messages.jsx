import {Button,message} from 'antd';

export const Success = (msg)=>{
    message.success(msg)
}

export const error = (msg)=>{
    message.error(msg)
}

export const loading = (msg)=>{
    message.loading(msg)
}