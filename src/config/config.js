process.env.PORT = 8888

let urlDB;

//if (process.env.NODE_ENV === 'dev') {
urlDB = 'mongodb://localhost:27017/cloudData';
//} else {
//    urlDB = process.env.MONGO_URI;
//}

process.env.SEED = process.env.SEED || 'clouddata'
process.env.URLDB = urlDB;

process.env.CLIENTGOOGLE = '615012829167-d9n4ne54kecsll59o3gjnuvvtjd7p65l.apps.googleusercontent.com'