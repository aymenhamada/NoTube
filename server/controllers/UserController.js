const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {validateLoginInput, validateRegisterInput } = require("../errorHandlers");


exports.login = async(req, res) => {
    const {errors, isValid} = validateLoginInput(req.body);

    if (!isValid){
        return res.status(400).json(errors);
    }

    let {email, password} = req.body;

    email = email.toLowerCase();
    const user = await User.findOne({email});

    if (!user){
        return res.status(400).json({
            err: "Username or password is incorect"
        })
    }

    bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch){
            const payload = {
                email: user.email
            }
            let token = jwt.sign(payload, "secret", {expiresIn: 129600});
            return res.status(200).json({
                token
            })
        }
        return res.status(401).json({
            err: "Username or password is incorrect"
        })
    })
}



exports.register = async (req, res) => {
    console.log(req.body);
    const {errors, isValid} = validateRegisterInput(req.body);

    if (!isValid){
        return res.status(400).json(errors);
    }

    const user = await User.findOne({email: req.body.email});

    if (user){
        return res.status(400).json({email: "L'adresse email existe déjà !"})
    }
    const newUser = new User({
        email: req.body.email,
        password: req.body.password
    });
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
            .then(user => res.status(200).json(user))
            .catch(err => console.log(err));
        })
    })
}