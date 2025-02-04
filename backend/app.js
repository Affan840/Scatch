import express from 'express'
import connectDB from './config/mongoose.connection.js'
const app = express()

import cookieParser from 'cookie-parser'

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

// routes imports

import ownersRoute from './routes/owners.routes.js'
import  usersRoute from './routes/users.routes.js'
import prdouctsRoute from './routes/products.routes.js'

app.use('/owners', ownersRoute);
app.use('/users', usersRoute);
app.use('/products', prdouctsRoute);

app.listen(3000)