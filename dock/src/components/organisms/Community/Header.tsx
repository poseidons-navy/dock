"use client"
import { Button } from "@/components/ui/button";

function Header(props: {name: string}) {
    return (<div className="flex justify-center items-center pt-5">
        <h2 className="font-semibold text-lg">{props.name}</h2>
        <Button size="sm"  className="ml-4 bg-purple-600">Join</Button>
    </div>);
}

export default Header;