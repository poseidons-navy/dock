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

export interface MembershipReturn {
    id: string,
    user_id: string,
    chaos_participant_id: string,
    role: string,
    vessel_id: string,
    attached_account_data: string
}

export interface MembershipParams {
    user_id: string,
    chaos_participant_id:  string, // chaos participant id
    role: string,
    essel_id: string
}

export async function createMembership(url: string, params: MembershipParams): Promise<MembershipReturn> {
    try {
        let result = await axios.post(`${url}/users/memberships`, params);
        return result.data;
    } catch(err) {
        console.log(err);
        throw new Error("Could Not Create Membership")
    }
}

export async function createPost(url: string, params: )


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
