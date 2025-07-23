import dotenv from 'dotenv';
dotenv.config({ quiet: true});
import express from 'express';

import connectDB from './db/index.js';
const app= express();
app.listen(process.env.PORT || 3000,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})

connectDB();