const mongoose = require('mongoose');
const _ = require('lodash')

console.log(process.env.MONGODB_URI)
// Step 0: Remember to add your MongoDB information in one of the following ways!
if (!process.env.MONGODB_URI) {
  console.log('Error: MONGODB_URI is not set. Did you run source env.sh ?');
  process.exit(1);
}


// const connect = process.env.MONGODB_URI;
const connect = `mongodb+srv://SirRendore:pa55word@horizonscluster-a9rxt.mongodb.net/HorizonsDocs?retryWrites=true&w=majority`
mongoose.connect(connect)
  .then(() => { console.log("Connected to mongoDB!") });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  imgUrl: {
    type: String,
    default: 'https://horizons-static.s3.amazonaws.com/horizons_h.png'
  },
  displayName: {
    type: String,
  },
  bio: {
    type: String,
  }
  /* Add other fields here */
});

var User = mongoose.model('user', userSchema);

module.exports = {
  User: User
};
