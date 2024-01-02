
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { CircularProgress, Divider, IconButton, InputAdornment, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import GetAvatar from '../../features/getAvatarByName';
import { UserInfoContext } from "../../App";
import { useState, useRef, useContext, useEffect } from "react";
import axios from 'axios';

export default function InterlocutorProfile({interlocutorId}: {interlocutorId: number}) {

    const navigate = useNavigate();

    const [name, setName] = useState<string>('');

    const handleGoBack = () => {
        navigate(-1);
    }

    useEffect(() => {
        const CancelToken = axios.CancelToken.source();
        const url = `get-username/${interlocutorId}`;
        axios.get(url, {
            cancelToken: CancelToken.token
        })
        .then((res) => {
            setName(res.data);
        })
        .catch((error) => {
            console.log(error);
        })
        return () => {
            CancelToken.cancel();
        }
    },
    [interlocutorId]);

    return (
        <>
            <section className='d-flex ai-center g-10'>
                <IconButton onClick={handleGoBack}>
                    <ArrowBackIcon/>
                </IconButton>
                <GetAvatar name={name || '0'}/>
                <h3>
                    {name}
                </h3>
            </section>
            <Divider/>
        </>
    )
}