const router = require('express').Router();

const User = require('../model/User'); // User Schema
const {registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs'); // Hashar vårt lösenord, krypterar lösenordet.
const jwt = require('jsonwebtoken'); // Importerar jsonwebtoken.

router.post('/register', async (req, res) => { // /api/user/register

    // Validate user
    const { error } = registerValidation(req.body);

    if(error){
        return res.status(400).json({error: error.details[0].message})
    }

    // if existing user
    const emailExists = await User.findOne({email: req.body.email});

    if(emailExists){
        return res.status(400).json({error: 'Email exists'});
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10); // Här skapar vi en algorithym för hur säker vårt lösen ska vara.
    const hashPassword = await bcrypt.hash(req.body.password, salt); // Skapar ett super hemligt lösenord!

    // Create user!
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });

    try {
        const savedUser = await user.save(); // Här sparar vi user i databasen.
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET); // Här skapar vi en token.
        res.json({user: user._id, redirect: 'batcave', token}); // Skickar informationen till frontend.
    } catch (error) {
        res.status(400).json(error);
        
    }
});

router.post('/login', async (req, res) => {

    // Validate user
    const { error } = loginValidation(req.body);

    if(error) {
        return res.status(400).json({error: error.details[0].message});
    }

    // If existing email
    const user = await User.findOne({email: req.body.email});

    if(!user) { // Visar om emailet som angets inte finns.
        return res.status(400).json({error: 'Email is not found'});
    }

    // If password correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if(!validPassword) {
        return res.status(400).json({error: 'Invalid password'});
    }

    // Create and assign a token.
    const token = jwt.sign({_id:user._id}, process.env.TOKEN_SECRET); // Skapar en token som sedan skickas til frontend.
    res.header('auth-token', token).json({token, redirect: 'batcave'}); // Här sätter vi den skapda token i vår header i vår /login POST

});

module.exports = router;