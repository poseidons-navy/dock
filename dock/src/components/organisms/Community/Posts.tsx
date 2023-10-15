"use client";
import { IconContext } from 'react-icons';
import { LuArrowBigUp, LuArrowBigDown } from "react-icons/lu";
import { PiArrowFatUpFill, PiArrowFatDownFill } from "react-icons/pi";
import { FaRegComment } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
import { useState, useEffect } from "react";
import { ArrowDown, ArrowUp } from 'lucide-react';

interface PostProps {
  username: string,
  proposal: string,
  description: string,
  comments: number,
  upvotes: number,

}

function Posts(props: PostProps) {
  const [voteType, setVoteType] = useState<"up"|"down"|"none">("none");


  const handleToggle = (type: "up" | "down") => {
    setVoteType(type)
  }


  return (
    <div className="flex flex-row items-start justify-between gap-x-5">
      <div className=" h-full flex flex-col items-start justify-center px-2 py-1 ring-1 ">
        <button
          className={`bg-none ${voteType == "up" ? "" : "opacity-50"}  `}
          onClick={()=>handleToggle("up")}
        >
            <ArrowUp size={16} />
        </button>
        
        <button
          className={`bg-none ${voteType == "down" ? "" : "opacity-50"}  `}
          onClick={()=>handleToggle("down")}
        >
            <ArrowDown size={16} />
        </button>
        <div className="flex flex-col items-center justify-center">
          <span className="text-semibold text-xs  ">
            {
              props.upvotes ?? 0
            }

            votes
          </span>
        </div>
      </div>
      <div className="flex flex-col w-full">
          <p className="text-sm text-left">
            {

            }
          </p>
      </div>
    </div>
  )
    
}

export default Posts;
