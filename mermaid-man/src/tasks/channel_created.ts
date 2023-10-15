
import client from "../../prisma/client";
import _ from "lodash"
import { constructVesselPublicKey, getConnection, getKeyPair, getVesselData } from "../utils";
import { createAssociatedTokenAccount, createMint, mintToChecked } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import fs from "node:fs"

let connection = getConnection()

const run = async () => {

    let onchain_vessel_data = await getVesselData()

    try {

        
        onchain_vessel_data.map(async (vessel)=>{
            
            let offchain_vessel = await client.vessel.findFirst({
                where: {
                    id: vessel.id
                },
                include: {
                    creator: true
                }
            })

            let creator = await client.user.findFirst({
                where: {
                    id: offchain_vessel?.creator_id 
                }
            })

            console.log(creator)

            if(!offchain_vessel?.is_initialized){

                // create mint account
                 // @ts-ignore
                // let program_data_account = await constructVesselPublicKey(offchain_vessel?.creator.address as string, vessel.id)

                let feepayer = getKeyPair()



                let mintPubKey = await createMint(
                    connection,
                    feepayer,
                    feepayer.publicKey,
                    feepayer.publicKey,
                    8
                )

                fs.writeFileSync(`./public_keys/${vessel.id}.txt`, mintPubKey.toString())
                
                
                //create an ata for the founder
                let founder_ata = await createAssociatedTokenAccount(
                    connection,
                    feepayer,
                    mintPubKey,
                     // @ts-ignore
                    new PublicKey(creator?.address ?? "")
                )

                // mint some tokens for founder
                let txHash = await mintToChecked(
                    connection,
                    feepayer,
                    mintPubKey,
                    // @ts-ignore
                    new PublicKey(founder_ata.toString()),
                     // @ts-ignore
                    feepayer,
                    5e8, // 5 vessel tokens
                    8
                )

                await client.membership.updateMany({
                    where: {
                        user_id: creator?.id,
                    },
                    data: {
                        attached_account_address: founder_ata?.toString()
                    }
                })

                await client.vessel.update({
                    where: {
                        id: vessel.id
                    },
                    data: {
                        is_initialized: true
                    }
                })
            }

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