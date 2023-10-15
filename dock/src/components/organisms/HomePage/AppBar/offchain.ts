import axios from "axios";

interface CreateUserInterface {
    id: string,
    chaos_user_id: string,
    address: string
}
interface createvesselInterface
{
    id: string,
    name: string,
    description: string,
    chaose_channel_id: string,
    categories: Array<string>,
    creator_id: string

}


export async function createUserOffchain(address: string, chaos_user_id: string): Promise<string>{
    const response = await axios.post<CreateUserInterface>("http://localhost:8089/users", {
        address: address,
        chaos_user_id: chaos_user_id,
    });

    console.log(response);
    return response.data.id
}
export async function createVesselOffchain(name: string, description: string, chaose_channel_id: string, categories: Array<string>, creator_id: string): Promise<string> {
    const response = await axios.post<createvesselInterface>("http://localhost:8089/vessels", {
        name: name,
        description: description,
        chaose_channel_id: chaose_channel_id,
        categories: categories,
        creator_id: creator_id
    });

    console.log(response);
    return response.data.id
}
