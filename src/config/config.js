process.env.PORT = process.env.PORT || 8888

let urlDB;

//if (process.env.NODE_ENV === 'dev') {
urlDB = 'mongodb://localhost:27017/cloudData';
//} else {
// urlDB = "mongodb+srv://z3hcnas:123@datacloud.cwzgu.mongodb.net/datacloud?retryWrites=true&w=majority"
//}

process.env.SEED = process.env.SEED || 'clouddata'
process.env.URLDB = urlDB;

process.env.ROUTE = "D:\\Users\\iperez\\Cloud\\Drive\\programacion\\proyectos\\proyectos web\\google drive\\server\\uploads"

process.env.CLIENTGOOGLE = '615012829167-d9n4ne54kecsll59o3gjnuvvtjd7p65l.apps.googleusercontent.com'
