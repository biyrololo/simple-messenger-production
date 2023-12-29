type MessageType = {
    text: string,
    id?: number,
    user_id: number;
}

type MessageResponseType = {
    user_id1: number;
    user_id2: number;
    id: number;
    text: string;
    author: number;
}

export type {MessageType, MessageResponseType};