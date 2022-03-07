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


app.use(isAuth)



app.use('/graphql', graphqlHTTP({
    schema: Schema,
    rootValue: root ,
    graphiql: true

}))


app.listen(3000)