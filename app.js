require('dotenv').config();
require('express-async-errors');


const express = require('express');
const app = express();

//extra security
const helmet=require('helmet');
const cors=require('cors');
const xss=require('xss-clean')
const rateLimiter=require('express-rate-limit')

//swagger
const swaggerUI=require('swagger-ui-express');
const YAML=require('yamljs');
const swaggerDocument=YAML.load('./swagger.yaml')

//authenticate route
const authenticateUser=require('./middleware/authentication')
//connect DB
const connectDB=require('./db/connect');

//router
const authRouter=require('./routes/auth');
const jobRouter=require('./routes/jobs')

// error handler
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');
const { StatusCodes } = require('http-status-codes');

app.use(express.json());
// extra packages

app.set('trust proxy',1);
app.use(rateLimiter({
  windowMs:15*60*1000 //15 minutes
  ,max:100 //limit each Ip to to 100 requests per WindowMs
}));
app.use(helmet());
app.use(cors());
app.use(xss());



// routes
app.get('/',(req,res)=>{
  res.status(StatusCodes.OK).send('<h1>JOBS API</h1> <a href="/api-docs">Api Documentation</a>')
})
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument))
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/jobs',authenticateUser,jobRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {

    await connectDB(process.env.MONGO_URI);
    
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
