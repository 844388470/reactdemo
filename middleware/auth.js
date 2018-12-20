'use strict';

// const config = require('../config')       // 配置

// 要求用户登录
function isLogin(req, res, next) {
  console.log(req.session.id)
  console.log(req.session.cookie)
  // console.log(res.session)
  // console.log(res.session) 
  if (req.session.user) {
    req.user = req.session.user; // 将用户信息添加到request对象
    next();
  } else {
    req.session.user=1
    next({ message: '请先登录！', status: 200 , code: 33});       // 为空执行下面的路由，为'route'跳过后面路由，其他会报错
  }
}



module.exports = {
  isLogin: isLogin,
};
