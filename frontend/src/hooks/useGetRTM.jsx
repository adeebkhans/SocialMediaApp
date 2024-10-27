import { setMessages, setNewMessages } from "@/redux/chatSlice";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetRTM = () => {
    const dispatch = useDispatch();
    const { socket } = useSelector(store => store.socketio);
    const { messages, newMessages } = useSelector(store => store.chat);
    // const { newMessages } = useSelector(store => store.chat);
    useEffect(() => { 
        socket?.on('newMessage', (newMessage) => {
            dispatch(setMessages([...messages, newMessage]));
            dispatch(setNewMessages(newMessages.length ? [...newMessages, newMessage] : [newMessage])); // bruh i cried to get this line correct
        })

        return () => {
            socket?.off('newMessage');
        }
    }, [messages, setMessages, newMessages]);
};
export default useGetRTM;