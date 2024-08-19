<template>
  <SplitPanel>
    <template #left-content>
      <DeptTree @select="onTreeSelect" @init="onDeptTreeInitData" />
    </template>
    <template #right-content>
      <DynamicTable
        header-title="新闻管理"
        show-index
        title-tooltip="请不要随意删除新闻，避免到影响用户的使用。"
        :data-request="loadTableData"
        :columns="columns"
        :scroll="{ x: 2000 }"
        :row-selection="rowSelection"
      >
        <template v-if="isCheckRows" #title>
          <Alert class="w-full" type="info" show-icon>
            <template #message>
              已选 {{ isCheckRows }} 项
              <a-button type="link" @click="rowSelection.selectedRowKeys = []">取消选择</a-button>
            </template>
          </Alert>
        </template>
        <template #toolbar>
          <UseModalComp />
          <a-button type="primary" @click="handleOpenUseModal">useModal组件方式</a-button>
          <a-button
            type="primary"
            :disabled="!$auth('system:user:create')"
            @click="openUserModal({})"
          >
            <Icon icon="ant-design:plus-outlined" /> 新增
          </a-button>
          <a-button
            type="error"
            :disabled="!isCheckRows || !$auth('system:user:delete')"
            @click="delRowConfirm(rowSelection.selectedRowKeys)"
          >
            <Icon icon="ant-design:delete-outlined" /> 删除
          </a-button>
        </template>
      </DynamicTable>
    </template>
  </SplitPanel>
</template>

<script setup lang="tsx">
  import { ref, computed, reactive } from 'vue';
  import { ExclamationCircleOutlined } from '@ant-design/icons-vue';
  import { Modal, Alert, Image } from 'ant-design-vue';
  import { userSchemas } from './formSchemas';
  import { baseColumns, type TableListItem, type TableColumnItem } from './columns';
  import DeptTree from './DeptTree.vue';
  import type { LoadDataParams } from '@/components/core/dynamic-table';
  import { SplitPanel } from '@/components/basic/split-panel';
  import { useTable } from '@/components/core/dynamic-table';
  import Api from '@/api/';
  import { useFormModal, useModal } from '@/hooks/useModal/';
  import { findPath } from '@/utils/common';

  defineOptions({
    name: 'SystemUser',
  });
  const [UseModalComp] = useModal();

  const state = reactive({
    visible: false,
  });
  const handleOpenUseModal = () => {
    UseModalComp.show({
      title: '目标导向与问题导向',
      content: (
        <>
          <Image src="3A%2F%2Fcms-bucket.ws.126.net%2F2024%2F0819%2Fdd48e7f1p00sift6e001sc0008c00b4c.png&thumbnail=300y400&quality=100&type=jpg" />
          <p>
            “坚持目标导向和问题导向相结合”，是新时代中国改革发展的重要特征，也是全面深化改革不断向纵深推进的重要经验。
          </p>
          <p>
            新时代以来，从党的十八届三中全会首次提出全面深化改革的总目标；到72次中央深改委（领导小组）会议锚定总目标进行顶层设计，审议通过超过600份改革文件……正是因为坚持目标引领，突出问题导向，改革精准发力、势如破竹，以前所未有的力度打开了崭新局面。
          </p>
          <p>
            党的二十届三中全会聚焦七个重点领域，提出300多项重要改革举措。进一步全面深化改革，要锚定继续完善和发展中国特色社会主义制度、推进国家治理体系和治理能力现代化这个总目标，落实习近平总书记“紧扣推进中国式现代化，坚持目标导向和问题导向相结合”的要求。
          </p>
          {/* 继续添加内容 */}
          <p>
            目标是行动的指南，问题是突破的方向。把进一步全面深化改革的全景图变为现实，很重要的一点就是处理好目标导向与问题导向的关系，既要有“咬定青山不放松”的战略定力，又要有“奔着问题去、盯着问题改”的行动自觉。
          </p>
          {/* 添加更多内容 */}
        </>
      ),
    });
  };

  const [DynamicTable, dynamicTableInstance] = useTable({ formProps: { autoSubmitOnEnter: true } });
  const [showModal] = useFormModal();

  const selectedDeptId = ref<number>();
  const deptTree = ref<any[]>([]);

  const rowSelection = ref({
    selectedRowKeys: [] as number[],
    onChange: (selectedRowKeys: number[], selectedRows: TableListItem[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      rowSelection.value.selectedRowKeys = selectedRowKeys;
    },
  });

  // 是否勾选了表格行
  const isCheckRows = computed(() => rowSelection.value.selectedRowKeys.length);

  const loadTableData = async (params: LoadDataParams) => {
    const data = await Api.systemUser.userList({
      ...params,
      deptId: selectedDeptId.value,
    });
    rowSelection.value.selectedRowKeys = [];
    return data;
  };

  /**
   * @description 打开操作用户弹窗
   */
  const openUserModal = async (record: Partial<TableListItem> = {}) => {
    const { userCreate, userUpdate } = Api.systemUser;
    const isUpdate = Boolean(record.id);

    const [formRef] = await showModal({
      modalProps: {
        title: `${isUpdate ? '编辑' : '新增'}用户`,
        width: 700,
        onFinish: async (values) => {
          console.log('新增/编辑用户', values);
          values.id = record.id;
          if (record.id) {
            await userUpdate({ id: record.id }, values);
          } else {
            await userCreate(values);
          }
          dynamicTableInstance?.reload();
        },
      },
      formProps: {
        labelWidth: 100,
        schemas: userSchemas,
        autoSubmitOnEnter: true,
      },
    });

    if (record.id) {
      const { roles, dept } = await Api.systemUser.userRead({ id: record.id });
      formRef?.setFieldsValue({
        ...record,
        deptId: dept.id,
        roleIds: roles.map((item) => item.id),
      });

      formRef?.updateSchema([
        { field: 'username', componentProps: { disabled: true } },
        { field: 'password', required: false },
      ]);
    } else {
      formRef?.updateSchema([
        { field: 'username', componentProps: { disabled: false } },
        {
          field: 'password',
          required: true,
          // defaultValue: 'a123456',
          componentProps: { placeholder: '请输入' },
        },
      ]);
    }

    formRef?.updateSchema([
      {
        field: 'deptId',
        componentProps: {
          treeDefaultExpandedKeys: findPath(deptTree.value, formRef?.getFieldsValue().deptId) || [],
          treeData: deptTree.value,
        },
      },
    ]);
  };

  /**
   * @description 表格删除行
   */
  const delRowConfirm = async (userId: number | number[]) => {
    const { userDelete } = Api.systemUser;
    if (Array.isArray(userId)) {
      Modal.confirm({
        title: '确定要删除所选的用户吗?',
        icon: <ExclamationCircleOutlined />,
        centered: true,
        onOk: async () => {
          await userDelete({ id: userId.join(',') });
          dynamicTableInstance?.reload();
        },
      });
    } else {
      await userDelete({ id: userId }).finally(dynamicTableInstance?.reload);
    }
  };

  const onTreeSelect = (id: number) => {
    selectedDeptId.value = id;
    dynamicTableInstance?.reload();
  };
  const onDeptTreeInitData = (treeData) => {
    deptTree.value = treeData;
  };

  const columns: TableColumnItem[] = [
    ...baseColumns,
    {
      title: '操作',
      width: 80,
      dataIndex: 'ACTION',
      fixed: 'right',
      actions: ({ record }) => [
        {
          icon: 'ant-design:edit-outlined',
          tooltip: '编辑用户资料',
          auth: {
            perm: 'system:user:update',
            effect: 'disable',
          },
          onClick: () => openUserModal(record),
        },
        {
          icon: 'ant-design:delete-outlined',
          color: 'red',
          tooltip: '删除此账号',
          auth: 'system:user:delete',
          popConfirm: {
            title: '你确定要删除吗？',
            placement: 'left',
            onConfirm: () => delRowConfirm(record.id),
          },
        },
      ],
    },
  ];
</script>

<style></style>
