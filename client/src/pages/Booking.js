import React, {Component} from "react";
import './pages.css'
import AuthContext from '../context/auth'
import Chart from "../components/Bookings/Charts/chart";
import Spinner from "../components/Bookings/BookingList/spinner";
import BookingList from "../components/Bookings/BookingList/bookingList";
class BookingsPage extends Component{
    state = {
        isLoading: false,
        bookings : [],
        Type : 'bookings'
    }
    static  contextType = AuthContext
    componentDidMount(){
        this.bookings()
    }

    bookings =()=>{
        this.setState({isLoading:true})
        const query = {
            query:`
            query {
                bookings{
                    _id
                    createdAt
                    event{
                        _id
                        title
                        date
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
          const bookings = resData.data.bookings
           this.setState({bookings: bookings, isLoading:false})
          
    
           })
        .catch(err=>{
            console.log(err);
            this.setState({isLoading:false})
        })
    }
    
    CancelBookHandler = bookingId =>{
        this.setState({isLoading:true})
        const query = {
            query:`
            mutation CancelBooking($Id: ID!) {
                cancelBooking(bookingId: $Id){
                        _id
                        title
                        
                    
                }
            }
                `,
            variables:{
                    Id: bookingId
                }
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
          this.setState(prevState =>{
              const newBookings = prevState.bookings.filter(booking =>{
                  return booking._id !== bookingId
              })
              return { bookings : newBookings, isLoading:false }
          })
          
           })
        .catch(err=>{
            console.log(err);
            this.setState({isLoading:false})
        })
    }

   BookingPageHundler = Type =>{
       if(Type === 'bookings'){
           this.setState({Type: 'bookings'})
       }else{
           this.setState({Type: 'chart'})
       }
   }

    render(){
       let content =  <Spinner/>
       if(!this.state.isLoading){
        content= (
            <React.Fragment>
                <div>
                    <button className="btn_Event" onClick={this.BookingPageHundler.bind(this,'bookings')}>Bookings</button>
                    <button  className="btn_Event" onClick={this.BookingPageHundler.bind(this,'chart')}>Chart</button>
                </div>
                <div>
                   {this.state.Type === 'bookings' ? (<BookingList bookings={this.state.bookings} onDelete={this.CancelBookHandler}/>): (<Chart bookings={this.state.bookings} />) }
                </div>
            </React.Fragment>
        )
       }
      
        return ( 
        <React.Fragment>
       {content}
        </React.Fragment>
        )
    }
}

export default BookingsPage