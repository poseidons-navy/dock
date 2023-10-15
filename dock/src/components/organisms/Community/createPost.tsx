"use client"
import { Input } from "@/components/ui/input";
import  Link  from "next/link";

function CreatePost() {
  return (
    <div>
      <Link href="Posts/Messages">
      <Input placeholder="Create Proposal" className="w-[400px] mt-2" />
      </Link>
    </div>
  );
}

export default CreatePost;
