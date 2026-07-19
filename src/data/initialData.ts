/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Service, PortfolioProject, CNCProduct, Testimonial, BlogPost, QuoteRequest, AppSettings, PricingFactor } from '../types';

export const initialServices: Service[] = [
  {
    id: 'decorative-wall-panels',
    title: 'Decorative Wall Panels',
    titleAr: 'ألواح الجدران الديكورية',
    category: 'residential',
    description: 'Relief-carved, parametric and modular wall panels that turn flat surfaces into architectural focal points.',
    descriptionAr: 'ألواح جدارية بارامترية ومجسمة تحول الأسطح المسطحة إلى نقاط تركيز معمارية فاخرة.',
    fullDescription: 'Our decorative wall panel system is engineered on a modular grid so complex geometric, wave and relief patterns install seamlessly across any span, with zero visible fasteners. Panels are CNC-routed to sub-millimeter tolerances and finished to specification, from matte mineral coatings to high-gloss lacquer.',
    fullDescriptionAr: 'نظام ألواحنا الجدارية الديكورية مصمم على شبكة معيارية تتيح تركيب الأنماط الهندسية والمجسمة والمتموجة المعقدة بسلاسة عبر أي مساحة، دون أي براغي ظاهرة. يتم تفريز الألواح بدقة CNC تقل عن المليمتر وتشطيبها حسب الطلب.',
    icon: 'Layers',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800',
    features: ['Modular seamless installation', 'Parametric relief patterns', 'MDF, PVC or PMMA substrate', 'Full custom finish palette'],
    featuresAr: ['تركيب معياري بلا فواصل ظاهرة', 'أنماط بارامترية مجسمة', 'قاعدة MDF أو PVC أو PMMA', 'مجموعة تشطيبات مخصصة كاملة']
  },
  {
    id: 'pmma-acrylic-products',
    title: 'PMMA (Acrylic) Products',
    titleAr: 'منتجات PMMA (الأكريليك)',
    category: 'manufacturing',
    description: 'Precision-cut and polished acrylic elements engineered for clarity, colour depth and light integration.',
    descriptionAr: 'عناصر أكريليك مقصوصة ومصقولة بدقة، مصممة لتحقيق الشفافية وعمق اللون ودمج الإضاءة.',
    fullDescription: 'We process cast and extruded PMMA sheets for backlit signage, dividing screens, display fixtures and layered decorative reliefs. Flame-polished edges and diamond-fine kerf give every acrylic piece a jewellery-grade finish, in clear, tinted, frosted or mirrored stock.',
    fullDescriptionAr: 'نقوم بمعالجة ألواح PMMA المصبوبة والمبثوقة للوحات المضيئة، الشاشات الفاصلة، عناصر العرض، والتفاصيل الديكورية المتعددة الطبقات. تمنح الحواف المصقولة باللهب والقطع الدقيق كل قطعة أكريليك لمسة نهائية فائقة النقاء.',
    icon: 'Gem',
    image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=800',
    features: ['Flame-polished edge finishing', 'Backlit & layered assemblies', 'Clear, tinted & mirrored stock', 'Diamond-tolerance laser kerf'],
    featuresAr: ['تلميع حواف باللهب', 'تجميعات مضيئة ومتعددة الطبقات', 'أكريليك شفاف وملون وعاكس', 'قص ليزر بدقة الماس']
  },
  {
    id: 'pvc-decorative-panels',
    title: 'PVC Decorative Panels',
    titleAr: 'ألواح PVC الديكورية',
    category: 'manufacturing',
    description: 'Lightweight, moisture-stable PVC panelling engineered for humid and high-traffic environments.',
    descriptionAr: 'ألواح PVC خفيفة الوزن ومستقرة أمام الرطوبة، مصممة للبيئات الرطبة وعالية الحركة.',
    fullDescription: 'PVC decorative panels give us a durable, dimensionally stable substrate for bathrooms, kitchens back-of-house, and exterior-adjacent applications where wood-based boards fall short. We route intricate lattice, fluted and textured profiles that hold their finish under humidity and repeated cleaning.',
    fullDescriptionAr: 'توفر لنا ألواح PVC الديكورية قاعدة متينة ومستقرة الأبعاد للحمامات والمطابخ والتطبيقات القريبة من الأجواء الخارجية حيث لا تفي الألواح الخشبية بالغرض. نقوم بتفريز أنماط مشربية ومضلعة ومنقوشة تحافظ على تشطيبها تحت الرطوبة والتنظيف المتكرر.',
    icon: 'PanelsTopLeft',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800',
    features: ['Moisture & humidity stable', 'Fluted and lattice profiles', 'Low-maintenance wipeable finish', 'Fire-rated stock available'],
    featuresAr: ['مقاومة للرطوبة والعوامل الجوية', 'أنماط مضلعة ومشربية', 'تشطيب سهل التنظيف والصيانة', 'مخزون مقاوم للحريق متوفر']
  },
  {
    id: 'mdf-decorative-solutions',
    title: 'MDF Decorative Solutions',
    titleAr: 'حلول MDF الديكورية',
    category: 'residential',
    description: 'E0-rated MDF machined into fine relief, fretwork and sculptural decorative components.',
    descriptionAr: 'ألواح MDF فئة E0 مفرزة إلى تفاصيل مجسمة ومشربيات وعناصر ديكورية نحتية دقيقة.',
    fullDescription: 'MDF remains our reference substrate for fine detail work: dense, void-free and ideal for crisp internal corners. We hold a library of E0 low-formaldehyde boards machined into fretwork screens, ceiling coffers and sculptural relief, ready for spray lacquer in any specification colour.',
    fullDescriptionAr: 'يبقى الـ MDF قاعدتنا المرجعية لأعمال التفاصيل الدقيقة: كثيف وخالٍ من الفراغات ومثالي للزوايا الداخلية الحادة. لدينا مكتبة من ألواح E0 منخفضة الانبعاثات مفرزة إلى شاشات مشربية، وأسقف مجصصة، وتفاصيل نحتية جاهزة للطلاء بأي لون.',
    icon: 'Grid3x3',
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800',
    features: ['E0 low-formaldehyde boards', 'Fine internal-corner routing', 'Any RAL spray-lacquer colour', 'Ceiling, wall & partition ready'],
    featuresAr: ['ألواح E0 منخفضة الانبعاثات', 'تفريز زوايا داخلية دقيقة', 'طلاء بأي لون من كتالوج RAL', 'جاهزة للأسقف والجدران والقواطع']
  },
  {
    id: 'interior-decorative-elements',
    title: 'Interior Decorative Elements',
    titleAr: 'عناصر الديكور الداخلي',
    category: 'residential',
    description: 'Ceiling coffers, columns, mouldings and accent features engineered to a room\u2019s exact geometry.',
    descriptionAr: 'أسقف مجصصة، أعمدة، كرانيش، وعناصر تكميلية مصممة بدقة على هندسة الغرفة الفعلية.',
    fullDescription: 'Beyond flat panelling, we produce full interior decorative systems: coffered ceilings, columns, niches, mouldings and backlit accent features. Every element is drafted from an on-site survey so the final installation reads as a single, continuous architectural gesture.',
    fullDescriptionAr: 'إلى جانب الألواح المسطحة، ننتج أنظمة ديكور داخلي متكاملة: أسقف مجصصة، أعمدة، محاريب، كرانيش، وتفاصيل مضيئة. يتم رسم كل عنصر بناءً على مسح دقيق للموقع ليظهر التركيب النهائي كقطعة معمارية واحدة متجانسة.',
    icon: 'Sparkles',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800',
    features: ['Site-surveyed custom geometry', 'Coffered ceilings & columns', 'Integrated backlighting channels', 'Full-service install team'],
    featuresAr: ['هندسة مخصصة وفق مسح الموقع', 'أسقف مجصصة وأعمدة', 'قنوات إضاءة خلفية مدمجة', 'فريق تركيب متكامل']
  },
  {
    id: 'custom-cnc-cutting',
    title: 'Custom CNC Cutting',
    titleAr: 'قص CNC مخصص',
    category: 'manufacturing',
    description: 'Multi-axis CNC routing across wood-based, plastic and composite substrates at sub-millimeter tolerance.',
    descriptionAr: 'تفريز CNC متعدد المحاور على القواعد الخشبية والبلاستيكية والمركبة بدقة تقل عن المليمتر.',
    fullDescription: 'Our machining floor runs high-speed multi-axis CNC routers processing MDF, PVC, PMMA, HPL and thin-gauge metals from a single CAD file, so every repeat run holds identical tolerances. This is the engine behind every panel, screen and decorative piece we produce.',
    fullDescriptionAr: 'يعمل قسم التصنيع لدينا بأجهزة CNC متعددة المحاور وعالية السرعة تعالج الـ MDF وPVC وPMMA وHPL والمعادن الرقيقة من ملف تصميم واحد، بحيث تحافظ كل عملية تكرار على نفس الدقة. هذا هو المحرك خلف كل لوح وشاشة وقطعة ديكورية ننتجها.',
    icon: 'Cpu',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800',
    features: ['Sub-millimeter routing tolerance', 'CAD-to-machine repeatability', 'MDF, PVC, PMMA & composite stock', 'Prototype-to-volume production'],
    featuresAr: ['دقة تفريز تقل عن المليمتر', 'تكرار مطابق من ملف CAD إلى الماكينة', 'قواعد MDF وPVC وPMMA ومركبة', 'من النموذج الأولي إلى الإنتاج الكمي']
  },
  {
    id: 'engraving',
    title: 'Engraving',
    titleAr: 'النقش والحفر',
    category: 'manufacturing',
    description: 'Fine surface and through-cut engraving for signage, branding and decorative typography.',
    descriptionAr: 'حفر سطحي وقص كامل بدقة عالية للوحات، الهوية التجارية، والخط الديكوري.',
    fullDescription: 'Our engraving line adds depth, contrast and identity to any panel or product: precise vector typography, brand marks, wayfinding signage and decorative motifs, engraved or through-cut into acrylic, MDF, metal and composite surfaces with a clean, repeatable edge.',
    fullDescriptionAr: 'يضيف قسم النقش لدينا العمق والتباين والهوية لأي لوح أو منتج: خط نصي متجهي دقيق، شعارات تجارية، لوحات إرشادية، وزخارف ديكورية منقوشة أو مقصوصة بالكامل على الأكريليك والـ MDF والمعادن بحافة نظيفة وقابلة للتكرار.',
    icon: 'PenTool',
    image: 'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=800',
    features: ['Vector typography & branding', 'Surface & through-cut engraving', 'Wayfinding & signage systems', 'Metal, acrylic, MDF compatible'],
    featuresAr: ['خط تجاري وحفر متجهي', 'نقش سطحي وقص كامل', 'أنظمة لوحات إرشادية', 'يعمل على المعادن والأكريليك وMDF']
  },
  {
    id: 'architectural-decorative-pieces',
    title: 'Architectural Decorative Pieces',
    titleAr: 'القطع الديكورية المعمارية',
    category: 'commercial',
    description: 'Large-format facade cladding, screens and structural ornament engineered for exterior exposure.',
    descriptionAr: 'كسوة واجهات كبيرة الحجم، شاشات، وزخارف إنشائية مصممة لتحمل التعرض الخارجي.',
    fullDescription: 'From perforated screens to full facade cladding systems, we engineer large-format architectural pieces that hold their finish outdoors. Composite panels, weather-stable acrylics and coated metals are cut and jointed to specification, then pressure-tested before installation.',
    fullDescriptionAr: 'من الشاشات المفرغة إلى أنظمة كسوة الواجهات الكاملة، نصمم قطعاً معمارية كبيرة الحجم تحافظ على تشطيبها في الأجواء الخارجية. يتم قص وتجميع الألواح المركبة والأكريليك المقاوم للعوامل الجوية والمعادن المطلية وفق المواصفات ثم اختبارها قبل التركيب.',
    icon: 'Landmark',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800',
    features: ['Weather-stable exterior materials', 'Large-format facade cladding', 'Perforated & parametric screens', 'Pressure-tested before install'],
    featuresAr: ['مواد خارجية مقاومة للعوامل الجوية', 'كسوة واجهات كبيرة الحجم', 'شاشات مفرغة وبارامترية', 'اختبار قبل التركيب']
  },
  {
    id: 'commercial-decoration',
    title: 'Commercial Decoration',
    titleAr: 'ديكور المحلات التجارية',
    category: 'commercial',
    description: 'Retail interiors, shopfronts and brand environments manufactured to a consistent design system.',
    descriptionAr: 'ديكورات داخلية للمحلات، واجهات، وبيئات علامة تجارية مصنعة وفق نظام تصميم موحد.',
    fullDescription: 'We design and manufacture the full decorative fit-out for retail spaces: shopfront panelling, illuminated brand walls, display fixtures and wayfinding, all produced from a single material and colour system so multi-location brands install identical environments every time.',
    fullDescriptionAr: 'نصمم وننتج التجهيز الديكوري الكامل للمساحات التجارية: ألواح الواجهات، جدران العلامة التجارية المضيئة، عناصر العرض، واللوحات الإرشادية، جميعها ضمن نظام مواد وألوان موحد ليحصل أصحاب الفروع المتعددة على بيئة متطابقة في كل موقع.',
    icon: 'Store',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800',
    features: ['Shopfront & interior panelling', 'Illuminated brand walls', 'Multi-location design consistency', 'Full design-to-install service'],
    featuresAr: ['ألواح واجهات وديكور داخلي', 'جدران علامة تجارية مضيئة', 'اتساق التصميم بين الفروع', 'خدمة كاملة من التصميم للتركيب']
  },
  {
    id: 'office-decoration',
    title: 'Office Decoration',
    titleAr: 'ديكور المكاتب',
    category: 'commercial',
    description: 'Acoustic partitions, reception features and workplace panelling built for daily commercial use.',
    descriptionAr: 'قواطع صوتية، عناصر استقبال، وألواح مكتبية مصممة للاستخدام التجاري اليومي.',
    fullDescription: 'Office environments demand decoration that performs: acoustic-rated partition screens, reception feature walls, meeting room panelling and durable finishes rated for daily handling. We manufacture each element to survive commercial-grade use without losing its precision edge.',
    fullDescriptionAr: 'تتطلب بيئات المكاتب ديكوراً وظيفياً بقدر ما هو جمالي: قواطع صوتية معتمدة، جدران استقبال مميزة، ألواح لغرف الاجتماعات، وتشطيبات متينة مصممة للاستخدام اليومي دون أن تفقد دقتها.',
    icon: 'Briefcase',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800',
    features: ['Acoustic-rated partitioning', 'Reception & meeting-room features', 'Commercial-grade durable finishes', 'Modular scalable systems'],
    featuresAr: ['قواطع معتمدة لعزل الصوت', 'عناصر استقبال وغرف اجتماعات', 'تشطيبات متينة بمعايير تجارية', 'أنظمة معيارية قابلة للتوسعة']
  },
  {
    id: 'restaurant-hotel-decoration',
    title: 'Restaurant & Hotel Decoration',
    titleAr: 'ديكور المطاعم والفنادق',
    category: 'commercial',
    description: 'Hospitality-grade panelling, bar fronts and ceiling features built to hold their finish under heavy use.',
    descriptionAr: 'ألواح وواجهات بار وعناصر أسقف بمعايير الضيافة، مصممة لتحمل الاستخدام المكثف دون فقدان تشطيبها.',
    fullDescription: 'Hospitality spaces put decoration under constant load: heat, humidity, spills and heavy foot traffic. We manufacture bar fronts, acoustic ceiling grids, backlit feature walls and dividing screens from moisture-resistant, wipeable substrates so the finish outlasts opening week.',
    fullDescriptionAr: 'تضع أماكن الضيافة الديكور تحت ضغط دائم: الحرارة، الرطوبة، الانسكابات، والحركة الكثيفة. نصنّع واجهات البار، شبكات الأسقف الصوتية، الجدران المضيئة، والشاشات الفاصلة من قواعد مقاومة للرطوبة وسهلة التنظيف تدوم طويلاً.',
    icon: 'UtensilsCrossed',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800',
    features: ['Moisture-resistant, wipeable finishes', 'Bar fronts & backlit feature walls', 'Acoustic ceiling grid systems', 'Built for heavy foot traffic'],
    featuresAr: ['تشطيبات مقاومة للرطوبة وسهلة التنظيف', 'واجهات بار وجدران مضيئة', 'أنظمة أسقف صوتية', 'مصممة للحركة الكثيفة']
  },
  {
    id: 'custom-decorative-designs',
    title: 'Custom-Made Decorative Designs',
    titleAr: 'تصاميم ديكورية مخصصة بالكامل',
    category: 'manufacturing',
    description: 'A dedicated design-to-manufacture track for one-off pieces that don\u2019t fit a standard catalogue.',
    descriptionAr: 'مسار تصميم وتصنيع مخصص للقطع الفريدة التي لا تندرج ضمن أي كتالوج قياسي.',
    fullDescription: 'When a project calls for something the catalogue can\u2019t cover, our design team drafts, prototypes and manufactures a fully bespoke solution, from initial sketch through CAD file to finished, installed piece. This is where material, geometry and finish are decided entirely around your brief.',
    fullDescriptionAr: 'عندما يتطلب المشروع شيئاً لا يغطيه الكتالوج، يقوم فريق التصميم لدينا برسم وتجربة وتصنيع حل مخصص بالكامل، من الرسم الأولي إلى ملف CAD وصولاً إلى القطعة النهائية المركبة. هنا يتم تحديد المادة والهندسة والتشطيب بالكامل وفق مواصفاتك.',
    icon: 'Wand2',
    image: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=800',
    features: ['Dedicated design consultation', 'Prototype before production run', 'Any material & finish combination', 'One-off & limited-series work'],
    featuresAr: ['استشارة تصميم مخصصة', 'نموذج أولي قبل الإنتاج', 'أي مزيج من المواد والتشطيبات', 'قطع فريدة أو بسلاسل محدودة']
  }
];

export const initialProjects: PortfolioProject[] = [
  {
    id: 'villa-panoramica',
    title: 'The Parametric Villa',
    titleAr: 'الفيلا البارامترية الراقية',
    category: 'residential',
    description: 'A masterclass in residential decoration, utilizing geometric CNC-routed MDF wall panels and custom mirrored partitions.',
    descriptionAr: 'تحفة فنية في الديكور السكني الراقي، باستخدام ألواح MDF الجدارية المحفورة بـ CNC وفواصل المرايا الهندسية.',
    client: 'Al-Thani Residence',
    location: 'Palm Jumeirah, Dubai',
    locationAr: 'نخلة جميرا، دبي',
    completionDate: 'November 2025',
    materials: ['High-Moisture MDF Panels', 'Brushed Brass Inlays', 'Tinted Beveled Mirrors', 'PMMA Backlit Inserts'],
    materialsAr: ['ألواح MDF مقاومة للرطوبة', 'تطعيمات النحاس المصقول', 'مرايا ملونة مشطوفة الحواف', 'إدراجات PMMA مضيئة خلفياً'],
    challenge: 'The client required a fluid, floor-to-ceiling geometric pattern across 12 meters of wall space with zero visible joints or fasteners, matching hidden doors perfectly.',
    challengeAr: 'طلب العميل نمطاً هندسياً انسيابياً ومستمراً من الأرض إلى السقف على مساحة جدارية تبلغ 12 متراً دون أي فواصل أو براغي ظاهرة، مع دمج الأبواب المخفية بشكل متناسق.',
    solution: 'We engineered a dynamic inter-locking MDF framework, CNC-carved using a 3-axis industrial router. The entire structure was spray-lacquered in-house and installed using split-batten mounting systems, hiding all construction points.',
    solutionAr: 'قمنا بهندسة إطار MDF متداخل وديناميكي، تم نحته بواسطة راوتر CNC ثلاثي المحاور. تم طلاء الهيكل بأكمله بدهان ناري فاخر في ورشتنا وتركيبه باستخدام أنظمة تعليق مخفية، مما أخفى جميع نقاط التثبيت.',
    images: [
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800'
    ],
    beforeAfterImage: {
      before: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=800', // Empty brick / construction
      after: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800' // Finished room
    }
  },
  {
    id: 'aurelia-lounge',
    title: 'Aurelia Restaurant & Lounge',
    titleAr: 'مطعم وصالة أوريليا الفاخرة',
    category: 'commercial',
    description: 'Custom hospitality interior including spectacular brass CNC-cut ceiling screens and ambient-lit bar fronts.',
    descriptionAr: 'ديكور داخلي مخصص للضيافة يشمل شاشات أسقف نحاسية مقصوصة بالـ CNC وواجهة بار مضيئة بشكل خلاب.',
    client: 'Aurelia Hospitality Group',
    location: 'Rome, Italy',
    locationAr: 'روما، إيطاليا',
    completionDate: 'September 2025',
    materials: ['CNC Brass Sheets', 'Black PMMA Sheets', 'LED Channel Lights', 'Lacquered MDF Panelling'],
    materialsAr: ['ألواح نحاس مقصوصة بـ CNC', 'ألواح PMMA أسود مصقول', 'قنوات إضاءة LED مدمجة', 'ألواح MDF مطلية ناري'],
    challenge: 'Acoustics were a primary issue in this high-ceilinged historic building. The design had to absorb noise while appearing completely luxurious and light.',
    challengeAr: 'كانت الصوتيات مشكلة رئيسية في هذا المبنى التاريخي ذي الأسقف المرتفعة. كان لا بد للتصميم من امتصاص الضوضاء مع الحفاظ على مظهر فاخر ومشرق.',
    solution: 'We carved intricate acoustic panels from composite materials behind custom CNC-patterned brass screens. This dual-layer approach combined sound isolation with luxury aesthetics.',
    solutionAr: 'قمنا بنحت ألواح صوتية ماصة للضوضاء من مواد مركبة خلف شاشات نحاسية مخصصة ومزخرفة بـ CNC. جمع هذا النهج ثنائي الطبقات بين عزل الصوت والجمال الفاخر.',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800'
    ]
  },
  {
    id: 'monolith-facade',
    title: 'Monolith Storefront Facade',
    titleAr: 'واجهة متجر مونوليث المعمارية',
    category: 'manufacturing',
    description: 'A striking luxury storefront combining geometric cutouts, matte black finishes, and golden branding details.',
    descriptionAr: 'واجهة متجر فاخرة لافتة للانتباه تجمع بين الأشكال الهندسية المفرغة، والتشطيب الأسود المطفي، وتفاصيل الهوية الذهبية.',
    client: 'Monolith Luxury Atelier',
    location: 'Milano, Italy',
    locationAr: 'ميلانو، إيطاليا',
    completionDate: 'January 2026',
    materials: ['Composite Architectural Panel', 'Laser-Cut Steel Logo', 'Gold Leaf Finishes', 'Ultra-Clear Security Glass'],
    materialsAr: ['ألواح كلادينج معمارية مركبة', 'شعار فولاذي مقصوص بالليزر', 'تشطيبات ورق الذهب', 'زجاج سيكوريت فائق الوضوح'],
    challenge: 'Creating a weather-resistant exterior facade that holds up under direct rain and sun while retaining an pristine art-gallery texture.',
    challengeAr: 'إنشاء واجهة خارجية مقاومة للعوامل الجوية تتحمل المطر وأشعة الشمس المباشرة مع الاحتفاظ بنسيج فني نقي يشبه المعارض الفنية.',
    solution: 'Used state-of-the-art thermo-treated composite panels machined on our high-speed CNC router, finished with exterior-grade UV-stable liquid steel coatings.',
    solutionAr: 'استخدمنا ألواحاً مركبة معالجة حرارياً تم تصنيعها على راوتر CNC فائق السرعة، ومطلية بطلاءات الفولاذ السائل المقاوم للأشعة فوق البنفسجية للاستخدام الخارجي.',
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200',
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=800'
    ],
    beforeAfterImage: {
      before: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800', // Under construction storefront
      after: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200' // Gorgeous storefront
    }
  }
];

export const initialProducts: CNCProduct[] = [
  {
    id: 'arabesque-panel',
    title: 'Arabesque Relief Panel',
    titleAr: 'لوح أرابيسك المجسم',
    category: 'decor-panels',
    description: 'A modular geometric relief panel engineered for feature walls, room dividers, and sliding partition systems.',
    descriptionAr: 'لوح هندسي مجسم ومعياري مصمم للجدران الديكورية، الفواصل، وأنظمة الأبواب المنزلقة.',
    materials: ['E0 Moisture-Resistant MDF', 'PVC Foam Board', 'PMMA Overlay Option'],
    materialsAr: ['MDF فئة E0 مقاوم للرطوبة', 'لوح PVC رغوي', 'خيار تغليف بـ PMMA'],
    sizes: ['120x240 cm (Standard)', '100x200 cm', 'Custom sizes on demand'],
    customizationOptions: ['Lacquered finish (any RAL color)', 'Backlight integration ready', 'Frame thickness customization'],
    customizationOptionsAr: ['طلاء ناري لامع أو مطفي (أي لون من كتالوج RAL)', 'جاهز لتركيب الإضاءة الخلفية المدمجة', 'تعديل سماكة الإطار الخارجي'],
    images: [
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=800'
    ],
    specifications: {
      'Available Thicknesses': '12mm, 18mm, 25mm, 30mm',
      'Lead Time': '7 to 10 working days',
      'Installation Guide': 'Pre-drilled mounting slots available upon request',
      'Environmental rating': 'E0 Low Formaldehyde MDF'
    },
    specificationsAr: {
      'السماكات المتاحة': '١٢ ملم، ١٨ ملم، ٢٥ ملم، ٣٠ ملم',
      'مدة التنفيذ': 'من ٧ إلى ١٠ أيام عمل',
      'دليل التركيب': 'فتحات تثبيت مجهزة مسبقاً بناءً على الطلب',
      'التقييم البيئي': 'MDF فئة E0 صديق للبيئة ومنخفض الانبعاثات'
    }
  },
  {
    id: 'imperium-mirror',
    title: 'Imperium Hex Mirror Panel',
    titleAr: 'لوح مرآة إمبيريوم السداسي',
    category: 'mirrors',
    description: 'An architectural mirror insert set inside a CNC-milled geometric MDF frame, built as a decorative wall system.',
    descriptionAr: 'مرآة معمارية مثبتة داخل إطار هندسي من الـ MDF المفرز بدقة CNC، كنظام جداري ديكوري متكامل.',
    materials: ['Tinted Safety Mirror Glass', 'CNC-Milled MDF Frame', 'Anodized Aluminum Trim'],
    materialsAr: ['زجاج مرايا آمن ملون', 'إطار MDF مفرز بـ CNC', 'إطار ألومنيوم مؤكسد'],
    sizes: ['80x80 cm', '100x100 cm', '120x120 cm'],
    customizationOptions: ['Brushed, matte or gloss frame finish', 'Bronze or grey glass tint', 'Safety shatterproof backing'],
    customizationOptionsAr: ['تشطيب إطار مصقول أو مطفي أو لامع', 'مرايا بلون برونزي أو رمادي دخاني', 'قاعدة حماية مقاومة للتناثر والكسر'],
    images: [
      'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=800',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800'
    ],
    specifications: {
      'Weight': '12 kg (for 80x80cm)',
      'Frame Depth': '40 mm',
      'Mirror thickness': '6 mm premium float',
      'Hanging hardware': 'Heavy-duty Z-bar cleat included'
    },
    specificationsAr: {
      'الوزن': '١٢ كجم (لمقاس ٨٠×٨٠ سم)',
      'عمق الإطار': '٤٠ ملم',
      'سماكة المرآة': '٦ ملم زجاج معالج ممتاز',
      'ملحقات التثبيت': 'علاقة معدنية ثقيلة على شكل Z متضمنة'
    }
  },
  {
    id: 'meridian-signage-panel',
    title: 'Meridian Illuminated Signage Panel',
    titleAr: 'لوح ميريديان الإعلاني المضيء',
    category: 'store-signs',
    description: 'A backlit PMMA and composite signage panel engineered for storefronts, reception walls, and brand identity displays.',
    descriptionAr: 'لوح إعلاني مضيء من PMMA والألواح المركبة، مصمم لواجهات المحلات وجدران الاستقبال وعرض الهوية التجارية.',
    materials: ['Cast PMMA Face', 'Aluminum Composite Backing', 'LED Edge-Lighting Channel'],
    materialsAr: ['واجهة PMMA مصبوبة', 'قاعدة ألومنيوم مركب', 'قناة إضاءة LED جانبية'],
    sizes: ['45x30 cm', '90x60 cm', 'Custom sizes on demand'],
    customizationOptions: ['Through-cut or engraved typography', 'Single or dual-color LED channel', 'Wall-mount or standoff hardware'],
    customizationOptionsAr: ['خط مقصوص بالكامل أو منقوش', 'قناة إضاءة أحادية أو ثنائية اللون', 'تركيب حائطي أو بمسافات فاصلة'],
    images: [
      'https://images.unsplash.com/photo-1590794056226-79ef3a8147e1?q=80&w=800',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800'
    ],
    specifications: {
      'Thickness': '10-25 mm',
      'Power': '12V LED driver, IP-rated for interior/exterior',
      'Finish': 'UV-stable, colourfast for 5+ years',
      'Packaging': 'Crated for freight, install hardware included'
    },
    specificationsAr: {
      'السماكة': '١٠-٢٥ ملم',
      'الطاقة': 'محول LED بجهد ١٢ فولت، مصنف للاستخدام الداخلي والخارجي',
      'التشطيب': 'مقاوم للأشعة فوق البنفسجية وثابت اللون لأكثر من ٥ سنوات',
      'التعبئة والتغليف': 'تعبئة للشحن مع ملحقات التركيب'
    }
  }
];

export const initialTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Arch. Francesco Rossi',
    nameAr: 'المهندس فرانشيسكو روسي',
    role: 'Principal Architect',
    roleAr: 'كبير المهندسين المعماريين',
    company: 'Studio Rossi Milano',
    companyAr: 'ستوديو روسي ميلانو',
    content: 'LES ROMAINS is an exceptional partner. Their CNC precision, coupled with an innate understanding of high-end Italian design materials, made our restaurant project a massive success.',
    contentAr: 'إن "ليز رومان" شريك استثنائي بحق. إن دقة الـ CNC لديهم، مقترنة بفهمهم الفطري لمواد التصميم الإيطالي الراقي، جعلت من مشروع مطعمنا نجاحاً باهراً وفارقاً.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200',
    isFeatured: true
  },
  {
    id: 'test-2',
    name: 'Yasmin Al-Mansoori',
    nameAr: 'ياسمين المنصوري',
    role: 'Senior Project Lead',
    roleAr: 'قائدة مشاريع أولى',
    company: 'Emaar Properties PJSC',
    companyAr: 'إعمار العقارية ش.م.ع',
    content: 'We commissioned custom wall panels and metal signage for a luxury residential lobby. Their work was finished on-time, perfectly matching the visual rendering specifications.',
    contentAr: 'لقد كلفناهم بتصنيع ألواح جدران مخصصة ولوحات معدنية لردهة سكنية فاخرة. تم الانتهاء من العمل في الوقت المحدد، وتطابق بشكل مذهل مع مواصفات المخططات البصرية والـ 3D.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200',
    isFeatured: true
  }
];

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Art of CNC-Routed Parametric Walls',
    titleAr: 'فن الجدران البارامترية المحفورة بـ CNC',
    excerpt: 'Explore how modern 3D CNC wood processing is redefining textures and architectural depth in corporate and residential environments.',
    excerptAr: 'اكتشف كيف تعيد معالجة الأخشاب ثلاثية الأبعاد بـ CNC تعريف الملمس والعمق المعماري في البيئات التجارية والسكنية.',
    content: 'Parametric wall design represents the peak fusion of digital computation and tactile craftsmanship. By translating mathematical algorithms into solid wood surfaces, our industrial routers carve flowing, wave-like textures that react dynamically to natural sunlight. In this article, we delve deep into the software pipelines, wood selections, and sanding secrets that make a panel truly seamless...',
    contentAr: 'يمثل تصميم الجدران البارامترية قمة الاندماج بين الحساب الرقمي والحرفية الملموسة. من خلال ترجمة الخوارزميات الرياضية إلى أسطح خشبية صلبة، تنحت أجهزة التوجيه الصناعية لدينا قواماً منساباً يشبه الأمواج يتفاعل ديناميكياً مع ضوء الشمس الطبيعي. في هذا المقال، نتعمق في تفاصيل برمجيات التصميم، واختيار الأخشاب، وأسرار الصنفرة والدهان التي تجعل اللوح يبدو قطعة واحدة بلا فواصل...',
    category: 'Design Insights',
    categoryAr: 'أفكار التصميم',
    author: 'Jean-Pierre Roman',
    authorAr: 'جان بيير رومان',
    date: 'March 14, 2026',
    readTime: '6 min read',
    readTimeAr: '٦ دقائق قراءة',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800',
    tags: ['CNC Wood', 'Parametric Design', 'Interior Architecture']
  },
  {
    id: 'post-2',
    title: 'Choosing Metals & Acrylics for Modern Storefronts',
    titleAr: 'اختيار المعادن والأكريليك لواجهات المحلات الحديثة',
    excerpt: 'An architect’s guide to selecting weather-resistant, laser-cut composite materials for high-traffic high-end commercial facades.',
    excerptAr: 'دليل المعماريين لاختيار المواد المركبة المقاومة للعوامل الجوية والمقصوصة بالليزر للواجهات التجارية الفاخرة.',
    content: 'A shopfront facade is the physical handshake of your brand. When fabricating luxury retail exteriors, selecting materials that combine pristine visual quality with rugged weather resistance is paramount. We review the benefits of aluminum composite materials (ACM), laser-cut weatherized brass, thermo-shield acrylic sheets, and low-iron architectural glass to construct facades that retain their elegance for decades.',
    contentAr: 'واجهة المحل هي المصافحة الملموسة الأولى لعلامتك التجارية. عند تصنيع واجهات المحلات الراقية، فإن اختيار المواد التي تجمع بين الجودة البصرية النقية والمقاومة الشديدة للعوامل الجوية أمر باليد الأهم. نستعرض هنا فوائد ألواح الألومنيوم المركبة (ACM)، النحاس المعالج المقاوم للأكسدة والمقصوص بالليزر، ألواح الأكريليك المقاومة للحرارة، والزجاج المعماري منخفض الحديد لبناء واجهات تحتفظ بأناقتها لعقود من الزمن.',
    category: 'Facades',
    categoryAr: 'الواجهات المعمارية',
    author: 'Michel Roman',
    authorAr: 'ميشيل رومان',
    date: 'April 22, 2026',
    readTime: '8 min read',
    readTimeAr: '٨ دقائق قراءة',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800',
    tags: ['Commercial Facades', 'Laser Cutting', 'Material Selection']
  }
];

export const initialQuotes: QuoteRequest[] = [
  {
    id: 'q-1001',
    name: 'Karim Bensalah',
    phone: '+971 50 123 4567',
    email: 'karim@bensalahdesign.ae',
    city: 'Dubai',
    projectType: 'Commercial Facade & Signage',
    budget: '$15,000 - $30,000',
    description: 'We need a full 3D geometric wood panel cladding for our new fashion showroom entrance in Mall of the Emirates. The structure must contain backlighting channels.',
    preferredContact: 'whatsapp',
    referenceImages: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=400'],
    status: 'pending',
    date: '2026-07-10'
  }
];

export const initialSettings: AppSettings = {
  seoTitle: 'LES ROMAINS | Decorative CNC Manufacturing Studio',
  seoDescription: 'Precision CNC manufacturing of decorative wall panels, PMMA/acrylic products, PVC panelling, MDF solutions, engraving and architectural decoration for residential, commercial and hospitality projects.',
  whatsappNumber: '+213675858793',
  contactPhone: '+213 675 858 793',
  contactEmail: 'sadeco005@gmail.com',
  address: 'Batna, Algeria',
  addressAr: 'باتنة، الجزائر',
  businessHours: 'Sat - Thu: 08:00 - 18:00 | Friday: Closed',
  businessHoursAr: 'السبت - الخميس: ٠٨:٠٠ - ١٨:٠٠ | الجمعة: مغلق',
  facebookUrl: '',
  instagramUrl: '',
  tiktokUrl: '',
  youtubeUrl: '',
  linkedinUrl: '',
  
  // Dynamic Homepage Defaults
  logoText: 'LES ROMAINS',
  logoTextAr: 'ليز رومان',
  heroTitle: 'Decorative Precision, Engineered by CNC',
  heroTitleAr: 'دقة الديكور، مصنّعة بتقنية CNC',
  heroSubtitle: 'LES ROMAINS is a modern decorative manufacturing studio, engineering custom wall panels, PMMA and PVC surfaces, MDF solutions, and architectural decoration for residential, commercial and hospitality spaces.',
  heroSubtitleAr: 'ليز رومان استوديو تصنيع ديكوري حديث، متخصص في تصميم وتصنيع الألواح الجدارية المخصصة، وأسطح PMMA وPVC، وحلول MDF، والديكور المعماري للمساحات السكنية والتجارية والفندقية.',
  heroBadge: 'DECORATIVE MANUFACTURING, CNC-ENGINEERED',
  heroBadgeAr: 'تصنيع ديكوري بدقة CNC',
  heroBgImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600',
  
  homeStat1Value: '150+',
  homeStat1Label: 'DECORATIVE PROJECTS DELIVERED',
  homeStat1LabelAr: 'مشروع ديكوري منجز',
  homeStat2Value: '< 0.2mm',
  homeStat2Label: 'CNC TOLERANCE THRESHOLD',
  homeStat2LabelAr: 'نسبة انحراف ميكنة الـ CNC',
  homeStat3Value: '4',
  homeStat3Label: 'CORE MATERIALS: PMMA / PVC / MDF / METAL',
  homeStat3LabelAr: 'مواد أساسية: PMMA / PVC / MDF / معدن',
  
  // SEO & Management
  seoKeywords: 'CNC Algeria, Les Romains, decorative wall panels, PMMA acrylic panels, PVC decorative panels, MDF decoration, CNC engraving Batna, architectural decoration',
  ogTitle: 'Les Romains | Decorative CNC Manufacturing',
  ogDescription: 'Custom decorative wall panels, acrylic and PVC surfaces, MDF solutions, CNC cutting and engraving for residential, commercial and hospitality projects.',
  robotsTxt: 'User-agent: *\nAllow: /\nSitemap: https://lesromains.com/sitemap.xml',
  sitemapXml: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://lesromains.com/</loc><priority>1.0</priority></url>\n</urlset>',
  redirectRules: '/old-about -> /about\n/services-old -> /services',
  googleMapsUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102927.42082260656!2d6.113402422533611!3d35.55160867746175!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12f409acdc26cd8b%3A0x6b7dbb858448ec6d!2sBatna%2C%20Algeria!5e0!3m2!1sen!2s!4v1700000000000!5m2!1sen!2s',
  footerText: 'Les Romains Decorative CNC Manufacturing Studio - Batna, Algeria.',
  footerTextAr: 'ليز رومان لتصنيع الديكورات بتقنية CNC - باتنة، الجزائر.'
};

// -----------------------------------------------------------------------------
// Pricing Estimator seed data
// -----------------------------------------------------------------------------
// Four factor families feed the public Quote Estimator and are all managed
// from the "Pricing & Materials" admin screen:
//   material    -> price per m² (DZD)
//   projectType -> multiplier applied on top of the material cost
//   complexity  -> multiplier for simple vs. intricate work
//   wilaya      -> flat transport/installation fee (DZD), tiered by distance from Batna

const materialFactors: PricingFactor[] = [
  { id: 'MAT-001', type: 'material', name: 'PMMA / Acrylic', nameAr: 'PMMA / أكريليك', value: 4500, unit: 'دج/م²', isActive: true, sortOrder: 1 },
  { id: 'MAT-002', type: 'material', name: 'PVC Panel', nameAr: 'لوح PVC', value: 2800, unit: 'دج/م²', isActive: true, sortOrder: 2 },
  { id: 'MAT-003', type: 'material', name: 'MDF Board', nameAr: 'لوح MDF', value: 2200, unit: 'دج/م²', isActive: true, sortOrder: 3 },
  { id: 'MAT-004', type: 'material', name: 'Metal / Composite', nameAr: 'معدن / مواد مركبة', value: 6000, unit: 'دج/م²', isActive: true, sortOrder: 4 }
];

const projectTypeFactors: PricingFactor[] = [
  { id: 'PT-001', type: 'projectType', name: 'Decorative Wall Panels', nameAr: 'ألواح جدارية ديكورية', value: 1.0, unit: '×', isActive: true, sortOrder: 1 },
  { id: 'PT-002', type: 'projectType', name: 'PMMA / Acrylic Products', nameAr: 'منتجات PMMA / أكريليك', value: 1.1, unit: '×', isActive: true, sortOrder: 2 },
  { id: 'PT-003', type: 'projectType', name: 'PVC Decorative Panels', nameAr: 'ألواح PVC ديكورية', value: 0.95, unit: '×', isActive: true, sortOrder: 3 },
  { id: 'PT-004', type: 'projectType', name: 'MDF Decorative Solutions', nameAr: 'حلول MDF ديكورية', value: 1.0, unit: '×', isActive: true, sortOrder: 4 },
  { id: 'PT-005', type: 'projectType', name: 'Interior Decorative Elements', nameAr: 'عناصر ديكور داخلي', value: 1.15, unit: '×', isActive: true, sortOrder: 5 },
  { id: 'PT-006', type: 'projectType', name: 'Custom CNC Cutting', nameAr: 'قص CNC مخصص', value: 1.0, unit: '×', isActive: true, sortOrder: 6 },
  { id: 'PT-007', type: 'projectType', name: 'Engraving', nameAr: 'نقش وحفر', value: 1.05, unit: '×', isActive: true, sortOrder: 7 },
  { id: 'PT-008', type: 'projectType', name: 'Architectural Decorative Pieces', nameAr: 'قطع ديكورية معمارية', value: 1.3, unit: '×', isActive: true, sortOrder: 8 },
  { id: 'PT-009', type: 'projectType', name: 'Commercial Decoration', nameAr: 'ديكور تجاري', value: 1.2, unit: '×', isActive: true, sortOrder: 9 },
  { id: 'PT-010', type: 'projectType', name: 'Office Decoration', nameAr: 'ديكور مكتبي', value: 1.1, unit: '×', isActive: true, sortOrder: 10 },
  { id: 'PT-011', type: 'projectType', name: 'Restaurant & Hotel Decoration', nameAr: 'ديكور مطاعم وفنادق', value: 1.25, unit: '×', isActive: true, sortOrder: 11 },
  { id: 'PT-012', type: 'projectType', name: 'Custom-Made Decorative Design', nameAr: 'تصميم ديكوري مخصص بالكامل', value: 1.4, unit: '×', isActive: true, sortOrder: 12 }
];

const complexityFactors: PricingFactor[] = [
  { id: 'CX-001', type: 'complexity', name: 'Simple', nameAr: 'بسيط', value: 1.0, unit: '×', isActive: true, sortOrder: 1 },
  { id: 'CX-002', type: 'complexity', name: 'Moderate', nameAr: 'متوسط التعقيد', value: 1.2, unit: '×', isActive: true, sortOrder: 2 },
  { id: 'CX-003', type: 'complexity', name: 'Complex', nameAr: 'معقد', value: 1.45, unit: '×', isActive: true, sortOrder: 3 }
];

// Algeria's 58 wilayas, tiered by approximate distance/transport cost from
// Batna (headquarters). The admin can fine-tune every value individually
// afterwards — these are sensible defaults, not surveyed freight rates.
const wilayaTiers: { fee: number; wilayas: [string, string][] }[] = [
  {
    fee: 0,
    wilayas: [['Batna', 'باتنة']]
  },
  {
    fee: 2000,
    wilayas: [
      ['Khenchela', 'خنشلة'], ['Oum El Bouaghi', 'أم البواقي'], ["M'Sila", 'المسيلة'],
      ['Sétif', 'سطيف'], ['Biskra', 'بسكرة'], ['Tébessa', 'تبسة']
    ]
  },
  {
    fee: 4000,
    wilayas: [
      ['Constantine', 'قسنطينة'], ['Mila', 'ميلة'], ['Jijel', 'جيجل'],
      ['Bordj Bou Arréridj', 'برج بوعريريج'], ['Djelfa', 'الجلفة'], ['Ouargla', 'ورقلة'],
      ['Souk Ahras', 'سوق أهراس'], ['Guelma', 'قالمة'], ['Annaba', 'عنابة'],
      ['Skikda', 'سكيكدة'], ['El Oued', 'الوادي'], ['Ouled Djellal', 'أولاد جلال'],
      ['Touggourt', "تقرت"], ["El M'Ghair", 'المغير']
    ]
  },
  {
    fee: 6000,
    wilayas: [
      ['Alger', 'الجزائر'], ['Blida', 'البليدة'], ['Tizi Ouzou', 'تيزي وزو'],
      ['Béjaïa', 'بجاية'], ['Bouira', 'البويرة'], ['Médéa', 'المدية'],
      ['Boumerdès', 'بومرداس'], ['Tipaza', 'تيبازة'], ['Aïn Defla', 'عين الدفلى'],
      ['Chlef', 'الشلف'], ['Tiaret', 'تيارت'], ['Relizane', 'غليزان'],
      ['Mostaganem', 'مستغانم'], ['Mascara', 'معسكر'], ['Tissemsilt', 'تيسمسيلت'],
      ['Laghouat', 'الأغواط'], ['Ghardaïa', 'غرداية'], ['El Meniaa', 'المنيعة']
    ]
  },
  {
    fee: 10000,
    wilayas: [
      ['Oran', 'وهران'], ['Sidi Bel Abbès', 'سيدي بلعباس'], ['Tlemcen', 'تلمسان'],
      ['Saïda', 'سعيدة'], ['Aïn Témouchent', 'عين تموشنت'], ['El Bayadh', 'البيض'],
      ['Naâma', 'النعامة'], ['Béchar', 'بشار'], ['Adrar', 'أدرار'],
      ['Timimoun', 'تيميمون'], ['Béni Abbès', 'بني عباس'], ['Tindouf', 'تندوف'],
      ['Bordj Badji Mokhtar', 'برج باجي مختار'], ['In Salah', 'عين صالح'],
      ['In Guezzam', 'عين قزام'], ['Tamanrasset', 'تمنراست'], ['Illizi', 'إليزي'],
      ['Djanet', 'جانت']
    ]
  }
];

const wilayaFactors: PricingFactor[] = wilayaTiers.flatMap((tier, tierIdx) =>
  tier.wilayas.map(([name, nameAr], idx) => ({
    id: `WIL-${String(tierIdx * 100 + idx + 1).padStart(3, '0')}`,
    type: 'wilaya' as const,
    name,
    nameAr,
    value: tier.fee,
    unit: 'دج',
    isActive: true,
    sortOrder: tierIdx * 100 + idx
  }))
);

export const initialPricingFactors: PricingFactor[] = [
  ...materialFactors,
  ...projectTypeFactors,
  ...complexityFactors,
  ...wilayaFactors
];
