import {clusterApiUrl, Connection, Keypair, PublicKey} from "@solana/web3.js";
import {Buffer} from "buffer"
import {Vessel, vesselSchema} from "./schemas";
import {SECRET_KEY} from "./CONSTANTS";


export const getKeyPair = () => {
    return Keypair.fromSecretKey(
        SECRET_KEY
    )
}

export const getConnection = () => {
    let connection = new Connection(clusterApiUrl("devnet"), "confirmed");
    return connection
}
export const getProgramAddress = () => {
    return new PublicKey("H56RznPRkcE2Tg7YGyntWy38rrHZTz4Sqzu2sT9NaKnL")
}

export const getCreatorPublicKey = (creator_address: string) => new PublicKey(creator_address)

export  const getAccountsInfo = async () => {
    let connection = getConnection();
    let program_address = getProgramAddress();

    try {
        let account_info = await  connection.getProgramAccounts(program_address);

        return account_info?.map(({account})=> account)

    } catch (e)
    {
        console.log("Something went wrong while trying to get the account info::", e)
        return null
    }
}


export const constructVesselPublicKey = async (creator_address: string, vessel_id: string) => {
    let program_address = getProgramAddress()
    console.log(`
        Creator::  ${creator_address}
        Vessel:: ${vessel_id}
    `)
    const [program_data_account] = await PublicKey.findProgramAddress([new PublicKey(creator_address).toBuffer(), Buffer.from(vessel_id)], program_address);
    console.log("HERE IS THE PROGRAM ADDRESS::", program_data_account)
    return program_data_account
}


export const getVesselData = async () => {

    // let program_data_account = await constructVesselPublicKey(creator_address, vessel_id);


    let account_infos = (await getAccountsInfo())?.filter((d)=> d !== null) ?? [];

    let vessel_data = account_infos?.map((info)=> vesselSchema.decode(info.data)) as Array<Vessel>

    return vessel_data

}


