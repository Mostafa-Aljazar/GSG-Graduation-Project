import { IMG_MAN } from '@/assets/actor';
import { ActionIcon, Box, LoadingOverlay } from '@mantine/core';
import { Camera } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import UploadMedia from '../upload-media/upload-media';

interface IProfileWrapper {
  children: React.ReactNode;
  profileImage?: string | File | null;
  mode?: boolean;
  setProfileImage?: React.Dispatch<React.SetStateAction<File | string | null>>;
  loading?: boolean;
}

const ProfileWrapper: React.FC<IProfileWrapper> = ({
  children,
  profileImage,
  mode,
  setProfileImage,
  loading,
}) => {
  return (
    <Box pos='relative' p={20}>
      <LoadingOverlay visible={loading} zIndex={49} overlayProps={{ radius: 'sm', blur: 0.3 }} />

      <Box
        w='100%'
        h={80}
        className='relative bg-gradient-to-l from-primary via-second to-white rounded-[20px]'
      >
        <Box
          pos='absolute'
          bottom={-50}
          left='50%'
          style={{ transform: 'translateX(-50%)' }} // مركزة أفقيًا بدقة
          className='shadow-xl border-4 border-white rounded-full overflow-hidden'
          w={100}
          h={100}
        >
          {profileImage ? (
            profileImage instanceof File ? (
              <Image
                src={URL.createObjectURL(profileImage)}
                alt='صورة الملف الشخصي'
                fill
                className='object-cover'
                priority
              />
            ) : (
              <Image
                src={profileImage}
                alt='صورة الملف الشخصي'
                fill
                className='object-cover'
                priority
              />
            )
          ) : (
            <Image src={IMG_MAN} alt='صورة افتراضية' fill className='object-cover' priority />
          )}

          {mode && setProfileImage && (
            <UploadMedia File_Type='image' setFileObject={setProfileImage}>
              <ActionIcon
                variant='filled'
                color='white'
                radius='xl'
                size='lg'
                pos='absolute'
                top='50%'
                left='50%'
                style={{ transform: 'translate(-50%, -50%)' }}
                className='bg-primary/80 hover:bg-primary shadow-lg border border-white'
                component='label'
              >
                <Camera size={20} strokeWidth={2.5} />
              </ActionIcon>
            </UploadMedia>
          )}
        </Box>
      </Box>

      <Box mt={60}>{children}</Box>
    </Box>
  );
};

export default ProfileWrapper;
