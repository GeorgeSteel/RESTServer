// Puerto
process.env.PORT = process.env.PORT || 3000;

// Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// DB
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

// Tokes expires
process.env.TOKEN_EXPIRES = '24h';

// Authentication SEED
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '876030848337-uou9urkqt70q0vvkliquig6rctprl81l.apps.googleusercontent.com';