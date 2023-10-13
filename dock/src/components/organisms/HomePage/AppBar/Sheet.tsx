"use client"
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
  import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type myProps = {
    handleSubmit:(event: any) => void;
    name: string,
    description: string
    setName: (event: any)=>void,
    setDescription: (event: any)=>void
    }

    const Popup: React.FC<myProps> = ({ handleSubmit, name, description, setName, setDescription }) => {
   
  
    return (  

        <Sheet key="bottom">
        <SheetTrigger>
          <Button variant="outline" color="black">
            Create vessel
          </Button>
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
                onChange={(e) => setName(e.target.value)}
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
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <SheetFooter>
            <SheetClose asChild>
              <Button type="submit" onClick={handleSubmit}>
                Save
              </Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

    );
}

export default Popup;