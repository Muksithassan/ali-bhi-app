const express = require('express');
const router = express.Router();
const { signup, login, googleLogin, me, updateMe, changePassword, registerPushToken } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.post('/google', googleLogin);

router.use(protect); // require login for below routes
router.get('/me', me);
router.put('/me', updateMe);
router.put('/password', changePassword);
router.post('/push-token', registerPushToken);

module.exports = router;
