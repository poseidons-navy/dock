
import client from "../../prisma/client";
import _ from "lodash"
import { getVesselData } from "../utils";

const run = async () => {

    let onchain_vessel_data = await getVesselData()

    try {

        onchain_vessel_data.map(async (vessel)=> {
            let polls = vessel.polls
 
            polls.map(async (poll)=>{

                let offchain_poll = await client.poll.findFirst({
                    where: {
                        id: poll.id
                    }
                })


                if(offchain_poll){

                    if(!offchain_poll.decided && new Date(offchain_poll.due) > new Date()){
                            
                        // mark as decided
                        await client.poll.updateMany({
                            where: {
                                id: offchain_poll.id
                            },
                            data: {
                                decided: true
                            }
                        })

                    }


                }

            })
            

        })
       

        
        setTimeout(async ()=>{
            console.log("BEGGINING NEW EPOCH AT::", new Date().toUTCString())
            await run()
        }, 1000 * 5 ) // TODO: use a longer period


    }
    catch (e)
    {
        console.log('Something went wrong:: ',e)

        await run()
    }

}

run().then().catch((e)=>{
    console.log("SOMEthing went wrong::", e)
})