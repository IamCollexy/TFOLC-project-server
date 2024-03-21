const express = require('express');
const usersWithPaginationRouter = require('./controllers/userControllerWithPagination');
const usersRouter = require('./routes/userRoutes');
const createUsers = require('./routes/createUser');
const authRouter = require('./routes/authRoute');
require('dotenv').config();
const connectDataBase = require('./config/dbConn');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const app = express();
const PORT = process.env.PORT || 8001;

connectDataBase();

//Cross Origin Resource Sharing
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

// Middleware to parse JSON requests
app.use(express.json());

app.use(cookieParser());

// Routes
app.get('/', (req, res) => {
  res.send('Server Running Great!');
});
app.use('/usersWithPagination', usersWithPaginationRouter);
app.use('/create', createUsers);
app.use('/users', usersRouter);
app.use('/auth', authRouter);

// mongoDb
mongoose.connection.once('open', () => {
  console.log('Connected to MongoDb');
  // Start the server
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  mongoose.connection.on('error', (err) => {
    console.log(err);
    //
    if (err.hasOwnProperty('code')) {
      console.log('code:', err.code);
    }

    if (err.hasOwnProperty('syscall')) {
      console.log('syscall:', err.syscall);
    }

    if (err.hasOwnProperty('hostname')) {
      console.log('hostname:', err.hostname);
    }
    //
    logEvent(
      `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
      'mongoErrLog.log'
    );
  });
});
