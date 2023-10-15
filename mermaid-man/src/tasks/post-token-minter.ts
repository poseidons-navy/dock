
import client from "../../prisma/client";
import _ from "lodash"
import { getConnection, getKeyPair, getVesselData } from "../utils";
import fs from "node:fs"
import { PublicKey } from "@solana/web3.js";
import { createAssociatedTokenAccount, mintToChecked } from "@solana/spl-token";

let connection = getConnection()

const run = async () => {

    let onchain_vessel_data = await getVesselData()

    try {

        
        onchain_vessel_data.map(async (vessel)=>{
            const contents = vessel.contents.filter((content)=> content.upvotes > 10);
      
            let ps = contents.map(async(creation)=>{


                const content_creation = await client.content.findFirst({
                    where: {
                        id: creation.id
                    },
                    include: {
                         post: {
                            include: {
                                user: true
                            }
                         }
                    }
                })


                

                if((content_creation?.last_passed_threshold  ?? 0) + 10 <= (content_creation?.upvotes ?? 0))
                {
                   
                    const mint_account_pubkey = fs.readFileSync(`./public_keys/${vessel.id}.txt`, {
                        encoding: 'utf8'
                    })

                    const feepayer = getKeyPair()

                    const mint_pubkey = new PublicKey(mint_account_pubkey)

                    const membership = await client.membership.findFirst({
                        where: {
                            user_id: content_creation?.post?.user_id
                        }
                    })
                   
    
                    // mint some tokens for founder
                    const txHash = await mintToChecked(
                        connection,
                        feepayer,
                        mint_pubkey,
                        // @ts-ignore
                        new PublicKey(membership?.attached_account_address ?? "none provided"),
                        // @ts-ignore
                        feepayer,
                        0.01e8, // 0.01 vessel tokens
                        8
                    )


                    await client.content.update({
                        where: {
                            id: content_creation?.id
                        },
                        data: {
                            last_passed_threshold: (content_creation?.last_passed_threshold  ?? 0) + 10
                        }
                    })
                    
                }
                
            })

            await Promise.all(ps)

        })

        
        setTimeout(async ()=>{
            console.log("BEGGINING NEW EPOCH AT::", new Date().toUTCString())
            await run()
        }, 1000 * 5 ) // TODO: use a longer period


    }
    catch (e)
    {
        console.log('Something went wrong:: ',e)
    }

}

run().then().catch((e)=>{
    console.log("SOMEthing went wrong::", e)
})