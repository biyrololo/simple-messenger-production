import { Button, Divider } from "@mui/material";
import { FriendType } from "../types/Friend";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MessengerInterlocutorId } from "../pages/MessengerPage";

export default function Friend({name, id}: FriendType) {

    const interlocutorId = useContext(MessengerInterlocutorId);

    const navigate = useNavigate();

    const changeCompanion = () => {
        // console.log(id);
        navigate(`/messenger/${id}`);

    }

    return (
        <span>
            <Button className="friend" onClick={changeCompanion}
            style={
                id === interlocutorId ? {
                    backgroundColor: 'rgba(139, 195, 74, .2)',
                }:
                {}
            }
            >
                {name}
            </Button>
        </span>
    )
}