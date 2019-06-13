const router = require('express').Router();

const User = require('../../models/users');
const Profile = require('../../models/profile');

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
            Profile.findOne({ handle: payload.accountname })
                .then(profile => {
                    console.log(profile)
                    console.log(payload.accountname)
                    res.render('pages/user-profile', { cookie: true, payload, user, profile });
                })
                .catch(err => console.log(err));
        })        
})

module.exports = router;