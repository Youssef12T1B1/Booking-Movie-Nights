import React, {Component} from "react";
import './pages.css'
import Modal from "../components/modal/modal";
import Backdrop from "../components/backdrop/backdrop";
class EventsPage extends Component{

    state ={
        creating : false
    }
    createHandler = ()=>{
        this.setState({
            creating: true
        })
    }
    cancelHandler=()=>{
        this.setState({
            creating: false
        })
    }
    AddHandler=()=>{
        this.setState({
            creating: false
        })
    }
    
    render(){
        return (
            <React.Fragment>
               {this.state.creating &&  <Backdrop/>}
    {this.state.creating &&   <Modal title="Add Event" canAdd canCancel onCancel={this.cancelHandler} onAdd={this.AddHandler}>
            <p> Modal Content</p>
       </Modal> }
        <div className="Event_Creation">
             <p>Share your own Events!</p>
            <button className="btn" onClick={this.createHandler}>Create Event</button>
        </div>
        </React.Fragment>
        
        )
     
    }
}

export default EventsPage