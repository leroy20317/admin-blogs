import { request } from 'umi';
import url from '@/utils/url';


export async function fetchInfo() {
  return request(url.info);
}
