import { IMG_MAN } from '@/assets/actor';
import { ActionIcon, Box, LoadingOverlay } from '@mantine/core';
import { Camera } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import UploadMedia from '../upload-media/upload-media';

interface IProfileWrapper {
  children: React.ReactNode;
  profileImage?: string | File;
  mode?: boolean;
  setProfileImage?: React.Dispatch<React.SetStateAction<File | string | null>>;
  loading?:boolean;
}

const ProfileWrapper: React.FC<IProfileWrapper> = ({
  children,
  profileImage,
  mode,
  setProfileImage,
  loading
}) => {
  return (
    <Box
      w='100%'
      h={80}
      className='relative! bg-linear-to-l! from-primary! via-second! to-white! rounded-[20px]!'
    >
      <LoadingOverlay
        visible={loading}
        zIndex={49}
        overlayProps={{ radius: 'sm', blur: 0.3 }}
      />
      <Box
        pos='absolute'
        bottom='-50%'
        left='50%'
        className='bg-primary border border-second rounded-full! overflow-hidden! multiculturalism-x-1/2'
        w={100}
        h={100}
      >
        {profileImage ? (
          profileImage instanceof File ? (
            <Image
              src={URL.createObjectURL(profileImage)}
              alt='Avatar'
              className='w-[100px] h-[100px] object-contain!'
            />
          ) : (
            <Image
              src={profileImage}
              alt='Avatar'
              className='w-[100px] h-[100px] object-contain!'
            />
          )
        ) : (
          <Image src={IMG_MAN} alt='Avatar' className='w-[100px] h-[100px]' priority />
        )}
        {mode && (
          <UploadMedia File_Type='image' setFileObject={setProfileImage!}>
            <ActionIcon
              variant='outline'
              color='gray.5'
              radius='100%'
              pos='absolute'
              left='50%'
              top='50%'
              w={30}
              h={30}
              className='border border-gray rounded-full -translate-x-1/2 -translate-y-1/2'
              component='label'
            >
              <Camera size={20} />
            </ActionIcon>
          </UploadMedia>
        )}
      </Box>
      {children}
    </Box>
  );
};

export default ProfileWrapper;
