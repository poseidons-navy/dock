enum ErrorMessages {
    "NOT_GET_VESSELS"= "Could Not Get Vessels",
    "NOT_CREATE_VESSEL" = "Could Not Create Vessel",
    "NOT_GET_USER" = "Could Not Get User From Address",
    "NOT_GET_USER_VESSELS" = "Could Not Get User Vessels",
    "NOT_GET_VESSEL" = "Could Not Get Vessel"
}


import axios, {AxiosResponse} from "axios"
interface CreateVessel {
    id: string,
    name: string,
    description: string,
    chaose_channel_id: string,
    categories: string[],
    creator_id: string
}

export interface Creator {
    id: string,
    address: string,
    chaos_user_id: string
}

export interface GetVessels {
    id: string,
    name: string,
    description: string,
    chaose_channel_id: string,
    categories: string[],
    creator_id: string,
    creator: Creator,
    members: Membership[]
}

export async function createVessel(url: string, params: CreateVessel): Promise<CreateVessel> {
    // Make a request to the server to get a list of vessels
    try {
        let result = await axios.post(`${url}/vessels/`, params);
        return result.data;
    } catch(err) {
        console.log(err);
        throw new Error(ErrorMessages['NOT_CREATE_VESSEL']);
    }
}

export async function getVessels(url: string): Promise<GetVessels[]> {
    try {
        let result = await axios.get(`${url}/vessels`);
        console.log(result.data)
        return result.data;
    } catch(err) {
        console.log(err);
        throw new Error(ErrorMessages["NOT_GET_VESSELS"]);
    }
}
enum MembershipRoles {
    member,
    founder,
    creator,
    specialist,
    invitee,
    invited_founder,
}

export interface Membership {
    id: string,
    user_id: string,
    chaos_participant_id: string,
    role: MembershipRoles,
    vessel_id: string
}

export interface User {
    id: string,
    address: string,
    chaos_user_id: string,
    created_vessels: GetVessels[],
    memberships: Membership[],
    posts: Post[]
}
export async function getUserFromAddress(url: string, address: string): Promise<User> {
    try {
        let result = await axios.get(`${url}/users?address=${address}`)
        return result.data;
    } catch(err) {
        console.log(err);
        throw new Error(ErrorMessages["NOT_GET_USER"])
    }
}

export async function getUserVessels(url: string, user_id: string): Promise<CreateVessel[]> {
    try {
        let result = await axios.get(`${url}/users/${user_id}/vessels`)
        return result.data;
    } catch(err) {
        console.log(err);
        throw new Error(ErrorMessages["NOT_GET_USER_VESSELS"])
    }
}

export async function getVessel(url: string, vessel_id: string): Promise<GetVessels> {
    try {
        let result = await axios.get(`${url}/vessels/${vessel_id}`)
        return result.data;
    } catch(err) {
        console.log(err);
        throw new Error(ErrorMessages["NOT_GET_VESSEL"])
    }
}

interface Content {
    id: string,
    upvotes: number,
    downvotes: number,
    post_id: string
}

interface ShortenedUser {
    id: string,
    address: string,
    chaos_user_id: string
}

interface Poll {
    id: string,
    for: number,
    against: number,
    post_id: string
}

interface Invitation {
    id: string,
    address: string,
    due: Date,
    for: number,
    against: number,
    post_id: string
}

export interface Post {
    id: string,
    user_id: string,
    type: string,
    chaos_message_id: string,
    content: Content,
    invitation: Invitation,
    poll: Poll,
    user: ShortenedUser
}