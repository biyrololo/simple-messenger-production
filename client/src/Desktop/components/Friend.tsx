import { Button } from "@mui/material";
import { FriendType } from "../types/Friend";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MessengerInterlocutorId } from "../pages/MessengerPage";
import GetAvatar from "../../features/getAvatarByName";

export default function Friend({name, id}: FriendType) {

    const interlocutorId = useContext(MessengerInterlocutorId);

    const navigate = useNavigate();

    const changeCompanion = () => {
        if(id === -2) {
            return;
        }
        // console.log(id);
        navigate(`/messenger/${id}`);

    }

    return (
        <span>
            <Button className="friend" onClick={changeCompanion}
            startIcon={<GetAvatar name={name}/>}
            style={
                {
                    ...{justifyContent: "flex-start"},
                    ...(id === interlocutorId ? {
                        backgroundColor: 'rgba(139, 195, 74, .2)',
                    }:
                    {})
                }
            }
            >
                {name}
            </Button>
        </span>
    )
}