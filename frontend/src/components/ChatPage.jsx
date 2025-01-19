import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setSelectedUser } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MessageCircleCode } from 'lucide-react';
import Messages from './Messages';
import axios from 'axios';
import { setMessages } from '@/redux/chatSlice';

const ChatPage = () => {
    const [textMessage, setTextMessage] = useState("");
    const { user, suggestedUsers, selectedUser } = useSelector(store => store.auth);
    const { onlineUsers, messages } = useSelector(store => store.chat);
    const dispatch = useDispatch();

    const sendMessageHandler = async (receiverId) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/v1/message/send/${receiverId}`, { textMessage }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));
                setTextMessage("");
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    }, []);

    return (
        <div className='flex ml-[16%] h-screen bg-gray-50'>
            <section className='w-full md:w-1/4 my-8 bg-white rounded-lg shadow-lg px-4 py-6'>
                <h1 className='font-bold mb-4 px-3 text-xl text-gray-700'>{user?.username}</h1>
                <hr className='mb-4 border-gray-300' />
                <div className='overflow-y-auto h-[80vh]'>
                    {
                        suggestedUsers.map((suggestedUser) => {
                            const isOnline = onlineUsers.includes(suggestedUser?._id);
                            return (
                                <div key={suggestedUser?._id}
                                    onClick={() => dispatch(setSelectedUser(suggestedUser))} 
                                    className='flex gap-3 items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-shadow duration-300 shadow-sm hover:shadow-md'
                                >
                                    <Avatar className='w-14 h-14 rounded-full'>
                                        <AvatarImage src={suggestedUser?.profilePicture} />
                                        <AvatarFallback>DP</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col'>
                                        <span className='font-medium text-gray-800'>{suggestedUser?.username}</span>
                                        <span className={`text-xs font-semibold ${isOnline ? 'text-green-500' : 'text-red-500'} `}>{isOnline ? 'online' : 'offline'}</span>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </section>

            {
                selectedUser ? (
                    <section className='flex-1 border-l border-l-gray-300 flex flex-col h-full bg-white rounded-lg shadow-lg'>
                        <div className='flex gap-3 items-center px-3 py-2 border-b border-gray-200 sticky top-0 bg-white z-10'>
                            <Avatar className='rounded-full'>
                                <AvatarImage src={selectedUser?.profilePicture} alt='profile' />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className='flex flex-col'>
                                <span className='font-semibold text-gray-800'>{selectedUser?.username}</span>
                            </div>
                        </div>
                        <Messages selectedUser={selectedUser} />
                        <div className='flex items-center p-4 border-t border-t-gray-200 bg-gray-50 rounded-b-lg shadow-inner'>
                            <Input 
                                value={textMessage} 
                                onChange={(e) => setTextMessage(e.target.value)} 
                                type="text" 
                                className='flex-1 mr-2 p-2 rounded-lg focus:ring focus:ring-blue-500 border-gray-300' 
                                placeholder="Type a message..." 
                            />
                            <Button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200' onClick={() => sendMessageHandler(selectedUser?._id)}>
                                Send
                            </Button>
                        </div>
                    </section>
                ) : (
                    <div className='flex flex-col items-center justify-center mx-auto text-gray-600'>
                        <MessageCircleCode className='w-32 h-32 my-4 text-blue-500' />
                        <h1 className='font-semibold text-lg'>Your messages</h1>
                        <span>Send a message to start a chat.</span>
                    </div>
                )
            }
        </div>
    )
}

export default ChatPage;
