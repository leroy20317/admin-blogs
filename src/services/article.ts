import { request } from '@umijs/max';
import url from '@/utils/url';

interface Params extends Record<string, any> {
  id?: number | string;
}

export async function fetch({ id, ...params }: any) {
  return request(`${url.article}/${id || ''}`, {
    method: 'get',
    params,
  });
}

export async function update({ id, data }: { id: any; data: Record<string, any> }) {
  return request(`${url.article}/${id || ''}`, {
    method: 'put',
    data,
  });
}

export async function create(data: Params) {
  return request(url.article, {
    method: 'post',
    data,
  });
}

export async function del({ id }: Params) {
  return request(`${url.article}/${id}`, {
    method: 'delete',
  });
}
