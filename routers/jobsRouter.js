const express = require('express')
const {
	getFeaturedJobs,
	getCreatedJobs,
	getImportantJobs,
	getSavedJobs,
	createJob,
	getJob,
	deleteJob,
	newJob,
} = require('../controllers/jobsController')

const router = express.Router()

router.get('/important', getImportantJobs) 
router.get('/featured', getFeaturedJobs) 
router.get('/created', getCreatedJobs) 
router.get('/saved', getSavedJobs) 
router.post('/', createJob)  // /jobs/      //saving and marking job as important
router.post('/newjob/', newJob)  // /jobs/  //newjob created
router.get('/:id', getJob)
router.delete('/:id', deleteJob) // /jobs/job_id?q=

module.exports = router
