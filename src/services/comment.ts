import { request } from 'umi';
import url from '@/utils/url';

interface Params {
  id?: number|string;
  [key: string]: any
}


export async function fetch({ id, ...params }: any) {
  return request(`${url.comment}/${id || ''}`, {
    method: 'get',
    params
  });
}

export async function replay(data: object) {
  return request(url.comment, {
    method: 'post',
    data
  });
}

export async function read() {
  return request(url.comment_read, {
    method: 'post',
  });
}


export async function del(params: Params) {
  return request(`${url.comment}`, {
    method: 'delete',
    data: params
  });
}

