const router = require('express').Router();

const authRoute = require('./auth.route');
const userRoute = require('./api/user.route');
const profileRoute = require('./api/profile.route');

const accessStuffs = require('../middlewares/access-log');

router.use(accessStuffs.url);
router.use(accessStuffs.method);
router.use(accessStuffs.time);

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/profile', profileRoute);

module.exports = router;