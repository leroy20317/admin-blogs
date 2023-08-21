/**
 * @author: leroy
 * @date: 2023-08-17 16:38
 * @description：clash
 */
import type { FC, Key } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { InputRef } from 'antd';
import { Button, Input, Popconfirm, Space } from 'antd';
import styles from './index.less';
import { QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { EditableProTable } from '@ant-design/pro-components';
import { createRule, delRule, fetch, updateRule } from '@/services/clash';

type Rule = API.Clash['rules'][number];

const Clash: FC = () => {
  const [types, setTypes] = useState<API.Clash['types']>([]);
  const [modes, setModes] = useState<API.Clash['modes']>([]);

  const actionRef = useRef<ActionType>();
  const [total, setTotal] = useState(0);
  const [editableKeys, setEditableRowKeys] = useState<Key[]>([]);

  const getTypeList = useCallback(() => {
    fetch({ mode: 'types' }).then((res) => {
      if (res.status === 'success') {
        setTypes(res.body);
      }
    });
  }, []);

  const getModeList = useCallback(() => {
    fetch({ mode: 'modes' }).then((res) => {
      if (res.status === 'success') {
        setModes(res.body);
      }
    });
  }, []);

  useEffect(() => {
    getModeList();
    getTypeList();
  }, []);

  const searchInput = useRef<InputRef>(null);

  const columns: ProColumns<Rule>[] = [
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
      width: 150,
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: 'Site',
      dataIndex: 'site',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Search Site`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => confirm()}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button onClick={clearFilters} size="small" style={{ width: 90 }}>
              Reset
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      filters: types.map((type: { name: any; id: any }) => ({ text: type.name, value: type.id })),
      key: 'type',
      valueType: 'select',
      valueEnum: types.reduce((prev, current) => {
        prev[current.id] = {
          text: current.name,
        };
        return prev;
      }, {}),
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
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
      renderText: (resolve) => (resolve === '1' ? 'resolve' : 'no-resolve'),

      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
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
        <Popconfirm
          key="delete"
          title="确认删除此行吗？"
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
          onConfirm={async () => {
            await delRule({ id: record._id });
            setTotal(total - 1);
            actionRef.current?.reloadAndRest?.();
          }}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <PageContainer
      className={styles.clash}
      pageHeaderRender={() => <h2 className={styles.header}>clash订阅列表 ({total})</h2>}
    >
      <EditableProTable<Rule>
        ghost
        rowKey="_id"
        actionRef={actionRef}
        recordCreatorProps={{
          position: 'top',
          record: () => ({
            _id: 'create',
            mode: '1',
            site: '',
            type: '1',
            resolve: '1',
            remark: '',
          }),
        }}
        columns={columns}
        request={async ({ pageSize, current }, sort, filter) => {
          const params = Object.entries(filter || {}).reduce(
            (prev, [key, value]) => {
              if (value)
                prev[key] = Array.isArray(value) && value.length > 0 ? value.join(',') : value;
              return prev;
            },
            { page: current || 1, size: pageSize || 10 },
          );

          const { body: res }: { body: API.ResponseList<API.Clash['rules']> } = await fetch({
            mode: 'rules',
            params,
          });
          console.log('sort, filter, params, res', sort, filter, params, res);
          if (Object.values(filter).filter((ele) => !!ele).length < 1) {
            setTotal(res.total);
          }

          return {
            data: res.data,
            total: res.total,
            success: true,
          };
        }}
        editable={{
          type: 'multiple',
          editableKeys,
          onSave: async (rowKey, { _id, index, ...data }, originRow) => {
            console.log(rowKey, _id, index, data, originRow);
            if (_id === 'create') {
              await createRule(data);
              setTotal(total + 1);
            } else {
              await updateRule({ id: _id, data });
            }
            actionRef.current?.reloadAndRest?.();
          },
          onChange: setEditableRowKeys,
        }}
        pagination={{
          size: 'default',
          hideOnSinglePage: true,
          position: ['bottomRight'],
        }}
      />
    </PageContainer>
  );
};

export default Clash;
