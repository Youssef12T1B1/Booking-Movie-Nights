const Booking = require('../../models/booking')
const Event = require('../../models/event')
const { dateToString } = require('../../useful/date')
const {formBooking, fromEvent} = require('./merge')






module.exports={


        bookings: async ()=>{
            try{
                const bookings = await Booking.find()
                return bookings.map(booking=>{
                    return formBooking(booking)
                })

            }catch(err){
                throw err
            }
            
        },

        bookEvent: async args =>{
            const event = await Event.findOne( {_id: args.eventId })
            const booking =  new Booking({
                   user: "6224c1c8a5a1775fe79fe0a9",
                   event: event
            })
            const result = await booking.save()
            return formBooking(result)
        },
        cancelBooking : async args=>{
            try{
                const booking = await Booking.findById(args.bookingId).populate('event')
                const event = fromEvent(booking.event)
                await Booking.deleteOne({_id:args.bookingId})
                return event
            }catch (err){
                throw err
            }
        }


    }
