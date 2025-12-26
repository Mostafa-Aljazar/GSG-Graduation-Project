import { getSecurityTasks } from '@/actions/actor/securities/tasks/getSecurityTasks';
import { IMG_FAVICON } from '@/assets/common';
import SecurityTasksFeed from '@/components/actor/security/tasks/security-tasks-feed';
import SecurityTasksHeaderTabs from '@/components/actor/security/tasks/security-tasks-tabs';
import { getSecurityRoutes } from '@/constants/routes';
import { APP_URL } from '@/constants/';
import { TASKS_TABS } from '@/types/actor/common/index.type';
import { Stack } from '@mantine/core';
import { Metadata, ResolvingMetadata } from 'next';

const FALLBACK = {
  TITLE: 'مهام الحراس | AL-AQSA Camp',
  DESCRIPTION: 'عرض جميع المهام الخاصة بالحراس على منصة مخيم الأقصى.',
  IMAGE: IMG_FAVICON.src,
};

interface ISecurityTasksProps {
  params: Promise<{ security: string }>;
  searchParams: Promise<{ 'tasks-tab'?: TASKS_TABS }>;
}

export async function generateMetadata(
  { params, searchParams }: ISecurityTasksProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { security: securityId } = await params;

  const { 'tasks-tab': tabParam } = await searchParams;
  const tab = tabParam || TASKS_TABS.COMPLETED_TASKS;

  const previousImages = (await parent)?.openGraph?.images || [];

  try {
    const response = await getSecurityTasks({
      taskType: tab,
      page: 1,
      limit: 1,
    });

    const totalTasks = response?.pagination.totalItems || 0;
    const title = `مهام الحارس (${totalTasks}) | AL-AQSA Camp` || FALLBACK.TITLE;
    const description =
      `عدد المهام الخاصة بالحارس: ${totalTasks}. تصفح جميع المهام على منصة مخيم الأقصى.` ||
      FALLBACK.DESCRIPTION;

    return {
      title,
      description,
      metadataBase: new URL(APP_URL),
      openGraph: {
        siteName: 'AL-AQSA Camp',
        title,
        description,
        type: 'website',
        url: APP_URL + getSecurityRoutes({ securityId }).TASKS,
        images: [
          { url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'Security Tasks' },
          ...previousImages,
        ],
        locale: 'ar',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [FALLBACK.IMAGE],
      },
    };
  } catch {
    return {
      title: FALLBACK.TITLE,
      description: FALLBACK.DESCRIPTION,
      metadataBase: new URL(APP_URL),
      openGraph: {
        siteName: 'AL-AQSA Camp',
        title: FALLBACK.TITLE,
        description: FALLBACK.DESCRIPTION,
        type: 'website',
        url: APP_URL + getSecurityRoutes({ securityId }).TASKS,
        images: [
          { url: FALLBACK.IMAGE, width: 600, height: 600, alt: 'Security Tasks' },
          ...previousImages,
        ],
        locale: 'ar',
      },
      twitter: {
        card: 'summary_large_image',
        title: FALLBACK.TITLE,
        description: FALLBACK.DESCRIPTION,
        images: [FALLBACK.IMAGE],
      },
    };
  }
}
export default async function Security_Tasks() {
  return (
    <Stack justify={'center'} align={'center'} pt={20} w={'100%'} px={10}>
      <SecurityTasksHeaderTabs />
      <SecurityTasksFeed />
    </Stack>
  );
}
