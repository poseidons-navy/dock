"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { Keypair, PublicKey, Transaction, SystemProgram, TransactionInstruction } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import BN from 'bn.js';

import React from "react";

import PopUp from "./Sheet";
import useChaosClient from "../../../../chaos/hooks/useChaosClient";
import { Vessel } from "./them";
const chaosClient = useChaosClient();

const VESSEL_REVIEW_PROGRAM_ID = "AbrLPc6a5SyWA32E4BMsq31WodUhimWX8J9xGCJScGYz";

function AppBar() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  // if (publicKey) {
  //   const adress = publicKey.toBase58();
  //   chaosClient.createUser(adress);
  // }

  async function createVessel(vessel: Vessel, vesselId: string) {

   
    const VESSEL_REVIEW_PROGRAM_ID = "AbrLPc6a5SyWA32E4BMsq31WodUhimWX8J9xGCJScGYz"
    let toProgramId = new PublicKey(VESSEL_REVIEW_PROGRAM_ID)
    if (!publicKey) {

        alert('Please connect your wallet!')

        return;

    }
    const buffer = vessel.serialize()
    
    const [pda] = await PublicKey.findProgramAddressSync(

        [publicKey.toBuffer(), new TextEncoder().encode(vesselId)],

        new PublicKey(VESSEL_REVIEW_PROGRAM_ID)

    )
    const accounts = [
        {
            pubkey: publicKey,
            isSigner: true,
            isWritable: false,
        },

        {
            pubkey: pda, // Replace with the actual public key of the PDA account
            isSigner: false, // Update based on your Rust code logic
            isWritable: true, // Update based on your Rust code logic
        },
        {
            pubkey: SystemProgram.programId, // Replace with the actual public key of the system program account
            isSigner: false, // Update based on your Rust code logic
            isWritable: false, // Update based on your Rust code logic
        },
    ];
    const instruction = new TransactionInstruction({
        keys: accounts,
        data: buffer,
        programId: toProgramId
        
    })

    const transaction = new Transaction()
    transaction.add(instruction)
    try {
     
        let txid = await sendTransaction(transaction, connection)
      
        console.log("create vessel worked")
    }
    catch (e) {
        console.log("Create vessel failed", JSON.stringify(e))
        alert("Error occured")
    }




}
  async function createUser() {
    let userId;
    if (publicKey) {
      userId = await chaosClient.createUser(publicKey.toBase58());
      alert(userId);
      console.log("Never reached here");
    } else {
      alert("Please connect wallet");
      return;
    }
    const vessel = new Vessel(
    {name: "Pash", id: "vjonfvifn", amount_token: new BN(90, 10), description: "Busty ass", creator_id: "blahblaha", chaos_channel_id: "yesyes"}
    );
    createVessel(vessel, "ibfifbfghbdfhg");
    const userObject = { address: publicKey.toBase58(), chaos_user_id: userId };
    
  }
  async function createVess() {}
  function handleSubmit(event: any) {
    event.preventDefault();
    createUser();
  
  }

  return (
    <div className="flex flex-row items-center justify-center w-full space-x-4 pt-4">
      <div className="flex flex-row items-center justify-center w-1/2 ">
        <Input placeholder="Find your vessel" className="w-full" />
        <Button size="sm">
          <Search size="16px" className="hover:bg-zinc-700" />
        </Button>
      </div>
      <div className="flex flex-row items-center justify-center space-x-2 ">
        <div className="grid grid-cols-2 gap-2">
          <PopUp handleSubmit={handleSubmit} name={name} description={description} setName={setName} setDescription={setDescription} />
        </div>
        <WalletMultiButton />
      </div>
    </div>
  );
}

export default AppBar;
