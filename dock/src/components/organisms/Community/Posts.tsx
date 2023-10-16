"use client";
import { useState } from 'react';
import { LuArrowBigUp, LuArrowBigDown } from "react-icons/lu";
import { PiArrowFatUpFill, PiArrowFatDownFill } from "react-icons/pi";
import {Vote} from './vote'
import {
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

interface PostProps {
  username: string,
  proposal: string,
  description: string,
  comments: number,
  upvotes: number,

}

function Post(props: PostProps) {
  const [toggle, setToggle] = useState(0)
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const VESSEL_REVIEW_PROGRAM_ID =
    "H56RznPRkcE2Tg7YGyntWy38rrHZTz4Sqzu2sT9NaKnL";
    const vessel_id = 'Random string'//This comes from clicked vessel

async function handleUpVote(vote: Vote, owner_account: string){
  let toProgramId = new PublicKey(VESSEL_REVIEW_PROGRAM_ID);
  let vesselOwnerKey = new PublicKey(owner_account);
  if (!publicKey) {
    alert("Please connect your wallet!");

    return;
  }
  const buffer = vote.serialize(0);

  const [pda] = PublicKey.findProgramAddressSync(
    [publicKey.toBuffer(), Buffer.from(vote.vessel_id)],
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
function handleUpVoteSubmit(event: any)
{
  if (!publicKey) {
    return;
  }
  const content_id = 'Random content id'
  const ownerAccount = 'Some random address'
  const voteObj = new Vote({post_type: 'content', vessel_id: vessel_id, interaction_type: 'up', id: content_id})
  handleUpVote(voteObj, ownerAccount)

}
async function handleDownVote(vote: Vote, owner_account: string){
  let toProgramId = new PublicKey(VESSEL_REVIEW_PROGRAM_ID);
  let vesselOwnerKey = new PublicKey(owner_account);
  if (!publicKey) {
    alert("Please connect your wallet!");

    return;
  }
  const buffer = vote.serialize(0);

  const [pda] = PublicKey.findProgramAddressSync(
    [publicKey.toBuffer(), Buffer.from(vote.vessel_id)],
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
function handleDownvoteSubmit(event: any)
{
  if (!publicKey) {
    return;
  }
  const content_id = 'Random content id'
  const ownerAccount = 'Some random address'
  const voteObj = new Vote({post_type: 'content', vessel_id: vessel_id, interaction_type: 'down', id: content_id})
  handleUpVote(voteObj, ownerAccount)

}

 return(

  <div className=' max-w-xl  rounded-md p-4 border-solid border-slate-600 border-[1px] mt-2 flex justify-start items-center'>
    <div className='pl-auto'>
      <LuArrowBigUp  className=  'font-light text-3xl hover:text-pink-500' onclick={handleUpVoteSubmit}/>
      <p>{props.upvotes}</p>
      <LuArrowBigDown className= 'font-light text-3xl hover:text-green-500'/>
    </div>
    <div className='ml-5 flex flex-col justify-center items-center'>
  <p>Message body</p>
  <p>date created</p>
    </div>

  </div>
 );
}

export default Post;
