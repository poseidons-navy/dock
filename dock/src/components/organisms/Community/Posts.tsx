"use client";
import { LuArrowBigUp, LuArrowBigDown } from "react-icons/lu";
import { PiArrowFatUpFill, PiArrowFatDownFill } from "react-icons/pi";
import { FaRegComment } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
function Posts() {
  return (
    <div className="flex py-5">
      <div>
        <LuArrowBigUp className="text-2xl hover:text-pink-300"/>
        <p>124</p>
        <LuArrowBigDown className="text-2xl hover:text-blue-300"/>
      </div>
      <div>
        <p className="text-zinc-500">Proposal by Random username</p>
        <p className="font-semibold">
          How do we figure out which hand is used for fine dexterity from such a
          young age?
        </p>
        <p>
          A detailed description of the proposal.It seems most children figure
          out if they’re left-handed or right-handed by the time they start
          writing. How do we know which hand is more dominant, is it more of a
          learned trait or genetic?
        </p>
        <div className="flex">
          <div className="flex items-center hover:bg-zinc-400 rounded-sm p-2">
            <FaRegComment />
            <p className="pl-3">73 comments</p>
          </div>
          <div className="pl-6 flex justify-center items-center hover:bg-zinc-400 rounded-sm p-2">
            <IoIosShareAlt />
            <p className="pl-2">share</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Posts;
