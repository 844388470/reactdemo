const express = require('express');
const _ = require('lodash');
const util = require('../utils')
const auth = require('../middleware/auth')
const controller = require('../controller/base')

const route = express.Router();
// route.get('/', (req, res) => {
//     res.reply('Hola!');
// })

var list=[
    { path: '/login', method: 'get',middlewares:auth.isLogin },
    { path: '/login', method: 'post',middlewares:[] },
]

util.buildRoute(list,route,controller)

exports.route=route