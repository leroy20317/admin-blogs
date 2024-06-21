import dotenv from 'dotenv'
dotenv.config();
import { fileURLToPath } from 'url';
import path from 'path'
import rd from 'rd'
import co from 'co'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import mime from 'mime';
import packageJson from './package.json' assert { type: "json"}
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const {name: folderName} = packageJson

// 创建 S3 客户端对象
const S3 = new S3Client({
  region: process.env.REGION,
  endpoint: process.env.ENDPOINT,
  credentials: { accessKeyId: process.env.ACCESS_KEY_ID, secretAccessKey: process.env.SECRET_ACCESS_KEY },
  forcePathStyle: true, // 对于非 AWS S3 兼容服务，通常需要设置为 true
});

// 文件上传
function uploadFile(key, localFile) {
  return S3.send(
    new PutObjectCommand({
      Bucket: process.env.BUCKET,
      Key: key,
      ContentType: mime.getType(localFile),
      Body: fs.createReadStream(localFile),
    }),
  );
}

// 异步遍历目录下的所有文件
rd.each(
  path.join(__dirname, '/dist'),
  function (f, s, next) {
    if (s.isFile()) {
      co(function* () {
        try {
          const result = yield uploadFile(f.replace(path.join(__dirname, '/dist'), folderName), f);
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
