
require('dotenv').config();         //加载环境变量

var express = require('express');       // express框架
var Sequelize = require('Sequelize')    // 数据库框架
var morgan = require('morgan')           // 中间件记录功能
var session = require('express-session')        //管理session组件
var bodyParser = require('body-parser')          //http请求体解析组件
// var RedisStore = require('connect-redis')(session);   //持久化session
var app = express();

var config = require('../config')       // 配置
var middleware = require('../middleware/base.js')       // 请求状态中间件
var route = require('../route/base.js')       // 路由


//数据库
const sequelize = new Sequelize(config.db_database, config.db_user, config.db_password, {
    host: config.db_host,
    dialect: 'mysql',
    port:'3306',
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    timezone: '+08:00',
    logging: false,
    // operatorsAliases:false, 这个是不警告
});

//测试数据库连接是否正常
sequelize.authenticate().then(() => {
    console.log('Database ok.');
}).catch(err => {
    console.error('Database fail.', err);
});

//添加所有请求的中间件
app.all('*', function (req, res, next) {
    // 设置cors
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', "POST, GET, OPTIONS, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Credentials', 'true');  // 允许发送Cookie数据
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    } else {
        next();
    }
});

//中间件记录日志
app.use(morgan('dev'))


//中间件express-session
app.use(session({
    // store: new RedisStore({
    //     host: 'localhost',
    //     port: '6379'
    // }),
    secret: 'reactdemo',
    cookie: { maxAge: 10000 },
    resave:false,
    saveUninitialized:false,
}))

//http请求体解析中间件 
app.use(bodyParser.json())   //解析application/json

//添加请求状态中间件
app.use(middleware.reply)    //自定义中间件

//路由
app.use(config.apiPath, route.route);

// 错误处理
app.use(middleware.notFound);
app.use(middleware.error);        //错误中间件，当参数为4个时，会被express视为错误处理中间件

app.listen(config.servicePort, function (req, res) {
  console.log('app is running at port '+config.servicePort);
});