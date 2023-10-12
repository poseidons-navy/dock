"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

import React from "react";

import PopUp from "./Sheet";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import useChaosClient from "../../../../chaos/hooks/useChaosClient";
import createVessel from "./createVessel";
const chaosClient = useChaosClient();

const VESSEL_REVIEW_PROGRAM_ID = "AbrLPc6a5SyWA32E4BMsq31WodUhimWX8J9xGCJScGYz";

function AppBar() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  // if (publicKey) {
  //   const adress = publicKey.toBase58();
  //   chaosClient.createUser(adress);
  // }

  async function handleSubmit(event: any) {
    event.preventDefault();
    if (publicKey) {
      console.log("Reached here yes")
      const user_id = await chaosClient.getUser("usr_744afe56b9482e83d6470cb39277779a");
      console.log("Never reached here")
      if (!user_id) {
        chaosClient.createUser(publicKey.toBase58());
      }
    } else {
      alert("Please connect wallet");
      return;
    }
    const adress = publicKey.toBase58();
    const userId = await chaosClient.getUser(adress);
    alert(userId);
  }
  // const handleSubmit = async (event: any) => {
  //   event.preventDefault();
  //   const vesselIdentifier = "not cool";
  //   console.log(publicKey);
  //   if (!publicKey) {
  //     alert("Please connect your wallet!");
  //     return;
  //   }
  //   const adress = publicKey.toBase58();
  //   const userId = await chaosClient.getUser(adress);
  //   const data = { name, description, vesselIdentifier };
  //   alert("Reached here");
  //   const vesselId = await chaosClient.createVessel(userId.userName, data);
  //   alert("Here too");
  //   alert(vesselId);
  //   const vessel = new Vessel(name, description, vesselId);
  //   handleTransactionSubmit(vessel);
  // };
  // const handleTransactionSubmit = async (vessel: Vessel) => {
  //   if (!publicKey) {
  //     alert("Please connect your wallet!");
  //     return;
  //   }

  //   const buffer = vessel.serialize();
  //   const transaction = new web3.Transaction();

  //   const [pda] = await web3.PublicKey.findProgramAddressSync(
  //     [publicKey.toBuffer(), new TextEncoder().encode(vessel.name)],
  //     new web3.PublicKey(VESSEL_REVIEW_PROGRAM_ID)
  //   );

  //   const instruction = new web3.TransactionInstruction({
  //     keys: [
  //       {
  //         pubkey: publicKey,
  //         isSigner: true,
  //         isWritable: false,
  //       },
  //       {
  //         pubkey: pda,
  //         isSigner: false,
  //         isWritable: true,
  //       },
  //       {
  //         pubkey: web3.SystemProgram.programId,
  //         isSigner: false,
  //         isWritable: false,
  //       },
  //     ],
  //     data: buffer,
  //     programId: new web3.PublicKey(VESSEL_REVIEW_PROGRAM_ID),
  //   });

  //   transaction.add(instruction);

  //   try {
  //     let txid = await sendTransaction(transaction, connection);

  //     alert(
  //       `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
  //     );
  //     console.log(
  //       `Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`
  //     );
  //   } catch (e) {
  //     console.log(JSON.stringify(e));
  //     alert(JSON.stringify(e));
  //   }
  // };

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
          <PopUp handleSubmit={handleSubmit} />
        </div>
        <WalletMultiButton />
      </div>
    </div>
  );
}

export default AppBar;
