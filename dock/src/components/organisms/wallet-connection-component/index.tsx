"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import { useWallet } from "@solana/wallet-adapter-react"

function WalletConnectionComponent() {
    const { connect, disconnect } = useWallet()
  return (
    <Button size="sm" variant={"outline"} >
        Connect your wallet
    </Button>
  )
}

export default WalletConnectionComponent