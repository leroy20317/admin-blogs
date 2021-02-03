import { request } from 'umi';
import url from '@/utils/url';

export async function fetchHome() {
  return request(url.home);
}

export async function fetchInfo() {
  return request(url.info);
}

export async function postInfo(data: object) {
  return request(url.info, {
    method: 'post',
    data,
  });
}

export async function fetchMyself() {
  return request(url.myself);
}

export async function postMyself(data: object) {
  return request(url.myself, {
    method: 'post',
    data,
  });
}
