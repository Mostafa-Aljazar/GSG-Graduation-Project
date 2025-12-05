'use client';

import { Stack, SimpleGrid, Group, Text, Divider, Card, Badge } from '@mantine/core';
import { TAid } from '@/types/actor/common/aids-management/aids-management.types';
import {
  DISTRIBUTION_MECHANISM,
  QUANTITY_AVAILABILITY,
  getAidsTypes,
} from '@/types/actor/common/index.type';
import PortionsManagementModal from '../common/aid-form/distribution-methods/portions-management';

interface Props {
  aidData: TAid;
}

export default function CommonAidView({ aidData }: Props) {
  if (!aidData) return null;

  return (
    <Stack gap='lg'>
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing='lg'>
        <Card p='md' radius='md' withBorder>
          <Stack gap='sm'>
            <Group>
              <Text fw={500}>عنوان المساعدة</Text>
            </Group>
            <Text size='sm'>{aidData.aidName || '-'}</Text>
            <Divider />

            <Group>
              <Text fw={500}>نوع المساعدة</Text>
            </Group>
            <Text size='sm'>{getAidsTypes()[aidData.aidType]?.label || '-'}</Text>
            <Divider />

            <Group>
              <Text fw={500}>محتوى المساعدة</Text>
            </Group>
            <Text size='sm'>{aidData.aidContent || '-'}</Text>
            <Divider />

            <Group>
              <Text fw={500}>موعد التسليم</Text>
            </Group>
            <Text size='sm'>
              {aidData.deliveryDate ? new Date(aidData.deliveryDate).toLocaleString() : '-'}
            </Text>
            <Divider />

            <Group>
              <Text fw={500}>مكان التسليم</Text>
            </Group>
            <Text size='sm'>{aidData.deliveryLocation || '-'}</Text>
          </Stack>
        </Card>

        <Card p='md' radius='md' withBorder>
          <Stack gap='sm'>
            <Group>
              <Text fw={500}>يلزم تأمين</Text>
            </Group>
            <Badge color={aidData.securityRequired ? 'green' : 'gray'} variant='filled'>
              {aidData.securityRequired ? 'نعم' : 'لا'}
            </Badge>
            <Divider />

            <Group>
              <Text fw={500}>مقدار الكمية</Text>
            </Group>
            <Text size='sm'>{aidData.quantityAvailability}</Text>

            {aidData.quantityAvailability === QUANTITY_AVAILABILITY.LIMITED && (
              <>
                <Divider />
                <Group>
                  <Text fw={500}>الكمية الموجودة</Text>
                </Group>
                <Text size='sm'>{aidData.existingQuantity}</Text>
              </>
            )}

            <Divider />
            <Group>
              <Text fw={500}>آلية التوزيع</Text>
            </Group>
            <Text size='sm'>
              {aidData.distributionMechanism === DISTRIBUTION_MECHANISM.DELEGATES_LISTS
                ? 'بناءً على كشوفات المناديب'
                : 'بناءً على العائلات النازحة'}
            </Text>
          </Stack>
        </Card>
      </SimpleGrid>

      <Card p='md' radius='md' withBorder>
        <Stack gap='sm'>
          <Group>
            <Text fw={500}>الملحقات</Text>
          </Group>
          <Text size='sm'>{aidData.additionalNotes || '-'}</Text>
          <Divider />

          <PortionsManagementModal
            selectedCategories={aidData.selectedCategories || []}
            onCategoriesChange={() => {}}
            onPortionChange={() => {}}
            isDisabled={true}
          />
        </Stack>
      </Card>
    </Stack>
  );
}
