import { request } from 'umi';
import url from '@/utils/url';

interface Params {
  id?: number|string;
  [key: string]: any
}


export async function fetch({ id, ...params }: any) {
  return request(`${url.article}/${id || ''}`, {
    method: 'get',
    params
  });
}

export async function update({ id, data }: {id: any, data: object}) {
  return request(`${url.article}/${id || ''}`, {
    method: 'post',
    data
  });
}

export async function create(data: Params) {
  return request(url.article, {
    method: 'post',
    data
  });
}

export async function del({ id }: Params) {
  return request(`${url.article}/${id}`, {
    method: 'delete',
  });
}

