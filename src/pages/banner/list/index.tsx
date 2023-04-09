import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input } from 'antd';
import React, { useState, useRef, useCallback } from 'react';
import { PageContainer, } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-form';

import Upload from '../../goods/goods-list/components/UPload'

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
      title: '图片',
      dataIndex: 'picUrl',
      hideInSearch: true,
      valueType: 'image',

    },
    {
      title: '链接',
      dataIndex: 'linkUrl',
      hideInSearch: true,
      render: (_, record) => {
        return <div style={{
          width: '250px',
          maxHeight: '80px',
        }} >
          {(record as any).linkUrl}
        </div >
      }
      // valueType: 'string',
    },
    {
      title: '标题',
      dataIndex: 'title',
      hideInSearch: true

    },
    {
      title: '排序',
      dataIndex: 'paixu',
      hideInSearch: true

    },
    {
      title: '标注',
      dataIndex: 'remark',
      hideInSearch: true

    },

    {
      title: '类型',
      dataIndex: 'type',
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
              return item.valueType === 'option' ? null : item.valueType === 'image' ?
                <div style={{ width: '100%' }} key={item?.dataIndex + 'updata'}> <Upload
                  title='封面:' cutSize={2} showUploadList={false} Defurl={currentRow[item.dataIndex]} onChange={(e: any) => {
                    setCurrentRow((d: any = {}) => { return { ...d, [item.dataIndex]: e } })
                  }}
                ></Upload></div> : <div key={item?.dataIndex + 'updata'}>
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
        </ModalForm> : null
      }

    </PageContainer >
  );
};

export default TableList;
