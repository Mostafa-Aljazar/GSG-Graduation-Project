import React from 'react';

export default function Loading() {
  return (
    <div
      dir='rtl'
      className='flex justify-center items-center px-4 min-h-screen'
      style={{ background: 'var(--color-white)', fontFamily: 'var(--font-family-sf-pro-display)' }}
    >
      <div className='w-full max-w-md text-right'>
        <div
          className='mx-auto border-4 rounded-full w-24 h-24 animate-spin'
          style={{
            borderColor: 'var(--color-second-light)',
            borderTopColor: 'var(--color-primary)',
          }}
        />

        <h2 className='mt-6 font-semibold text-2xl' style={{ color: 'var(--color-dark)' }}>
          جاري التحميل
        </h2>
        <p className='mt-2' style={{ color: 'var(--color-dark)' }}>
          نقوم بإعداد المحتوى — قد يستغرق ذلك بضع ثوانٍ.
        </p>

        <div className='space-y-3 mt-6'>
          <div
            className='rounded-full h-3 overflow-hidden'
            style={{ background: 'var(--color-second-light)' }}
          >
            <div
              className='rounded-full h-3 animate-pulse'
              style={{ width: '66%', background: 'var(--color-primary)' }}
            />
          </div>
          <div
            className='rounded-full h-3 overflow-hidden'
            style={{ background: 'var(--color-second-light)' }}
          >
            <div
              className='rounded-full h-3 animate-pulse'
              style={{ width: '50%', background: 'var(--color-primary)' }}
            />
          </div>
          <div
            className='rounded-full h-3 overflow-hidden'
            style={{ background: 'var(--color-second-light)' }}
          >
            <div
              className='rounded-full h-3 animate-pulse'
              style={{ width: '40%', background: 'var(--color-primary)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
