"use client";
import { LuArrowBigUp, LuArrowBigDown } from "react-icons/lu";
import { PiArrowFatUpFill, PiArrowFatDownFill } from "react-icons/pi";
import { FaRegComment } from "react-icons/fa";
import { IoIosShareAlt } from "react-icons/io";
function Posts() {
  return (
    <div className="flex">
      <div>
        <LuArrowBigUp />
        <p>124</p>
        <LuArrowBigDown />
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
        <div>
          <div className="flex items-center">
            <FaRegComment />
            <p className="pl-3">73 comments</p>
          </div>
          <div className="pl-6">
            <IoIosShareAlt />
            <p className="pl-2">share</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Posts;
