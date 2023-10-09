import Koa from 'koa'
import KoaLogger   from "koa-logger";
import { koaBody } from 'koa-body'
import KoaRouter from '@koa/router'

const app = new Koa()

app.use(KoaLogger())
app.use(koaBody())

const router = new KoaRouter()

router.get("ping", "/ping", (ctx)=>{
    ctx.response.body ="pong"
    return ctx
})




app.use(router.routes())


app.listen(8089, ()=>{
    console.log("🚀 BLAST OFF!!!")
})