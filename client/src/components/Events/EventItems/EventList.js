import React from "react";
import './EventList.css'
import EventItem from './EventItem/eventItem'


const eventList = props =>   {

    const eventsList = props.eventsList.map(event=>{
        return(
         <EventItem  key={event._id} eventId={event._id}
          title={event.title} userId={props.CurrentUserId}
          creatorId ={event.creator._id}
          Username = {event.creator.username}
          price = {event.price}
          date = {event.date}
          Details={props.ViewDetails}

          />
         
        ) 
    })
    return(
        <ul className="event_list">
             {eventsList}
        
        </ul> 
    )
} 

export default eventList

