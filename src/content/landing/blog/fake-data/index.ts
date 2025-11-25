import { IGetArticleProps } from "@/actions/landing/blog/getArticle";
import { IGetArticlesProps } from "@/actions/landing/blog/getArticles";
import { IMG_HOME_HERO_SLIDER_1, IMG_HOME_HERO_SLIDER_2, IMG_HOME_HERO_SLIDER_3, } from "@/assets/landing/home";
import { IArticle, IArticleResponse, IArticlesResponse } from "@/types/landing/blog/blog.type";


export const fakeArticles: IArticle[] = [
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
    updatedAt: new Date('2025-05-26T15:06:00Z'),
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
    updatedAt: new Date('2025-05-26T15:06:00Z'),
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
    updatedAt: new Date('2025-05-26T15:06:00Z'),
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
    updatedAt: new Date('2025-05-26T15:06:00Z'),
  },
  {
    id: 5,
    title: 'الصحة النفسية في المخيمات: دعم حيوي',
    brief: 'أهمية تقديم الدعم النفسي لسكان المخيمات.',
    content: `<div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl"><h1 class="mb-10 pb-4 border-red-500 border-b-2 text-4xl text-center">الصحة النفسية في المخيمات</h1><p class="text-gray-700 text-lg leading-relaxed">يعاني النازحون من ضغوط نفسية كبيرة بسبب النزوح وفقدان الأمان. يتطلب الأمر تدخلات مستمرة من متخصصين نفسيين وبرامج دعم مجتمعية.</p></div>`,
    imgs: [IMG_HOME_HERO_SLIDER_2.src, IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_3.src],
    createdAt: new Date('2025-05-25T10:00:00Z'),
    updatedAt: new Date('2025-05-26T15:06:00Z'),
  },
  {
    id: 6,
    title: 'المرأة في المخيمات: قصص صمود',
    brief: 'كيف تقود النساء التغيير في ظروف صعبة؟',
    content: `<div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl"><h1 class="mb-10 pb-4 border-pink-500 border-b-2 text-4xl text-center">دور المرأة في المخيمات</h1><p class="text-gray-700 text-lg leading-relaxed">النساء يتحملن مسؤوليات كبيرة في رعاية الأسر، والمشاركة في التعليم والدعم النفسي رغم التحديات.</p></div>`,
    imgs: [IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_2.src, IMG_HOME_HERO_SLIDER_3.src],
    createdAt: new Date('2025-05-27T09:00:00Z'),
    updatedAt: new Date('2025-05-27T15:00:00Z'),
  },
  {
    id: 7,
    title: 'التعليم غير الرسمي في المخيمات',
    brief: 'مبادرات تطوعية لتعويض غياب المدارس.',
    content: `<div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl"><h1 class="mb-10 pb-4 border-green-500 border-b-2 text-4xl text-center">التعليم غير الرسمي</h1><p class="text-gray-700 text-lg leading-relaxed">يبتكر المتطوعون طرقًا بسيطة للتعليم في ظل غياب المدارس، باستخدام القصص، والأنشطة التفاعلية، والتعلم الرقمي.</p></div>`,
    imgs: [IMG_HOME_HERO_SLIDER_2.src, IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_3.src],
    createdAt: new Date('2025-05-28T11:00:00Z'),
    updatedAt: new Date('2025-05-28T15:00:00Z'),
  },
  {
    id: 8,
    title: 'المبادرات الشبابية في مخيمات النزوح',
    brief: 'كيف يقود الشباب التغيير من داخل الخيام؟',
    content: `<div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl"><h1 class="mb-10 pb-4 border-orange-500 border-b-2 text-4xl text-center">مبادرات الشباب</h1><p class="text-gray-700 text-lg leading-relaxed">من ورش العمل إلى حملات النظافة، يطلق الشباب في المخيمات مبادرات إيجابية تساهم في تحسين الحياة اليومية.</p></div>`,
    imgs: [IMG_HOME_HERO_SLIDER_3.src, IMG_HOME_HERO_SLIDER_1.src],
    createdAt: new Date('2025-05-29T14:00:00Z'),
    updatedAt: new Date('2025-05-29T16:00:00Z'),
  },
  {
    id: 9,
    title: 'الغذاء في المخيمات: بين الحاجة والمساعدات',
    brief: 'نظرة على الواقع الغذائي للنازحين.',
    content: `<div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl"><h1 class="mb-10 pb-4 border-b-2 border-brown-500 text-4xl text-center">توفير الغذاء</h1><p class="text-gray-700 text-lg leading-relaxed">تعتمد العديد من العائلات على المساعدات الغذائية، لكن التحديات اللوجستية تجعل التوزيع غير منتظم أحيانًا.</p></div>`,
    imgs: [IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_3.src],
    createdAt: new Date('2025-05-30T08:00:00Z'),
    updatedAt: new Date('2025-05-30T15:00:00Z'),
  },
  {
    id: 10,
    title: 'تجارب النجاح داخل المخيمات',
    brief: 'قصص ملهمة لأشخاص تجاوزوا المحنة.',
    content: `<div class="bg-white shadow-lg mx-auto p-6 rounded-lg max-w-4xl"><h1 class="mb-10 pb-4 border-teal-500 border-b-2 text-4xl text-center">قصص نجاح</h1><p class="text-gray-700 text-lg leading-relaxed">رغم الصعوبات، ينجح بعض النازحين في تأسيس أعمال صغيرة، أو استكمال تعليمهم بطرق غير تقليدية.</p></div>`,
    imgs: [IMG_HOME_HERO_SLIDER_1.src, IMG_HOME_HERO_SLIDER_3.src],
    createdAt: new Date('2025-06-01T12:00:00Z'),
    updatedAt: new Date('2025-06-01T16:00:00Z'),
  },
];


export const fakeArticlesResponse = ({
  limit = 5, page = 1
}: IGetArticlesProps): IArticlesResponse => {

  const total_items = fakeArticles.length;
  const total_pages = Math.ceil(total_items / limit);

  const paginatedArticles = fakeArticles.slice((page - 1) * limit, page * limit);


  return {
    status: 200,
    message: 'تم جلب المحتوى بنجاح',
    articles: paginatedArticles,
    pagination: { page, limit, totalItems: total_items, totalPages: total_pages },
  };

};


export const fakeArticleResponse = ({ id }: IGetArticleProps): IArticleResponse => {
  const article = fakeArticles.find(a => a.id === id)

  if (!article) {
    return {
      status: 404,
      message: 'المقال غير موجود',
      article: {} as IArticle,
      error: 'المقال غير موجود',
    }
  }

  return {
    status: 200,
    message: 'تم جلب المحتوى بنجاح',
    article,
  }
}
