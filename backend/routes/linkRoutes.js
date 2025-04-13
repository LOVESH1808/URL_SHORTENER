const express = require('express');
const {protect} = require('../middlewares/authMiddleware');
const {generateShortURL, getAllLinks, deleteShortURL, getAnalytics, getShortURL} = require('../controller/linkController');

const router = express.Router();

router.route('/analytics/:shortUrl').get(protect, getAnalytics);
router.route('/shortURL').post(protect, generateShortURL);
router.route('/allLinks').get(protect, getAllLinks);
router.route('/short/:shortUrl').get(getShortURL);
router.route('/short/:shortUrl').delete(protect, deleteShortURL);

module.exports = router;