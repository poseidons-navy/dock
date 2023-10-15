/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import React, { useEffect, useState } from 'react'
import ChaosClient from '@/chaos/utils/chaos'
import axiosClient from '@/chaos/utils/client'
import axios from 'axios'

const chaos = new ChaosClient(axiosClient)

interface PageProps {
    params: {
        vessel_id: string
    }
}



function VesselPage( props: PageProps ) {
    const { params: { vessel_id } } = props 

    const [results, setResults] = useState<Array<Record<string, any>>>([])

    const getChannelMessages = async (vessel_id: string) => {

        const messages = await chaos.getChannelMessages(vessel_id) 

        const offchain_messages = messages.map(async (message)=>{

            const offchain = (await axios.get("https://0e55-41-80-117-179.ngrok-free.app",{
                params: {
                    chaos_message_id: message.id
                }
            })).data

            

            return offchain
        })

        return await Promise.all(offchain_messages)

        
    }


    useEffect(()=>{
        getChannelMessages(vessel_id)
        .then((data)=>{
            setResults(data)
        }).catch((e)=>{
            console.log("Something went wrong::", e)
        })
    }, [])

  return (
    <div className="grid grid-cols-5 gap-x-2  w-screen h-full">
        
        <div className="flex"></div>


        <div className="flex col-span-3 w-full h-full overflow-y-scroll ">


            {
                JSON.stringify(results ?? null)
            }


        </div>

        <div className="flex"></div>


    </div>
  )
}

export default VesselPage