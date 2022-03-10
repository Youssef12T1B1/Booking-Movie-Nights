import React, {Component} from "react";
import './pages.css'
import AuthContext from '../context/auth'

class AuthPage extends Component{
      state = {
          isLoggedIn : true,
          isError: null,
          IsSignedUp: null,
      }
    static contextType = AuthContext

    constructor(props){
        super(props)
        this.usernameRef = React.createRef()
        this.emailRef = React.createRef()
        this.passwordRef = React.createRef()
    }

    LogInHandler = ()=>{
        this.setState(prevState =>{
            return {isLoggedIn : !prevState.isLoggedIn }
        })
    }
    ErrorHandler = ()=>{
        this.setState({
            isError: null
        })
    }

      fromHandler = (event)=>{
          event.preventDefault()
          const username = this.usernameRef.current.value
          const email = this.emailRef.current.value
          const password = this.passwordRef.current.value
          if(username.trim().length === 0 || email.trim().length === 0 || password.trim().length === 0 ){
              this.setState({
                  isError: "Please Entre Valid Data"
              })
              return
          }
          let query = {
              query:`
                  query Login($username: String!, $password:String!){
                     login(username:$username, password:$password) {
                         userId
                         token
                         tokenExpiration
                     }
                  }
              
              `,
              variables:{
                username: username,
                password: password
             
             }

          }
          if(!this.state.isLoggedIn){
                 query = {
                    query:`
                    mutation CreateUser($username:String!, $email:String!, $password:String!){
                    createUser(UserInput:{username:$username , email:$email,password:$password }){
                        _id
                        username
                    }
                    }
                    
                    `,
                    variables:{
                       username: username,
                       email: email,
                       password: password
                    
                    }
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
                if(res.status !==200 && res.status !== 201 ){
                   
                    throw new Error('Authentication Failed !!')
                    
                }
                 return res.json()
            })
            .then(resData =>{
                if(resData){
                    if(resData.errors){
                        this.setState({
                            isError: resData.errors[0].message
                           })
                    }
             if(resData.data){

                if(resData.data.createUser){
                    this.setState({
                     IsSignedUp: 'Hi: '+resData.data.createUser.username+ ' Switch To logged In'
                    })
                    
    
                }
                if(resData.data.login){
                    this.context.login(
                     resData.data.login.token,
                     resData.data.login.userId,
                     resData.data.login.tokenExpiration
                     )
                         return
                }
             
            
             }}
             
       
             

            })
            .catch(err=>{
                this.setState({isError: err.message})
            })
      }

    render(){
      
        return (
            <React.Fragment>
       
        <form className="Auth_form" onSubmit={this.fromHandler}> 
        {this.state.isError && <center><div className="errorHandler"> <h2>{this.state.isError}</h2> <button onClick={this.ErrorHandler}>x</button></div></center>}
        {this.state.IsSignedUp && <center><div className="msgHandler"> <h2>{this.state.IsSignedUp}</h2> <button onClick={this.ErrorHandler}>x</button></div></center>}
            <div className="form-control">
                <label htmlFor="username">Username</label>
                <input type='text' id="username" ref={this.usernameRef}></input>
            </div>

            <div className="form-control">
                <label htmlFor="email">E-mail</label>
                <input type='email' id="email" ref={this.emailRef} ></input>
            </div>

            <div className="form-control">
              <label htmlFor="password">Password</label>
              <input type='password' id="password" ref={this.passwordRef}></input>
          </div>
          <div className="from-buttons">
                 <button type="submit">Submit</button>
                <button type="button" onClick={this.LogInHandler} >Switch To {this.state.isLoggedIn ? 'Sign Up': 'Log In'}</button>
             
              
              </div>
        </form>
        </React.Fragment>
        )
    }
}

export default AuthPage