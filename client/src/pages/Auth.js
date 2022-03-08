import React, {Component} from "react";
import './pages.css'
import AuthContext from '../context/auth'

class AuthPage extends Component{
      state = {
          isLoggedIn : true
      }
    static contextType = AuthContext

    constructor(props){
        super(props)
        this.usernameV = React.createRef()
        this.emailV = React.createRef()
        this.passwordV = React.createRef()
    }

    LogInHandler = ()=>{
        this.setState(prevState =>{
            return {isLoggedIn : !prevState.isLoggedIn }
        })
    }

      fromHandler = (event)=>{
          event.preventDefault()
          const username = this.usernameV.current.value
          const email = this.emailV.current.value
          const password = this.passwordV.current.value
          if(username.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0 ){
              return
          }
          let query = {
              query:`
                  query{
                     login(username:"${username}", password:"${password}") {
                         userId
                         token
                         tokenExpiration
                     }
                  }
              
              `
          }
          if(!this.state.isLoggedIn){
                 query = {
                    query:`
                    mutation {
                    createUser(UserInput:{username:"${username}" , email:"${email}",password:"${password}" }){
                        _id
                        username
                    }
                    }
                    
                    `
                }
          }


          
            fetch('http://localhost:5000/graphql',{
                method: 'POST',
                body: JSON.stringify(query),
                headers : {
                    'Content-Type': 'application/json'
                }
            })
            .then(res =>{
                if(res.status !==200 && res.status !== 201){
                    throw new Error('Failed!!!')
                }
                 return res.json()
            })
            .then(resData =>{
               if(resData.data.login.token){
                   this.context.login(
                    resData.data.login.token,
                    resData.data.login.userId,
                    resData.data.login.tokenExpiration
                    )

               }
            })
            .catch(err=>{
                console.log(err);
            })
      }

    render(){
        return <form className="Auth_form" onSubmit={this.fromHandler}>
            <div className="form-control">
                <label htmlFor="username">Username</label>
                <input type='text' id="username" ref={this.usernameV}></input>
            </div>

            <div className="form-control">
                <label htmlFor="email">E-mail</label>
                <input type='email' id="email" ref={this.emailV} ></input>
            </div>

            <div className="form-control">
              <label htmlFor="password">Password</label>
              <input type='password' id="password" ref={this.passwordV}></input>
          </div>
          <div className="from-buttons">
                 <button type="submit">Submit</button>
                <button type="button" onClick={this.LogInHandler} >Switch To {this.state.isLoggedIn ? 'Sign Up': 'Log In'}</button>
             
              
              </div>
        </form>
    }
}

export default AuthPage