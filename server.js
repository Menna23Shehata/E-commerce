import dotenv from 'dotenv'
dotenv.config({})
import express from 'express'
import { connection } from './db/connection.js'
import morgan from 'morgan'
import { init } from './src/modules/index.js'
import cors from 'cors'
import { createOnlineOrder } from './src/modules/order/order.controller.js'

const app = express()
const port = 3000

app.post('/webhook', express.raw({ type: 'application/json' }), createOnlineOrder);
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())
app.use(express.static("uploads"))
app.use(morgan('dev'))







init(app)
connection()
app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))


process.on("unhandledRejection", (err) => {
    console.log(err);
})