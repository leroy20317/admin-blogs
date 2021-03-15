## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

## Description

1. react + ts + Ant design Pro 5.0
2. 页面
   1. 登录
   2. 仪表盘
   3. 文章列表、添加修改
   4. 短语列表、添加修改
   5. 评论列表、添加修改
   6. 个人介绍
   7. 系统相关设置
3. 运用 useModel 处理简易数据流
4. 通过将项目资源上传至七牛 CDN 达到请求优化缓存加速功能
5. 使用 jenkins 来实现项目的自动化部署
