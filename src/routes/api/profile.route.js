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
                    if(!profile) {
                        const newProfile = new Profile({
                            handle: req.body.handle.trim(),
                            firstname: req.body.firstname.trim(),
                            lastname: req.body.lastname.trim(),
                            email: req.body.email.trim(),
                            age: parseInt(req.body.age.trim()),
                            phone: req.body.phone.trim(),
                            address: req.body.address.trim(),                    
                            social: {
                                facebook: req.body.facebook.trim(),
                                github: req.body.github.trim(),
                                linkedin: req.body.linkedin.trim()
                            }
                        })

                        return newProfile
                            .save()
                            .then(newprofile => {
                                res.redirect('/users/profile');
                            })
                            .catch(err => console.log('Error creating new profile'));
                        
                    }

                    profile.firstname = req.body.firstname.trim();
                    profile.lastname = req.body.lastname.trim();
                    profile.email = req.body.email.trim();
                    profile.age = parseInt(req.body.age.trim());
                    profile.phone = req.body.phone.trim();
                    profile.address = req.body.address.trim();                    
                    profile.social = {
                        facebook: req.body.facebook.trim(),
                        github: req.body.github.trim(),
                        linkedin: req.body.linkedin.trim()
                    }
                                        
                    profile
                        .save()
                        .then(newprofile => {                            
                            res.redirect('/users/profile');
                        })
                        .catch(err => console.log('Error updating profile'));
                    
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
})

// route    GET /profile/mangement/edu
// desc     get the users education profile view
// access   private
router.get('/management/edu', (req, res) => {
    const payload = req.cookies.payload || null;
    
    res.render('pages/profile-edu', { payload, cookie: true });
})

// route    GET /profile/mangement/edu
// desc     get the users education profile view
// access   private
router.post('/management/edu', (req, res) => {
    const newEduProfile = {
        major: req.body.major.trim(),
        school: req.body.school.trim(),
        rewards: req.body.rewards.trim(),
        from: req.body.from.trim(),
        to: req.body.to.trim(),
    };        

    Profile.findOne({handle: req.cookies.payload.accountname})
        .then(profile => {
            if(!profile) {
                console.log('Profile not found');
                return res.redirect('/users/profile');
            }

            profile.edu.unshift(newEduProfile);

            profile
                .save()
                .then(updatedEdu => {
                    console.log(updatedEdu);
                    res.redirect('/users/profile');
                })
                .catch(err => console.log('Error updating education profile'));
        })
})

module.exports = router;