import dotenv from 'dotenv';

// It's a good practice to centralize your environment variable loading.
// This file will be imported at the very top of your application's entry point.
dotenv.config({
    path: './.env',
    quiet:true
});