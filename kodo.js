const dotenv = require('dotenv');
dotenv.config();
const path = require('path');
const rd = require('rd');
const co = require('co');
const { S3, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const folderName = require('./package.json').name;

// // 创建 七牛 S3 客户端对象
const kodoClient = new S3({
  region: 'z2',
  endpoint: 'https://s3.cn-south-1.qiniucs.com',
  credentials: { accessKeyId: process.env.ACCESSKEY, secretAccessKey: process.env.SECRETKEY },
});

// 异步遍历目录下的所有文件
rd.each(
  path.join(__dirname, '/dist'),
  function (f, s, next) {
    if (s.isFile()) {
      co(function* () {
        try {
          const result = yield kodoClient.send(
            new PutObjectCommand({
              Bucket: 'leroy20317',
              Key: f.replace(path.join(__dirname, '/dist'), folderName),
              Body: fs.createReadStream(f),
            }),
          );
          return result;
        } catch (error) {
          console.log(error);
        }
        // return result;
      }).then(function () {
        console.log(
          `上传文件至 https://cdn.leroytop.com/${f.replace(
            path.join(__dirname, '/dist'),
            folderName,
          )} 成功`,
        );
      });
    }
    next();
  },
  function (err) {
    if (err) throw err;
  },
);

// 删除
// const data = await s3Client.send(new DeleteObjectCommand({ Bucket: "BUCKET_NAME", Key: "KEY" }));

return;

// const qiniu = require('qiniu');
// const mac = new qiniu.auth.digest.Mac(process.env.ACCESSKEY, process.env.SECRETKEY);
// const config = new qiniu.conf.Config({
//   zone: qiniu.zone.Zone_z2, // 华南
// });
//
// const options = { scope: 'leroy20317', expires: 7200 };
// const putPolicy = new qiniu.rs.PutPolicy(options);
// const uploadToken = putPolicy.uploadToken(mac);
//
// const formUploader = new qiniu.form_up.FormUploader(config);
// const putExtra = new qiniu.form_up.PutExtra();
//
// // 异步遍历目录下的所有文件
// rd.each(
//   path.join(__dirname, '/dist'),
//   function (f, s, next) {
//     putExtra.mimeType = null;
//     if (s.isFile()) {
//       co(function* () {
//         try {
//           const result = yield upload(f.replace(path.join(__dirname, '/dist'), folderName), f);
//           return result;
//         } catch (error) {
//           console.log(error);
//         }
//         // return result;
//       }).then(function () {
//         console.log(
//           `上传文件至 https://cdn.leroytop.com/${f.replace(
//             path.join(__dirname, '/dist'),
//             folderName,
//           )} 成功`,
//         );
//       });
//     }
//     next();
//   },
//   function (err) {
//     if (err) throw err;
//   },
// );
//
// function upload(key, localFile) {
//   return new Promise((resolve, reject) => {
//     // 文件上传
//     formUploader.putFile(
//       uploadToken,
//       key,
//       localFile,
//       putExtra,
//       function (respErr, respBody, respInfo) {
//         putExtra.mimeType = null; // 重置MIME类型
//         if (respErr) {
//           reject(respErr);
//           throw respErr;
//         }
//         resolve(respBody);
//         if (respInfo.statusCode === 200) {
//           // console.log(respBody);
//         } else {
//           // console.log(respInfo.statusCode);
//           // console.log(respBody);
//         }
//       },
//     );
//   });
// }
