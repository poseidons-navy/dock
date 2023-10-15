"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import React from "react";

import PopUp from "./Sheet";
import useChaosClient from "../../../../chaos/hooks/useChaosClient";
import { Vessel } from "./them";
import { createUserOffchain, createVesselOffchain } from "./offchain";
import { getUserFromAddress } from "../helpers";
function AppBar() {
  const { connection } = useConnection();
  const chaosClient = useChaosClient();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const { publicKey, sendTransaction } = useWallet();

  const VESSEL_REVIEW_PROGRAM_ID =
  "H56RznPRkcE2Tg7YGyntWy38rrHZTz4Sqzu2sT9NaKnL";
  async function createVessel(vessel: Vessel) {
   
    let toProgramId = new PublicKey(VESSEL_REVIEW_PROGRAM_ID);
    if (!publicKey) {
      alert("Please connect your wallet!");

      return;
    }
    const buffer = vessel.serialize(0);
    
    const [pda] = PublicKey.findProgramAddressSync(
      [publicKey.toBuffer(), Buffer.from(vessel.id)],
      new PublicKey(VESSEL_REVIEW_PROGRAM_ID)
    );
 
    const instruction = new TransactionInstruction({
      keys: [
        {
          pubkey: publicKey,
          isSigner: true,
          isWritable: false,
        },
        {
          pubkey: pda,
          isSigner: false,
          isWritable: true,
        },
        {
          pubkey: SystemProgram.programId,
          isSigner: false,
          isWritable: false,
        },
      ],
      data: buffer,
      programId: toProgramId,
    });

    const transaction = new Transaction();

    transaction.add(instruction);
   
    try {
      let txid = await sendTransaction(transaction, connection);
      console.log(txid);
      console.log("create vessel worked");
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }
  
  async function createUser() {
    let chaos_userId;
    let offchainuserId;
    if (publicKey) {
      const userData = await getUserFromAddress( 'http://localhost:8089', publicKey.toBase58())
      if(!userData)
      {
        chaos_userId = await chaosClient.createUser(publicKey.toBase58());
        //Create a user on the offchain
        offchainuserId = await createUserOffchain(publicKey.toBase58(), chaos_userId)
      }
      console.log("Debug2");
     
      //    //create vessel on chaos and offchain
      const vesselData = {
        name: name,
        description: description,
        vesselIdentifier: "sample",
      };
      const chaosVessel = await chaosClient.createVessel(
        userData.chaos_user_id??chaos_userId,
        vesselData
      );

      const offchainvesselid = await createVesselOffchain(name, description, chaosVessel, ['vessel'], userData.id??offchainuserId)
      //vesselid and user_id from offchain

      const vessel = new Vessel({
        name: name,
        id: offchainvesselid,
        amount_token: 90,
        description: description,
        creator_id: offchainuserId??userData.id,
        chaos_channel_id: chaosVessel,
      });
      console.log(vessel);
      createVessel(vessel);
    } else {
      alert("Please connect wallet");
      return;
    }
  }

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
          <PopUp
            handleSubmit={handleSubmit}
            name={name}
            description={description}
            setName={setName}
            setDescription={setDescription}
          />
        </div>
        <WalletMultiButton />
      </div>
    </div>
  );
}

export default AppBar;
