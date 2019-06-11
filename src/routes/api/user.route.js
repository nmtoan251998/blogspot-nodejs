const router = require('express').Router();

// route    GET /users
// desc     get the users index view
// access   public
router.get('', (req, res) => {
    const title = 'Welcome to user page';
    const payload = req.cookies.payload || null;
    
    if(req.cookies.payload) {
        return res.render('pages/user', { title, cookie: true, payload })
    }
    
    res.render('pages/user', { title, cookie: false });
})

module.exports = router;