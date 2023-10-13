import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import ConstApp from "@/components/organisms/HomePage/ConstApp";


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DOCK',
  description: 'Poseidons doc',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
     
        <ConstApp/>
      <main>{children}</main>
      </body>
     
    </html>
  )
}
