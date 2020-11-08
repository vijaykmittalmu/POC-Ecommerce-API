const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then((success) => {
    console.log("Connection create successfully.");
}).catch((error) => {
    console.log(`ERROR: Connection failed - ${error}`);
});