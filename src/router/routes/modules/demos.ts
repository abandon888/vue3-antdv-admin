import type { RouteRecordRaw } from 'vue-router';
import { t } from '@/hooks/useI18n';

const moduleName = 'demos';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/demos',
    name: moduleName,
    redirect: { name: `${moduleName}-custom-modal` },
    meta: {
      title: t('routes.demo.demo'),
      icon: 'ant-design:desktop-outlined',
    },
    children: [
      {
        path: 'custom-modal',
        name: `${moduleName}-custom-modal`,
        meta: {
          title: t('routes.demo.modal'),
          icon: 'ant-design:desktop-outlined',
          keepAlive: false,
        },
        component: () => import('@/views/demos/news.vue'),
      },
    ],
  },
];

export default routes;
