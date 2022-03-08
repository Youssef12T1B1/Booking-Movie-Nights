const express = require('express')
const bodyParser = require('body-parser')
const { graphqlHTTP } = require('express-graphql')
const connectDB = require('./config/db')
const Schema = require('./graphql/schema/schema')
const root = require('./graphql/resolvers/main')
const isAuth = require('./middleware/Is_Auth')

const app = express()
connectDB()


app.use(bodyParser.json())

app.use((req,res,next)=>{
    res.setHeader('Access-Control-Allow-Origin','*')
    res.setHeader('Access-Control-Allow-Methods','POST,GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization')
    if(req.method === 'OPTIONS'){
        return res.sendStatus(200)
    }
    next()
})


app.use(isAuth)



app.use('/graphql', graphqlHTTP({
    schema: Schema,
    rootValue: root ,
    graphiql: true

}))


app.listen(5000)