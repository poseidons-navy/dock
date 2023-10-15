
import client from "../../prisma/client";
import _ from "lodash"
import { getConnection, getKeyPair, getVesselData } from "../utils";
import fs from "node:fs"
import { PublicKey } from "@solana/web3.js";
import { createAssociatedTokenAccount, mintToChecked } from "@solana/spl-token";

const connection = getConnection()

const run = async () => {

    let onchain_vessel_data = await getVesselData()

    try {

        
        onchain_vessel_data.map(async (vessel)=>{
            const invites = vessel.invites.filter((invite)=>{
                let active = new Date(invite.due) > new Date()
                return active 
            })


            let ps = invites.map(async (invitation)=>{
                let onchain_invite = await client.invitation.findFirst({
                    where: {
                        id: invitation.id
                    },
                    include: {
                        post: {
                            include: {
                                user: true
                            }
                        }
                    }
                })

                let parent_post = await client.post.findFirst({
                    where: {
                        id: invitation.post_id
                    }
                })

                if(onchain_invite){
                    if(!onchain_invite.decided && new Date(invitation.due) > new Date()){
                        
                        if(invitation.for_invite > invitation.against_invite)
                        {

                            // Invite change user membership status and mint them channel tokens
                            
                            await client.membership.updateMany({
                                where: {
                                    vessel_id: vessel.id,
                                    user_id: onchain_invite.post?.user_id ?? "couldnt find ome",
                                    role: "invitee"
                                },
                                data: {
                                    role: "member"
                                }
                            })

                            let mint_account_pubkey = fs.readFileSync(`./public_keys/${vessel.id}.txt`, {
                                encoding: 'utf8'
                            })

                            const feepayer = getKeyPair()

                            let mint_pubkey = new PublicKey(Buffer.from(mint_account_pubkey))

                            
                            let member_ata = await createAssociatedTokenAccount(
                                connection,
                                feepayer,
                                mint_pubkey,
                                 // @ts-ignore
                                new PublicKey(onchain_invite.post?.user.address ?? "")
                            )
            
                            // mint some tokens for founder
                            let txHash = await mintToChecked(
                                connection,
                                feepayer,
                                mint_pubkey,
                                 // @ts-ignore
                                new PublicKey(member_ata.toString()),
                                 // @ts-ignore
                                feepayer,
                                1e8, // 1 vessel tokens
                                8
                            )


                            await client.membership.updateMany({
                                where: {
                                    vessel_id: vessel.id,
                                    user_id: onchain_invite.post?.user_id ?? "couldnt find ome",
                                },
                                data: {
                                    attached_account_address: member_ata?.toString()
                                }
                            })

                        }
                        else 
                        {

                            await client.membership.deleteMany({
                                where: {
                                    vessel_id: vessel.id,
                                    user_id: onchain_invite.post?.user_id ?? "couldnt find ome",
                                    role: "invitee"
                                }
                            })



                        }

                        
                    }
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

        await run()
    }

}

run().then().catch((e)=>{
    console.log("SOMEthing went wrong::", e)
})