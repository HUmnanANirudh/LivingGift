const  mongoose = require("mongoose")
const { Schema } = mongoose;

mongoose.connect( Mongo_uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  Username: { type: String, required: true, unique: true },
  password: { type: String, minlength: 6 },
});

const Eusers = mongoose.model("Eusers", userSchema);

module.exports = Eusers;