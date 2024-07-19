const { StatusCodes } = require("http-status-codes");
const { NotFoundError, BadRequestError } = require("../errors");
const Job = require("../models/Job");
const User = require("../models/User");
const FeaturedJob = require("../models/FeaturedJob");
const UserJob = require("../models/UserJob");

const newJob = async (req, res) => {
  console.log("reached new job");
  try {
    req.body.createdBy = req.user.userID;
    req.body.job_id = req.user.userID + req.body.job_id + Date.now();
    console.log(req.body);
    const jobData = req.body; 
    const userModel = await User.findById(req.user.userID);

    if (!userModel) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    const newJob = new Job(jobData);
    const newUserJob = new UserJob(jobData);

    await newJob.save();
    await newUserJob.save();

    userModel.createdJobs.push(newUserJob._id);
    await userModel.save();
    const newFeaturedJob = new FeaturedJob({ _id: newUserJob._id });
    await newFeaturedJob.save();
    res.status(201).json({ message: "Job created successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getSavedJobs = async (req, res) => {
  try {
    const userModel = await User.findById(req.user.userID);

    if (!userModel) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    // Fetch the saved jobs from the user model
    // This assumes savedJobs contains job IDs that you can populate with actual job data
    const savedJobs = await UserJob.find({ _id: { $in: userModel.savedJobs } });
    res.status(StatusCodes.OK).json({ savedJobs });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Could not fetch saved jobs" });
  }
};

const getImportantJobs = async (req, res) => {
  try {
    const userModel = await User.findById(req.user.userID);

    if (!userModel) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    // Fetch the saved jobs from the user model
    const savedJobs = await UserJob.find({
      _id: { $in: userModel.importantJobs },
    });
    res.status(StatusCodes.OK).json({ savedJobs });
  } catch (error) {
    console.error("Error fetching Important jobs:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Could not fetch Important jobs" });
  }
};

const getCreatedJobs = async (req, res) => {
  try {
    const userModel = await User.findById(req.user.userID);

    if (!userModel) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }

    // Fetch the saved jobs from the user model
    // This assumes savedJobs contains job IDs that you can populate with actual job data
    const savedJobs = await UserJob.find({
      _id: { $in: userModel.createdJobs },
    });
    res.status(StatusCodes.OK).json({ savedJobs });
  } catch (error) {
    console.error("Error fetching created jobs:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Could not fetch created jobs" });
  }
};

const getFeaturedJobs = async (req, res) => {
  try {
    // Step 1: Get the _id values from FeaturedJob
    const featuredJobIds = await FeaturedJob.find({}, { _id: 1 })
      .limit(20)
      .lean();

    // Extract the _id values into an array
    const featuredJobIdArray = featuredJobIds.map((job) => job._id);

    // Step 2: Use the _id values to query the UserJob collection
    const savedJobs = await UserJob.find({ _id: { $in: featuredJobIdArray } });

    res.status(StatusCodes.OK).json({ savedJobs });
  } catch (error) {
    console.error("Error fetching created jobs:", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Could not fetch featured jobs" });
  }
};


// saves jobs as saved and also as important this functions main use is for marking jobs fetched from api as saved and also in important if specified
const createJob = async (req, res) => {
  try {
    req.body.createdBy = req.user.userID;
    const params = req.query;
    req.body.imp = params.imp;
    // Check if the job already exists in the UserJob collection
    let job = await UserJob.findOne({ job_id: req.body.job_id });

    if (job) {
      // If the job already exists, check if it's already in the user's savedJobs array
      const userModel = await User.findById(req.user.userID);
      if (userModel.savedJobs.includes(job._id)) {
        if (req.body.imp) {
          if (!userModel.importantJobs.includes(job._id)) {
            userModel.importantJobs.push(job._id);
          }
        }
        await userModel.save();
        return res
          .status(StatusCodes.CONFLICT)
          .json({ message: "Job already saved in savedJobs" });
      } else {
        userModel.savedJobs.push(job._id);
        if (req.body.imp) {
          if (!userModel.importantJobs.includes(job._id)) {
            userModel.importantJobs.push(job._id);
          }
        }
        await userModel.save();
        return res
          .status(StatusCodes.OK)
          .json({ message: "Job added to savedJobs" });
      }
    } else {
      // Create the job and add it to the user's savedJobs array

         job = new UserJob(req.body);
        job.save();

      const userModel = await User.findById(req.user.userID);
      userModel.savedJobs.push(job._id);
      if (req.body.imp) {
        if (!userModel.importantJobs.includes(job._id)) {
          userModel.importantJobs.push(job._id);
        }
      }
      await userModel.save();
      return res.status(StatusCodes.CREATED).json({ job });
    }
  } catch (error) {
    // Handle errors
    if (error.code === 11000) {
      // Handle duplicate key error
      res.status(StatusCodes.CONFLICT).json({ error: "Job already exists" });
    } else {
      console.error("Error creating job:", error);
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: "Error creating job" });
    }
  }
};




const deleteJob = async (req, res) => {
  try {

    const params = req.query;   //ye search ya query params
    const job_id = req.params.id // aur ye path wale params
    const type = params.category;
	console.log(" del params",job_id,type)
  
  // Check if the job already exists in the UserJob collection
  let job = await UserJob.findOne({ job_id: job_id });
  console.log(job)
  if (job) {
      // If the job already exists, check if it's already in the user's savedJobs array
      const userModel = await User.findById(req.user.userID);
      console.log(userModel)
      //for featured jobs
      if (type == "featured") {
        const jobdel = await FeaturedJob.findOneAndRemove({ _id: job._id });
		    console.log(jobdel)
        return res.status(200).json({ message: `Job deleted in ${type} jobs` });
      } else {
        const jobIndex = userModel[`${type}Jobs`].indexOf(job._id);
		    console.log(jobIndex)
        if (jobIndex === -1) {
          return res
          .status(404)
          .json({ message: `Job not found in ${type} jobs` });
        }

        // Remove the job ID from the savedJobs array
        userModel[`${type}Jobs`].splice(jobIndex, 1);

		    await userModel.save()
        console.log(userModel)
        return res.status(200).json({ message: `Job deleted in ${type} jobs` });
      }
      } 
  } catch (error) {
    // Handle errors
      console.error("Error Deleting job:", error);
      res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error deleting job" });
    
  }
};




const getJob = async (req, res) => {
  const {
    user: { userID },
    params: { id: jobID },
  } = req;
  const job = await Job.findOne({ _id: jobID, createdBy: userID });
  if (!job) {
    throw new NotFoundError(`No job with ID: ${jobID}`);
  }
  res.status(StatusCodes.OK).json({ job });
};



module.exports = {
  getFeaturedJobs,
  getCreatedJobs,
  getImportantJobs,
  newJob,
  getSavedJobs,
  createJob,
  getJob,
  deleteJob,
};
