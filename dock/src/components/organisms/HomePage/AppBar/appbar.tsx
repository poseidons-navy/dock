"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Plus, Search } from "lucide-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Vessel } from "./vessel";
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import * as web3 from '@solana/web3.js'
const VESSEL_REVIEW_PROGRAM_ID = 'AbrLPc6a5SyWA32E4BMsq31WodUhimWX8J9xGCJScGYz';


function AppBar() {

const [name, setName] = useState('')
const [description, setDescription] = useState('')


const { connection } = useConnection();
const { publicKey, sendTransaction } = useWallet();


const handleSubmit = (event: any) => {
  event.preventDefault()
  const vessel = new Vessel(name, description)
  handleTransactionSubmit(vessel)
}
const handleTransactionSubmit = async (vessel: Vessel) => {
  if (!publicKey) {
      alert('Please connect your wallet!')
      return
  }

  const buffer = vessel.serialize()
  const transaction = new web3.Transaction()

  const [pda] = await web3.PublicKey.findProgramAddressSync(
      [publicKey.toBuffer(), new TextEncoder().encode(vessel.name)],
      new web3.PublicKey(VESSEL_REVIEW_PROGRAM_ID)
  )
  const instruction = new web3.TransactionInstruction({
    keys: [
        {
            pubkey: publicKey,
            isSigner: true,
            isWritable: false,
        },
        {
            pubkey: pda,
            isSigner: false,
            isWritable: true
        },
        {
            pubkey: web3.SystemProgram.programId,
            isSigner: false,
            isWritable: false
        }
    ],
    data: buffer,
    programId: new web3.PublicKey(VESSEL_REVIEW_PROGRAM_ID)
})

transaction.add(instruction)

try {
    let txid = await sendTransaction(transaction, connection)
    alert(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
    console.log(`Transaction submitted: https://explorer.solana.com/tx/${txid}?cluster=devnet`)
} catch (e) {
    console.log(JSON.stringify(e))
    alert(JSON.stringify(e))
}
}




  return (
    <div className="flex flex-row items-center justify-center w-full space-x-4 pt-4">
      <div className="flex flex-row items-center justify-center w-1/2 ">
        <Input placeholder="Find your vessel" className="w-full" />
        <Button size="sm">
          <Search size="16px" className="hover:bg-zinc-700"/>
        </Button>
      </div>
      <div className="flex flex-row items-center justify-center space-x-2 ">
        <div className="grid grid-cols-2 gap-2">
          <Sheet key="bottom">
            <SheetTrigger >
              <Button variant="outline" color="black">Create vessel</Button>
            </SheetTrigger>
            <SheetContent side="bottom">
              <SheetHeader>
                <SheetTitle>Vessel details</SheetTitle>
                <SheetDescription>Enter vessel details here</SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={name}
                    className="col-span-3"
                    onChange={e=>setName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={description}
                    className="col-span-3"
                    onChange={e=>setDescription(e.target.value)}
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit" onClick={handleSubmit}>Save</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        <WalletMultiButton />
      </div>
    </div>
  );
}

export default AppBar;
