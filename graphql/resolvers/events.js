const Event = require('../../models/event')
const {fromEvent} = require('./merge')



module.exports={

    events : async () =>{
        try{
           const events = await Event.find()
     
            return events.map(event=>{
                return fromEvent(event)
            })

        }catch(err){
            console.log(err);
        }
    },

    createEvent : (args)=>{
        const event = new Event({
            title: args.EventInput.title,
            description: args.EventInput.description,
            price: +args.EventInput.price,
            date: new Date(args.EventInput.date),
            creator: '6224c1c8a5a1775fe79fe0a9'
        
        })
        let createdEvent
        return event
        .save()
        .then(result=>{
            createdEvent =  fromEvent(result)
            return  User.findById('6224c1c8a5a1775fe79fe0a9')
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
            return  createdEvent
        })
        .catch(err=>{
            console.log(err);
            throw err
        })
    
        return event
    },

   
 


}