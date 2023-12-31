"use client";
import { Button } from "@/components/ui/button";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  PublicKey,
  Transaction,
  SystemProgram,
  TransactionInstruction,
} from "@solana/web3.js";
import { Textarea } from "@/components/ui/textarea";
import { createContentOffchain, getUser, createPollOffchain } from "./messagesoffchain";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Box from "@mui/material/Box";

import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { BiPlusCircle } from "react-icons/bi";
import { useState } from "react";
import useChaosClient from "../../../chaos/hooks/useChaosClient";
import {Message} from './mess'
const chaosClient = useChaosClient();

function TabsDemo() {
  const { publicKey, sendTransaction } = useWallet();
  const { connection } = useConnection();
  const VESSEL_REVIEW_PROGRAM_ID =
  "H56RznPRkcE2Tg7YGyntWy38rrHZTz4Sqzu2sT9NaKnL";
  const [message, setMessage] = useState("");
  //the random ones
  const channel_id = "placeholder"; //Comes fromthe currently clicked channel
 const vessel_id = 'random comes from the clicked one'
 const vessel_owner_address = 'Random comes from the clicked one'
 // the random ones
  if (!publicKey) {
    console.log("Please connect your wallet");
  }
  async function createContent(message: Message,  owner_account: string)
  {
    if (!publicKey) {
      alert("Please connect your wallet!");

      return;
    }
    let toProgramId = new PublicKey(VESSEL_REVIEW_PROGRAM_ID);
    const buffer = message.serialize(12);
    let vesselOwnerKey = new PublicKey(owner_account);

    const [pda] = PublicKey.findProgramAddressSync(
      [publicKey.toBuffer(), Buffer.from(message.vessel_id)],
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
      console.log("create poll worked");
    } catch (e) {
      alert(JSON.stringify(e));
    }

  }
  async function createPoll(message: Message,  owner_account: string)
  {
    if (!publicKey) {
      alert("Please connect your wallet!");

      return;
    }
    let toProgramId = new PublicKey(VESSEL_REVIEW_PROGRAM_ID);
    const buffer = message.serialize(14);
    let vesselOwnerKey = new PublicKey(owner_account);

    const [pda] = PublicKey.findProgramAddressSync(
      [publicKey.toBuffer(), Buffer.from(message.vessel_id)],
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
      console.log("create poll worked");
    } catch (e) {
      alert(JSON.stringify(e));
    }

  }
  async function handleSubmitPoll(event: any) {
    event.preventDefault();

    if (publicKey) {
      const user_id = await getUser(publicKey.toBase58());
      if (user_id) {
        let chaos_message_id = await chaosClient.createMessage(
          channel_id,
          message
        );
        const type = "poll";
        let offchainMessageId = await createPollOffchain(
          user_id,
          type,
          chaos_message_id
        );
          const messageObj = new Message({post_id: offchainMessageId.post_id, user_id: user_id, vessel_id: vessel_id, id: offchainMessageId.poll_id, chaos_message_id: chaos_message_id  })
        createPoll(messageObj, vessel_owner_address)
      }
    } else {
      alert("Please connect the wallet");
    }
  }
async function handleSubmitContent(event: any){
  event.preventDefault();

    if (publicKey) {
      const user_id = await getUser(publicKey.toBase58());
      if (user_id) {
        let chaos_message_id = await chaosClient.createMessage(
          channel_id,
          message
        );
        const type = "content";
        let offchainMessageId = await createContentOffchain(
          user_id,
          type,
          chaos_message_id
        );
          const messageObj = new Message({post_id: offchainMessageId.post_id, user_id: user_id, vessel_id: vessel_id, id: offchainMessageId.poll_id, chaos_message_id: chaos_message_id  })
        createContent(messageObj, vessel_owner_address)
      }
    } else {
      alert("Please connect the wallet");
    }
}
  

  return (
    <div className="flex flex-col justify-center items-center pt-4">
      <Tabs defaultValue="proposals" className="w-1/3 ">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="announcement">Announcement</TabsTrigger>
          <TabsTrigger value="poll">Poll</TabsTrigger>
        </TabsList>

      
        <TabsContent value="announcement">
          <Card>
            <CardHeader>
              <CardTitle>Announcement</CardTitle>
              <CardDescription>
                Create an announcement for the community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="new">Announcement body</Label>
                <Textarea
                  placeholder="Type your entire announcement."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmitContent}>Post</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="poll">
          <Card>
            <CardHeader>
              <CardTitle>Poll</CardTitle>
              <CardDescription>Create a poll for the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="proposal">Proposal body</Label>
                <Textarea placeholder="Type your post for the poll." />
                <Box sx={{ "& > :not(style)": { m: 1 } }}>
                  <TextField
                    id="input-with-icon-textfield"
                    label="TextField"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <BiPlusCircle />
                        </InputAdornment>
                      ),
                    }}
                    variant="standard"
                  />
                  <Box sx={{ display: "flex", alignItems: "flex-end" }}>
                    <BiPlusCircle />
                    <TextField
                      id="input-with-sx"
                      label="With sx"
                      variant="standard"
                    />
                  </Box>
                </Box>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubmitPoll}>Post</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
export default TabsDemo;
