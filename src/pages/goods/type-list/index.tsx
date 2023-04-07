import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';



import { rule, addRule, updateRule, removeRule } from './service';

import type { TableListItem, TableListPagination } from './data';
/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: TableListItem) => {
  const hide = message.loading('正在操作');

  try {
    await addRule({ ...fields });
    hide();
    message.success('操作成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};


const TableList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const [currentRow, setCurrentRow] = useState<any>([]);

  const actionRef = useRef<ActionType>();

  /** 国际化配置 */
  const columns: ProColumns<TableListItem>[] = [
    {
      title: 'id',
      dataIndex: 'id',
      hideInSearch: true
    },
    {
      title: '是否使用',
      dataIndex: 'isUse',
      hideInSearch: true
      // valueType: 'string',
    },
    {
      title: '名称',
      dataIndex: 'name',
      hideInSearch: true

    },
    {
      title: '排序',
      dataIndex: 'paixu',
      hideInSearch: true

    },
    {
      title: '商品对应分类编号',
      dataIndex: 'pid',
      hideInSearch: true

    },
    {
      title: `操作`,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key={record.key + '_11'}
          onClick={() => {
            handleModalVisible(true);
            setCurrentRow(record)

          }}
        >
          更新
        </a>,
        <a
          key={record.key + '_22'}
          onClick={async () => {
            await handleAdd({ id: (record as any)?.id } as any);
            actionRef && (actionRef as any).reload();
          }}
        >
          删除
        </a>,

      ],
    },
  ]

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="类目列表"
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCurrentRow({})
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={rule}
        columns={columns}
      />

      {
        createModalVisible ? <ModalForm

          title={currentRow.id ? '修改id:' + currentRow.id : '新建'}
          width="400px"
          visible={createModalVisible}

          onVisibleChange={handleModalVisible}
          onFinish={async (value) => {
            const success = await handleAdd(currentRow as TableListItem);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >
          {
            columns.map((item: any) => {
              return item.valueType === 'option' ? null : <div key={item?.dataIndex + 'updata'}>
                {item?.title}
                <Input

                  placeholder={item?.title}
                  defaultValue={currentRow[item.dataIndex]}
                  onInput={e => {
                    setCurrentRow({ ...currentRow, [item.dataIndex]: e.currentTarget.value })


                  }}
                  width="md"
                  name={item?.dataIndex}
                /><br /><br />
              </div>


            })
          }
        </ModalForm> : null}

    </PageContainer >
  );
};

export default TableList;
