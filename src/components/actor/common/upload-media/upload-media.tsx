'use client';

import { Image as ImageIcon, ImagePlay } from 'lucide-react';
import { Group, Stack, FileButton } from '@mantine/core';
import { cn } from '@/utils/cn';
import React from 'react';

type Props = {
  File_Type: 'image' | 'video';
  setFileObject: React.Dispatch<React.SetStateAction<File | string | null>>;
  classes?: string;
  children?: React.ReactNode;
};

export default function UploadMedia({
  File_Type,
  setFileObject,
  classes,
  children,
}: Props) {
  return (
    <Group gap='sm' align='flex-start'>
      <Stack gap='sm' className='flex-1'>
        <Group gap='xs'>
          {File_Type === 'image' ? (
            <FileButton accept='image/*' onChange={setFileObject}>
              {(props) =>
                children ? (
                  <div
                    {...props}
                    className={cn('inline-block mr-1 cursor-pointer', classes)}
                  >
                    {children}
                  </div>
                ) : (
                  <ImageIcon
                    {...props}
                    width={20}
                    height={20}
                    className={cn('inline-block mr-1 cursor-pointer', classes)}
                  />
                )
              }
            </FileButton>
          ) : File_Type === 'video' ? (
            <FileButton accept='video/*' onChange={setFileObject}>
              {(props) =>
                children ? (
                  <div
                    {...props}
                    className={cn('inline-block mr-1 cursor-pointer', classes)}
                  >
                    {children}
                  </div>
                ) : (
                  <ImagePlay
                    {...props}
                    width={20}
                    height={20}
                    className={cn('inline-block mr-1 cursor-pointer', classes)}
                  />
                )
              }
            </FileButton>
          ) : null}
        </Group>
      </Stack>
    </Group>
  );
}
