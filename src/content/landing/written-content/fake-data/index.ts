import { IGetWrittenContentProps } from '@/actions/landing/written-content/getWrittenContent';
import { IGetWrittenContentsProps } from '@/actions/landing/written-content/getWrittenContents';
import {
  IMG_HOME_HERO_SLIDER_1,
  IMG_HOME_HERO_SLIDER_2,
  IMG_HOME_HERO_SLIDER_3,
} from '@/assets/landing/home';
import {
  IWrittenContent,
  IWrittenContentResponse,
  IWrittenContentsResponse,
} from '@/types/landing/written-content/written-content.type';
import { TYPE_WRITTEN_CONTENT } from '@/types/landing/index.type';

export const fakeAds: IWrittenContent[] = [
  {
    id: 1,
    imgs: [IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_2.src, IMG_HOME_HERO_SLIDER_3.src],
    title: 'سيتم افتتاح خيمة للمساعدات الطبية خلال الأسبوع القادم',
    brief: 'افتتاح خيمة طبية جديدة لتقديم الخدمات الصحية المجانية للنازحين',
    content: `
      <div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl">
        <h1 class="mb-6 pb-4 border-green-500 border-b-2 text-gray-800 text-3xl text-center">
          افتتاح خيمة المساعدات الطبية
        </h1>
        <div class="mb-6">
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            خيمة جديدة للرعاية الصحية المجانية ستُفتتح يوم 2 يونيو 2025 في المخيم الرئيسي.
          </p>
        </div>
        <div class="mb-6">
          <h2 class="mb-4 text-green-600 text-xl">الخدمات:</h2>
          <ul class="mr-6 text-gray-700 text-lg leading-relaxed list-disc">
            <li>فحص طبي عام</li>
            <li>توزيع أدوية</li>
            <li>إسعافات أولية</li>
          </ul>
        </div>
      </div>
    `,
    createdAt: new Date('2025-05-20T08:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    type: TYPE_WRITTEN_CONTENT.ADS,
  },
  {
    id: 2,
    imgs: [IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_2.src, IMG_HOME_HERO_SLIDER_3.src],
    title: 'توزيع مساعدات غذائية يوم الخميس',
    brief: 'سلال غذائية شاملة للعائلات النازحة يوم 29 مايو 2025',
    content: `
      <div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl">
        <h1 class="mb-6 pb-4 border-orange-500 border-b-2 text-gray-800 text-3xl text-center">
          توزيع المساعدات الغذائية
        </h1>
        <div class="mb-6">
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            توزيع سلال غذائية يوم الخميس في ساحة المخيم الرئيسية.
          </p>
        </div>
        <div class="mb-6">
          <h2 class="mb-4 text-orange-600 text-xl">المحتويات:</h2>
          <ul class="mr-6 text-gray-700 text-lg leading-relaxed list-disc">
            <li>أرز (5 كيلو)</li>
            <li>زيت (1 لتر)</li>
            <li>سكر (2 كيلو)</li>
          </ul>
        </div>
      </div>
    `,
    createdAt: new Date('2025-05-25T10:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    type: TYPE_WRITTEN_CONTENT.ADS,
  },
  {
    id: 3,
    imgs: [IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_2.src, IMG_HOME_HERO_SLIDER_3.src],
    title: 'توزيع أغطية وملابس شتوية',
    brief: 'حماية العائلات من البرد اعتبارًا من 1 يونيو 2025',
    content: `
      <div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl">
        <h1 class="mb-6 pb-4 border-b-2 border-blue-500 text-gray-800 text-3xl text-center">
          حملة الدفء
        </h1>
        <div class="mb-6">
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            توزيع أغطية وملابس شتوية للعائلات النازحة ابتداءً من الأسبوع القادم.
          </p>
        </div>
        <div class="mb-6">
          <h2 class="mb-4 text-blue-600 text-xl">المواد:</h2>
          <ul class="mr-6 text-gray-700 text-lg leading-relaxed list-disc">
            <li>بطانيات</li>
            <li>معاطف</li>
            <li>جوارب</li>
          </ul>
        </div>
      </div>
    `,
    createdAt: new Date('2025-05-22T14:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    type: TYPE_WRITTEN_CONTENT.ADS,
  },
  {
    id: 4,
    imgs: [IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_2.src, IMG_HOME_HERO_SLIDER_3.src],
    title: 'شاحنة مياه نظيفة يوميًا',
    brief: 'توفير 50 لترًا يوميًا لكل عائلة بدءًا من 27 مايو 2025',
    content: `
      <div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl">
        <h1 class="mb-6 pb-4 border-cyan-500 border-b-2 text-gray-800 text-3xl text-center">
          توزيع المياه
        </h1>
        <div class="mb-6">
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            شاحنة مياه نظيفة ستزور المخيم يوميًا من الساعة 7:00 صباحًا.
          </p>
        </div>
        <div class="mb-6">
          <h2 class="mb-4 text-cyan-600 text-xl">التعليمات:</h2>
          <ul class="mr-6 text-gray-700 text-lg leading-relaxed list-disc">
            <li>إحضار أوعية نظيفة</li>
            <li>حد أقصى 50 لترًا</li>
          </ul>
        </div>
      </div>
    `,
    createdAt: new Date('2025-05-24T06:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    type: TYPE_WRITTEN_CONTENT.ADS,
  },
  {
    id: 5,
    imgs: [IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_2.src, IMG_HOME_HERO_SLIDER_3.src],
    title: 'مدرسة مؤقتة للأطفال',
    brief: 'بدء الدراسة للأطفال النازحين يوم 3 يونيو 2025',
    content: `
      <div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl">
        <h1 class="mb-6 pb-4 border-purple-500 border-b-2 text-gray-800 text-3xl text-center">
          المدرسة المؤقتة
        </h1>
        <div class="mb-6">
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            مدرسة مؤقتة ستبدأ أنشطتها لتعليم الأطفال ابتداءً من الأسبوع القادم.
          </p>
        </div>
        <div class="mb-6">
          <h2 class="mb-4 text-purple-600 text-xl">المواد:</h2>
          <ul class="mr-6 text-gray-700 text-lg leading-relaxed list-disc">
            <li>قراءة</li>
            <li>رياضيات</li>
            <li>ألعاب</li>
          </ul>
        </div>
      </div>
    `,
    createdAt: new Date('2025-05-23T09:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    type: TYPE_WRITTEN_CONTENT.ADS,
  },
  {
    id: 6,
    imgs: [IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_2.src, IMG_HOME_HERO_SLIDER_3.src],
    title: 'إنترنت مجاني في المخيم',
    brief: 'نقاط واي فاي متاحة للتواصل يوميًا بدءًا من 28 مايو 2025',
    content: `
      <div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl">
        <h1 class="mb-6 pb-4 border-indigo-500 border-b-2 text-gray-800 text-3xl text-center">
          خدمة الإنترنت
        </h1>
        <div class="mb-6">
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            إنترنت مجاني متاح في النقاط الرئيسية للمخيم ابتداءً من غدًا.
          </p>
        </div>
        <div class="mb-6">
          <h2 class="mb-4 text-indigo-600 text-xl">التفاصيل:</h2>
          <ul class="mr-6 text-gray-700 text-lg leading-relaxed list-disc">
            <li>شبكة: FREE_CAMP_WIFI</li>
            <li>كلمة المرور: camp2025</li>
          </ul>
        </div>
      </div>
    `,
    createdAt: new Date('2025-05-26T12:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    type: TYPE_WRITTEN_CONTENT.ADS,
  },
  {
    id: 7,
    imgs: [IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_2.src, IMG_HOME_HERO_SLIDER_3.src],
    title: 'ورشة تدريب على الخياطة للنساء',
    brief: 'ورشة مجانية لتعليم الخياطة تبدأ يوم 4 يونيو 2025',
    content: `
      <div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl">
        <h1 class="mb-6 pb-4 border-pink-500 border-b-2 text-gray-800 text-3xl text-center">
          ورشة الخياطة للنساء
        </h1>
        <div class="mb-6">
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            ورشة تدريب مجانية لتعليم النساء الخياطة، تبدأ يوم الثلاثاء في المخيم.
          </p>
        </div>
        <div class="mb-6">
          <h2 class="mb-4 text-pink-600 text-xl">التفاصيل:</h2>
          <ul class="mr-6 text-gray-700 text-lg leading-relaxed list-disc">
            <li>المدة: 5 أيام</li>
            <li>الوقت: 9:00 صباحًا - 12:00 ظهرًا</li>
            <li>المكان: خيمة التدريب المركزية</li>
          </ul>
        </div>
      </div>
    `,
    createdAt: new Date('2025-05-26T15:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    type: TYPE_WRITTEN_CONTENT.ADS,
  },
  {
    id: 8,
    imgs: [IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_2.src, IMG_HOME_HERO_SLIDER_3.src],
    title: 'توزيع ألعاب للأطفال',
    brief: 'توزيع ألعاب مجانية للأطفال يوم 5 يونيو 2025',
    content: `
      <div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl">
        <h1 class="mb-6 pb-4 border-yellow-500 border-b-2 text-gray-800 text-3xl text-center">
          توزيع ألعاب للأطفال
        </h1>
        <div class="mb-6">
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            توزيع ألعاب مجانية للأطفال في ساحة الأنشطة يوم الأربعاء.
          </p>
        </div>
        <div class="mb-6">
          <h2 class="mb-4 text-yellow-600 text-xl">التفاصيل:</h2>
          <ul class="mr-6 text-gray-700 text-lg leading-relaxed list-disc">
            <li>الوقت: 2:00 ظهرًا</li>
            <li>العمر: من 3 إلى 12 سنة</li>
          </ul>
        </div>
      </div>
    `,
    createdAt: new Date('2025-05-26T15:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    type: TYPE_WRITTEN_CONTENT.ADS,
  },
  {
    id: 9,
    imgs: [IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_2.src, IMG_HOME_HERO_SLIDER_3.src],
    title: 'جلسات دعم نفسي مجانية',
    brief: 'جلسات دعم نفسي للنازحين تبدأ يوم 6 يونيو 2025',
    content: `
      <div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl">
        <h1 class="mb-6 pb-4 border-teal-500 border-b-2 text-gray-800 text-3xl text-center">
          جلسات الدعم النفسي
        </h1>
        <div class="mb-6">
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            جلسات دعم نفسي مجانية مع متخصصين لدعم الصحة النفسية للنازحين.
          </p>
        </div>
        <div class="mb-6">
          <h2 class="mb-4 text-teal-600 text-xl">التفاصيل:</h2>
          <ul class="mr-6 text-gray-700 text-lg leading-relaxed list-disc">
            <li>الوقت: 10:00 صباحًا - 3:00 عصرًا</li>
            <li>المكان: خيمة الصحة النفسية</li>
          </ul>
        </div>
      </div>
    `,
    createdAt: new Date('2025-05-26T15:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    type: TYPE_WRITTEN_CONTENT.ADS,
  },
];

export const fakeBlogs: IWrittenContent[] = [
  {
    id: 1,
    title: 'الصعوبات التي يواجهها النازحون في الخيام؟',
    brief: 'استكشاف التحديات اليومية التي يواجهها النازحون في ظروف الخيام.',
    content: `
      <div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl">
        <h1 class="mb-10 pb-4 border-b-2 border-blue-500 text-gray-800 text-4xl text-center">
          التحديات التي يواجهها النازحون في الخيام
        </h1>
        <div class="mb-8">
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            يعيش الملايين من النازحين في ظروف صعبة داخل الخيام، حيث تواجههم تحديات يومية تهدد حياتهم وكرامتهم. يتناول هذا المقال التحديات الرئيسية التي يواجهها النازحون، مستندًا إلى أحدث البيانات ودراسات الميدان.
          </p>
        </div>
        <div class="mb-8">
          <h2 class="mb-4 text-blue-600 text-2xl">1. نقص الموارد الأساسية</h2>
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            يعاني النازحون من نقص المياه النظيفة والغذاء الكافي. في كثير من المخيمات، لا يتجاوز حصة الفرد اليومية من المياه عن 10 لترات، وهو أقل بكثير من الحد الأدنى الموصى به من منظمة الصحة العالمية (15-20 لترًا).
          </p>
        </div>
        <div class="mb-8">
          <h2 class="mb-4 text-blue-600 text-2xl">2. التحديات الصحية</h2>
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            تنتشر الأمراض بسهولة بسبب سوء الصرف الصحي وازدحام الخيام. تُشير التقارير إلى ارتفاع حالات الإسهال والالتهاب الرئوي بين الأطفال.
          </p>
        </div>
        <div class="mb-8">
          <h2 class="mb-4 text-blue-600 text-2xl">3. انقطاع التعليم</h2>
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            الأطفال النازحون يواجهون انقطاع التعليم بسبب غياب المدارس أو الموارد التعليمية.
          </p>
        </div>
        <div class="mb-8">
          <h2 class="mb-4 text-blue-600 text-2xl">4. الضغوط النفسية</h2>
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            يعاني النازحون من التوتر والاكتئاب نتيجة فقدان المنازل والأحباء وغياب الأمان.
          </p>
        </div>
        <div class="mb-8">
          <h2 class="mb-4 text-blue-600 text-2xl">المصادر والمراجع</h2>
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            - تقرير الأمم المتحدة لشؤون اللاجئين (UNHCR)، "الوضع في المخيمات 2025".<br>
            - دراسة لجنة الإغاثة الدولية، "تحديات الصحة في المخيمات"، مايو 2025.<br>
            - محمد، علي. "حياة النازحين في الخيام". مجلة الدراسات الاجتماعية، إصدار مايو 2025.<br>
            - منظمة الصحة العالمية (WHO)، "المعايير الصحية في النزوح"، 2024.
          </p>
        </div>
      </div>
    `,
    imgs: [IMG_HOME_HERO_SLIDER_2.src, IMG_HOME_HERO_SLIDER_3.src],
    createdAt: new Date('2025-05-01T08:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    type: TYPE_WRITTEN_CONTENT.BLOG,
  },
  {
    id: 2,
    title: 'دور التكنولوجيا في تحسين حياة النازحين',
    brief: 'كيف يمكن للتكنولوجيا أن تساعد في تلبية احتياجات النازحين؟',
    content: `
      <div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl">
        <h1 class="mb-10 pb-4 border-indigo-500 border-b-2 text-gray-800 text-4xl text-center">
          دور التكنولوجيا في المخيمات
        </h1>
        <div class="mb-8">
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            التكنولوجيا يمكن أن تلعب دورًا كبيرًا في تحسين ظروف النازحين، من التواصل إلى التعليم.
          </p>
        </div>
        <div class="mb-8">
          <h2 class="mb-4 text-indigo-600 text-2xl">1. التواصل</h2>
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            توفير الإنترنت المجاني يساعد النازحين على البقاء على اتصال مع أقاربهم والحصول على المعلومات.
          </p>
        </div>
        <div class="mb-8">
          <h2 class="mb-4 text-indigo-600 text-2xl">2. التعليم</h2>
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            التطبيقات التعليمية ومنصات التعلم عن بُعد يمكن أن تعوض غياب الم in-person education.
          </p>
        </div>
        <div class="mb-8">
          <h2 class="mb-4 text-indigo-600 text-2xl">3. التحديات</h2>
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            نقص الكهرباء والأجهزة يشكل عائقًا، لكن الحلول مثل الألواح الشمسية يمكن أن تساعد.
          </p>
        </div>
        <div class="mb-8">
          <h2 class="mb-4 text-indigo-600 text-2xl">المصادر والمراجع</h2>
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            - تقرير الأمم المتحدة، "التكنولوجيا والنزوح 2025".<br>
            - دراسة مركز الابتكار الإنساني، "التكنولوجيا في المخيمات"، مايو 2025.<br>
            - علي، محمد. "التكنولوجيا للنازحين". مجلة المستقبل، مايو 2025.
          </p>
        </div>
      </div>
    `,
    imgs: [IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_2.src],
    createdAt: new Date('2025-05-10T09:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    type: TYPE_WRITTEN_CONTENT.BLOG,
  },
  {
    id: 3,
    title: 'تأثير المناخ على المخيمات: تحديات جديدة',
    brief: 'كيف تؤثر التغيرات المناخية على حياة النازحين؟',
    content: `
      <div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl">
        <h1 class="mb-10 pb-4 border-yellow-500 border-b-2 text-gray-800 text-4xl text-center">
          تأثير المناخ على المخيمات
        </h1>
        <div class="mb-8">
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            التغيرات المناخية تضيف تحديات جديدة للنازحين، من الفيضانات إلى الحرارة الشديدة.
          </p>
        </div>
        <div class="mb-8">
          <h2 class="mb-4 text-yellow-600 text-2xl">1. الفيضانات</h2>
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            الأمطار الغزيرة تتسبب في غمر الخيام، مما يؤدي إلى تدمير الممتلكات وانتشار الأمراض.
          </p>
        </div>
        <div class="mb-8">
          <h2 class="mb-4 text-yellow-600 text-2xl">2. الحرارة الشديدة</h2>
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            ارتفاع درجات الحرارة يزيد من مخاطر الجفاف وضربات الشمس، خاصة بين الأطفال وكبار السن.
          </p>
        </div>
        <div class="mb-8">
          <h2 class="mb-4 text-yellow-600 text-2xl">3. الحلول</h2>
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            تحسين تصميم الخيام لمقاومة العوامل الجوية وتوفير مظلات ومياه شرب آمنة.
          </p>
        </div>
        <div class="mb-8">
          <h2 class="mb-4 text-yellow-600 text-2xl">المصادر والمراجع</h2>
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            - برنامج الأمم المتحدة للبيئة، "المناخ والنزوح 2025".<br>
            - دراسة المركز العالمي للبيئة، "التغيرات المناخية"، مايو 2025.<br>
            - خالد، أحمد. "المناخ والمخيمات". مجلة البيئة، مايو 2025.
          </p>
        </div>
      </div>
    `,
    imgs: [IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_3.src],
    createdAt: new Date('2025-05-15T10:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    type: TYPE_WRITTEN_CONTENT.BLOG,
  },
  {
    id: 4,
    title: 'دور الشباب في بناء مستقبل المخيمات',
    brief: 'كيف يساهم الشباب في تحسين ظروف المخيمات؟',
    content: `
      <div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl">
        <h1 class="mb-10 pb-4 border-purple-500 border-b-2 text-gray-800 text-4xl text-center">
          دور الشباب في المخيمات
        </h1>
        <div class="mb-8">
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            الشباب هم قوة التغيير في المخيمات، حيث يقودون المبادرات المجتمعية ويدعمون التعليم.
          </p>
        </div>
        <div class="mb-8">
          <h2 class="mb-4 text-purple-600 text-2xl">1. المبادرات التعليمية</h2>
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            الشباب ينظمون دروسًا للأطفال، مما يساعد على سد الفجوة التعليمية.
          </p>
        </div>
        <div class="mb-8">
          <h2 class="mb-4 text-purple-600 text-2xl">2. الأنشطة الترفيهية</h2>
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            تنظيم الألعاب الرياضية وحلقات القراءة يعزز الصحة النفسية للسكان.
          </p>
        </div>
        <div class="mb-8">
          <h2 class="mb-4 text-purple-600 text-2xl">3. التحديات</h2>
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            قلة الموارد والدعم تحد من قدرة الشباب على التوسع في مبادراتهم.
          </p>
        </div>
        <div class="mb-8">
          <h2 class="mb-4 text-purple-600 text-2xl">المصادر والمراجع</h2>
          <p class="text-gray-700 text-lg text-justify leading-relaxed">
            - تقرير الأمم المتحدة، "الشباب والنزوح 2025".<br>
            - دراسة مركز الشباب العالمي، "دور الشباب"، مايو 2025.<br>
            - نور، ليلى. "الشباب وقوة التغيير". مجلة الأمل، مايو 2025.
          </p>
        </div>
      </div>
    `,
    imgs: [IMG_HOME_HERO_SLIDER_3.src, IMG_HOME_HERO_SLIDER_1.src],
    createdAt: new Date('2025-05-20T11:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    type: TYPE_WRITTEN_CONTENT.BLOG,
  },
  {
    id: 5,
    title: 'الصحة النفسية في المخيمات: دعم حيوي',
    brief: 'أهمية تقديم الدعم النفسي لسكان المخيمات.',
    content: `<div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl"><h1 class="mb-10 pb-4 border-red-500 border-b-2 text-4xl text-center">الصحة النفسية في المخيمات</h1><p class="text-gray-700 text-lg leading-relaxed">يعاني النازحون من ضغوط نفسية كبيرة بسبب النزوح وفقدان الأمان. يتطلب الأمر تدخلات مستمرة من متخصصين نفسيين وبرامج دعم مجتمعية.</p></div>`,
    imgs: [IMG_HOME_HERO_SLIDER_2.src, IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_3.src],
    createdAt: new Date('2025-05-25T10:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    type: TYPE_WRITTEN_CONTENT.BLOG,
  },
  {
    id: 6,
    title: 'المرأة في المخيمات: قصص صمود',
    brief: 'كيف تقود النساء التغيير في ظروف صعبة؟',
    content: `<div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl"><h1 class="mb-10 pb-4 border-pink-500 border-b-2 text-4xl text-center">دور المرأة في المخيمات</h1><p class="text-gray-700 text-lg leading-relaxed">النساء يتحملن مسؤوليات كبيرة في رعاية الأسر، والمشاركة في التعليم والدعم النفسي رغم التحديات.</p></div>`,
    imgs: [IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_2.src, IMG_HOME_HERO_SLIDER_3.src],
    createdAt: new Date('2025-05-27T09:00:00Z'),
    updateAt: new Date('2025-05-27T15:00:00Z'),
    type: TYPE_WRITTEN_CONTENT.BLOG,
  },
  {
    id: 7,
    title: 'التعليم غير الرسمي في المخيمات',
    brief: 'مبادرات تطوعية لتعويض غياب المدارس.',
    content: `<div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl"><h1 class="mb-10 pb-4 border-green-500 border-b-2 text-4xl text-center">التعليم غير الرسمي</h1><p class="text-gray-700 text-lg leading-relaxed">يبتكر المتطوعون طرقًا بسيطة للتعليم في ظل غياب المدارس، باستخدام القصص، والأنشطة التفاعلية، والتعلم الرقمي.</p></div>`,
    imgs: [IMG_HOME_HERO_SLIDER_2.src, IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_3.src],
    createdAt: new Date('2025-05-28T11:00:00Z'),
    updateAt: new Date('2025-05-28T15:00:00Z'),
    type: TYPE_WRITTEN_CONTENT.BLOG,
  },
  {
    id: 8,
    title: 'المبادرات الشبابية في مخيمات النزوح',
    brief: 'كيف يقود الشباب التغيير من داخل الخيام؟',
    content: `<div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl"><h1 class="mb-10 pb-4 border-orange-500 border-b-2 text-4xl text-center">مبادرات الشباب</h1><p class="text-gray-700 text-lg leading-relaxed">من ورش العمل إلى حملات النظافة، يطلق الشباب في المخيمات مبادرات إيجابية تساهم في تحسين الحياة اليومية.</p></div>`,
    imgs: [IMG_HOME_HERO_SLIDER_3.src, IMG_HOME_HERO_SLIDER_1.src],
    createdAt: new Date('2025-05-29T14:00:00Z'),
    updateAt: new Date('2025-05-29T16:00:00Z'),
    type: TYPE_WRITTEN_CONTENT.BLOG,
  },
  {
    id: 9,
    title: 'الغذاء في المخيمات: بين الحاجة والمساعدات',
    brief: 'نظرة على الواقع الغذائي للنازحين.',
    content: `<div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl"><h1 class="mb-10 pb-4 border-b-2 border-brown-500 text-4xl text-center">توفير الغذاء</h1><p class="text-gray-700 text-lg leading-relaxed">تعتمد العديد من العائلات على المساعدات الغذائية، لكن التحديات اللوجستية تجعل التوزيع غير منتظم أحيانًا.</p></div>`,
    imgs: [IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_3.src],
    createdAt: new Date('2025-05-30T08:00:00Z'),
    updateAt: new Date('2025-05-30T15:00:00Z'),
    type: TYPE_WRITTEN_CONTENT.BLOG,
  },
  {
    id: 10,
    title: 'تجارب النجاح داخل المخيمات',
    brief: 'قصص ملهمة لأشخاص تجاوزوا المحنة.',
    content: `<div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl"><h1 class="mb-10 pb-4 border-teal-500 border-b-2 text-4xl text-center">قصص نجاح</h1><p class="text-gray-700 text-lg leading-relaxed">رغم الصعوبات، ينجح بعض النازحين في تأسيس أعمال صغيرة، أو استكمال تعليمهم بطرق غير تقليدية.</p></div>`,
    imgs: [IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_3.src],
    createdAt: new Date('2025-06-01T12:00:00Z'),
    updateAt: new Date('2025-06-01T16:00:00Z'),
    type: TYPE_WRITTEN_CONTENT.BLOG,
  },
];

export const fakeStories: IWrittenContent[] = [
  {
    id: 1,
    imgs: [IMG_HOME_HERO_SLIDER_1.src],
    title: 'خالد و رحلة التعلم',
    content: `خالد، البالغ من العمر 23 عامًا، يعيش في مخيم للنازحين منذ أربع سنوات. يعاني من إعاقة في ساقه اليمنى منذ الطفولة، مما يجعل الحركة صعبة، بالإضافة إلى تحديات تعليمية بسبب نقص الموارد. لكنه لم يستسلم أبدًا. كل صباح، يستيقظ عند الفجر ويسير لمسافة تزيد عن 3 كيلومترات للوصول إلى مركز تعليمي مؤقت أقيم في المخيم بدعم من منظمة إنسانية. هناك، يتعلم القراءة والكتابة الأساسية بجانب أطفال أصغر منه سنًا، لكنه لا يشعر بالخجل. يحلم خالد أن يصبح يومًا معلمًا ليغير حياة الآخرين كما تغيرت حياته.`,
    createdAt: new Date('2023-09-01T10:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    brief: 'قصة نجاح خالد في تحدي ظروفه الصعبة لمواصلة تعليمه رغم الإعاقة والتحديات.',
    type: TYPE_WRITTEN_CONTENT.SUCCESS_STORIES,
  },
  {
    id: 2,
    imgs: [IMG_HOME_HERO_SLIDER_2.src],
    title: 'الأسمر و رحلته في جمع الأموال',
    content: `الأسمر، شاب يبلغ من العمر 27 عامًا، كان يعمل كبائع متجول قبل أن يضطر للنزوح مع عائلته. في المخيم، لاحظ حاجة العائلات الماسة للطعام والدواء، خاصة الأطفال وكبار السن. قرر الأسمر أن يفعل شيئًا. بدأ بجمع التبرعات من خلال تنظيم فعاليات صغيرة داخل المخيم، مثل بيع الحرف اليدوية التي صنعها الأطفال ورواية القصص مقابل تبرعات رمزية. بمساعدة أصدقائه، تمكن من جمع ما يكفي لشراء سلال غذائية وأدوية لـ 50 عائلة خلال شهر واحد فقط. الأسمر يطمح الآن لتوسيع مبادرته لتشمل المخيمات المجاورة.`,
    createdAt: new Date('2023-10-15T14:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    brief: 'جهود الأسمر في تنظيم حملات تبرع لدعم المحتاجين في المخيم.',
    type: TYPE_WRITTEN_CONTENT.SUCCESS_STORIES,
  },
  {
    id: 3,
    imgs: [IMG_HOME_HERO_SLIDER_3.src],
    title: 'فيصل و رحلة التسول',
    content: `فيصل، أب لثلاثة أطفال تتراوح أعمارهم بين 5 و 10 سنوات، واجه أصعب لحظات حياته عندما دُمر منزله في النزاع. اضطر للتسول في شوارع المدينة القريبة من المخيم لإطعام أطفاله. كان يشعر بالعار يوميًا، لكنه لم يجد خيارًا آخر. في أحد الأيام، سمع عن برنامج تدريب مهني تقدمه منظمة خيرية في المخيم. التحق فيصل بدورة لتعليم النجارة، وبعد ثلاثة أشهر من التدريب المكثف، بدأ بصنع أثاث بسيط مثل الكراسي والطاولات. الآن، يبيع فيصل منتجاته في سوق المخيم الصغير ويستطيع توفير حياة كريمة لعائلته.`,
    createdAt: new Date('2023-11-20T09:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    brief: 'تحول فيصل من التسول إلى العمل المهني بفضل التدريب الذي قدمته منظمة خيرية.',
    type: TYPE_WRITTEN_CONTENT.SUCCESS_STORIES,
  },
  {
    id: 4,
    imgs: [IMG_HOME_HERO_SLIDER_1.src],
    title: 'ليلى وجهودها التطوعية',
    content: `ليلى، فتاة في السابعة عشرة من عمرها، نزحت مع عائلتها منذ ثلاث سنوات. رأت ليلى معاناة الأطفال في المخيم الذين حُرموا من التعليم والترفيه، فقررت أن تفعل شيئًا. بدأت بجمع مجموعة من الشباب المتطوعين لتنظيم أنشطة يومية للأطفال، مثل دروس القراءة البسيطة، الألعاب الجماعية، وحلقات رواية القصص. بمساعدة المتطوعين، تمكنت من تنظيم فعاليات أسبوعية تجذب أكثر من 100 طفل. ليلى لا تكتفي بذلك، فهي تخطط لإنشاء مكتبة صغيرة في المخيم باستخدام كتب متبرع بها.`,
    createdAt: new Date('2023-12-05T13:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    brief: 'دور ليلى في تعليم وتسلية أطفال المخيم من خلال أنشطة تطوعية.',
    type: TYPE_WRITTEN_CONTENT.SUCCESS_STORIES,
  },
  {
    id: 5,
    imgs: [IMG_HOME_HERO_SLIDER_2.src],
    title: 'مريم ومساهمتها في الرعاية الصحية',
    content: `مريم، أم لأربعة أطفال وممرضة سابقة، تبلغ من العمر 35 عامًا. بعد نزوحها إلى المخيم، لاحظت نقص الرعاية الصحية الأساسية، خاصة للنساء الحوامل والأطفال. باستخدام خبرتها الطبية السابقة، بدأت مريم بتقديم استشارات صحية بسيطة للنساء في المخيم، مثل كيفية التعامل مع الحمى عند الأطفال أو العناية بالجروح. بمساعدة منظمة طبية، حصلت على تدريب إضافي وأدوات طبية أساسية، مما مكنها من إدارة عيادة صغيرة في خيمة مخصصة. الآن، تخدم مريم أكثر من 30 شخصًا يوميًا وتحلم بتوسيع خدماتها.`,
    createdAt: new Date('2024-01-15T08:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    brief: 'جهود مريم في تقديم الرعاية الصحية الأساسية لسكان المخيم.',
    type: TYPE_WRITTEN_CONTENT.SUCCESS_STORIES,
  },
  {
    id: 6,
    imgs: [IMG_HOME_HERO_SLIDER_3.src],
    title: 'عبد الله وزراعة الأمل',
    content: `عبد الله، رجل في الأربعين من عمره، كان مزارعًا قبل النزوح. في المخيم، افتقد العمل في الأرض، لكنه لم ييأس. باستخدام مساحة صغيرة بجوار خيمته، بدأ بزراعة الخضروات مثل الطماطم والخيار باستخدام بذور تبرعت بها منظمة زراعية. على الرغم من قلة المياه، استخدم عبد الله نظام ري بالتنقيط بسيط صنعه بنفسه من زجاجات بلاستيكية. الآن، يوزع عبد الله محاصيله على جيرانه في المخيم، مما يساعد في تحسين التغذية للعائلات. يطمح عبد الله لتعليم الآخرين كيفية الزراعة في ظروف المخيم.`,
    createdAt: new Date('2024-03-10T11:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    brief: 'قصة عبد الله الذي بدأ بزراعة الخضروات لدعم التغذية في المخيم.',
    type: TYPE_WRITTEN_CONTENT.SUCCESS_STORIES,
  },
  {
    id: 7,
    imgs: [IMG_HOME_HERO_SLIDER_1.src],
    title: 'نور ودروس القرآن',
    content: `نور، فتاة تبلغ من العمر 15 عامًا، معروفة في المخيم بحبها لتعليم القرآن. بعد أن فقدت والديها في النزاع، وجدت نور العزاء في الدين. بدأت بتعليم الأطفال الصغار في المخيم حفظ القرآن الكريم في خيمة صغيرة تبرعت بها عائلة مجاورة. تستخدم نور لوحًا خشبيًا بسيطًا لكتابة الآيات، وتجمع الأطفال كل يوم بعد الظهر لتعليمهم التجويد والحفظ. حتى الآن، ساعدت أكثر من 40 طفلًا على حفظ أجزاء من القرآن، مما أعطاهم شعورًا بالهدف والانتماء.`,
    createdAt: new Date('2024-06-20T14:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    brief: 'جهود نور في تعليم الأطفال القرآن الكريم في المخيم.',
    type: TYPE_WRITTEN_CONTENT.SUCCESS_STORIES,
  },
  {
    id: 8,
    imgs: [IMG_HOME_HERO_SLIDER_2.src],
    title: 'أمينة ومبادرة الخياطة',
    content: `أمينة، امرأة تبلغ من العمر 42 عامًا، كانت خياطة ماهرة قبل نزوحها. في المخيم، قررت استخدام مهاراتها لدعم عائلتها والمجتمع. بمساعدة منظمة محلية، حصلت على ماكينة خياطة ومواد خام بسيطة. بدأت بصنع ملابس للأطفال والنساء، وبيعت منتجاتها في سوق المخيم الصغير. أمينة لم تكتفِ بذلك، فقد بدأت بتعليم النساء الأخريات الخياطة، مما ساعد 15 امرأة على اكتساب مهارة جديدة وكسب دخل صغير. الآن، أصبحت أمينة رمزًا للتمكين الاقتصادي في المخيم.`,
    createdAt: new Date('2024-08-12T09:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    brief: 'قصة أمينة التي استخدمت مهارات الخياطة لتمكين ال نساء في المخيم.',
    type: TYPE_WRITTEN_CONTENT.SUCCESS_STORIES,
  },
  {
    id: 9,
    imgs: [IMG_HOME_HERO_SLIDER_3.src],
    title: 'ياسر وإصلاح الخيام',
    content: `ياسر، شاب يبلغ من العمر 30 عامًا، كان يعمل في البناء قبل النزوح. في المخيم، لاحظ أن العديد من الخيام تعرضت للتلف بسبب الأمطار والرياح القوية، مما جعل العائلات تعاني من البرد والرطوبة. قرر ياسر مساعدة جيرانه باستخدام مهاراته. بمساعدة أدوات بسيطة تبرعت بها منظمة إغاثة، بدأ بإصلاح الخيام وتعزيزها بمواد مقاومة للماء. حتى الآن، أصلح ياسر أكثر من 60 خيمة، مما ساعد العائلات على البقاء في مأمن من الظروف الجوية القاسية. يطمح ياسر لتدريب شباب آخرين على هذه المهارة.`,
    createdAt: new Date('2024-10-05T12:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    brief: 'جهود ياسر في إصلاح الخيام لحماية العائلات من الظروف الجوية.',
    type: TYPE_WRITTEN_CONTENT.SUCCESS_STORIES,
  },
  {
    id: 10,
    imgs: [IMG_HOME_HERO_SLIDER_1.src],
    title: 'سامي وتنظيم الألعاب الرياضية',
    content: `سامي، شاب يبلغ من العمر 25 عامًا، كان لاعب كرة قدم هاوي قبل النزوح. في المخيم، لاحظ أن الشباب يعانون من الملل والإحباط بسبب قلة الأنشطة الترفيهية. قرر سامي تنظيم دوري رياضي صغير باستخدام كرة قدم قديمة ومساحة مفتوحة في المخيم. بدأ بتشكيل فرق من الشباب والأطفال، وينظم مباريات أسبوعية تجذب أكثر من 50 مشاركًا. هذه الأنشطة ساعدت على تحسين الحالة النفسية للمشاركين وبناء روح الفريق بينهم. سامي يخطط الآن لإضافة ألعاب أخرى مثل الكرة الطائرة.`,
    createdAt: new Date('2025-01-15T10:00:00Z'),
    updateAt: new Date('2025-05-26T15:06:00Z'),
    brief: 'مبادرة سامي لتنظيم أنشطة رياضية لدعم الصحة النفسية في المخيم.',
    type: TYPE_WRITTEN_CONTENT.SUCCESS_STORIES,
  },
];

export const fakeWrittenContentResponse = ({
  id,
  type,
}: IGetWrittenContentProps): IWrittenContentResponse => {
  const selectedWrittenContents =
    type == TYPE_WRITTEN_CONTENT.ADS
      ? fakeAds
      : type == TYPE_WRITTEN_CONTENT.BLOG
        ? fakeBlogs
        : fakeStories;

  const filteredSpecific = selectedWrittenContents.find((item) => item.id == id);

  if (filteredSpecific) {
    return {
      status: 200,
      message: 'تم جلب المحتوى بنجاح',
      writtenContent: filteredSpecific as IWrittenContent,
      error: undefined,
    };
  }

  return {
    status: 404,
    message: 'لم يتم العثور على المحتوى المطلوب',
    writtenContent: {} as IWrittenContent,
    error: 'لم يتم العثور على المحتوى المطلوب',
  };
};

export const fakeWrittenContentsResponse = ({
  page = 1,
  limit = 10,
  type,
}: IGetWrittenContentsProps): IWrittenContentsResponse => {
  const selectedWrittenContents =
    type == TYPE_WRITTEN_CONTENT.ADS
      ? fakeAds
      : type == TYPE_WRITTEN_CONTENT.BLOG
        ? fakeBlogs
        : fakeStories;

  if (!selectedWrittenContents) {
    return {
      status: 500,
      message: 'حدث خطأ أثناء جلب المحتوى',
      error: 'حدث خطأ أثناء جلب المحتوى',
      writtenContents: [],
      pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
    };
  }

  const filtered = type
    ? selectedWrittenContents.filter((item) => item.type === type)
    : selectedWrittenContents;

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / limit);

  const paginatedAids = filtered.slice((page - 1) * limit, page * limit);

  const fakeResponse: IWrittenContentsResponse = {
    status: 200,
    writtenContents: paginatedAids,
    pagination: { page, limit, totalItems, totalPages },
  };

  return fakeResponse;
};
