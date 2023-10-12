
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, Transaction, SystemProgram, TransactionInstruction } from "@solana/web3.js";
const { connection } = useConnection();
const { publicKey, sendTransaction } = useWallet();
export default function createVessel() {


    let toProgramId = new PublicKey("AbrLPc6a5SyWA32E4BMsq31WodUhimWX8J9xGCJScGYz")
    const VESSEL_REVIEW_PROGRAM_ID = "AbrLPc6a5SyWA32E4BMsq31WodUhimWX8J9xGCJScGYz"
    if (!publicKey) {

        alert('Please connect your wallet!')

        return;

    }
    const [pda] = PublicKey.findProgramAddressSync(

        [publicKey.toBuffer(), new TextEncoder().encode(vesselId)],

        new PublicKey(VESSEL_REVIEW_PROGRAM_ID)

    )
    const accounts = [
        {
            publicKey: publicKey,
            isSigner: true,
            isWritable: true,
        },
        {
            publicKey: ownerPublicKey,// key of the owner of the vessel
            isSigner: false,
            isWritable: true,
        },
        {
            publicKey: pda, // Replace with the actual public key of the PDA account
            isSigner: false, // Update based on your Rust code logic
            isWritable: true, // Update based on your Rust code logic
        },
        {
            publicKey: SystemProgram.programId, // Replace with the actual public key of the system program account
            isSigner: false, // Update based on your Rust code logic
            isWritable: true, // Update based on your Rust code logic
        },
    ];
    const instruction = new TransactionInstruction({
        accounts: accounts,
        programId: toProgramId
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