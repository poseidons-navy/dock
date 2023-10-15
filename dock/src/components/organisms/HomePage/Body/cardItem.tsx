"use client";
import Link from 'next/link'
import React from "react";
import { Button } from "../../../ui/button";

export interface CardItemProps {
  name: string
  description: string
}

function CardItem(props: CardItemProps) {
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
