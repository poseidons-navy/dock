"use client"
import { Input } from "@/components/ui/input";
import  Link  from "next/link";

function CreatePost() {
  return (
    <div>
      <Link href="/Messages">
      <Input placeholder="Create Proposal" className="w-full mt-2" />
      </Link>
    </div>
  );
}

export default CreatePost;
