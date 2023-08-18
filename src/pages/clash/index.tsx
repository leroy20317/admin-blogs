/**
 * @author: leroy
 * @date: 2023-08-17 16:38
 * @description：clash
 */
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { FilterValue, SorterResult } from 'antd/es/table/interface';
import { FC, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Col, List, message, Popconfirm, Row, Space, Tooltip, Table } from 'antd';
import styles from './index.less';
import { history, useModel } from 'umi';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import url from '@/utils/url';
import { del } from '@/services/article';
import moment from 'moment';
import type { ProColumns } from '@ant-design/pro-components';
import { EditableProTable, ProCard, ProFormField, ProFormRadio } from '@ant-design/pro-components';

interface TableParams {
  pagination?: TablePaginationConfig;
  sortField?: string;
  sortOrder?: string;
  filters?: Record<string, FilterValue | null>;
}

const Clash: FC = () => {
  const { rules, getRuleList, loading, getTypeList, types, getModeList, modes } = useModel(
    'clash',
    (model) => model,
  );

  const [tableParams, setTableParams] = useState<TableParams>({
    pagination: {
      current: 1,
      pageSize: 10,
    },
  });

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    getRuleList();
    getModeList();
    getTypeList();
  }, []);

  const pageChange = (page: number) => {
    getRuleList({ page });
  };

  // 新窗口打开文章
  const view = (id: string) => {
    window.open(`${url.webHost}/article/${id}`);
  };
  // 编辑文章
  const edit = (id: string) => {
    history.push(`/article-info?id=${id}`);
  };
  // 删除文章
  const deleteItem = (id: string) => {
    del({ id }).then((res) => {
      if (res.status === 'success') {
        message.success(res.message, 1);
        pageChange(rules.page || 1);
      } else {
        message.error(res.message || '删除失败', 1);
      }
    });
  };

  // const columns: ColumnsType<API.Clash['rules'][number]> = [
  //   {
  //     title: 'Mode',
  //     dataIndex: 'mode',
  //     filters: modes.map((mode) => ({ text: mode.name, value: mode.id })),
  //     render: (mode) => modes.find((ele) => ele.id === mode)?.name,
  //     width: '15%',
  //   },
  //   {
  //     title: 'Site',
  //     dataIndex: 'site',
  //     width: '30%',
  //   },
  //   {
  //     title: 'Type',
  //     dataIndex: 'type',
  //     filters: types.map((type) => ({ text: type.name, value: type.id })),
  //     render: (type) => types.find((ele) => ele.id === type)?.name,
  //     width: '15%',
  //   },
  //   {
  //     title: 'Resolve',
  //     dataIndex: 'resolve',
  //     filters: [
  //       { text: 'True', value: 1 },
  //       { text: 'False', value: 0 },
  //     ],
  //     render: (resolve) => (resolve ? 'resolve' : 'no-resolve'),
  //     width: '5%',
  //   },
  //   {
  //     title: 'Remark',
  //     dataIndex: 'remark',
  //     width: '20%',
  //   },
  //   {
  //     title: 'Action',
  //     width: '15%',
  //     render: (_, item) => {
  //       return (
  //         <Space align="start" size="middle">
  //           <Tooltip title="Edit Rule">
  //             <EditOutlined className={styles.icon} onClick={() => edit(item._id)} />
  //           </Tooltip>
  //           <Popconfirm
  //             title="是否删除该规则?"
  //             onConfirm={() => deleteItem(item._id)}
  //             okText="确定"
  //             cancelText="取消"
  //           >
  //             <DeleteOutlined className={`${styles.icon} ${styles.delete}`} />
  //           </Popconfirm>
  //         </Space>
  //       );
  //     },
  //   },
  // ];

  const columns: ProColumns<API.Clash['rules'][number]>[] = [
    {
      title: 'Mode',
      dataIndex: 'mode',
      filters: modes.map((mode) => ({ text: mode.name, value: mode.id })),
      valueType: 'select',
      valueEnum: modes.reduce((prev, current) => {
        prev[current.id] = {
          text: current.name,
        };
        return prev;
      }, {}),
      width: '10%',
      formItemProps: (form) => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      // 第一行不允许编辑
      editable: (text, record, index) => {
        return index !== 0;
      },
    },
    {
      title: 'Site',
      dataIndex: 'site',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      filters: types.map((type) => ({ text: type.name, value: type.id })),
      key: 'type',
      valueType: 'select',
      valueEnum: types.reduce((prev, current) => {
        prev[current.id] = {
          text: current.name,
        };
        return prev;
      }, {}),
      width: '15%',
    },
    {
      title: 'Resolve',
      dataIndex: 'resolve',
      filters: [
        { text: 'resolve', value: '1' },
        { text: 'no-resolve', value: '0' },
      ],
      valueType: 'select',
      valueEnum: {
        '1': {
          text: 'resolve',
        },
        '0': {
          text: 'no-resolve',
        },
      },
      render: (resolve) => (resolve ? 'resolve' : 'no-resolve'),
      width: 120,
    },
    {
      title: 'Remark',
      dataIndex: 'remark',
    },
    {
      title: 'Actions',
      valueType: 'option',
      width: 150,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record._id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            console.log('delete');
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  const getRandomuserParams = (params: TableParams) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
  });

  return (
    <PageContainer
      className={styles.clash}
      pageHeaderRender={() => <h2 className={styles.header}>clash订阅列表 ({rules?.total})</h2>}
    >
      <EditableProTable<API.Clash['rules'][number]>
        rowKey="_id"
        recordCreatorProps={{
          position: 'top',
          record: () => ({
            _id: Math.random().toString(),
            mode: '1',
            site: '',
            type: '1',
            resolve: '1',
            remark: '',
          }),
        }}
        loading={loading}
        columns={columns}
        // request={async () => ({
        //   data: defaultData,
        //   total: 3,
        //   success: true,
        // })}
        value={rules.data}
        onChange={(...params) => {
          console.log('onChange', params);
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, data, row) => {
            console.log(rowKey, data, row);
          },
          onChange: setEditableRowKeys,
        }}
        pagination={{
          size: 'default',
          hideOnSinglePage: true,
          position: ['bottomRight'],
          current: rules.page,
          pageSize: 10,
          total: rules.total,
          onChange: pageChange,
        }}
      />
    </PageContainer>
  );
};

export default Clash;
