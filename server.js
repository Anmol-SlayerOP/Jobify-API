require('dotenv').config()
require('express-async-errors')

const express = require('express')
const fileUpload = require('express-fileupload')
const cookieParser = require('cookie-parser')
const connectDB = require('./db/connectDB')

// cloudinary setup
const cloudinary = require('cloudinary').v2
cloudinary.config({
	cloud_name: process.env.CLOUD_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
})

// security packages
const helmet = require('helmet')
const cors = require('cors')
const xssClean = require('xss-clean')


// middlewares
const notFoundMiddleware = require('./middlewares/notFound')
const errorHandlerMiddleware = require('./middlewares/errorHandler')
const authenticationMiddleware = require('./middlewares/authentication')

// routers
const authRouter = require('./routers/authRouter')
const jobsRouter = require('./routers/jobsRouter')
const usersRouter = require('./routers/usersRouter')
const externalapisRouter = require('./routers/externalapiRouter')

const app = express()


//for swagger
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
	swaggerDefinition: {
	  openapi: '3.0.0',
	  info: {
		title: 'API Documentation',
		version: '1.0.0',
		description: 'API Information',
		contact: {
		  name: 'Developer'
		},
		servers: [{ url: 'http://localhost:5001' }]
	  }
	},
	apis: ['./routers/*.js']
  };

  const swaggerDocs = swaggerJsDoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.set('trust proxy', 1)
// app.use(
// 	rateLimiter({
// 		// 😾
// 		windowMs: 60 * 60 * 1000,
// 		max: 20,
// 	})
// )
app.use(express.json())
app.use(cookieParser())
app.use(fileUpload({ useTempFiles: true }))
app.use(helmet())
const corsOptions = {
	origin: process.env.ORIGIN,
	optionsSuccessStatus: 200,
	allowedHeaders: ['Content-Type', 'Authorization']
  };
  
  app.use(cors(corsOptions));
app.use(xssClean())

//for Debugging
app.use((req, res, next) => {
    console.log(`Received request for ${req.url}`);
    next();
});






app.get('/', (req, res) => res.send('Jobify Backend API'))
app.use('/api/auth', authRouter)
app.use('/api/jobs', authenticationMiddleware, jobsRouter)
app.use('/api/users', usersRouter)
app.use('/api/externalapis',authenticationMiddleware, externalapisRouter)// externalapis/search/getjobs , ai/generateresume

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = process.env.PORT || 5001
const start = async () => {
	try {
		await connectDB(process.env.MONGO_URL)
		console.log('DB connected successfully!')
		app.listen(port, () =>
		  {
			var datetime = new Date();
    console.log(datetime.toISOString().slice(11,-5));
			console.log(`Server is listening at port ${port}...`)}
		)
	} catch (error) {
		console.log(error)
		process.exit()
	}
}

start()
