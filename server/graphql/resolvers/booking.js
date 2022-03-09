const Booking = require('../../models/booking')
const Event = require('../../models/event')
const { dateToString } = require('../../useful/date')
const {formBooking, fromEvent} = require('./merge')






module.exports={


        bookings: async (args, req)=>{
            if(!req.isAuth){
                throw new Error('Logged In first!!')
            }
            try{
                const bookings = await Booking.find({user:  req.userId})
                return bookings.map(booking=>{
                    return formBooking(booking)
                })

            }catch(err){
                throw err
            }
            
        },

        bookEvent: async (args, req) =>{
            if(!req.isAuth){
                throw new Error('Logged In first!!')
            }
            const event = await Event.findOne( {_id: args.eventId })
            const booking =  new Booking({
                   user: req.userId,
                   event: event
            })
            const result = await booking.save()
            return formBooking(result)
        },
        cancelBooking : async (args, req)=>{
            if(!req.isAuth){
                throw new Error('Logged In first!!')
            }
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
