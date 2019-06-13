const router = require('express').Router();

const User = require('../../models/users');
const Profile = require('../../models/profile');

// route    GET /users/profile
// desc     get the users profile view
// access   private
router.get('', (req, res) => {
    const payload = req.cookies.payload || null;     
    
    res.render('pages/profile', { payload, cookie: true });
})

// route    POST /users/profile
// desc     create user profile
// access   private
router.post('', (req, res) => {
    User.findOne({_id: req.body._id.trim()})     
        .populate('user')        
        .then(user => {
            Profile.findOne({handle: req.body.handle.trim()})
                .then(profile => {
                    profile.firstname = req.body.firstname.trim();
                    profile.lastname = req.body.lastname.trim();
                    profile.email = req.body.email.trim();
                    profile.age = parseInt(req.body.age.trim());
                    profile.phone = req.body.phone.trim();
                    profile.address = req.body.address.trim();
    
                    profile
                        .save()
                        .then(newprofile => {                            
                            res.redirect('/users/profile');
                        })
                        .catch(err => console.log('Error updating data'));
                    
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
})

module.exports = router;