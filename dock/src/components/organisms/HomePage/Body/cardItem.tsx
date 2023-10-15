"use client";
import Link from "next/link";
import React from "react";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import useChaosClient from "../../../../chaos/hooks/useChaosClient";
import { createUserOffchain } from "../AppBar/offchain";
import { getUser } from "../../../../app/Posts/Messages/messagesoffchain";
import { Button } from "../../../ui/button";
import { Member } from "./Member";
export interface CardItemProps {
  name: string
  description: string
}

function CardItem(props: CardItemProps) {
  const chaosClient = useChaosClient();

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const VESSEL_REVIEW_PROGRAM_ID =
    "H56RznPRkcE2Tg7YGyntWy38rrHZTz4Sqzu2sT9NaKnL";
    const vessel_id = 'Random string'//This comes from clicked vessel
  async function createMember(member: Member, owner_account: string) {
    let toProgramId = new PublicKey(VESSEL_REVIEW_PROGRAM_ID);
    let vesselOwnerKey = new PublicKey(owner_account);
    if (!publicKey) {
      alert("Please connect your wallet!");

      return;
    }
    const buffer = member.serialize(0);

    const [pda] = PublicKey.findProgramAddressSync(
      [publicKey.toBuffer(), Buffer.from(member.vessel_id)],
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
          pubkey: vesselOwnerKey,
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
      console.log("Add member worked");
    } catch (e) {
      alert(JSON.stringify(e));
    }
  }
  async function createUser(): Promise<string> {
    if (!publicKey) {
      throw new Error("publicKey is not available");
    }
    let chaos_userId;
    chaos_userId = await chaosClient.createUser(publicKey.toBase58());
    const offchainuserId = await createUserOffchain(
      publicKey.toBase58(),
      chaos_userId
    );
    return offchainuserId;
  }
  async function addMember() {
    if (!publicKey) {
      return;
    }
    let user_id = await getUser(publicKey.toBase58());
    if (!user_id) {
      user_id = await createUser();
    }
    let user_type = 'invitee';
    let chaos_participant_id = (await chaosClient.getUser(user_id)).userName
    let use = await getUser(publicKey.toBase58());

    const member = new Member({vessel_id: vessel_id, user_type: user_type, user_id: user_id, chaos_participant_id: chaos_participant_id})
    createMember(member, member.vessel_id)


  }
  function handleAdd(event: any) {}
  return (
    <div className="flex flex-col items-center justify-start rounded-md overflow-hidden shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)]">
      <div className="flex flex-row items-center justify-center w-full  bg-slate-300 px-5 py-5">
        {props.name}
      </div>
      <div className="flex flex-col items-start justift-start p-3 w-full space-y-2">
        <span>{props.description}</span>

        <Button size="sm" className="self-center my-5">Request to Join</Button>

      </div>
    </div>
  );
}

export default CardItem;
