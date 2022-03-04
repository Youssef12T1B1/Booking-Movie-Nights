const express = require('express')
const bodyParser = require('body-parser')
const { graphqlHTTP }= require('express-graphql')
const { buildSchema } = require('graphql')
const connectDB = require('./config/db')
const Event = require('./models/event')

const app = express()
connectDB()


app.use(bodyParser.json())

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
       type Event {
           _id: ID!
           title: String!
           description: String!
           price: Float!
           date: String!

       }

       input  EventInput{
        title: String!
        description: String!
        price: Float!
        date: String!
       } 

       type RootQuery{
           events : [Event!]!

       } 
       type RootMutation{
           createEvent(EventInput: EventInput): Event


       }
       schema {
           query: RootQuery
           mutation: RootMutation
       }
    `),
    rootValue: {
        events : () =>{
          return Event
            .find()
            .then(results=>{
                return results.map(result=>{
                    return {...result._doc}
                })
            })
            .catch(err=>{
                console.log(err);
            })
        },
        createEvent : (args)=>{
       
        const event = new Event({
            title: args.EventInput.title,
            description: args.EventInput.description,
            price: +args.EventInput.price,
            date: new Date(args.EventInput.date)
        })
        return event
        .save()
        .then(result=>{
           
            return {...result._doc}
        })
        .catch(err=>{
            console.log(err);
            throw err
        })
    
        return event
        }
    },
    graphiql: true

}))


app.listen(3000)