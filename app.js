const express = require('express')
const bodyParser = require('body-parser')
const { graphqlHTTP }= require('express-graphql')
const { buildSchema } = require('graphql')
const connectDB = require('./config/db')
const Event = require('./models/event')
const User = require('./models/user')
const bcrypt = require('bcryptjs')

const app = express()
connectDB()


app.use(bodyParser.json())

const user = userId=>{
    return User.findById(userId)
    .then(user=>{
    return { ...user._doc}
    })
    .catch(err=>{
        throw err
    })
}

app.use('/graphql', graphqlHTTP({
    schema: buildSchema(`
       type Event {
           _id: ID!
           title: String!
           description: String!
           price: Float!
           date: String!
           creator: User!

       }
       type User{
           _id: ID!
           username: String!
           email: String!
           password: String
           createdEvents: [Event!]

       }

       input  EventInput{
        title: String!
        description: String!
        price: Float!
        date: String!
       } 

       input UserInput{
            username: String!
            email: String!
            password: String!
       }

       type RootQuery{
           events : [Event!]!

       } 
       type RootMutation{
           createEvent(EventInput: EventInput): Event
           createUser(UserInput: UserInput): User


       }
       schema {
           query: RootQuery
           mutation: RootMutation
       }
    `),
    rootValue: {
        events : () =>{
          return Event.find()
            .then(results=>{
                return results.map(result=>{
                    return {
                        ...result._doc,
                    
                    creator : user.bind(this, result._doc.creator)}
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
            date: new Date(args.EventInput.date),
            creator: '6223e6484ad54b8041d8cf5a'
          
        })
        let createdEvents 
        return event
        .save()
        .then(result=>{
            createdEvents = {...result._doc}
            return  User.findById('6223e6484ad54b8041d8cf5a')
            return {...result._doc}
        })
        .then(user=>{
            if(!user){
                throw new Error('User not found')
            }
            user.createdEvents.push(event)
            return user.save()
        })
        .then(result=>{
            return  createdEvents
        })
        .catch(err=>{
            console.log(err);
            throw err
        })
    
        return event
        },
        createUser : args =>{
            return User.findOne({username: args.UserInput.username })
            .then(user=>{
                if(user){
                    throw new Error('User Exists')
                }
                return bcrypt.hash(args.UserInput.password,12)
            })
            .then(hashPass=>{
                const user = new User({
                    username : args.UserInput.username,
                    email : args.UserInput.email,
                    password : hashPass
    
                })
                return user.save()
            })
            .then(result=>{
                return { ...result._doc, password:null}
            })
            .catch(err=>{
                throw err
            })
            
        }
    },
    graphiql: true

}))


app.listen(3000)