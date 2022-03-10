import { Component } from "react";
import { BrowserRouter, Route, Navigate, Routes } from 'react-router-dom'
import './App.css'
import AuthPage from "./pages/Auth";
import BookingsPage from "./pages/Booking";
import EventsPage from "./pages/Events";
import MainNav from "./components/NavBar/MainNav";
import AuthContext from './context/auth'
class App extends Component {
  state = {
    token : null,
    userId: null,


  }

  login =(token , userId, tokenExpiration)=>{
      this.setState({token:token, userId:userId})
  }
  logout = ()=>{
    this.setState({token:null, userId:null})
  }

  render() {
    return (

      <BrowserRouter>
      <AuthContext.Provider 
            value={{token: this.state.token , userId: this.state.userId, 
            login:this.login, logout:this.logout}}>
        <MainNav />
        <main className="main-content">
          <Routes>
          <Route path="/" element={<Navigate replace to="/events" />} /> 
           {this.state.token && <Route path="/" element={<Navigate replace to="/events" />} />} 
           {this.state.token && <Route path="/login" element={<Navigate replace to="/events" />} />} 
           {!this.state.token &&<Route path="/login" element={<AuthPage />} /> }
            <Route path="/events" element={< EventsPage />} />
          {this.state.token &&   <Route path="/bookings" element={<BookingsPage />} />}
          {!this.state.token && <Route path="/bookings" element={<Navigate replace to="/login" />} />} 
          </Routes>
        </main>
        </AuthContext.Provider>
      </BrowserRouter>
    );
  }
}

export default App;
