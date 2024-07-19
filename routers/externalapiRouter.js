const express = require('express')
const rateLimiter = require('express-rate-limit')
const {
getJobs
} = require('../controllers/jsearchjobController')
const {
generateResume
} = require('../controllers/geminiAIController')

const router = express.Router()

const tenMinutesLimiter = rateLimiter({
    windowMs: 10 * 60 * 1000, // 10 minutes window
    max: 7, // limit each IP to 7 requests per windowMs
    message: 'Too many requests from this IP for Job Search , please try again after 10 minutes',
  });
  
router.get('/search/getjobs',tenMinutesLimiter, getJobs)
router.post('/ai/generateresume', generateResume)

module.exports = router
