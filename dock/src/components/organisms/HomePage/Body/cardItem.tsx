"use client"

import React from 'react'
import { Button } from '../../../ui/button'

function CardItem() {
  return (
    <div className="flex flex-col items-center justify-start rounded-md shadow-sm overflow-hidden">
        <div className="flex flex-row items-center justify-center w-full  bg-slate-300 px-5 py-5">
            SpongeBob
        </div>
        <div className="flex flex-col items-start justift-start px-2 py-2 w-full space-y-2">
            <span>
                Discuss all things SpongeBob
            </span>
            <Button size="sm" >
           Request to Join
            </Button>
        </div>
    </div>
  )
}

export default CardItem