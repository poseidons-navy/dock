"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Box from "@mui/material/Box";

import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { BiPlusCircle } from "react-icons/bi";
function TabsDemo() {
  return (
  <div className="flex flex-col justify-center items-center">
      <Tabs defaultValue="proposals" className="w-1/3 ">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="proposal">Proposal</TabsTrigger>
        <TabsTrigger value="announcement">Announcement</TabsTrigger>
        <TabsTrigger value="poll">Poll</TabsTrigger>
      </TabsList>
      <TabsContent value="proposal">
        <Card>
          <CardHeader>
            <CardTitle>Proposal</CardTitle>
            <CardDescription>
              Create a proposal for the community members from here
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="name">Title</Label>
              <Input id="name" defaultValue="Title" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="proposal">Proposal body</Label>
              <Textarea placeholder="Type your entire proposal." />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Post</Button>
          </CardFooter>
        </Card>
      </TabsContent>
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
              <Label htmlFor="current">Title</Label>
              <Input id="current" defaultValue="title" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new">Announcement body</Label>
              <Textarea placeholder="Type your entire announcement." />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Post</Button>
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
            <Button>Post</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
  );
}
export default TabsDemo;
