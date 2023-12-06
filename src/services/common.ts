import { request } from '@umijs/max';
import url from '@/utils/url';

export async function fetchHome() {
  return request(url.home);
}

export async function fetchInfo() {
  return request(url.info);
}

export async function postInfo(data: Record<string, any>) {
  return request(url.info, {
    method: 'post',
    data,
  });
}

export async function fetchMyself() {
  return request(url.myself);
}

export async function postMyself(data: Record<string, any>) {
  return request(url.myself, {
    method: 'post',
    data,
  });
}

export async function upload(data: { type?: 'base' | 'cdn'; file: Blob }) {
  const formData = new FormData();
  formData.append('file', data.file);
  return request<{
    status: string;
    message: string;
    body: {
      url: string;
      filename: string;
    };
  }>(`${url.upload}/${data.type}`, {
    method: 'post',
    data: formData,
  });
}
