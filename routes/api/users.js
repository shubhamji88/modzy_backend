const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const auth = require("../../middleware/auth");
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");
const getSummart = require('../../funtions/getSummarizedText')
// Load User model
const User = require("../../models/UserSchema");
const UserData = require("../../models/UserDataSchema");
const getSummarizedText = require("../../funtions/getSummarizedText");
const UserSchema = require("../../models/UserSchema");
const { promisify } = require('util');
const exec = promisify(require('child_process').exec)

// @route POST api/users/register
// @desc Register user
// @access Public

router.post("/register", (req, res) => {
    
    //Form validation
    const {errors, isValid} = validateRegisterInput(req.body);
    
    if(!isValid){
        return res.status(400).json(errors);
    }

    User.findOne({email:req.body.email}).then(user=>{

        if(user){
            return res.status(400).json({email:"Email already exists"});
        } else{
            const newUser = new User({
                name:req.body.name,
                password:req.body.password,
                email:req.body.email
            });

            // Hash password before storing in database
            const rounds  = 10;
            bcrypt.genSalt(rounds, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser
                    .save()
                    .then(user => res.json(user))
                    .catch(err => console.log(err));
                });
            });
        }

    });

});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/login",(req,res) => {

    //Form Valdiation
    const {errors, isValid} = validateLoginInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;
   
    //Find user by Email
    User.findOne({email}).then(user=>{
        if(!user){
            return res.status(404).json({ emailnotfound: "Email not found" });
        }

    // Check password
    bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {
            // Create JWT Payload
            const payload = {
                id: user.id
            };

            // Sign token
            jwt.sign(
                payload,
                keys.secretOrKey,
                {
                 expiresIn: 31556926 
                },
                (err, token) => {
                res.json({
                    success: true,
                    token: "Bearer " + token,
                    name: user.name
                });
                }
            );
        } else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
        }
      });
    });
});
router.post("/add", auth, async (req, res) => {
    try {
        let userData = new UserData({
            useid: req.userId,
            date : req.date,
            meetlink: req.meetlink,
            status: 0
        })
        userData.save()
                    .then(user => res.json({status :200,message:'saved'}))
                    .catch(err => {console.log(err)
                        res.json({status :400,message:'error'})
                    });
        // let result = await getSummarizedText('Modzy is good');
    //   const user = await User.findById(req.userId);
    //   res.json(result);
    } catch (e) {
      res.send({ message: "Error" });
    }
});
router.get("/getDetails", auth, async (req, res) => {
    try {
        UserSchema.findOne({id: req.id}).then(userData=>{
            if(userData.status ==0){
                return res.status(404).json({ message: "Data Still processing" });
            }
        })
    } catch (e) {
      res.send({ message: "Error" });
    }
});
router.post('/addMeetingData',async (req, res) => {
    console.log(req.body.id+req.body.mom+req.body.fUser)
    res.send({ message: "ok" })
})
const markle = async function makeTree () {
    // Exec output contains both stderr and stdout outputs
    await exec('python .\\gbot\\main.py')
  
    return { 
      completed: true 
    }
  };
async function start(){
    return new Promise(resolve => {
        markle()
        resolve('ok')
    })
    console.log('ok');
}
start();
// router.get('/startBot',async (req, res) => {
    
// })
module.exports = router;