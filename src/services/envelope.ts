import { request } from '@umijs/max';
import url from '@/utils/url';

export async function fetch({ id, ...params }: Record<string, any>) {
  return request(`${url.envelope}/${id || ''}`, {
    method: 'get',
    params,
  });
}

export async function update({ id, data }: { id: any; data: Record<string, any> }) {
  return request(`${url.envelope}/${id || ''}`, {
    method: 'put',
    data,
  });
}

export async function create(data: Record<string, any>) {
  return request(url.envelope, {
    method: 'post',
    data,
  });
}

export async function del({ id }: { id: string | number }) {
  return request(`${url.envelope}/${id}`, {
    method: 'delete',
  });
}
