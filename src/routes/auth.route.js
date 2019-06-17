const router = require('express').Router();
const bcrypt = require('bcrypt');

const User = require('../models/users');
const { validateRegisterInput } = require('../validation/auth.validate');

// route    GET /auth/register
// desc     view to input new account
// access   public
router.get('/register',(req, res) => {
    const payload = req.cookies.payload || null;
    
    if(req.cookies.payload) {
        return res.redirect('/users');
    }
    
    res.render('auth/register', { payload, cookie: false });
})

// route    POST /auth/register
// desc     api to send new account infor
// access   public
router.post('/register', (req, res) => {
    const { accountname, password, password2 } = req.body;

    const error = validateRegisterInput(req.body);    

    // compare 2 password fields
    if(password.trim() !== password2.trim()) {
        error.passwordConfirm = 'Passwors must match';        
    }
    
    // hash password before saving it to the database
    bcrypt.hash(password, 10, (err, hash) => {
        const newUser = new User({
            accountname: accountname.trim(),
            password: hash
        })

        // find user account in the database, if exist then do not create new account
        User.findOne({ accountname: newUser.accountname})
            .then(user => {
                if(user) {
                    error.userExist = 'User already exist';
                };

                if(error) {                    
                    return res.render('auth/register.ejs', { error, cookie: false });
                }
                
                // newUser.save()
                //     .then(user => console.log('New user: ' +user +' action = redirect'))
                //     .catch(err => res.status(400).json({ error: err }));
                    
                return res.redirect('/auth/login');                                
            })
            .catch(err => console.log(err));
    });    
})

// route    GET /auth/login
// desc     view to login
// access   public
router.get('/login', (req, res) => {
    const payload = req.cookies.payload || null;
    
    if(req.cookies.payload) {
        return res.redirect('/users');
    }
    
    res.render('auth/login', { payload, cookie: false });
})

// route    POST /auth/login
// desc     api to send account infor to database / send cookie to other routes
// access   public
router.post('/login', (req, res) => {
    const { accountname, password } = req.body;

    // find account infor from the database
    User.findOne({ accountname: accountname.trim() })
        .then(user => {
            if(!user) {
                // TODO: render error label
                return res.redirect('/auth/login');
            }

            // compare the password of matched account infor in the database
            bcrypt.compare(password, user.password, (err, result) => {
                if(result === false) {
                    // TODO: render error label
                    return res.status(404).json({ msg: 'Wrong Id or password', error: err });
                }

                const payload = {
                    _id: user._id,
                    accountname: accountname
                }

                if(result === true) {
                    res.cookie('payload', payload, { expire: 360000 + Date.now() }).redirect('/users');
                }
            })

        })
})

// route    GET /auth/logout
// desc     logout the user / clear the cookies
// access   private
router.get('/logout', (req, res) => {
    res.clearCookie('payload').redirect('/auth/login');
})


module.exports = router;