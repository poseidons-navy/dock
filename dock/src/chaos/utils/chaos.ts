import { Axios } from "axios"
import axiosClient from "./client"



export default class ChaosClient {
    ax: Axios
    constructor(client: Axios){
        console.log("Initialized")
        this.ax = client
        // console.log(this.ax)
    }




    /**
     * @name createUser
     * @description returns the new user id
     * @param address 
     * @returns 
     */
    createUser = async (address: string) => {
        const user_id = (await axiosClient.post<string>("/users", {
            userName: address
        }, {
            headers: {
                "Content-Type": "application/json"
            }
        })).data

        return user_id
    }


    /**
     * @name getUser
     * @description returns the user's id
     * @param user_id 
     * @returns 
     */
    getUser = async (user_id: string) => {
        const user = (await this.ax.get<{
            userName: string
        }>(`/users/${user_id}`)).data

        return user
    }


    /**
     * @name getUserChannels
     * @description get the user's channels
     * @param user_id 
     * @returns 
     */
    getUserChannels =  async (user_id: string) => {

        const channels = (await this.ax.get<Array<{
            id: string,
            creatorID: string,
            name: string,
            description: string
        }>>(`/users/channels/${user_id}`)).data


        return channels

    }


    /**
     * @name createChannel
     * @description create a new channel
     * @param user_id 
     * @param data 
     * @returns 
     */
    createChannel = async (user_id: string, data: { name: string, description: string, vesselIdentifier: string }) => {

        const channel_id =  (await this.ax.post<string>(`/channels`, {
            creatorID: user_id,
            name: data.name,
            icon: data.vesselIdentifier,
            description: data.description
        })).data

        return channel_id

    }


    /**
     * @name getChannel
     * @description get a channel
     * @param channel_id 
     * @returns 
     */
    getChannel = async (channel_id: string) => {

        const channel = (await this.ax.get<{
            id: string,
            name: string,
            description: string,
            icon: string
        }>(`/channels/${channel_id}`)).data

        return {
            ...channel,
            vesselIdentifier: channel.icon
        }

    }


    /**
     * @name getChannelParticipants
     * @description get all channel participants
     * @param channel_id 
     * @returns 
     */
    getChannelParticipants = async (channel_id: string) =>
    {
        const users = (await this.ax.get<Array<{
            userName: string
        }>>(`/channels/${channel_id}/participants`)).data

        return users?.map(({userName})=>({address: userName}))
    }

    addChannelParticipants = async (channel_id: string, user_id: string) =>
    {
        const participant_id = (await this.ax.post<string>(`/channels/${channel_id}/participants`, {
            channelID: channel_id,
            participantID: user_id
        })).data

        return participant_id
    }


    /**
     * @name createMessage
     * @description creates a new message in the channel
     * @param channel_id 
     * @returns 
     */
    createMessage = async (channel_id: string, message: string ) =>
    {
        const message_id = (await this.ax.post<string>(`/channels/${channel_id}/messages`, {
            textContent: message
        })).data

        return message_id
    }
    

    /**
     * @name getChannelMessages
     * @param channel_id 
     * @returns 
     */
    getChannelMessages = async (channel_id: string)=>
    {
        const messages = (await this.ax.get<Array<{
            id: string,
            senderID: string,
            createdAt: string,
            channelID: string,
            textContent: string,
            sender: {
                userName: string,
            }
        }>>(`/channels/${channel_id}/messages`)).data 

        return messages
    }





}