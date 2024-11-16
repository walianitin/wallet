// backend/index.js
const express = require("express");
const zod = require("zod")
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("./config");
const userRouter = express();
const {User,Account}=require('../db');

const  { authMiddleware } = require("../middleware");

const updateBody = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
})
const signinBody=zod.object({
    username:zod.string().email(),
    password:zod.string()
})

const signupBody= zod.object(
    {

        firstname: zod.string().min(1),
        lastname: zod.string().min(1),
        username: zod.string().email(),
        password: zod.string().min(1)
    }
)
userRouter.post("/signup", async (req, res) => {
    try {
        const result = await signupBody.safeParse(req.body);


        if (!result.success) {
            console.log("Zod validation error:", result.error.issues);
            return res.status(400).json({
                message: "Incorrect inputs",
                details: result.error.issues
            });
        }

        const { username, password, firstname, lastname } = result.data;


        if (!username) {
            return res.status(400).json({
                message: "Email is required"
            });
        }


        const existingUser = await User.findOne({ username: username });
        if (existingUser) {
            return res.status(409).json({
                message: "Username is already taken"
            });
        }


        const user = await User.create({
            username: username,
            password: password,
            firstname: firstname,
            lastname: lastname,
        });

        const userId = user._id;


        await Account.create({
            userId,
            balance: 1 + Math.random() * 10000
        });


        const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });


        res.status(201).json({
            message: "User created successfully",
            token: token,
        });
    } catch (err) {
        console.error("Error in signup route:", err.message, err.stack); // Detailed error logging
        res.status(500).json({
            message: "Internal server error"
        });
    }
});

userRouter.post('/signin', async (req, res) => {
    try{
        const { success, data } = await signinBody.safeParseAsync(req.body);
        if (!success) {
            return res.status(400).json({
                message: 'Incorrect inputs',
                details: data.issues,
            });
        }

        const user = await User.findOne({
            username: data.username,
            password: data.password,
        });

        if (user) {
            const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
                expiresIn: '1h',
            });
            res.json({ token });
        } else {
            res.status(401).json({
                message: 'Invalid username or password',
            });
        }
    } catch (err){
        console.error("Error in siginin route:", err.message, err.stack);
        res.status(500).json({
            message: "Internal server error"
        });
    }

});
userRouter.put('/',authMiddleware,async (req,res)=>{

    const {success}=updateBody.safeParse(req.body);   

    if(!success)
    {
        res.status(411).json({
            message: "Error while updating information"
        })
    }
    await User.updateOne({ _id: req.userId }, req.body);
    res.json({
        message: "Updated successfully"
    })
})

userRouter.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstname: {
                "$regex": filter
            }
        }, {
            lastname: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    })
})

module.exports=userRouter