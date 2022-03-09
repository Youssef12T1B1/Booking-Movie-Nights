import React from "react";
import './bookings.css'
const bookingList = props =>(
    <ul className="bookings_ul">
        {props.bookings.map(booking=>{
            return <li  className="bookings_li" key={booking._id}>
                <div className="bookings_item">
                {booking.event.title} {' - '}
                { new Date(booking.createdAt).toLocaleDateString()} 
                </div>
                <div className="bookings_buttons">
                    <button onClick={props.onDelete.bind(this, booking._id)}>Cancel</button>
                </div>
              </li>
        })}
    </ul>
)

export default bookingList