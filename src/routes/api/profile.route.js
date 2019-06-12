const router = require('express').Router();

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
    const newProfile = {
        firstname: req.body.firstname.toString().trim(),
        lastname: req.body.lastname.toString().trim(),
        email: req.body.email.toString().trim(),
        age: parseInt(req.body.age.toString().trim()),
        phone: req.body.phone.toString().trim(),
        address: req.body.address.toString().trim(),
    };
    
    User.findOneAndUpdate(
        {_id: req.body._id.toString().trim()}, 
        newProfile)
        .then(user => {
            res.redirect('/users');
        })
        .catch(err => res.status(400).send('Error occured'));
})

module.exports = router;