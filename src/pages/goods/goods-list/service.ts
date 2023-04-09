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
  }>('/api/admin/goods/list', {
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



export async function getDoodsDetailed(params: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/admin/goods/detail', {
    params: params,
    method: 'get',
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/rule', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(data: { [key: string]: any }, options?: { [key: string]: any }) {
  return request<TableListItem>('/api/admin/goods/change', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(data: { key: number[] }, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

//上传图片
export async function uploadImg(data:any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/dfs/upload/file', {
    data,
    method:  'POST',
    ...(options || {}),
  });
}

//更新图片商品图
export async function picsAdd(data:any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/admin/goods/picsAdd', {
    data,
    method:  'POST',
    ...(options || {}),
  });
}
//删除图片商品图
export async function picsDel(data:any, options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/admin/goods/picsDel', {
    data,
    method:  'POST',
    ...(options || {}),
  });
}
