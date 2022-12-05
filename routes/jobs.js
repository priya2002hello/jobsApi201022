const express=require('express');
const router=express.Router();

const {getAllJobs,
    getSingleJob,
    createJob,
    updateJob,
    deleteJob}=require('../controllers/jobs');

router.route('/').post(createJob).get(getAllJobs);
router.route('/:id').get(getSingleJob).delete(deleteJob).patch(updateJob);

module.exports=router;
