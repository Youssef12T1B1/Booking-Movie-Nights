
const User = require('../../models/user')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const jwtKey = require('../../config/.env').Jwt_Sec

module.exports={
    
        createUser : args =>{
            return User.findOne({username: args.UserInput.username })
            .then(user=>{
                if(user){
                    throw new Error('User Exists')
                }
                return bcrypt.hash(args.UserInput.password,12)
            })
            .then(hashPass=>{
                const user = new User({
                    username : args.UserInput.username,
                    email : args.UserInput.email,
                    password : hashPass
    
                })
                return user.save()
            })
            .then(result=>{
                return { ...result._doc, password:null}
            })
            .catch(err=>{
                throw err
            })
            
        },

        login : async ({username,password})=>{
            const user =  await User.findOne({username:username})
            if(!user){
               throw new Error('No User Found!')
            }
           const pass = await bcrypt.compare(password, user.password)
           if(!pass){
            throw new Error('No User Found!')
           }
           const token = jwt.sign({
               userId: user.id,
               username: user.username
           },jwtKey, {expiresIn: '1h'})

           return{
               userId: user.id,
               token: token,
               tokenExpiration: 1
           }
        }

    }
