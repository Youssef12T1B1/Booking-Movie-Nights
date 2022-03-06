const jwt = require('jsonwebtoken')
const jwtKey = require('../../config/.env').JwtSec

module.exports = (req,res,next)=>{
    const authHeader = req.get('Authorization')
    if(!authHeader){
        res.isAuth = false
        return next()
    }
    const token = authHeader.split(' ')[1]
    if(!token || token === ' '){
        res.isAuth = false
        return next()
    }
    let decodedToken
    try{
        decodedToken =  jwt.verify(token,jwtKey)
    }catch(err){
        res.isAuth = false
        return next()
    }

    if(!decodedToken){
        res.isAuth = false
        return next()
    }

    req.isAuth = true
    req.userId = decodedToken.userId
    
    next()




}