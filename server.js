import koa from 'koa'
import logger from 'koa-logger'
import Router from 'koa-router'
import config from 'config'
import fs from 'fs'

import errorHandler from './src/middlewares/error-handler'
import twitter from './src/twitter'

var app = new koa()
app.use(errorHandler)
app.use(logger())

const router = new Router()
router.get('/error', async () => {
  let e = Error('Unspecified error')
  e.status = 501
  throw e
})

router.get('/tweet/:id', async ctx => {
  const res = JSON.parse(await twitter.fetch(ctx.params.id))
  ctx.body = res;
});

router.get('/templates/:filename', async ctx => {
  ctx.type = 'text/html'
  ctx.body = fs.createReadStream('templates/'+ctx.params.filename)  
})

router.get('/assets/:filename', async ctx => {
  ctx.type = 'image'
  ctx.body = fs.createReadStream('assets/'+ctx.params.filename)  
})

router.get('/styles/:filename', async ctx => {
  ctx.type = 'text/css'
  ctx.body = fs.createReadStream('styles/'+ctx.params.filename)  
})

router.get('/scripts/:filename', async ctx => {
  ctx.type = 'text/javascript'
  ctx.body = fs.createReadStream('scripts/'+ctx.params.filename)  
})


router.get(/\/?|\/index.html/, async ctx => {  
  ctx.type = 'html'
  ctx.body = fs.createReadStream('index.html')
})

const default_route = (ctx, next) => {
  let e = Error('Not Found')
  e.status = 404
  throw e
}

app.use(router.routes())
app.use(default_route)

app.listen(config.server.port)