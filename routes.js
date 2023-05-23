const express = require('express');
const router = express.Router();
const controller = require('./controller.js');

router.get('/', controller.getBasic);
router.get('/Signup', controller.getSignup);
router.get('/Login', controller.getLogin);
router.get('/dashboard', controller.getDashboard);
router.get('/Profile', controller.getProfile);
router.post('/Userinfo', controller.postUserinfo);
router.post('/signup', controller.postsignup);
router.post('/login', controller.postlogin)

module.exports = router;
