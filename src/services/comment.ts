import { request } from 'umi';
import url from '@/utils/url';

export async function fetch({ id, ...params }: Record<string, any>) {
  return request(`${url.comment}/${id || ''}`, {
    method: 'get',
    params,
  });
}

export async function replay(id?: string, data: Record<string, any> = {}) {
  return request(`${url.comment}/replay/${id}`, {
    method: 'post',
    data,
  });
}

export async function read(ids: string[]) {
  return request(`${url.comment}/read`, {
    method: 'post',
    data: { ids },
  });
}

export async function del(id: string) {
  return request(`${url.comment}/${id}`, {
    method: 'delete',
  });
}
