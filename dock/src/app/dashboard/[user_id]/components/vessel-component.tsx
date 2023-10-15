"use client"
import React from 'react'
import { Vessel, User } from "@prisma/client"
import { AvatarImage, Avatar, AvatarFallback } from '@/components/ui/avatar'
import Link from 'next/link'


type Props = Vessel & { creator: User}

function VesselComponent(props: Props) {
  return (
    <Link
      href={`/vessels/${props.id}`}
      legacyBehavior
    >
      <div className="w-full cursor-pointer px-5 py-2 rounded-sm border-[1px] border-slate-400 hover:border-slate-700  flex flex-row gap-x-2">
          <div className="flex flex-col h-full w-[10px] ">
            <Avatar>
              <AvatarImage
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${props.creator.address}`}
              />
              <AvatarFallback>
                Creator
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-row w-full gap-y-5">
            <h4 className='font-semibold text-lg' >
              { props.name }
            </h4>
            <p
              className='font-medium'
            >
              {props.description}
            </p>
          </div>
      </div>
    </Link>
  )
}

export default VesselComponent