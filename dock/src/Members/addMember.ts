
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, Transaction, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import borsh from '@project-serum/borsh'
const { connection } = useConnection();
const { publicKey, sendTransaction } = useWallet();

export class Member {
    vessel_id: string;
    user_type: string;
    user_id: string;
    chaos_participant_id: string;


    constructor(user_id: string,
        vessel_id: string,
        user_type: string,
        chaos_participant_id: string) {
        this.user_type = user_type;
        this.vessel_id = vessel_id;
        this.user_id = user_id;
        this.chaos_participant_id = chaos_participant_id;
    }
    borshInstructionSchema = borsh.struct([

        borsh.u8('variant'),

        borsh.str('user_id'),

        borsh.str('vessel_id'),

        borsh.str('user_type'),
        borsh.str('chaos_participant_id'),
        
    ])

    serialize(): Buffer {

        const buffer = Buffer.alloc(1000)

        this.borshInstructionSchema.encode({ ...this, variant: 11 }, buffer)

        return buffer.slice(11, this.borshInstructionSchema.getSpan(buffer))

    }


}
export default async function createVessel(member: Member, vesselId: string, owner_id: string) {

    let ownerId = new PublicKey(owner_id)
    const VESSEL_REVIEW_PROGRAM_ID = "H56RznPRkcE2Tg7YGyntWy38rrHZTz4Sqzu2sT9NaKnL"
    const toProgramId = new PublicKey(VESSEL_REVIEW_PROGRAM_ID)
    if (!publicKey) {

        alert('Please connect your wallet!')

        return;

    }
    const buffer = member.serialize()
    const [pda] = PublicKey.findProgramAddressSync(

        [publicKey.toBuffer(), Buffer.from(vesselId)],

        new PublicKey(VESSEL_REVIEW_PROGRAM_ID)

    )
    const accounts = [
        {
            pubkey: publicKey,
            isSigner: true,
            isWritable: true,
        },
        {
            pubkey: ownerId,
            isSigner: true,
            isWritable: true,
        },

        {
            pubkey: pda, // Replace with the actual public key of the PDA account
            isSigner: false, // Update based on your Rust code logic
            isWritable: true, // Update based on your Rust code logic
        },
        {
            pubkey: SystemProgram.programId, // Replace with the actual public key of the system program account
            isSigner: false, // Update based on your Rust code logic
            isWritable: true, // Update based on your Rust code logic
        },
    ];
    const instruction = new TransactionInstruction({
        keys: accounts,
        programId: toProgramId,
        data: buffer
    })
    const transaction = new Transaction()
    transaction.add(instruction)
    try {
        let txid = await sendTransaction(transaction, connection)
        console.log("create member worked")
    }
    catch (e) {
        console.log("Create Member failed", JSON.stringify(e))
    }




}