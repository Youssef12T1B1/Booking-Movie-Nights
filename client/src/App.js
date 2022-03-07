import { Component } from "react";
import {BrowserRouter, Route, Navigate, Routes} from 'react-router-dom'

import AuthPage  from "./components/Auth";
import BookingsPage from "./components/Booking";
import EventsPage from "./components/Events";

class App extends Component {
  render(){
  return (
 
    <BrowserRouter>
    <Routes>
        <Route path="/"  element={<Navigate replace to="/login"/>}/>
        <Route path="/login" element={<AuthPage/>}/>
        <Route path="/events" element={< EventsPage/>}/>
        <Route path="/booking" element={<BookingsPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}
}

export default App;
