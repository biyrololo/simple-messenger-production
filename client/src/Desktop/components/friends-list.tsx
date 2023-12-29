import './friends-list.css';
import { FriendType } from "../types/Friend";
import { useEffect, useState } from 'react';
import Friend from './Friend';
import { Button, Divider } from '@mui/material';
import { useContext } from "react";
import { UserInfoContext } from "../../App";
import axios from 'axios';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from "react-router-dom";

type UserType = {
    id: number;
    username: string;
}

export default function FriendsList() {

    const navigate = useNavigate();

    const userInfo = useContext(UserInfoContext);

    const [friends, setFriends] = useState<FriendType[]>([]);

    useEffect(
        () => {
            const cancelToket = axios.CancelToken.source();
            const url = 'users';
            axios.get(url, {
                cancelToken: cancelToket.token
            })
            .then((res) => {
                const data : UserType[] = res.data;
                setFriends(data.map((user) => {
                    return {
                        name: user.username,
                        id: user.id
                    }
                }).filter((friend) => friend.id !== userInfo.userInfo.id));
            })
            .catch((error) => {
                console.log(error);
            })
            return () => {
                cancelToket.cancel();
            }
        },
        [userInfo.userInfo.id]
    )

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    }

    return (
        <div id='friends'>
            <Button color="error" className='d-flex g-5' onClick={handleLogout}>
                Выйти
                <LogoutIcon style={
                    {
                        fontSize: '18px'
                    }
                }/>
            </Button>
            <Divider />
            {
                friends.map((friend, index) => 
                    <Friend key={index} name={friend.name} id={friend.id}/>
                )
            }
        </div>
    )
}