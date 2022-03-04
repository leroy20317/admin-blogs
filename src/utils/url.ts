const prod: boolean = process.env.NODE_ENV === 'production';
const Url = {
  webHost: 'https://www.leroy.net.cn',
  staticHost: prod ? '//cdn.leroy.net.cn/admin-blogs/dist/' : '/',
  // staticHost: '//static.leroy.net.cn/',

  login: `/user/login`, // 登录
  register: `/user/register`, // 创建用户
  userInfo: `/user/info`, // 用户信息
  home: `/home`, // 主页数据
  article: `/article`, // 文章
  envelope: `/envelope`, // 短语
  myself: `/about`, // 关于我
  info: `/info`, // 用户信息
  comment: `/comment`, // 评论
  upload: `/file/upload`, // 上传
  delete_file: `/file/delete`, // 删除文件
};
export default Url;
