import { createContext } from "react";


const BaseContext = createContext({
    items: [] as Array<{
        name: string,
        description: string, 
        vessel_id: string,
        creator_address: string
    }>
})

export default BaseContext