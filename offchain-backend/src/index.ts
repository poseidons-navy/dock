import Koa from 'koa'
import KoaLogger   from "koa-logger";
import { koaBody } from 'koa-body'
import KoaRouter from '@koa/router'
import {schemas} from "./lib/schemas";
import client from "../prisma/client";
import {generate_unique_id} from "./lib/functions";
import _ from "lodash"
import {z} from "zod";
import dayjs from "dayjs";
import cors from '@koa/cors'

const app = new Koa()
app.use(cors())
app.use(KoaLogger())
app.use(koaBody())

const {isNull, isString} = _


const router = new KoaRouter()

router.get("ping", "/ping", (ctx)=>{
    ctx.response.body ="pong"
    return ctx
})


router.post("create-new-user", "/users", async (ctx)=> {

    const { body } = ctx.request
   
    const parsed = schemas.User.safeParse(body)
   
    if(!parsed.success) {
        console.log(parsed.error)
        ctx.response.status = 400
        ctx.response.body = "INVALID BODY"
        return
    }

    const new_user = await client.user.create({
        data: {
             ...parsed.data,
            id: generate_unique_id("usr")







        }
    })


    ctx.response.body = new_user
    ctx.response.status = 201

    return
})

router.get("get-user", "/users", async (ctx)=>{

    const { query } = ctx.request
    const address = query["address"] ?? null
   
    if(!isString(address)){
        ctx.response.status = 400
        ctx.response.body = "INVALID ADDRESS"
        return
    }

    const user = await client.user.findFirst({
        where: {
            address
        },
        include: {
            created_vessels: true,
            memberships: true,
            posts: true
        }
    })

    ctx.response.body = user
    ctx.response.status  = 200
    return

})

router.get("get-user-vessels", "/users/:user_id/vessels", async (ctx)=>{

    const user_id = ctx.params.user_id

    const user_vessels = await client.vessel.findMany({
        where: {
            OR: [
                {
                    members: {
                        some: {
                            user_id
                        }
                    }
                },
                {
                    creator_id: user_id
                }
            ]
        }
    })


    ctx.response.body = user_vessels
    ctx.response.status =  200;
    return
})

router.post("create-vessel", "/vessels", async (ctx)=>{

    const { body } = ctx.request

    const parsed = schemas.Vessel.safeParse(body)

    if(!parsed.success) {
        ctx.response.status = 400
        ctx.response.body = "INVALID BODY"
        return
    }

    const vessel = await client.vessel.create({
        data: {
            id: generate_unique_id("vsl").slice(0,32),
            ...parsed.data
        }
    })

    ctx.response.status = 201
    ctx.response.body = vessel
    return

})

router.get("get-vessel", "/vessels/:vessel_id", async (ctx)=>{

    const vessel_id = ctx.params.vessel_id

    const vessel = await client.vessel.findFirst({
        where: {
            id: vessel_id
        },
        include: {
            creator: true,
            members: {
                include: {
                    user: true
                }
            }
        }
    })


    ctx.response.status =  200
    ctx.response.body = vessel

})

router.get("get-all-vessels", "/vessels", async (ctx)=>{

    const vessels = await client.vessel.findMany({
        include: {
            creator: true,
            members: {
                include: {
                    user: true
                }
            }
        }
    })


    ctx.response.status =  200
    ctx.response.body = vessels

})

router.post("create-content-post", "/posts/content", async (ctx)=>{

    const { body } = ctx.request

    const parsedPostDetails = schemas.Post.parse(body)

    const new_post = await client.post.create({
        data: {
            id: generate_unique_id("post"),
            ...parsedPostDetails
        }
    })


    const new_content = await  client.content.create({
        data: {
            id: generate_unique_id("content_post"),
            post_id: new_post?.id,
        }
    })

    ctx.response.body = {
        post_id: new_post.id,
        content_id: new_content.id
    }

    ctx.response.status = 201
    return
})

router.post("create-poll-post", "/posts/poll", async (ctx)=>{

    const { body } = ctx.request;
    
    const parsedPostData = schemas.Post.parse(body)

    const new_post = await client.post.create({
        data: {
            id: generate_unique_id("post"),
            ...parsedPostData
        }
    })


    const new_poll = await client.poll.create({
        data: {
            id: generate_unique_id("poll_post"),
            post_id: new_post?.id,
            due: dayjs().add(24, "h").toDate()
        }
    })


    ctx.response.body = {
        post_id: new_post.id,
        poll_id: new_poll.id
    }

    return
})

router.post("create-invitation-poll", "/posts/invitation", async (ctx) => {

    const { body } = ctx.request
    console.log(body)
    const parsedBody = schemas.Post.extend({
        invitee: z.string()
    }).parse(body)

    const { invitee, ...rest } = parsedBody


    const new_post = await client.post.create({
        data: {
            id: generate_unique_id("post"),
            ...rest
        }
    })

    const invitation = await client.invitation.create({
        data: {
            id: generate_unique_id("invitation_poll_post"),
            address: invitee,
            post_id: new_post.id,
            due: dayjs( new Date().toUTCString() ).add(24, "hours").toDate(),
            for: 0,
            against: 0
        }
    })

    return {
        post_id: new_post.id,
        invitation_id: invitation.id
    }


})


router.get("get-posts", "/posts", async (ctx)=> {

    const chaos_message_id = ctx.query["chaos_message_id"] as string

    const posts = await client.post.findMany({
        where: {
            chaos_message_id: chaos_message_id
        },
        include: {
            content: true,
            invitation: true,
            poll:true,
            user: true
        }
    })
    

    ctx.response.body = posts 
    ctx.response.status = 200 

    return 

})


app.use(router.routes())


app.listen(8089, ()=>{
    console.log("🚀 BLAST OFF!!!")
})