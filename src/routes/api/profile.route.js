const router = require('express').Router();

const User = require('../../models/users');
const Profile = require('../../models/profile');

// route    GET /users/profile
// desc     get the users profile view
// access   private
router.get('', (req, res) => {
    const payload = req.cookies.payload || null;     
    
    res.render('pages/profile.create.ejs', { payload, cookie: true });
})

// route    POST /profile
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

                        return newProfile.save()
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
                                        
                    profile.save()
                        .then(newprofile => {                            
                            res.redirect('/users/profile');
                        })
                        .catch(err => console.log('Error updating profile'));
                    
                })
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
})

// route    GET /profile/mangement/edu/all
// desc     get all users edu profile
// access   private
router.get('/management/edu/all', (req, res) => {
    const payload = req.cookies.payload || null;

    User.findOne({accountname: payload.accountname})
        .then(user => {
            Profile.findOne({ handle: payload.accountname })
                .then(profiles => {
                    res.render('pages/profile-management-edu-all.ejs', { cookie: true, payload, user, profiles });
                })
                .catch(err => console.log('No profile found'));
                                    
        })
    
    
})

// route    GET /profile/mangement/edu
// desc     get the users education profile create view
// access   private
router.get('/management/edu', (req, res) => {
    const payload = req.cookies.payload || null;

    res.render('pages/profile-management-edu.create.ejs', { payload, cookie: true });
})

// route    POST /profile/mangement/edu
// desc     save new edu profile
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

            profile.edu.sort((a, b) => parseInt(b.to.slice(0, 4)) - parseInt(a.to.slice(0, 4)));                                                
            
            profile.save()
                .then(updatedEdu => {
                    res.redirect('/users/profile');
                })
                .catch(err => console.log('Error updating education profile'));
        })
})

// route    GET /profile/mangement/:userid/edu/:id
// desc     get the users education profile view to modify
// access   private
router.get('/management/:userid/edu/:id', (req, res) => {
    const payload = req.cookies.payload || null;    

    const { userid, id } = req.params;
        
    User.findById(userid)
        .then(user => {
            Profile.findOne({handle: user.accountname})    
                .then(profile => {
                    const matchedEdu = Array.from(profile.edu.filter(edu => {                        
                        return edu._id.toString() === id;                        
                    })).shift()

                    res.render('pages/profile-management-edu.modify.ejs', { payload, cookie: true, edu: matchedEdu, userid });
                })
        })            
})

// route    PUT /profile/mangement/:userid/edu/:id
// desc     modify education profile
// access   private
router.post('/management/:userid/edu/:id', (req, res) => {
    const { userid, id } = req.params;      
        
    User.findById(userid)
        .then(user => {
            Profile.findOne({handle: user.accountname})    
                .then(profile => {                                        
                    profile.edu.forEach((edu, index) => {                
                        if(id === edu._id.toString()) {
                            if(req.query['req-method'] === 'delete') {
                                profile.edu.splice(index, 1);
                            } else if(req.query['req-method'] === 'modify') {                                                                
                                profile.edu[index].major = req.body.major.toString().trim();
                                profile.edu[index].school = req.body.school.toString().trim();
                                profile.edu[index].from = req.body.from.toString().trim();
                                profile.edu[index].to = req.body.to.toString().trim();
                                profile.edu[index].rewards = req.body.rewards.toString().trim();                                
                            }
                        }                                                    
                    })
                    // save modified or deleted profile
                    profile.save()                    
                        .then(newprofile => {
                            res.redirect('/users/profile');
                        })
                        .catch(err => console.log('Error action data profile'));
                    
                })
        })            
})

module.exports = router;