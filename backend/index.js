const express = require('express');
const path = require('path');
require('dotenv').config(); 
const PORT = process.env.PORT || 1000;
const cors = require('cors');

const cookieParser = require("cookie-parser");

const app = express();

app.use(cookieParser());


app.use("/files", express.static(path.join(__dirname, "./files"))); // Serve uploaded files statically

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(cors({ 
    origin: "http://localhost:3000", 
    credentials: true }));


const connectDB = require('./config/db');
const authRouter= require('./routers/authroute');
const empRouter = require('./routers/emproute')
const deptRouter = require('./routers/deptroute')
const leaveRouter = require('./routers/leaveroute')
const salaryRouter = require('./routers/salaryroute')
const IssueRouter = require('./routers/issuerouter')
const ResignationRouter = require('./routers/resinationrouter')
const HolidayRouter = require('./routers/holidayrouter')


connectDB();

app.get('/', (req, res) => {
  res.send('Emp Management System Server is running');
});

app.use('/api/auth', authRouter);
app.use('/api/employee', empRouter);
app.use('/api/dept', deptRouter);
app.use('/api/leave', leaveRouter);
app.use('/api/salary', salaryRouter);
app.use('/api/issue', IssueRouter);
app.use('/api/resignation', ResignationRouter);
app.use('/api/holiday', HolidayRouter);

app.get("/", (req, res) => {
  res.send("Hello Guys!");
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));