import React, {Component} from "react";
import './pages.css'
import AuthContext from '../context/auth'
class BookingsPage extends Component{
    state = {
        isLoading: false,
        bookings : []
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
    render(){
        return ( 
        <React.Fragment>
        {this.state.isLoading  ? <div className="lds-grid"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div> :(
                <ul>
                {this.state.bookings.map(booking =>
                            <li key={booking._id}>{booking.createdAt} - {booking.event.title} </li>
                            
                )}
                </ul>
        )}
     
        </React.Fragment>
        )
    }
}

export default BookingsPage