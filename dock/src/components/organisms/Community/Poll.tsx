"use client"
import * as React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { DivideSquare } from 'lucide-react';

interface PollProps{
    question: string,
    choices: string[],
    for: number,
    against: number
}

export default function Poll(props: PollProps) {
    const [checked, setChecked] = useState("YES")
    const [forV, setFor] = useState(props.for);
    const [against, setAgainst] = useState(props.against);

    function onOptionChange(e: React.ChangeEvent<HTMLInputElement>) {
        setChecked(e.target.value)
    }

    function handleVote() {
        alert(`${checked} has been voted`)
        if (checked == "YES") {
            setFor(forV + 1)
        } else {
            setAgainst(against + 1)
        }
    }

    return(
        <div>
            <p>{props.question}</p>
                <div>
                   <div className='block'>
                    <input 
                            id="terms1" 
                            type="radio" 
                            value="YES" 
                            name="for" 
                            checked={checked == "YES"} 
                            onChange={onOptionChange}/>
                        <label
                            htmlFor='terms1'
                            className="px-4"
                        >
                            {props.choices[0]}
                        </label>
                   </div>
                   <div>
                    <p>{forV / (forV + against) * 100}</p>
                    <div className='p-2 bg-blue-400 rounded-sm' style={{width: `${forV / (forV + against) * 100}%`}}></div>
                   </div>
                    <div className='block'>
                        <input 
                            id="terms2" 
                            type="radio" 
                            value="NO" 
                            name="for" 
                            checked={checked == "NO"} 
                            onChange={onOptionChange}/>
                        <label
                            htmlFor='terms2'
                            className='px-4'
                        >
                            {props.choices[1]}
                        </label>
                    </div>
                    <div>
                        <p>{against / (forV + against) * 100}</p>
                        <div className='p-2 bg-green-400 rounded-sm' style={{width: `${against / (forV + against) * 100}%`}}></div>
                   </div>
                </div>
            <div className='flex flex-row items-center justify-around'>
                <p>Total Votes: {forV + against}</p>
                <Button onClick={handleVote}>Vote</Button>
            </div>
        </div>
    );
}

interface PercentageRowArgs {
    text: string,
    percentage: number
}

function PercentageRow(props: PercentageRowArgs) {
    return (
        <div>
            <p>{props.text}</p>
            <div style={{width: props.percentage}}></div>
        </div>
    );
}