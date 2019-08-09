const mongoose = require('mongoose');

if (!process.env.MONGODB_URI) {
  console.log('Error: MONGODB_URI is not set. Did you run source env.sh ?');
  process.exit(1);
}

const connect = process.env.MONGODB_URI;
mongoose.connect(connect);

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    first: {
      type: String,
      required: true
    },
    last: {
      type: String,
      required: true
    }
  }
});

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "New Document"
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
    default: []
  },
  content: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: new Date(),
    required: true
  },
  lastUpdated: {
    type: Date,
    default: new Date(),
    required: true
  }
});


var User = mongoose.model('User', userSchema);
var Document = mongoose.model('Document', documentSchema);

module.exports = {
  User,
  Document
};
