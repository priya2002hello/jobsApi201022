const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors/index");

//jobs associated with login user
const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getSingleJob = async (req, res) => {
  const {
    user: { userId },
    params: { id: jobId },
  } = req;

  const singleJob = await Job.findOne({
    _id: jobId,
    createdBy: userId,
  });

  if (!singleJob) {
    throw new NotFoundError(`No job with id : ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ singleJob });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  console.log(req.body);
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json(job);
};

const updateJob = async (req, res) => {
  const {
    body:{company,position},
    user: { userId },
    params: { id: jobId },
  } = req;

  if(company=='' || position==''){
    throw new BadRequestError('Company or position fields cannot be empty');
  }

  const job=await Job.findByIdAndUpdate({
    _id: jobId,
    createdBy: userId,
  },req.body,{new:true,runValidators:true})

  if (!job) {
    throw new NotFoundError(`No job with id : ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });

};
const deleteJob = async (req, res) => {
    const {
        user: { userId },
        params: { id: jobId },
      } = req;

      const deletedJob=await Job.findByIdAndDelete({
        _id: jobId,
       createdBy: userId,
      })

      if(!deletedJob){
        throw new NotFoundError(`No job with id : ${jobId}`);
      }

      res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllJobs,
  getSingleJob,
  createJob,
  updateJob,
  deleteJob,
};
