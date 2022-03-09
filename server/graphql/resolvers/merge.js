const User = require('../../models/user')
const Event = require('../../models/event') 
const { dateToString } = require('../../useful/date')
const  DataLoader = require('dataloader')

const eventLoader = new DataLoader((eventIds)=>{
    return events(eventIds)

})
const userLoader = new DataLoader((userIds)=>{
    return User.find({_id:{$in:userIds}})

})
const user = async userId=>{
    try{
    const user = await userLoader.load(userId.toString())
  
    return { ...user._doc, 
        createdEvents: eventLoader.load.bind(this, user._doc.createdEvents)
    }
  
}catch (err){
 throw err
} 
}
 const singleEvent = async eventId=>{
     try{
         const event = await eventLoader.load(eventId.toString())
         return  event
     }catch(err){
         throw err

     }
 }

const  events = async eventIds =>{
    try{
        const events = await Event.find({ _id: {$in: eventIds }})
           return events.map(event=>{
            return fromEvent(event)
            
            })
          
        }
    catch (err) {
           throw err
        }
     
}

const formBooking =  booking =>{
    return{
        ...booking._doc,
                        user: user.bind(this, booking._doc.user),
                        event : singleEvent.bind(this, booking._doc.event),
                        createdAt: dateToString(booking._doc.createdAt),
                        updatedAt: dateToString(booking._doc.updatedAt)
    }
    
    }
    
    const fromEvent = event =>{
        return {
            ...event._doc,
                    date : dateToString(event._doc.date),
                    creator: user.bind(this, event.creator)
        }}


exports.formBooking = formBooking 
exports.fromEvent = fromEvent 
// exports.user = user
//exports.events = events
// exports.singleEvent= singleEvent