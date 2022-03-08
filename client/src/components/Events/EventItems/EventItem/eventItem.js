import React from "react";
import './eventitem.css'


const eventItem = props =>(

    <li  key={props.eventId} className="event_li">
             <div>
                
                 <h2>{props.title}</h2>
                 <h3>{props.price} DH - {new Date(props.date).toLocaleDateString()}</h3>
                 
             </div>
             <div>
                 {props.userId === props.creatorId ?   <p>You Created this Event</p>:
                 <button className="btn_Event" onClick={props.Details.bind(this,props.eventId)}>More Details</button>}
               
             </div>
    </li>

)

export default eventItem