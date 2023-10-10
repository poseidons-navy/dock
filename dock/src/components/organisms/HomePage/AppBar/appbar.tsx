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
function AppBar() {
const [vesselDetails, setVesselDetails] = useState({
  name:"",
  description:""
})
function handleChange(event: React.ChangeEvent<HTMLInputElement>)
{
  setVesselDetails(prevDetails=>({
    ...prevDetails,
    [event.target.name]:event.target.value
  }))
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
                    value={vesselDetails.name}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Input
                    id="description"
                    value={vesselDetails.description}
                    className="col-span-3"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <SheetFooter>
                <SheetClose asChild>
                  <Button type="submit">Save</Button>
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
