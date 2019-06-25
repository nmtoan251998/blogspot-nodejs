const router = require('express').Router();

const User = require('../../models/users');
const Profile = require('../../models/profile');
const { 
    validateBasicProfileInput,
    validateEduProfileInput,
    validateExpProfileInput } = require('../../validation/profile.validate');

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
    const error = validateBasicProfileInput(req.body);
    const payload = req.cookies.payload;    

    User.findOne({_id: req.body._id.trim()})     
        .populate('user')        
        .then(user => {
            if(Object.keys(error).length > 0) {
                return res.render('pages/profile.create.ejs', { error, payload, cookie: true });
            }

            Profile.findOne({handle: req.body.handle.trim()})
                .then(profile => {
                    if(profile) {
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
                                            
                        return profile.save()
                            .then(newprofile => {                            
                                res.redirect('/users/profile');
                            })
                            .catch(err => console.log('Error updating profile'));   
                    }                                        
                })
                .catch(err => console.log(err));

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

            newProfile.save()
                .then(newprofile => {
                    res.redirect('/users/profile');
                })
                .catch(err => console.log('Error creating new profile'));            
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
    const error = validateEduProfileInput(req.body);
    const payload = req.cookies.payload;

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
                error.profileNotFound = 'Profile not found';                
            }

            if(Object.keys(error).length > 0) {
                return res.render('pages/profile-management-edu.create.ejs', { error, payload, cookie: true });
            }

            profile.edu.unshift(newEduProfile);
            profile.edu.sort((a, b) => parseInt(b.to.slice(0, 4)) - parseInt(a.to.slice(0, 4)));                                                
            
            profile.save()
                .then(updatedEdu => {
                    res.redirect('/profile/management/edu/all');
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

// route    POST /profile/mangement/:userid/edu/:id
// desc     modify education profile
// access   private
router.post('/management/:userid/edu/:id', (req, res) => {
    const { userid, id } = req.params;     
    const payload = req.cookies.payload;
    const error = validateEduProfileInput(req.body);    
            
    User.findById(userid)
        .then(user => {            
            Profile.findOne({handle: user.accountname})    
                .then(profile => {                                                                
                    if(Object.keys(error).length > 0) {
                        const matchedEdu = Array.from(profile.edu.filter(edu => {                        
                            return edu._id.toString() === id;                        
                        })).shift()
                        return res.render('pages/profile-management-edu.modify.ejs', { error, payload, cookie: true, userid, edu: matchedEdu });
                    }
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
                            res.redirect('/profile/management/edu/all');
                        })
                        .catch(err => console.log('Error action data profile'));
                    
                })
        })            
})

// route    GET /profile/mangement/exp
// desc     get the users experience profile create view
// access   private
router.get('/management/exp', (req, res) => {
    const payload = req.cookies.payload || null;

    res.render('pages/profile-management-exp.create.ejs', { payload, cookie: true });
})

// route    POST /profile/mangement/exp
// desc     save new exp profile
// access   private
router.post('/management/exp', (req, res) => {
    const error = validateExpProfileInput(req.body);
    const payload = req.cookies.payload;

    const newExpProfile = {
        title: req.body.title.trim(),
        company: req.body.company.trim(),
        location: req.body.location.trim(),
        from: req.body.from.trim(),
        to: req.body.to.trim(),
    };        

    Profile.findOne({handle: req.cookies.payload.accountname})
        .then(profile => {
            if(!profile) {
                error.profileNotFound = 'Profile not found';                
            }

            if(Object.keys(error).length > 0) {
                return res.render('pages/profile-management-edu.create.ejs', { error, payload, cookie: true });
            }

            profile.exp.unshift(newExpProfile);
            profile.exp.sort((a, b) => parseInt(b.to.slice(0, 4)) - parseInt(a.to.slice(0, 4)));                                                
            
            profile.save()
                .then(updatedExp => {
                    res.redirect('/profile/management/exp/all');
                })
                .catch(err => console.log('Error updating experience profile'));
        })
})

// route    GET /profile/mangement/:userid/exp/:id
// desc     get the users experience profile view to modify
// access   private
router.get('/management/:userid/exp/:id', (req, res) => {
    const payload = req.cookies.payload || null;    

    const { userid, id } = req.params;
        
    User.findById(userid)
        .then(user => {
            Profile.findOne({handle: user.accountname})    
                .then(profile => {
                    const matchedExp = Array.from(profile.exp.filter(exp => {                        
                        return exp._id.toString() === id;                        
                    })).shift()

                    res.render('pages/profile-management-exp.modify.ejs', { payload, cookie: true, exp: matchedExp, userid });
                })
        })            
})

// route    POST /profile/mangement/:userid/exp/:id
// desc     modify experience profile
// access   private
router.post('/management/:userid/exp/:id', (req, res) => {    
    const { userid, id } = req.params;         
        
    User.findById(userid)
        .then(user => {
            Profile.findOne({handle: user.accountname})    
                .then(profile => {                                          
                    profile.exp.forEach((exp, index) => {                
                        if(id === exp._id.toString()) {                            
                            if(req.query['req-method'] === 'delete') {
                                profile.exp.splice(index, 1);
                            } else if(req.query['req-method'] === 'modify') { 
                                const payload = req.cookies.payload;
                                const error = validateExpProfileInput(req.body);

                                if(Object.keys(error).length > 0) {
                                    const matchedExp = Array.from(profile.exp.filter(exp => {                        
                                        return exp._id.toString() === id;                        
                                    })).shift()
                                    return res.render('pages/profile-management-exp.modify.ejs', { error, payload, cookie: true, userid, edu: matchedExp });
                                }

                                profile.exp[index].title = req.body.title.toString().trim();
                                profile.exp[index].company = req.body.company.toString().trim();
                                profile.exp[index].location = req.body.location.toString().trim();                                
                                profile.exp[index].from = req.body.from.toString().trim();
                                profile.exp[index].to = req.body.to.toString().trim();
                            }
                        }                                                    
                    })
                    // save modified or deleted profile
                    profile.save()                    
                        .then(newprofile => {
                            res.redirect('/profile/management/exp/all');
                        })
                        .catch(err => console.log('Error action data profile'));
                    
                })
        })            
})

// route    GET /profile/mangement/exp/all
// desc     get all users exp profile
// access   private
router.get('/management/exp/all', (req, res) => {
    const payload = req.cookies.payload || null;

    User.findOne({accountname: payload.accountname})
        .then(user => {
            Profile.findOne({ handle: payload.accountname })
                .then(profiles => {
                    res.render('pages/profile-management-exp-all.ejs', { cookie: true, payload, user, profiles });
                })
                .catch(err => console.log('No profile found'));
                                    
        })
    
    
})

// route    GET /profile/mangement/skill
// desc     get the users skill profile create view
// access   private
router.get('/management/skill', (req, res) => {
    const payload = req.cookies.payload || null;

    res.render('pages/profile-management-skill.create.ejs', { payload, cookie: true });
})

module.exports = router;