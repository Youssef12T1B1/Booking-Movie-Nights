import React from "react";
import { NavLink } from "react-router-dom"
import "./mainNav.css"
import AuthContext from '../../context/auth'

const MainNav = props => (
    <AuthContext.Consumer >
        {(context)=>{
            return (
                <header className="main_nav"> 
                <div className="main-nav_logo">
                    <h1>BookEvents</h1>
                </div>
                <nav className="main-nav_items">
                    <ul>
                        {!context.token &&
                        <li><NavLink to="/login">Log In</NavLink></li> }
                        {context.token && <li><NavLink to="/bookings">Bookings</NavLink></li>}
                        <li><NavLink to="/events">Events</NavLink></li>
                        {context.token && <li><button onClick={context.logout}>log Out</button></li>}
                    </ul>
                </nav>
            </header>
            )
        }}

    </AuthContext.Consumer>
)

export default MainNav