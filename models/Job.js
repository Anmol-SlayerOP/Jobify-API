
const mongoose = require('mongoose');  // All temporary jobs are stored here to collect jobs data from API's

const jobSchema = new mongoose.Schema({
  job_id: { type: String, unique: true, required: true },
  employer_logo: { type: String },
  employer_name: { type: String },
  job_title: { type: String },
  job_city: { type: String },
  job_state: { type: String },
  job_country: { type: String },
  job_posted_at_timestamp: { type: Number},
  job_offer_expiration_datetime_utc: { type: String},
  job_employment_type: { type: String},
  job_is_remote: { type: Boolean },
  min_salary: { type: String },
  max_salary: { type: String },
  job_salary_period: { type: String},
  job_description: { type: String },
  job_highlights: {
    Benefits: { type: [String] },
    Qualifications: { type: [String] },
    Responsibilities: { type: [String] }
  },
  job_apply_link: { type: String, required: true },
  job_required_education: {
    bachelors_degree: { type: Boolean }
  },
  job_required_experience: {
    required_experience_in_months: { type: Number },
    experience_mentioned: { type: Boolean }
  },
  availability: { type: String },
  education: { type: String },
  gender: { type: String },
  age: { type: String },
  experience: { type: String },
  language: { type: String },
});

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
