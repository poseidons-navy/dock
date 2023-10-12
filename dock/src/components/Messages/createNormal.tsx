"use client"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {useState} from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export function Normal() {
    const [postContent, setPostContent] = useState('');
    const [title, setTitle] = useState('');
  return (
    <div className="grid w-full gap-1.5">
        <Input value={title} onChange={e=>setTitle(e.target.value)}/>
      <Label htmlFor="message-2">Your Message</Label>
      <Textarea placeholder="Type your message here." id="message-2" value={postContent}
      onChange={e =>setPostContent(e.target.value)}
      />
      <p className="text-sm text-muted-foreground">
        Your message will be copied to the support team.
      </p>
      <Button size="sm">Post</Button>
    </div>
  )
}
