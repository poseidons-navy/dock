import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { Plus, Search } from "lucide-react"
import Card from '@/components/organisms/card'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start px-5 pt-10 space-y-10">

        <div className="flex flex-row items-center justify-center w-full space-x-4">


            <div className="flex flex-row items-center justify-center w-1/2 ">
              <Input
                placeholder='Find your vessel'
                className='w-full'
              />
              <Button size="sm" >
                <Search
                  size="16px"
                />
              </Button>
            </div>
            <div className="flex flex-row items-center justify-center space-x-2 ">
              <Button size="sm" >
                {/* <Plus/> */}
                <span>
                  Create a Vessel
                </span>
              </Button>

              <Button size="sm" variant={"outline"} >
                Connect your wallet
              </Button>
            </div>

        </div>

        <div className="flex flex-col w-4/5 items-center justify-start">
          <div className="grid grid-cols-3 gap-x-5 gap-y-5 w-full">
            {
              [...Array(20).fill(0)]?.map((k, i)=>{
                return (
                  <Card
                    key={i}
                  />
                )
              })
            }
          </div>
        </div>

    </main>
  )
}
