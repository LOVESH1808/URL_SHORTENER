const express = require('express');
const {protect} = require('../middlewares/authMiddleware');
const {generateShortURL, getAllLinks, deleteShortURL, getAnalytics, getShortURL} = require('../controller/linkController');

const router = express.Router();

router.route('/shortURL').post(protect, generateShortURL);
router.route('/allLinks').get(protect, getAllLinks);
router.route('/:shortUrl').get(getShortURL);
router.route('/:shortUrl').delete(protect, deleteShortURL);
router.route('/analytics/:shortUrl').get(protect, getAnalytics);

module.exports = router;