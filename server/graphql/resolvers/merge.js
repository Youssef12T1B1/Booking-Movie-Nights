const User = require('../../models/user')
const Event = require('../../models/event') 
const { dateToString } = require('../../useful/date')


const user = async userId=>{
    try{
    const user = await User.findById(userId)
  
    return { ...user._doc, 
        createdEvents: events.bind(this, user.createdEvents)
    }
  
}catch (err){
 throw err
} 
}
 const singleEvent = async eventId=>{
     try{
         const event = await Event.findById(eventId)
         return  fromEvent(event)
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
// //exports.events = events
// exports.singleEvent= singleEvent