const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    try 
    {
        const token = req.header("authorization").split(" ")[1];
        const decryptedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.body.userId = decryptedToken.userId;
        next();  
    } 
    catch (error) 
    {
        res.send({
            success: false,
            message: error.message
        });    
    }
}