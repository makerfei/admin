
import React, {  useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { rule} from './service';
import type { TableListItem, TableListPagination } from './data';
/**
 * 添加节点
 *
 * @param fields
 */





const TableList: React.FC = () => {
 
  const actionRef = useRef<ActionType>();
  

  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
     // valueType:'index',
      tip: '用户唯一Id',
    },
    {
      title: '用户名称',
      dataIndex: 'username',
     // valueType: 'string',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
     // sorter: true,
     // hideInForm: true,
     // renderText: (val: string) => `${val}万`,
    },
    {
      title: '密码',
      dataIndex: 'password',
      hideInSearch: true,
    },
    {
      title: '微信openid',
      dataIndex: 'weixin_openid',
     
    },
    {
      title: '注册时间',
      dataIndex: 'register_time',
      valueType: 'dateTime',
      hideInSearch: true
    },
    {
      title: '最后登录时间',
      dataIndex: 'last_login_time',
      valueType: 'dateTime',
      hideInSearch: true
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="用户列表"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
       
        request={rule}
        columns={columns}
       
      />
    
    </PageContainer>
  );
};

export default TableList;
