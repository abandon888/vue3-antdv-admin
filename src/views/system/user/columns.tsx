import { Image, Space, Tag } from 'ant-design-vue';
import type { TableColumn } from '@/components/core/dynamic-table';
import { formatToDateTime } from '@/utils/dateUtil';
import { baseApiUrl } from '@/utils/request';

export type TableListItem = API.UserEntity;
export type TableColumnItem = TableColumn<TableListItem>;

export const getAvatarUrl = (path: string) => {
  return /^https?:\/\//.test(path) ? path : baseApiUrl + path;
};

export const baseColumns: TableColumnItem[] = [
  {
    title: '新闻封面',
    width: 120,
    dataIndex: 'avatar',
    hideInSearch: true,
    customRender: ({ record }) => <Image src={getAvatarUrl(record.avatar)} />,
  },
  {
    title: '新闻标题',
    width: 120,
    dataIndex: 'username',
  },
  {
    title: '新闻标签',
    dataIndex: 'dept',
    hideInSearch: true,
    width: 180,
    customRender: ({ record }) => {
      return <Tag>{record.dept?.name}</Tag>;
    },
  },
  {
    title: '所属类别',
    dataIndex: 'roleNames',
    hideInSearch: true,
    width: 180,
    customRender: ({ record }) => (
      <Space>
        {record.roles.map((item) => (
          <Tag color={'success'} key={item.id}>
            {item.name}
          </Tag>
        ))}
      </Space>
    ),
  },
  {
    title: '作者邮箱',
    width: 120,
    dataIndex: 'email',
  },
  {
    title: '文章内容',
    width: 200,
    dataIndex: 'remark',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 100,
    hideInSearch: true,
    formItemProps: {
      component: 'Select',
      componentProps: {
        options: [
          {
            label: '启用',
            value: 1,
          },
          {
            label: '禁用',
            value: 0,
          },
        ],
      },
    },
    customRender: ({ record }) => {
      const isEnable = ~~record.status === 1;
      return <Tag color={isEnable ? 'success' : 'red'}>{isEnable ? '启用' : '禁用'}</Tag>;
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
    width: 120,
    hideInSearch: true,
    customRender: ({ record }) => {
      return formatToDateTime(record.createdAt);
    },
  },
  {
    title: '修改时间',
    dataIndex: 'updatedAt',
    width: 120,
    hideInSearch: true,
    customRender: ({ record }) => {
      return formatToDateTime(record.createdAt);
    },
  },
];
