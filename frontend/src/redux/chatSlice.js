import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        onlineUsers:[],
        messages:[],
        newMessages:[],
    },
    reducers:{
        // actions
        setOnlineUsers:(state,action) => {
            state.onlineUsers = action.payload;
        },
        setMessages:(state,action) => {
            state.messages = action.payload;
        },
        setNewMessages:(state,action) => {
            state.newMessages = action.payload;
        },
    }
});
export const {setOnlineUsers, setMessages, setNewMessages} = chatSlice.actions;
export default chatSlice.reducer;