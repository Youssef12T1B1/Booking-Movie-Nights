import React, {Component} from "react";
import './pages.css'
import Modal from "../components/modal/modal";
import AuthContext from '../context/auth'
import Backdrop from "../components/backdrop/backdrop";
import EventList from "../components/Events/EventItems/EventList";


class EventsPage extends Component{

    state = {
        creating : false,
        events : [],
        isLoading: false,
        selectedEvent : null
    }

    isActive = true

    static  contextType = AuthContext

    constructor(props){
        super(props)
        this.titleRef = React.createRef()
        this.descriptionRef = React.createRef()
        this.priceRef = React.createRef()
        this.dateRef = React.createRef()
    }

    componentDidMount(){
        this.ShowEvents()
    }
    
    createHandler = ()=>{
        this.setState({
            creating: true
        })
    }
     ShowDetail= eventId=>{
        this.setState(prevState=>{
            const selectedEvent = prevState.events.find(e=>e._id === eventId)
            return   { selectedEvent : selectedEvent}
        })
     }
    ShowEvents=()=>{
        this.setState({isLoading:true})
        const query = {
            query:`
            query {
                events{
                _id    
                title
                description
                price
                date
                creator{
                    _id
                    username
                }
                
                }
            }
                `
        }
        
         
        fetch('http://localhost:5000/graphql',{
            method: 'POST',
            body: JSON.stringify(query),
            headers : {
                'Content-Type': 'application/json',
           
            }
        })
        .then(res =>{
            if(res.status !==200 && res.status !== 201){
                throw new Error('Failed!!!')
            }
             return res.json()
        })
        .then(resData =>{
          const events = resData.data.events
          if(this.isActive){
            this.setState({events: events, isLoading:false})
          }
         
          
    
           })
        .catch(err=>{
            console.log(err);
            if(this.isActive){
            this.setState({isLoading:false})}
        })
    
    }

    cancelHandler=()=>{
        this.setState({
            creating: false,
            selectedEvent: null
        })
    }


    BookEventHandler = ()=>{
        if(!this.context.token){
            this.setState({selectedEvent: null})
            return
        }
        // this.setState({isLoading:true})
        const query = {
            query:`
            mutation {
                bookEvent(eventId :"${this.state.selectedEvent._id}"){
                _id    
                createdAt
                updatedAt
                
                }
            }
                `
        }
      

         
        fetch('http://localhost:5000/graphql',{
            method: 'POST',
            body: JSON.stringify(query),
            headers : {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.context.token
           
            }
        })
        .then(res =>{
            if(res.status !==200 && res.status !== 201){
                throw new Error('Failed!!!')
            }
             return res.json()
        })
        .then(resData =>{
          console.log(resData);
          this.setState({selectedEvent: null})
          
    
           })
        .catch(err=>{
            console.log(err);
            this.setState({isLoading:false})
        })
    


    }
    AddHandler=()=>{
       const tilte = this.titleRef.current.value
       const description = this.descriptionRef.current.value
       const price = +this.priceRef.current.value
       const date = this.dateRef.current.value
       if(tilte.trim().length === 0 || description.trim().length === 0 || !price || date.trim().length === 0 ){
        return
    }
    //    const event = { tilte, description, price, date }
       const query = {
        query:`
        mutation {
            createEvent(EventInput:{title:"${tilte}" , description:"${description}",price:${price},date:"${date}" }){
            _id
            title
            description
            price
            date
            
        }
        }
            `
    }
    const token = this.context.token
     
    fetch('http://localhost:5000/graphql',{
        method: 'POST',
        body: JSON.stringify(query),
        headers : {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    .then(res =>{
        if(res.status !==200 && res.status !== 201){
            throw new Error('Failed!!!')
        }
         return res.json()
    })
    .then(resData =>{
      this.setState(prevState=>{
          const newEvents = [...prevState.events]
          newEvents.push({     
            _id    : resData.data.createEvent._id,
            title : resData.data.createEvent.title,
            description:  resData.data.createEvent.description,
            price:resData.data.createEvent.price,
            date:resData.data.createEvent.date,
            creator:{
                _id : this.context.userId

            }
      
            })
            return {events: newEvents}
      })
      this.cancelHandler()

       })
    .catch(err=>{
        console.log(err);
    })

    }

    componentWillUnmount(){
        this.isActive = false
    }
    
    render(){
    
        return (
            <React.Fragment>
            {(this.state.creating || this.state.selectedEvent) &&  <Backdrop/>} 
            {this.state.creating &&  
                <Modal title="Add Event" 
                buttonText="Add Event"
                    canAdd canCancel 
                    onCancel={this.cancelHandler} 
                    onAdd={this.AddHandler}>
                        <form>
                         <div className="form-control">
                             <label htmlFor="tilte">Title</label>
                             <input type='text' id="title" ref={this.titleRef}/>
                        </div>
                        <div className="form-control">
                             <label htmlFor="description">Description</label>
                             <textarea id="description" rows="3" ref={this.descriptionRef}></textarea>
                        </div>
                        <div className="form-control">
                             <label htmlFor="price">Price</label>
                             <input type='number' id="price" ref={this.priceRef}/>
                        </div>
                        <div className="form-control">
                             <label htmlFor="date">Date</label>
                             <input type='datetime-local' id="date" ref={this.dateRef}/>
                        </div>

                        </form>
                   


            </Modal> }
           {this.state.selectedEvent  &&  (
            <Modal 
            title={this.state.selectedEvent.title}
            buttonText= {this.context.token ?"Book Event" :"Confirm"}
                    canAdd canCancel 
                    onCancel={this.cancelHandler} 
                    onAdd={this.BookEventHandler}>
                        
                        <h1>{this.state.selectedEvent.title}</h1>
                        <h2>{this.state.selectedEvent.description}</h2>
                        <h3>{this.state.selectedEvent.price} DH - {new Date(this.state.selectedEvent.date).toLocaleDateString()}</h3>
                   


            </Modal>)}
           {this.context.token && <div className="Event_Creation">
                 
                <p>Share your own Events!</p>
                <button className="btn_Event" onClick={this.createHandler}>Create Event</button>
            </div>}
               
           {this.state.isLoading ? <center> <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> </center>  :
          <EventList eventsList={this.state.events} CurrentUserId={this.context.userId} 
           ViewDetails={this.ShowDetail}
          />   } 

      
           
        </React.Fragment>
        
        )
     
    }
}

export default EventsPage