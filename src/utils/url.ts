const prod: boolean = process.env.NODE_ENV === 'production';

const domain: string = prod ? '//api.leroy.net.cn/admin' : 'http://local.leroy.net.cn:5001/admin';
// const domain: string = '//api.leroy.net.cn/admin';
const webHost: string = 'https://www.leroy.net.cn';

const Url = {
  domain,
  webHost,
  staticHost: prod ? '//cdn.leroy.net.cn/admin-blogs/dist/' : '/',
  // staticHost: '//static.leroy.net.cn/',

  login: `${domain}/user/login`, // 登录
  register: `${domain}/user/register`, // 创建用户
  userInfo: `${domain}/user/info`, // 用户信息
  home: `${domain}/home`, // 主页数据
  article: `${domain}/article`, // 文章
  envelope: `${domain}/envelope`, // 短语
  myself: `${domain}/about`, // 关于我
  info: `${domain}/info`, // 用户信息
  comment: `${domain}/comment`, // 评论
  upload: `${domain}/file/upload`, // 上传
  delete_file: `${domain}/file/delete`, // 删除文件
};
export default Url;
