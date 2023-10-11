"use client"
import ChaosClient from "../utils/chaos"
import axiosClient from "../utils/client"




export default function useChaosClient(){
    const { createChannel, createMessage, createUser, getChannel, getChannelMessages, getChannelParticipants,getUser,getUserChannels } = new ChaosClient(axiosClient)
    return {
        createVessel: createChannel,
        createMessage,
        createUser,
        getVessel: getChannel,
        getVesselMessages: getChannelMessages,
        getVesselCrew: getChannelParticipants,
        getUser,
        getUserVessels: getUserChannels
    }

}