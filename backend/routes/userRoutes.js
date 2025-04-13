const express = require('express');
const {registerUser, loginUser, getAllUser, deleteUser} = require('../controller/userController');
const {protect} = require('../middlewares/authMiddleware');
const router = express.Router();

router.route('/').post(registerUser);
router.route('/login').post(loginUser);
// router.route('/getAllUser').get(protect, getAllUser);
// router.route('/deleteUser/:userId').delete(protect, deleteUser);

module.exports = router;

