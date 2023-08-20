const router = require("express").Router();
const User = require("../models/userModel.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware.js");
// const cors = require("cors");

// router.use(cors);

router.post("/register", async function(req, res) {
    try 
    {
        const user = await User.findOne({email: req.body.email});
        if(user)
        {
            throw new Error("User already exists!");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        req.body.password = hashedPassword;

        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            success: true,
            message: "Registration successful!"
        });
    } 
    catch (error) 
    {
        res.send({
            success: false,
            message: error.message
        });
    }
});

router.post("/login", async function(req, res) {
    try 
    {
        const user = await User.findOne({email: req.body.email});
        if(!user)
        {
            throw new Error("User does not exist!");
        }

        if(user.status !== "active")
        {
            throw new Error("Account blocked! Please contact admin.")
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if(!validPassword)
        {
            throw new Error("Invalid Password!");
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});

        res.send({
            success: true,
            message: "Login successful!",
            data: token
        });
    } 
    catch (error) 
    {
        res.send({
            success: false,
            message: error.message
        });
    }
});

router.get("/get-current-user", authMiddleware, async function(req, res) {
    try 
    {
        const user = await User.findById(req.body.userId);
        res.send({
            success: true,
            message: "User fetched successfully!",
            data: user
        });
    } 
    catch (error) 
    {
        res.send({
            success: false,
            message: error.message
        }); 
    }
});

router.get("/get-all-users", authMiddleware, async function(req, res) {
    try 
    {
        const users = await User.find();
        res.send({
            success: true,
            message: "Users fetched successfully!",
            data: users
        });
    } 
    catch (error) 
    {
        res.send({
            success: false,
            message: error.message
        }); 
    }
});

router.put("/update-user-status/:id", authMiddleware, async function(req, res) {
    try 
    {
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.send({
            success: true,
            message: "Users status updated successfully!"
        });
    } 
    catch (error) 
    {
        res.send({
            success: false,
            message: error.message
        }); 
    }
});

module.exports = router;