import {
  IMG_HOME_HERO_SLIDER_1,
  IMG_HOME_HERO_SLIDER_2,
  IMG_HOME_HERO_SLIDER_3,
} from '@/assets/landing/home';

import {
  Smile,
  Users,
  BookOpenText,
  Brain,
  Rss,
  ShieldPlus,
  Tent,
  Hospital,
  HeartPlus,
  Apple,
} from 'lucide-react';

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// HOME PAGE:
////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const HOME_HERO_CONTENT = [
  {
    title: 'رسالتُنا :',
    desc: 'نسعى لخلق الحياة لأناسٍ سُلبت منهم الحياة ، طفولة بريئة و عيون تبحث عن الأمل',
    image: IMG_HOME_HERO_SLIDER_1,
  },
  {
    title: 'من نحن ؟',
    desc: 'مخيم الأقصى للإغاثة و التنمية هي مؤسسة مستقلة غير ربحية , تأسست في العام 2025م , لتنفيذ العديد من المشاريع الإغاثية و التنموية في قطاع غزة المحاصر .',
    image: IMG_HOME_HERO_SLIDER_2,
  },
  {
    title: 'هدفنا :',
    desc: 'نسعى لتقديم المساعدات الإنسانية للنازحين المتضررين في قطاع غزة و تقديم يد العون لهم من خلال تخفيف العبء اليومي عليهم و تسهيل أوضاعهم الحياتية، و توفير مجموعة متنوعة من المساعدات الإنسانية',
    image: IMG_HOME_HERO_SLIDER_3,
  },
];

// STATISTICS
export const HOME_STATISTICS_TITLE = 'رغم التحديات إلا أننا مستمرون لنصنع فارق';
export const HOME_STATISTICS_MESSAGE =
  ' اليوم، نعمل على تقديم مساعدات منقذة للحياة لألاف الأشخاص الذين يعيشون على حافة البقاء على قيد الحياة';

export const HOME_STATISTICS_DATA = [
  { icon: Tent, value: 5200, label: 'خيم' },
  { icon: Smile, value: 5200, label: 'طفل' },
  { icon: Users, value: 42300, label: 'عائلة' },
  { icon: Hospital, value: 1200, label: 'مصابين' },
];

// SERVICES
export const HOME_SERVICES_TITLE = 'الإغاثة والخدمات الأساسية';
export const HOME_SERVICES_Data = [
  {
    icon: Tent, // Placeholder name, replace with actual icon component/path
    title: 'المأوى',
    description: 'يوفر المخيم حياة ومساحات آمنة للعائلات النازحة لضمان الحماية والخصوصية.',
  },
  {
    icon: Apple,
    title: 'الغذاء والمياه',
    description: 'تقديم وجبات غذائية متكاملة ومياه نظيفة لضمان صحة النازحين واحتياجاتهم الأساسية.',
  },
  {
    icon: Hospital,
    title: 'الرعاية الصحية',
    description: 'تقديم خدمات طبية وعلاجات مجانية لضمان صحة النازحين ووقايتهم من الأمراض.',
  },
  {
    icon: HeartPlus,
    title: 'الدعم النفسي والاجتماعي',
    description:
      'توفير برامج دعم نفسي وأنشطة ترفيهية للأطفال والكبار للمساعدة في التكيف مع الظروف الصعبة.',
  },
  {
    icon: BookOpenText,
    title: 'التعليم',
    description:
      'إنشاء مدارس مؤقتة وبرامج تعليمية للأطفال والشباب وتوفير فرص لتعلم مهارات جديدة تساعدهم على تحقيق الذات في المستقبل.',
  },
  {
    icon: Rss,
    title: 'خدمات الإنترنت والتكنولوجيا',
    description:
      'توفير نقاط إنترنت منخفضة التكلفة داخل المخيم لدعم الطلبة على استمرار مسيرتهم التعليمية.',
  },
  {
    icon: ShieldPlus,
    title: 'خدمات الإسعافات الأولية والطوارئ',
    description:
      'تدريب السكان على الإسعافات الأولية، وتوفير حقائب طوارئ تحتوي على أدوات أساسية مثل الضمادات والأدوية.',
  },
  {
    icon: Brain,
    title: 'برامج التوعية والتثقيف الصحي',
    description: 'تنظيم جلسات توعية حول الصحة العامة، النظافة الشخصية، والتغذية السليمة.',
  },
];
