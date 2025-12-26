import Link from 'next/link';
import { AlertCircle, Home, Mail } from 'lucide-react';

export default function NotFound() {
  return (
    <div
      dir='rtl'
      className='relative flex flex-col justify-center items-center px-6 min-h-screen overflow-hidden'
      style={{
        background: 'var(--color-white)',
        fontFamily: 'var(--font-family-sf-pro-display), Arial, sans-serif',
      }}
    >
      <div
        className='-z-10 absolute inset-0 opacity-10'
        style={{ background: 'var(--color-second-light)' }}
      />

      <div className='max-w-lg text-center'>
        <div className='inline-flex justify-center items-center mb-10 animate-bounce-in'>
          <div
            className='shadow-2xl p-5 rounded-full'
            style={{ background: 'var(--color-second-light)' }}
          >
            <AlertCircle size={50} strokeWidth={2} className='text-primary' />
          </div>
        </div>

        <h1
          className='font-bold text-2xl sm:text-3xl leading-tight animate-fade-in-left'
          style={{ color: 'var(--color-dark)' }}
        >
          الصفحة غير موجودة
        </h1>

        <p
          className='mt-5 text-lg sm:text-xl leading-relaxed animate-fade-in-right'
          style={{ color: 'var(--color-dark)' }}
        >
          عذرًا، يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو حذفها، أو أن الرابط غير صحيح.
        </p>

        <div className='flex sm:flex-row flex-col justify-center gap-5 mt-10 animate-fade-in-up'>
          <Link
            href='/'
            className='group flex justify-center items-center gap-3 hover:shadow-xl px-4 py-2 rounded-xl font-semibold text-lg transition-all hover:-translate-y-1 duration-300'
            style={{
              background: 'var(--color-primary)',
              color: 'var(--color-white)',
            }}
          >
            <Home size={16} />
            العودة إلى الرئيسية
          </Link>

          <a
            href='mailto:mostafaibrahim20032020@gmail.com'
            className='group flex justify-center items-center gap-3 hover:shadow-md px-5 py-2 border-2 rounded-xl font-semibold text-lg transition-all hover:-translate-y-1 duration-300'
            style={{
              borderColor: 'var(--color-second)',
              color: 'var(--color-dark)',
            }}
          >
            <Mail size={16} />
            التواصل مع الدعم
          </a>
        </div>

        <p
          className='mt-10 text-sm animate-fade-in animation-delay-1000'
          style={{ color: 'var(--color-second)' }}
        >
          تأكد من صحة الرابط
        </p>
      </div>
    </div>
  );
}
