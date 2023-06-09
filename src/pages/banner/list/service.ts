// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import { TableListItem } from './data';

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
   page?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    data: TableListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  }>('/api/admin/banner/list', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  }).then(res=>{
    res.data = res.data.map((item:any)=>{
      return {...item,key:item.id}
    })
    return res
  });
}


/** 新建规则 POST /api/rule */
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/admin/banner/change', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

