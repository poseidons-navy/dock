import { PrismaClient } from "@prisma/client";


const client = new PrismaClient({
    log: [
        {
            emit: "stdout",
            level: "error"
        },
        {
            emit: "stdout",
            level: "info"
        }
    ]
})


export default client