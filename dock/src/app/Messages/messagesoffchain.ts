import axios from "axios";

interface CreateContentInterface {
    user_id: string,
    type: string
    chaos_message_id: string,
}
interface CreatePollInterface {
    user_id: string,
    type: string
    chaos_message_id: string,
}
interface CreateInvitationInterface {
    user_id: string,
    type: string
    chaos_message_id: string,
}
interface getUserInterface{
    address: string
}
export async function createPostOffchain(user_id: string, type: string, chaos_message_id: string) {
    const response = await axios.post("http://localhost:8089/posts/content", {
        user_id: user_id,
        type: type,
        chaos_message_id: chaos_message_id
    });

    console.log(response);
}
export async function createContentOffchain(user_id: string, type: string, chaos_message_id: string) {
    const response = await axios.post("http://localhost:8089/posts/content", {
        user_id: user_id,
        type: type,
        chaos_message_id: chaos_message_id
    });

    console.log(response);
}
export async function createPollOffchain(user_id: string, type: string, chaos_message_id: string) {
    const response = await axios.post("http://localhost:8089/posts/poll", {
        user_id: user_id,
        type: type,
        chaos_message_id: chaos_message_id

    });

    console.log(response);
}
export async function createInvitationOffchain(user_id: string, type: string, chaos_message_id: string) {
    const response = await axios.post("http://localhost:8089/posts/invitation", {
        user_id: user_id,
        type: type,
        chaos_message_id: chaos_message_id
    });

    console.log(response);
}
export async function getUser(address: string): Promise<string> {
    const response = await axios.get<getUserInterface>("http://localhost:8089/users",
        {
            params: {
                address: address,
            },
        }

    );
    return response.data.
}
