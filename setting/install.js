const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://yerinko:<비밀번호>@boilerplate.b4kwc.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log("MongoDB Connected..."))
    .catch(err => console.log(err))
