import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Input } from 'antd';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { PageContainer, } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { ModalForm } from '@ant-design/pro-form';
import { rule, addRule, getDoodsDetailed, updateRule, removeRule } from './service';
import styles from './index.less';

import MyEditor from '../goods-list/components/Edit'
import Upload from '../goods-list/components/UPload'
import PicsList from '../goods-list/components/PicsList'


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



  const [selectId, setSelectId] = useState(-1);

  //选择按钮事件 详情
  useEffect(() => {
    if (selectId > -1) {
      if (selectId) {
        getDoodsDetailed({ id: selectId }).then((res: any) => {
          setCurrentRow(res.data);
          handleModalVisible(true)
        })
      } else {
        setCurrentRow({} as any);
        handleModalVisible(true)
      }
    }
  },
    [selectId],
  );

  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const [currentRow, setCurrentRow] = useState<{
    id: String,
    afterSale: String, categoryId: String, characteristic: String, content: String, feeType: String,
    isFree: String, logisticsId: String, minPrice: String, name: String, originalPrice: String,
    pic: String, recommendStatus: String, status: String, stores: String
  }>({
    id: '', afterSale: '', categoryId: '', characteristic: '', content: '', feeType: '',
    isFree: '', logisticsId: '', minPrice: '', name: '', originalPrice: '',
    pic: '', recommendStatus: '', status: '', stores: ''

  });
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
      title: '原始价',
      dataIndex: 'originalPrice',
      hideInSearch: true,
      hideInTable: true,
    },

    {
      title: '是否免运费',
      dataIndex: 'isFree',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '费用类型',
      dataIndex: 'feeType',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '物流Id',
      dataIndex: 'logisticsId',
      hideInSearch: true,
      hideInTable: true,
    },
    {
      title: '简介',
      dataIndex: 'characteristic',
      hideInSearch: true,
      hideInTable: true,
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
      title: '内容',
      dataIndex: 'content',
      hideInSearch: true,
      hideInTable: true,
    },



    {
      title: `操作`,
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key={record.key + '_11'}
          onClick={() => {
            setSelectId((record as any).id)
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
              setSelectId(0);
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

          onVisibleChange={
            (e) => {
              if (!e) {
                setSelectId(-1);
              }
              handleModalVisible(e)
            }

          }
          onFinish={async (value) => {
            const success = await handleAdd(currentRow as any);
            if (success) {
              handleModalVisible(false);
              setSelectId(-1);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}

        >
          <div className={styles.editconitem}>

            {
              columns.map((item: any) => {

                return item.dataIndex === 'content' ? < div key={item?.dataIndex + 'updata'}>

                  <MyEditor defaultValue={currentRow[item.dataIndex]} onchange={(e: any) => {
                    setCurrentRow((d: any = {}) => { return { ...d, [item.dataIndex]: e } })
                  }}  > </MyEditor>
                </div> :
                  item.dataIndex === 'pic' ?
                    <div style={{ width: '100%', marginLeft: '30px' }} key={item?.dataIndex + 'updata'}> <Upload
                      title='封面:' showUploadList={false} Defurl={currentRow[item.dataIndex]} onChange={(e: any) => {
                        setCurrentRow((d: any = {}) => { return { ...d, [item.dataIndex]: e } })
                      }}
                    ></Upload></div>
                    : item.valueType === 'option' ? null :
                      <span key={item?.dataIndex + 'updata'}  >
                        <span>{item?.title} :</span>
                        <input
                          placeholder={item?.title}
                          defaultValue={currentRow[item.dataIndex]}
                          onInput={e => {
                            setCurrentRow((d: any = {}) => { return { ...d, [item.dataIndex]: e?.currentTarget?.value || '' } })

                          }}
                          width="md"
                          name={item?.dataIndex}
                        /></span>

              })
            }

          </div>
          {currentRow.id &&
            <div >
              <PicsList goodsId={currentRow.id} defaultValue={currentRow['picsList'] || []} ></PicsList>
            </div>}
        </ModalForm> : null
      }

    </PageContainer >
  );
};

export default TableList;
