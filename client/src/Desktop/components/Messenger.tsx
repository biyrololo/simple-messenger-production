import { IconButton, TextField } from "@mui/material";
import { useState, useRef, useContext, useEffect } from "react";
import { MessageType, MessageResponseType } from "../types/Messege";
import SendIcon from '@mui/icons-material/Send';
import './messenger.css';
import { MessengerInterlocutorId } from "../pages/MessengerPage";
import { UserInfoContext } from "../../App";
import axios from "axios";

export default function Messenger() {

    const interlocutorId = useContext(MessengerInterlocutorId);

    const inputRef = useRef<HTMLInputElement>(null);

    const user = useContext(UserInfoContext);

    const user_id = user.userInfo.id;

    const [messages, setMessages] = useState<MessageType[]>([]);

    const [socket, setSocket] = useState<WebSocket | null>(null);

    const sendMessage = () => {
        if(!inputRef.current) {
            return;
        }
        const text = inputRef.current.value;
        if(text.length === 0) return;
        if(!socket) return;
        const sendedMessage = {
            user_id1: user_id,
            user_id2: interlocutorId,
            text,
            author: user_id
        }
        socket.send(JSON.stringify(sendedMessage));
        inputRef.current.value = '';
        console.log('Отправил ', sendedMessage);
    }

    useEffect(() => {
        const cancelTokenSource = axios.CancelToken.source();
        const url = `me?id1=${user_id}&id2=${interlocutorId}`;
        axios.get(url, {
            cancelToken: cancelTokenSource.token
        })
        .then((response) => {
            const data : MessageResponseType[] = response.data;
            setMessages(data.map((message) => {
                return {
                    text: message.text,
                    user_id: message.author
                }
            })) 
        })
        .catch((error) => {
            console.log(error);
        })
        return () => {
            cancelTokenSource.cancel();
        }
    },
    [user_id, interlocutorId]
    )

    useEffect(() => {
        const newSocket = new WebSocket(`wss://simple-messenger-server.onrender.com:8000/me/ws/${user_id}/${interlocutorId}`);

        newSocket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => {
                return [
                    ...prevMessages,
                    {
                        text: data.text,
                        user_id: data.author
                    }
                ]
            })
        }

        setSocket(newSocket);
        return () => {
            newSocket.close();
        }
    }, [user_id, interlocutorId]);

    return (
        <div id="messenger">
            {
                interlocutorId === -1 ? <span id="choose-interlocutor-text">Выберите собеседника</span> :
                <section id='messages'>
                    {
                        messages.length === 0 ? <span id="no-messages-text">История сообщений пуста</span> : null
                    }
                    {
                        messages.map((message, index) =>(
                            <div
                            key={index}
                            data-from={message.user_id === user_id ? 'me' : 'other'}
                            >
                                {
                                    message.text
                                }
                            </div>
                        ))
                    }
                </section>
            }
            <section id='input'>
                <TextField
                style={
                    {
                        flexGrow: 1
                    }
                }
                color="secondary"
                multiline
                placeholder="Написать сообщение..."
                inputRef={inputRef}
                disabled={interlocutorId === -1}
                />
                <IconButton style={{marginBottom: '8px'}} onClick={sendMessage} disabled={interlocutorId === -1} color="secondary">
                    <SendIcon/>
                </IconButton>
            </section>
        </div>
    )
}