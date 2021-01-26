const prod: boolean = process.env.NODE_ENV === 'production';

const domain: string = prod ? '//api.leroy.net.cn/admin' : 'http://local.leroy.net.cn:5001/admin';
// const domain: string = '//api.leroy.net.cn/admin';
const webHost: string = 'https://www.leroy.net.cn';

const Url = {
  domain,
  webHost,
  staticHost: prod ? '//cdn.leroy.net.cn/admin-blogs/dist/' : '/',
  // staticHost: '//static.leroy.net.cn/',

  login: `${domain}/login`, // 登录
  user: `${domain}/user`, // 创建用户
  dashboard: `${domain}/dashboard`, // 主页仪表盘
  password: `${domain}/password`, // 重置密码
  info: `${domain}/info`, // 用户信息
  article: `${domain}/article`, // 文章
  envelope: `${domain}/envelope`, // 短语
  myself: `${domain}/myself`, // 关于我
  comment: `${domain}/comment`, // 评论
  comment_read: `${domain}/comment_read`, // 评论已读
  article_like: `${domain}/article_like`, // 点赞
  upload: `${domain}/upload`, // 上传
  delete_file: `${domain}/delete_file`, // 删除文件
};
export default Url;
