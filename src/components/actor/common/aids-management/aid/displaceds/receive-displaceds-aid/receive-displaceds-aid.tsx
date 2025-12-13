'use client';
import { Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import ReceiveDisplacedAidModal from './receive_displaced-aid-modal';

interface IReceiveDisplacedAidProps {
  displacedId: string;
  aidId: string;
  disabled?: boolean;
}

export default function ReceiveDisplacedAid({
  displacedId,
  aidId,
  disabled = false,
}: IReceiveDisplacedAidProps) {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Button
        size='xs'
        type='submit'
        className='bg-primary! shadow-md!'
        onClick={open}
        fw={300}
        fz={14}
        disabled={disabled}
      >
        تسليم
      </Button>
      <ReceiveDisplacedAidModal
        close={close}
        opened={opened}
        displacedId={displacedId}
        aidId={aidId}
      />
    </>
  );
}
