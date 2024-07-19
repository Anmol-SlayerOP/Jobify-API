const { StatusCodes } = require('http-status-codes')
const { NotFoundError, BadRequestError } = require('../errors')
const axios = require('axios');
const Job = require('../models/Job')

const getJobs =     async (req, res) => {
    const  params  = req.query;
    console.log("job route params: ",params)
        const options = {
          method: 'GET',
          url: 'https://jsearch.p.rapidapi.com/search',
          params: params,
          headers: {
            'x-rapidapi-key': process.env.JSEARCH_API_KEY || '',
            'x-rapidapi-host': 'jsearch.p.rapidapi.com'
          }
        };
        try {
          const response = await axios.request(options);
          res.json(response.data);

          //save to db also
          Job.insertMany(response.data.data)
    .then((docs) => {
        console.log('Jobs saved successfully:', docs);
    })
    .catch((err) => {
        console.error('Error saving jobs:', err);
    });
        } catch (error) {
            console.log(error.message)
          res.status(500).json({ error: 'Failed to fetch data from external API' });
        }
      };



module.exports = { getJobs }
