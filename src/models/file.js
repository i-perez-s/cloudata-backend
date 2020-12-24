var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    path: {
        type: String,
        required: [true, 'El path es necesario']
    },
    creator: {
        type: Schema.Types.ObjectId,
        required: true
    },
    shared: {
        type: [Schema.Types.ObjectId],
        required: false
    }
});


module.exports = mongoose.model('File', productoSchema);
