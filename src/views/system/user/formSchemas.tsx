import AvatarUpload from './AvatarUpload.vue';
import type { FormSchema } from '@/components/core/schema-form/';
import Api from '@/api/';

export const userSchemas: FormSchema<API.UserDto>[] = [
  {
    field: 'avatar',
    component: () => AvatarUpload,
    label: '新闻封面',
  },
  {
    field: 'deptId',
    component: 'TreeSelect',
    label: '新闻标签',
    componentProps: {
      fieldNames: {
        label: 'name',
        value: 'id',
      },
      getPopupContainer: () => document.body,
    },
    rules: [{ required: true, type: 'number' }],
  },
  {
    field: 'roleIds',
    component: 'Select',
    label: '所属类别',
    rules: [{ required: true, type: 'array' }],
    componentProps: {
      mode: 'multiple',
      request: async () => {
        const { items = [] } = await Api.systemRole.roleList({});
        return items.map((n) => ({ label: n.name, value: n.id }));
      },
    },
  },
  {
    field: 'username',
    component: 'Input',
    label: '新闻名称',
    rules: [{ required: true }],
  },
  {
    field: 'password',
    component: 'Input',
    label: '作者联系方式',
    // defaultValue: '123456@gmail.com',
    colProps: {
      span: 12,
    },
  },
  {
    field: 'remark',
    component: 'InputTextArea',
    label: '文章内容',
  },
  {
    field: 'status',
    component: 'RadioGroup',
    label: '状态',
    defaultValue: 1,
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
];
/**
 * @description 更新用户密码
 */
export const updatePswSchemas: FormSchema[] = [
  {
    field: 'password',
    component: 'Input',
    label: '新密码',
    rules: [{ required: true, type: 'string' }],
  },
];
/**
 * @description 将用户转移部门
 */
export const transferUserSchemas: FormSchema[] = [
  {
    field: 'departmentId',
    component: 'TreeSelect',
    label: '转移至',
    rules: [{ required: true, type: 'number' }],
  },
];
