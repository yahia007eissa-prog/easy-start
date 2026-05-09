export interface Governorate {
  id: string;
  name: string;
  nameAr: string;
  districts: District[];
}

export interface District {
  id: string;
  name: string;
  nameAr: string;
}

export const EGYPT_GOVERNORATES: Governorate[] = [
  {
    id: 'cairo', name: 'Cairo', nameAr: 'القاهرة',
    districts: [
      { id: 'nasr-city',       name: 'Nasr City',        nameAr: 'مدينة نصر' },
      { id: 'heliopolis',      name: 'Heliopolis',        nameAr: 'مصر الجديدة' },
      { id: 'new-cairo',       name: 'New Cairo',         nameAr: 'القاهرة الجديدة' },
      { id: 'maadi',           name: 'Maadi',             nameAr: 'المعادي' },
      { id: 'zamalek',         name: 'Zamalek',           nameAr: 'الزمالك' },
      { id: 'garden-city',     name: 'Garden City',       nameAr: 'جاردن سيتي' },
      { id: 'downtown',        name: 'Downtown',          nameAr: 'وسط البلد' },
      { id: 'ain-shams',       name: 'Ain Shams',         nameAr: 'عين شمس' },
      { id: 'mokattam',        name: 'Mokattam',          nameAr: 'المقطم' },
      { id: 'dar-el-salam',    name: 'Dar El Salam',      nameAr: 'دار السلام' },
      { id: 'shubra',          name: 'Shubra',            nameAr: 'شبرا' },
      { id: 'matariya',        name: 'Matariya',          nameAr: 'المطرية' },
      { id: 'helwan',          name: 'Helwan',            nameAr: 'حلوان' },
      { id: 'manshiyat-naser', name: 'Manshiyat Naser',   nameAr: 'منشية ناصر' },
      { id: 'tura',            name: 'Tura',              nameAr: 'طرة' },
      { id: 'masr-el-kadima',  name: 'Old Cairo',         nameAr: 'مصر القديمة' },
      { id: 'boulaq',          name: 'Boulaq',            nameAr: 'بولاق' },
      { id: 'el-basatin',      name: 'El Basatin',        nameAr: 'البساتين' },
      { id: 'el-salam',        name: 'El Salam',          nameAr: 'السلام' },
      { id: 'el-nozha',        name: 'El Nozha',          nameAr: 'النزهة' },
      { id: 'el-amiriya',      name: 'El Amiriya',        nameAr: 'العمرانية' },
      { id: 'imbaba-cairo',    name: 'Imbaba (Cairo)',     nameAr: 'إمبابة (القاهرة)' },
      { id: 'shorouk',         name: 'El Shorouk',        nameAr: 'الشروق' },
      { id: 'badr',            name: 'Badr City',         nameAr: 'مدينة بدر' },
      { id: 'new-admin-cap',   name: 'New Administrative Capital', nameAr: 'العاصمة الإدارية الجديدة' },
    ],
  },
  {
    id: 'giza', name: 'Giza', nameAr: 'الجيزة',
    districts: [
      { id: '6th-october',   name: '6th of October',  nameAr: 'السادس من أكتوبر' },
      { id: 'sheikh-zayed',  name: 'Sheikh Zayed',    nameAr: 'الشيخ زايد' },
      { id: 'haram',         name: 'Haram',           nameAr: 'الهرم' },
      { id: 'dokki',         name: 'Dokki',           nameAr: 'الدقي' },
      { id: 'agouza',        name: 'Agouza',          nameAr: 'العجوزة' },
      { id: 'mohandessin',   name: 'Mohandessin',     nameAr: 'المهندسين' },
      { id: 'imbaba',        name: 'Imbaba',          nameAr: 'إمبابة' },
      { id: 'omraniya',      name: 'Omraniya',        nameAr: 'العمرانية' },
      { id: 'faisal',        name: 'Faisal',          nameAr: 'فيصل' },
      { id: 'giza-center',   name: 'Giza Center',     nameAr: 'مركز الجيزة' },
      { id: 'warraq',        name: 'Warraq',          nameAr: 'الوراق' },
      { id: 'ard-el-lewa',   name: 'Ard El Lewa',     nameAr: 'أرض اللواء' },
      { id: 'boulaq-dakrour',name: 'Boulaq Dakrour',  nameAr: 'بولاق الدكرور' },
      { id: 'hadayek-ahram', name: 'Hadayek El Ahram',nameAr: 'حدائق الأهرام' },
      { id: 'smart-village', name: 'Smart Village Area',nameAr: 'منطقة القرية الذكية' },
    ],
  },
  {
    id: 'alexandria', name: 'Alexandria', nameAr: 'الإسكندرية',
    districts: [
      { id: 'sidi-bishr',    name: 'Sidi Bishr',      nameAr: 'سيدي بشر' },
      { id: 'montaza',       name: 'Montaza',         nameAr: 'المنتزه' },
      { id: 'smouha',        name: 'Smouha',          nameAr: 'سموحة' },
      { id: 'kafr-abdo',     name: 'Kafr Abdo',       nameAr: 'كفر عبده' },
      { id: 'ibrahimia',     name: 'Ibrahimia',       nameAr: 'إبراهيمية' },
      { id: 'miami',         name: 'Miami',           nameAr: 'ميامي' },
      { id: 'stanley',       name: 'Stanley',         nameAr: 'ستانلي' },
      { id: 'gleem',         name: 'Gleem',           nameAr: 'جليم' },
      { id: 'san-stefano',   name: 'San Stefano',     nameAr: 'سان ستيفانو' },
      { id: 'louran',        name: 'Louran',          nameAr: 'لوران' },
      { id: 'azarita',       name: 'Azarita',         nameAr: 'الأزاريطة' },
      { id: 'el-manshiya',   name: 'El Manshiya',     nameAr: 'المنشية' },
      { id: 'agami',         name: 'Agami',           nameAr: 'العجمي' },
      { id: 'el-amriya',     name: 'El Amriya',       nameAr: 'العامرية' },
      { id: 'el-dekhila',    name: 'El Dekhila',      nameAr: 'الدخيلة' },
      { id: 'el-maamoura',   name: 'El Maamoura',     nameAr: 'المعمورة' },
      { id: 'borg-el-arab',  name: 'Borg El Arab',    nameAr: 'برج العرب' },
    ],
  },
  {
    id: 'sharkia', name: 'Sharkia', nameAr: 'الشرقية',
    districts: [
      { id: 'zagazig',       name: 'Zagazig',         nameAr: 'الزقازيق' },
      { id: '10th-ramadan',  name: '10th of Ramadan', nameAr: 'العاشر من رمضان' },
      { id: 'belbeis',       name: 'Belbeis',         nameAr: 'بلبيس' },
      { id: 'minya-el-qamh', name: 'Minya El Qamh',  nameAr: 'منيا القمح' },
      { id: 'hehya',         name: 'Hehya',           nameAr: 'ههيا' },
      { id: 'abu-kabir',     name: 'Abu Kabir',       nameAr: 'أبو كبير' },
      { id: 'faqous',        name: 'Faqous',          nameAr: 'فاقوس' },
      { id: 'el-husseiniya', name: 'El Husseiniya',   nameAr: 'الحسينية' },
    ],
  },
  {
    id: 'dakahlia', name: 'Dakahlia', nameAr: 'الدقهلية',
    districts: [
      { id: 'mansoura',      name: 'Mansoura',        nameAr: 'المنصورة' },
      { id: 'talkha',        name: 'Talkha',          nameAr: 'طلخا' },
      { id: 'mit-ghamr',     name: 'Mit Ghamr',       nameAr: 'ميت غمر' },
      { id: 'el-sinbillawin',name: 'El Sinbillawin',  nameAr: 'السنبلاوين' },
      { id: 'dikirnis',      name: 'Dikirnis',        nameAr: 'دكرنس' },
      { id: 'aga',           name: 'Aga',             nameAr: 'أجا' },
      { id: 'manzala',       name: 'Manzala',         nameAr: 'منزلة' },
    ],
  },
  {
    id: 'gharbia', name: 'Gharbia', nameAr: 'الغربية',
    districts: [
      { id: 'tanta',         name: 'Tanta',           nameAr: 'طنطا' },
      { id: 'el-mahalla',    name: 'El Mahalla El Kubra', nameAr: 'المحلة الكبرى' },
      { id: 'kafr-el-zayat', name: 'Kafr El Zayat',   nameAr: 'كفر الزيات' },
      { id: 'zefta',         name: 'Zefta',           nameAr: 'زفتى' },
      { id: 'el-santa',      name: 'El Santa',        nameAr: 'السنطة' },
      { id: 'basyoun',       name: 'Basyoun',         nameAr: 'بسيون' },
    ],
  },
  {
    id: 'menoufia', name: 'Menoufia', nameAr: 'المنوفية',
    districts: [
      { id: 'shebin-el-kom', name: 'Shebin El Kom',   nameAr: 'شبين الكوم' },
      { id: 'menouf',        name: 'Menouf',          nameAr: 'منوف' },
      { id: 'sadat-city',    name: 'Sadat City',      nameAr: 'مدينة السادات' },
      { id: 'ashmoun',       name: 'Ashmoun',         nameAr: 'أشمون' },
      { id: 'el-bagor',      name: 'El Bagor',        nameAr: 'الباجور' },
      { id: 'tala',          name: 'Tala',            nameAr: 'تلا' },
    ],
  },
  {
    id: 'qalyubia', name: 'Qalyubia', nameAr: 'القليوبية',
    districts: [
      { id: 'banha',         name: 'Banha',           nameAr: 'بنها' },
      { id: 'shubra-el-kheima', name: 'Shubra El Kheima', nameAr: 'شبرا الخيمة' },
      { id: 'qalyub',        name: 'Qalyub',          nameAr: 'قليوب' },
      { id: 'khanka',        name: 'Khanka',          nameAr: 'الخانكة' },
      { id: 'obour',         name: 'Obour City',      nameAr: 'مدينة العبور' },
      { id: 'el-khosous',    name: 'El Khosous',      nameAr: 'الخصوص' },
    ],
  },
  {
    id: 'beheira', name: 'Beheira', nameAr: 'البحيرة',
    districts: [
      { id: 'damanhour',     name: 'Damanhour',       nameAr: 'دمنهور' },
      { id: 'kafr-el-dawwar',name: 'Kafr El Dawwar',  nameAr: 'كفر الدوار' },
      { id: 'el-mahmoudiya', name: 'El Mahmoudiya',   nameAr: 'المحمودية' },
      { id: 'rashid',        name: 'Rashid (Rosetta)', nameAr: 'رشيد' },
      { id: 'abu-hummus',    name: 'Abu Hummus',      nameAr: 'أبو حمص' },
      { id: 'el-delengat',   name: 'El Delengat',     nameAr: 'الدلنجات' },
    ],
  },
  {
    id: 'kafr-el-sheikh', name: 'Kafr El Sheikh', nameAr: 'كفر الشيخ',
    districts: [
      { id: 'kafr-el-sheikh-city', name: 'Kafr El Sheikh City', nameAr: 'مدينة كفر الشيخ' },
      { id: 'desouk',        name: 'Desouk',          nameAr: 'دسوق' },
      { id: 'fuwwa',         name: 'Fuwwa',           nameAr: 'فوه' },
      { id: 'el-hamoul',     name: 'El Hamoul',       nameAr: 'الحامول' },
      { id: 'baltim',        name: 'Baltim',          nameAr: 'بلطيم' },
    ],
  },
  {
    id: 'damietta', name: 'Damietta', nameAr: 'دمياط',
    districts: [
      { id: 'damietta-city', name: 'Damietta City',   nameAr: 'مدينة دمياط' },
      { id: 'new-damietta',  name: 'New Damietta',    nameAr: 'دمياط الجديدة' },
      { id: 'ras-el-bar',    name: 'Ras El Bar',      nameAr: 'رأس البر' },
      { id: 'el-zarqa',      name: 'El Zarqa',        nameAr: 'الزرقا' },
      { id: 'el-senbillawin-damietta', name: 'Faraskour', nameAr: 'فارسكور' },
    ],
  },
  {
    id: 'port-said', name: 'Port Said', nameAr: 'بورسعيد',
    districts: [
      { id: 'port-said-center', name: 'Port Said Center', nameAr: 'بورسعيد المركز' },
      { id: 'el-arab',       name: 'El Arab',         nameAr: 'العرب' },
      { id: 'el-manakh',     name: 'El Manakh',       nameAr: 'المناخ' },
      { id: 'el-zohour',     name: 'El Zohour',       nameAr: 'الزهور' },
      { id: 'el-dawahi',     name: 'El Dawahi',       nameAr: 'الضواحي' },
    ],
  },
  {
    id: 'ismailia', name: 'Ismailia', nameAr: 'الإسماعيلية',
    districts: [
      { id: 'ismailia-city', name: 'Ismailia City',   nameAr: 'مدينة الإسماعيلية' },
      { id: 'el-tal-el-kabir', name: 'El Tal El Kabir', nameAr: 'التل الكبير' },
      { id: 'el-qantara',    name: 'El Qantara',      nameAr: 'القنطرة' },
      { id: 'fayed',         name: 'Fayed',           nameAr: 'فايد' },
    ],
  },
  {
    id: 'suez', name: 'Suez', nameAr: 'السويس',
    districts: [
      { id: 'suez-city',     name: 'Suez City',       nameAr: 'مدينة السويس' },
      { id: 'el-arbaeen',    name: 'El Arbaeen',      nameAr: 'الأربعين' },
      { id: 'el-attaka',     name: 'El Attaka',       nameAr: 'العتاقة' },
      { id: 'faisal-suez',   name: 'Faisal',          nameAr: 'فيصل' },
    ],
  },
  {
    id: 'sinai-north', name: 'North Sinai', nameAr: 'شمال سيناء',
    districts: [
      { id: 'arish',         name: 'El Arish',        nameAr: 'العريش' },
      { id: 'rafah',         name: 'Rafah',           nameAr: 'رفح' },
      { id: 'el-hasana',     name: 'El Hasana',       nameAr: 'الحسنة' },
      { id: 'bir-el-abd',    name: 'Bir El Abd',      nameAr: 'بئر العبد' },
    ],
  },
  {
    id: 'sinai-south', name: 'South Sinai', nameAr: 'جنوب سيناء',
    districts: [
      { id: 'sharm-el-sheikh', name: 'Sharm El Sheikh', nameAr: 'شرم الشيخ' },
      { id: 'dahab',         name: 'Dahab',           nameAr: 'دهب' },
      { id: 'nuweiba',       name: 'Nuweiba',         nameAr: 'نويبع' },
      { id: 'taba',          name: 'Taba',            nameAr: 'طابا' },
      { id: 'el-tor',        name: 'El Tor',          nameAr: 'الطور' },
      { id: 'saint-catherine', name: 'Saint Catherine', nameAr: 'سانت كاترين' },
    ],
  },
  {
    id: 'red-sea', name: 'Red Sea', nameAr: 'البحر الأحمر',
    districts: [
      { id: 'hurghada',      name: 'Hurghada',        nameAr: 'الغردقة' },
      { id: 'safaga',        name: 'Safaga',          nameAr: 'سفاجا' },
      { id: 'el-quseir',     name: 'El Quseir',       nameAr: 'القصير' },
      { id: 'marsa-alam',    name: 'Marsa Alam',      nameAr: 'مرسى علم' },
      { id: 'el-gouna',      name: 'El Gouna',        nameAr: 'الجونة' },
      { id: 'sahl-hasheesh', name: 'Sahl Hasheesh',   nameAr: 'سهل حشيش' },
      { id: 'makadi',        name: 'Makadi Bay',      nameAr: 'مكادي باي' },
      { id: 'soma-bay',      name: 'Soma Bay',        nameAr: 'سوما باي' },
    ],
  },
  {
    id: 'matrouh', name: 'Matrouh', nameAr: 'مطروح',
    districts: [
      { id: 'mersa-matrouh', name: 'Mersa Matrouh',   nameAr: 'مرسى مطروح' },
      { id: 'el-hammam',     name: 'El Hammam',       nameAr: 'الحمام' },
      { id: 'sidi-barrani',  name: 'Sidi Barrani',    nameAr: 'سيدي براني' },
      { id: 'siwa',          name: 'Siwa',            nameAr: 'سيوة' },
      { id: 'el-alamein',    name: 'El Alamein',      nameAr: 'العلمين' },
      { id: 'ras-el-hikma',  name: 'Ras El Hikma',   nameAr: 'رأس الحكمة' },
    ],
  },
  {
    id: 'el-wadi-el-gedid', name: 'New Valley', nameAr: 'الوادي الجديد',
    districts: [
      { id: 'kharga',        name: 'Kharga',          nameAr: 'الخارجة' },
      { id: 'dakhla',        name: 'Dakhla',          nameAr: 'الداخلة' },
      { id: 'farafra',       name: 'Farafra',         nameAr: 'الفرافرة' },
      { id: 'baris',         name: 'Baris',           nameAr: 'باريس' },
    ],
  },
  {
    id: 'minya', name: 'Minya', nameAr: 'المنيا',
    districts: [
      { id: 'minya-city',    name: 'Minya City',      nameAr: 'مدينة المنيا' },
      { id: 'mallawi',       name: 'Mallawi',         nameAr: 'ملوي' },
      { id: 'el-minya-new',  name: 'New Minya',       nameAr: 'المنيا الجديدة' },
      { id: 'beni-mazar',    name: 'Beni Mazar',      nameAr: 'بني مزار' },
      { id: 'samalout',      name: 'Samalout',        nameAr: 'سمالوط' },
      { id: 'maghagha',      name: 'Maghagha',        nameAr: 'مغاغة' },
    ],
  },
  {
    id: 'beni-suef', name: 'Beni Suef', nameAr: 'بني سويف',
    districts: [
      { id: 'beni-suef-city', name: 'Beni Suef City', nameAr: 'مدينة بني سويف' },
      { id: 'el-wasta',      name: 'El Wasta',        nameAr: 'الواسطى' },
      { id: 'beba',          name: 'Beba',            nameAr: 'ببا' },
      { id: 'el-fashn',      name: 'El Fashn',        nameAr: 'الفشن' },
      { id: 'nasser',        name: 'Nasser City',     nameAr: 'مدينة ناصر' },
    ],
  },
  {
    id: 'fayoum', name: 'Fayoum', nameAr: 'الفيوم',
    districts: [
      { id: 'fayoum-city',   name: 'Fayoum City',     nameAr: 'مدينة الفيوم' },
      { id: 'sinnuris',      name: 'Sinnuris',        nameAr: 'سنورس' },
      { id: 'tamiya',        name: 'Tamiya',          nameAr: 'طامية' },
      { id: 'ibsheway',      name: 'Ibsheway',        nameAr: 'إبشواي' },
      { id: 'yusuf-el-seddik', name: 'Yusuf El Seddik', nameAr: 'يوسف الصديق' },
    ],
  },
  {
    id: 'asyut', name: 'Asyut', nameAr: 'أسيوط',
    districts: [
      { id: 'asyut-city',    name: 'Asyut City',      nameAr: 'مدينة أسيوط' },
      { id: 'new-asyut',     name: 'New Asyut',       nameAr: 'أسيوط الجديدة' },
      { id: 'abnoub',        name: 'Abnoub',          nameAr: 'أبنوب' },
      { id: 'manfalout',     name: 'Manfalout',       nameAr: 'منفلوط' },
      { id: 'el-badari',     name: 'El Badari',       nameAr: 'البداري' },
      { id: 'dairut',        name: 'Dairut',          nameAr: 'ديروط' },
    ],
  },
  {
    id: 'sohag', name: 'Sohag', nameAr: 'سوهاج',
    districts: [
      { id: 'sohag-city',    name: 'Sohag City',      nameAr: 'مدينة سوهاج' },
      { id: 'new-sohag',     name: 'New Sohag',       nameAr: 'سوهاج الجديدة' },
      { id: 'girga',         name: 'Girga',           nameAr: 'جرجا' },
      { id: 'akhmim',        name: 'Akhmim',          nameAr: 'أخميم' },
      { id: 'tahta',         name: 'Tahta',           nameAr: 'طهطا' },
      { id: 'el-balyana',    name: 'El Balyana',      nameAr: 'البلينا' },
    ],
  },
  {
    id: 'qena', name: 'Qena', nameAr: 'قنا',
    districts: [
      { id: 'qena-city',     name: 'Qena City',       nameAr: 'مدينة قنا' },
      { id: 'new-qena',      name: 'New Qena',        nameAr: 'قنا الجديدة' },
      { id: 'luxor',         name: 'Luxor',           nameAr: 'الأقصر' },
      { id: 'nag-hammadi',   name: 'Nag Hammadi',     nameAr: 'نجع حمادي' },
      { id: 'qus',           name: 'Qus',             nameAr: 'قوص' },
      { id: 'el-waqf',       name: 'El Waqf',         nameAr: 'الوقف' },
    ],
  },
  {
    id: 'luxor', name: 'Luxor', nameAr: 'الأقصر',
    districts: [
      { id: 'luxor-city',    name: 'Luxor City',      nameAr: 'مدينة الأقصر' },
      { id: 'karnak',        name: 'Karnak',          nameAr: 'الكرنك' },
      { id: 'el-bayadiya',   name: 'El Bayadiya',     nameAr: 'البياضية' },
      { id: 'armant',        name: 'Armant',          nameAr: 'أرمنت' },
      { id: 'esna',          name: 'Esna',            nameAr: 'إسنا' },
    ],
  },
  {
    id: 'aswan', name: 'Aswan', nameAr: 'أسوان',
    districts: [
      { id: 'aswan-city',    name: 'Aswan City',      nameAr: 'مدينة أسوان' },
      { id: 'new-aswan',     name: 'New Aswan',       nameAr: 'أسوان الجديدة' },
      { id: 'kom-ombo',      name: 'Kom Ombo',        nameAr: 'كوم أمبو' },
      { id: 'edfu',          name: 'Edfu',            nameAr: 'إدفو' },
      { id: 'el-daraw',      name: 'El Daraw',        nameAr: 'الدراو' },
      { id: 'abu-simbel',    name: 'Abu Simbel',      nameAr: 'أبو سمبل' },
    ],
  },
];
