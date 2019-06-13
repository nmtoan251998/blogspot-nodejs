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
    User.findOne({_id: req.body._id.toString().trim()})     
        .populate('user')        
        .then(user => {            
            const newProfile = new Profile({
                handle: req.body.accountname.toString().trim(),
                firstname: req.body.firstname.toString().trim(),
                lastname: req.body.lastname.toString().trim(),
                email: req.body.email.toString().trim(),
                age: parseInt(req.body.age.toString().trim()),
                phone: req.body.phone.toString().trim(),
                address: req.body.address.toString().trim(),
            });                                     
        
            Profile.findOneAndUpdate({ handle: newProfile.handle })            
                .then(profile => {                                        
                    if(profile) {
                        newProfile.save();                           
                        return res.redirect('/users/profile');
                    }
                })                
                
            newProfile
                .save()
                .then(newprofile => console.log(newprofile))
                .catch(err => console.log(err));

            res.redirect('/users/profile');
        })
        .catch(err => res.status(400).send('Error occured'));
})

module.exports = router;