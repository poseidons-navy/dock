"use client"
import * as React from 'react';

interface PollProps{
    question: string
}

export default function Poll(props: PollProps) {
    return(
        <div>
            <p>{props.question}</p>
            
        </div>
    );
}