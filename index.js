const express = require('express')
const app = express()
const port = 4000
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
// app.use(express.urlencoded({extended:true}));
const config = require('./config/key')
const { User } = require('./models/User');
const mongoose = require('mongoose')

mongoose.connect(config.mongoURI)
.then((res) => console.log("ok!"))
.catch((error) => console.log(error))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/register', (req, res) =>{
    const user = new User(req.body);
    user.save((err, userInfo) =>{
        if(err) return res.json({success:false, err});
        return res.status(200).json({
            success:true
        })
    });
})

app.post('/login', (req, res) => {
    //요청된 이메일을 데이터베이스에서 있는지 찾는다.
    User.findOne({email: req.body.email},(err, user) => {
        if(!user){
            return res.json({
                loginSuccess: false,
                message:"이메일이 존재하지 않습니다."
            });
        };

        //요청된 이메일이 데이터베이스에 있다면 비밀번호가 일치하는지 확인
        user.comparePassword(req.body.password, (err, isMatch) =>{
            if(!isMatch){
                return res.json({loginSuccess:false,message:"비밀번호가 틀렸습니다."});
            };
            //비밀번호가 일치하다면 token생성
            user.generateToken((err, user) =>{
                if(err) return res.status(400).send(err);

                //토큰을 쿠키에 저장
                res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess:true, userId:user._id})
            })
        })
    })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})