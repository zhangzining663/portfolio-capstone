// 可选的演示数据填充脚本：node seed.js
// 给已注册的 zhangzining 用户挂上示例项目、博文和评论，重复运行不会重复插入
require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');
dns.setServers(['223.5.5.5', '119.29.29.29', '8.8.8.8']);

const User = require('./models/User');
const Project = require('./models/Project');
const BlogPost = require('./models/BlogPost');
const Comment = require('./models/Comment');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('connected for seeding');

  let user = await User.findOne({ username: 'zhangzining' });
  if (!user) {
    user = await User.create({
      username: 'zhangzining',
      email: 'zhangzining@example.com',
      password: 'seed123456'
    });
    console.log('created seed user');
  }

  const projects = [
    {
      title: '课程成绩管理小系统',
      description: '用 Express + MongoDB 做的后端练习，能录入学生成绩、按课程查询和排序，配套简单的表格页面。',
      repoUrl: 'https://github.com/zhangzining/course-grades',
      liveUrl: ''
    },
    {
      title: '个人记账网页',
      description: 'React 写的单页记账本，按月统计收支，数据先存在浏览器 localStorage，后续计划换成后端接口。',
      repoUrl: 'https://github.com/zhangzining/personal-ledger',
      liveUrl: ''
    },
    {
      title: '数据库实验：学生信息表 CRUD',
      description: 'SQL 课程实验，建学生、课程、选课三张表并写增删改查语句，用 Navicat 连接 MySQL 执行验证。',
      repoUrl: '',
      liveUrl: ''
    }
  ];

  for (const p of projects) {
    const exists = await Project.findOne({ title: p.title });
    if (!exists) {
      await Project.create({ ...p, user: user._id });
      console.log('project added:', p.title);
    }
  }

  const posts = [
    {
      title: '第一次用 MongoDB Atlas 搭数据库的踩坑记录',
      content:
        '这周把课程项目的数据库从本地换成了 Atlas。最开始一直连不上，报错是 querySrv ECONNREFUSED，查了半天才发现是本地默认 DNS 不响应 SRV 查询，在连接前手动指定公共 DNS 后就通了。另外建完集群一定要在 Network Access 里把 IP 加进去，线上平台部署时还要允许 0.0.0.0/0，不然服务器连不上数据库。密码记得在 Connect 弹窗里立刻复制，退出之后就看不到了。'
    },
    {
      title: 'React Router 里受保护路由是怎么工作的',
      content:
        '后台页面 /admin 不能让没登录的人看到。做法是写一个 ProtectedRoute 组件，用 useAuth 拿到 token，没有 token 就用 Navigate 跳到 /login；有 token 才渲染 Outlet 里的子路由。路由配置里把 /admin 包在这个组件外面就行。登录状态用 Context 全局管理，Header 导航栏根据有没有 token 切换显示 Login/Register 还是 Logout 和 Dashboard 链接。'
    }
  ];

  const postIds = [];
  for (const item of posts) {
    let post = await BlogPost.findOne({ title: item.title });
    if (!post) {
      post = await BlogPost.create({ ...item, author: user._id });
      console.log('post added:', item.title);
    }
    postIds.push(post);
  }

  const comments = [
    { post: postIds[0], body: 'DNS 那个坑我也踩过，谢谢整理！' },
    { post: postIds[0], body: 'Network Access 白名单确实容易忘，线上部署报错先查这里。' },
    { post: postIds[1], body: 'ProtectedRoute 用 Outlet 嵌套比每个页面单独判断清爽多了。' }
  ];

  for (const c of comments) {
    const exists = await Comment.findOne({ post: c.post, body: c.body });
    if (!exists) {
      await Comment.create({ body: c.body, author: user._id, post: c.post });
      console.log('comment added');
    }
  }

  console.log('seeding finished');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
