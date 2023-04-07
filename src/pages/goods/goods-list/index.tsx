import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm } from '@ant-design/pro-form';
import { rule, addRule, updateRule, removeRule } from './service';
import styles from './index.less';


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
      title: '编号',
      dataIndex: 'id',
    },
    {
      title: '类目',
      dataIndex: 'categoryId',
      // valueType: 'string',
    },
    {
      title: '封面图',
      dataIndex: 'pic',
      hideInSearch: true,
      valueType: 'image',
      // render: (_, record) => {
      //   return <img width={80} src={(record as any).pic} />
      // }


    },
    {
      title: '名称',
      dataIndex: 'name',
      render: (_, record) => {
        return <div style={{
          width: '250px',
          maxHeight: '80px',
        }} >
          {(record as any).name}
        </div >
      }


    },

    {
      title: '最小价',
      dataIndex: 'minPrice',
      valueType: 'money',
      hideInSearch: true,


    },

    {
      title: '推荐',
      dataIndex: 'recommendStatus',

      hideInSearch: true,


    },
    {
      title: '库存',
      dataIndex: 'stores',
      hideInSearch: true

    },

    {
      title: '售后',
      dataIndex: 'afterSale',
      hideInSearch: true

    },

    {
      title: '状态',
      dataIndex: 'status',
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
          详情
        </a>,
      ],
    },
  ]

  return (
    <PageContainer>
      <ProTable<TableListItem, TableListPagination>
        headerTitle="商品列表"
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
          width="100vw"
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
          <div className={styles.editconitem}>







            {
              columns.map((item: any) => {
                return item.valueType === 'option' ? null :
                  <span key={item?.dataIndex + 'updata'}  >
                    <span>{item?.title} :</span>
                    <input
                      placeholder={item?.title}
                      defaultValue={currentRow[item.dataIndex]}
                      onInput={e => {
                        setCurrentRow({ ...currentRow, [item.dataIndex]: e.currentTarget.value })
                      }}
                      width="md"
                      name={item?.dataIndex}
                    /></span>

              })
            }
          </div>
        </ModalForm> : null}

    </PageContainer >
  );
};

export default TableList;
