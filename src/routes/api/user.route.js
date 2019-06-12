const router = require('express').Router();

const User = require('../../models/users');

// route    GET /users
// desc     get the users index view
// access   private
router.get('', (req, res) => {    
    const payload = req.cookies.payload || null;
    
    if(!req.cookies.payload) {
        return res.render('pages/user', { cookie: false })
    }
    
    res.render('pages/user', { cookie: true, payload });
})

// route    GET /users
// desc     get the users index view
// access   private
router.get('/profile', (req, res) => {    
    const payload = req.cookies.payload || null;
    
    if(!req.cookies.payload) {
        return res.render('pages/user', { cookie: false })
    }

    User.findOne({accountname: payload.accountname})
        .then(user => {
            console.log(user);
            res.render('pages/user-profile', { cookie: true, payload, user });
        })        
})

module.exports = router;