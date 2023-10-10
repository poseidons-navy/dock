"use client"
import { Button } from "@/components/ui/button";

function Header() {
    return (<div className="flex justify-center items-center">
        <h2>Javascript club</h2>
        <Button size="sm" className="pl-4">Join</Button>
    </div>);
}

export default Header;