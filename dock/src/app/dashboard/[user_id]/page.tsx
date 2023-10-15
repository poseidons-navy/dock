import React from 'react'
import client from '../../../../prisma/client'
import VesselComponent from './components/vessel-component'

const getJoinedVessels = async (user_id: string) => {

    const memberships = await client.membership.findMany({
        where: {
            user_id,
            role: "member"
        },
        include: {
            user: true,
            vessel: {
                include: {
                    creator: true
                }
            }
        }
    })

    return memberships

}

const getCreatedVessels = async (user_id: string) => {

    const memberships = await client.membership.findMany({
        where: {
            user_id,
            role: "creator"
        },
        include: {
            user: true,
            vessel: {
                include: {
                    creator: true
                }
            }
        }
    })

    return memberships

}

const getPendingVessels = async (user_id: string) => {

    const memberships = await client.membership.findMany({
        where: {
            user_id,
            role: "invitee"
        },
        include: {
            user: true,
            vessel: {
                include: {
                    creator: true
                }
            }
        }
    })

    return memberships
}

interface DashboardProps {
    params: {
        user_id: string
    }
}
async function DashboardPage(props: DashboardProps) {
    const { user_id } = props.params

    const joined = await getJoinedVessels(user_id)
    const created = await getCreatedVessels(user_id)
    const pending = await getPendingVessels(user_id)

  return (
    <div className="flex flex-col w-full h-full items-center justify-start">
        
        <div className="flex flex-col px-5 py-5">
            <div className="flex flex-row items-center space-y-2">
                <h2>
                    Your Vessels 🏴‍☠️
                </h2>
                <div className="grid grid-cols-2 gap-x-2 gap-y-2">

                    {
                        joined.map((vessel, i)=><VesselComponent key={i} {...vessel.vessel} />)
                    }

                </div>
            </div>

            <div className="flex flex-row items-center space-y-2">
                <h2>
                    Your Creations  🏗️
                </h2>
                <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                    {
                        created.map((vessel, i)=><VesselComponent key={i} {...vessel.vessel} />)
                    }
                </div>
            </div>


            <div className="flex flex-row items-center space-y-2">
                <h2>
                    Pening Requests 😎
                </h2>
                <div className="grid grid-cols-2 gap-x-2 gap-y-2">
                    {
                        pending.map((vessel, i)=><VesselComponent key={i} {...vessel.vessel} />)
                    }
                </div>
            </div>
        </div>
    </div>
  )
}

export default DashboardPage