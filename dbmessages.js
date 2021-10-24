import mongoose  from "mongoose";

const schema = mongoose.Schema({
    message: String,
    name: String,
    timestamp: String,
    recieved: Boolean,
});

export default mongoose.model('messagecontent', schema);