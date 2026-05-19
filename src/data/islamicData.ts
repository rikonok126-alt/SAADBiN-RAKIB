export interface Translation {
  en: string;
  bn: string;
}

export interface VerificationStep {
  id: string;
  title: Translation;
  desc: Translation;
  arabic?: string;
  transliteration?: Translation;
  tip?: Translation;
}

export interface SurahVerse {
  number: number;
  arabic: string;
  transliteration: Translation;
  translation: Translation;
}

export interface Surah {
  id: string;
  number: number;
  nameArabic: string;
  nameEnglish: string;
  nameBangla: string;
  revelationType: Translation;
  versesCount: number;
  meaning: Translation;
  verses: SurahVerse[];
  benefit: Translation;
}

export interface Hadith {
  id: string;
  source: string;
  text: Translation;
  narrator: Translation;
  reference: string;
  category: "Salah" | "Wudu" | "General";
}

export interface RakahDetail {
  sunnahMuakkadah: number;
  fard: number;
  sunnahGhairMuakkadah: number;
  nafl: number;
  witr: number;
  total: number;
}

export interface PrayerRakahInfo {
  name: string;
  nameBn: string;
  timeHint: Translation;
  rakahs: RakahDetail;
}

export const PRAYERS_RAKAH_DATA: PrayerRakahInfo[] = [
  {
    name: "Fajr",
    nameBn: "ফজর",
    timeHint: { en: "Dawn, before sunrise", bn: "ভোর থেকে সূর্যোদয়ের পূর্ব পর্যন্ত" },
    rakahs: { sunnahMuakkadah: 2, fard: 2, sunnahGhairMuakkadah: 0, nafl: 0, witr: 0, total: 4 }
  },
  {
    name: "Dhuhr",
    nameBn: "যোহর",
    timeHint: { en: "After midday until afternoon", bn: "দুপুর থেকে আসরের পূর্ব পর্যন্ত" },
    rakahs: { sunnahMuakkadah: 6, fard: 4, sunnahGhairMuakkadah: 0, nafl: 2, witr: 0, total: 12 } // 4 before fard, 2 after fard
  },
  {
    name: "Asr",
    nameBn: "আসর",
    timeHint: { en: "Late afternoon until sunset", bn: "বিকালে সূর্যাস্তের পূর্ব পর্যন্ত" },
    rakahs: { sunnahMuakkadah: 0, fard: 4, sunnahGhairMuakkadah: 4, nafl: 0, witr: 0, total: 8 } // 4 sunnah ghair muakkadah
  },
  {
    name: "Maghrib",
    nameBn: "মাগরিব",
    timeHint: { en: "Just after sunset", bn: "সূর্যাস্তের পর থেকে গোধূলি বিদায় পর্যন্ত" },
    rakahs: { sunnahMuakkadah: 2, fard: 3, sunnahGhairMuakkadah: 0, nafl: 2, witr: 0, total: 7 } // 3 fard, 2 sunnah, 2 nafl
  },
  {
    name: "Isha",
    nameBn: "এশা",
    timeHint: { en: "Nightfall until pre-dawn", bn: "রাত্রি থেকে ফজরের পূর্ব পর্যন্ত" },
    rakahs: { sunnahMuakkadah: 2, fard: 4, sunnahGhairMuakkadah: 4, nafl: 4, witr: 3, total: 17 } // 4 sunnah before, 4 fard, 2 sunnah, 2 nafl, 3 witr, 2 nafl
  }
];

export const WUDU_STEPS: VerificationStep[] = [
  {
    id: "intention",
    title: { en: "1. Intention (Niyyah)", bn: "১. নিয়ত ও বিসমিল্লাহ" },
    desc: {
      en: "Make the silent intention to purify yourself for prayer, and say 'Bismillah-ir-Rahman-ir-Rahim' (In the name of Allah, the Most Gracious, the Most Merciful).",
      bn: "মনে মনে পবিত্রতা অর্জনের নিয়ত করে শুরু করুন এবং 'বিসমিল্লাহির রহমানির রাহিম' বলুন।"
    },
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    transliteration: {
      en: "Bismillah-ir-Rahman-ir-Rahim",
      bn: "বিসমিল্লাহির রাহমানির রাহিম"
    }
  },
  {
    id: "hands",
    title: { en: "2. Washing Hands", bn: "২. দুই হাত ধোয়া" },
    desc: {
      en: "Wash your hands up to the wrist three times. Ensure water reaches between your fingers.",
      bn: "উভয় হাত কবজি পর্যন্ত ৩ বার ভালো করে ধৌত করুন। আঙুলগুলো খিলাল করুন।"
    },
    tip: {
      en: "Tip: Start with the right hand first, then the left hand.",
      bn: "পরামর্শ: প্রথমে ডান হাত এবং পরে বাঁ হাত ধৌত করুন।"
    }
  },
  {
    id: "mouth",
    title: { en: "3. Rinsing the Mouth", bn: "৩. কুলি করা" },
    desc: {
      en: "Take water into your mouth with the right hand, rinse it thoroughly, and spit it out. Repeat three times.",
      bn: "ডান হাত দিয়ে মুখে পানি নিয়ে ভালো করে ৩ বার কুলি করুন।"
    }
  },
  {
    id: "nose",
    title: { en: "4. Inhaling Water into Nose", bn: "৪. নাকে পানি দেওয়া" },
    desc: {
      en: "Snuff water gently into your nostrils with your right hand, and blow it out using your left hand. Repeat three times.",
      bn: "ডান হাত দিয়ে নাকে পানি দিন এবং বাঁ হাত দিয়ে নাক সাফ করুন। এভাবে ৩ বার করুন।"
    }
  },
  {
    id: "face",
    title: { en: "5. Washing the Face", bn: "৫. মুখমণ্ডল ধোয়া" },
    desc: {
      en: "Wash your entire face three times, from the forehead to the chin, and from ear to ear.",
      bn: "কপাল থেকে থুতনি এবং দুই কানের লতি পর্যন্ত সম্পূর্ণ মুখমণ্ডল ৩ বার ভালো করে ধৌত করুন।"
    }
  },
  {
    id: "arms",
    title: { en: "6. Washing Arms", bn: "৬. দুই হাত কনুইসহ ধোয়া" },
    desc: {
      en: "Wash your right arm up to and including the elbow three times, then wash your left arm similarly three times.",
      bn: "ডান হাত কনুইসহ ৩ বার ধৌত করুন, তারপর একইভাবে বাঁ হাত কনুইসহ ৩ বার ধৌত করুন।"
    }
  },
  {
    id: "masah",
    title: { en: "7. Wiping the Head (Masah)", bn: "৭. মাথা মাসেহ করা" },
    desc: {
      en: "Wet your hands and run your damp palms from the front of your hairline to the back of your head, then bring them back. Pass your wet forefingers around the inner creases of your ears, and use your thumbs to wipe behind them (once).",
      bn: "নতুন পানি দিয়ে হাত ভিজিয়ে দুই হাত দ্বারা সম্পূর্ণ মাথা একবার মাসেহ করুন। শাহাদাত আঙুল দিয়ে কানের ভেতর এবং বুড়ো আঙুল দিয়ে কানের পিঠ ঘষুন।"
    }
  },
  {
    id: "feet",
    title: { en: "8. Washing the feet", bn: "৮. দুই পা টাখনুসহ ধোয়া" },
    desc: {
      en: "Wash both feet up to the ankles three times, starting with the right foot. Ensure water rinses thoroughly between the toes.",
      bn: "প্রথমে ডান পা টাখনুসহ (গিঁট) ৩ বার ধৌত করুন এবং পায়ের আঙুল খিলাল করুন। এরপর একইভাবে বাঁ পা ৩ বার ধৌত করুন।"
    }
  }
];

export const NAMAZ_STEPS: VerificationStep[] = [
  {
    id: "niyyah",
    title: { en: "1. Intention & Takbeer", bn: "১. নিয়ত ও তাকবিরে তাহরিমা" },
    desc: {
      en: "Stand straight facing the Qiblah. Raise your hands up to your ear lobes (men) or shoulders (women). Say 'Allahu Akbar' (Allah is the Greatest) and fold your hands below the navel (men) or over the chest (women). Keep your eyes fixed on the spot where your head will touch the floor during Sujud.",
      bn: "কিবলামুখী হয়ে সোজা দাঁড়িয়ে মনে মনে নামাজের নিয়ত করুন। পুরুষরা দুই হাত কানের লতি পর্যন্ত এবং নারীরা কাঁধ পর্যন্ত উঠিয়ে 'আল্লাহু আকবার' বলে হাত বাঁধবেন (নাভির নিচে পুরুষ ও বুকের ওপর নারীরা)। সিজদার জায়গার দিকে নজর রাখুন।"
    },
    arabic: "الله أكبر",
    transliteration: { en: "Allahu Akbar", bn: "আল্লাহু আকবার" },
    tip: { en: "Translation: Allah is the Greatest.", bn: "অর্থ: আল্লাহ সর্বশ্রেষ্ঠ।" }
  },
  {
    id: "sana",
    title: { en: "2. Sana & Ta'awwudh", bn: "২. সানা পাঠ" },
    desc: {
      en: "While standing, recite the Sana (glorification of Allah), followed by seeking refuge and starting with Bismillah.",
      bn: "দাঁড়িয়ে হাত বাঁধা অবস্থায় সানা পাঠ করুন। অতঃপর আউজুবিল্লাহ ও বিসমিল্লাহ পাঠ করুন।"
    },
    arabic: "سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ ، وَتَبَارَكَ اسْمُكَ ، وَتَعَالَى جَدُّكَ ، وَلَا إِلَهَ غَيْرُكَ",
    transliteration: {
      en: "Subhanaka Allahumma wa bihamdika, wa tabarakasmuka wa ta'ala jadduka, wa la ilaha ghayruk.",
      bn: "সুবহানাকা আল্লাহুম্মা ওয়া বিহামদিকা, ওয়া তাবারাকাসমুকা, ওয়া তাআলা জাদ্দুকা, ওয়া লা ইলাহা গাইরুকা।"
    },
    tip: {
      en: "Meaning: Glory be to You, O Allah, and all praise. Blessed is Your name and exalted is Your majesty, there is no god besides You.",
      bn: "অর্থ: হে আল্লাহ! আমি আপনার পবিত্রতা ঘোষণা করছি এবং আপনার হামদ করছি। আপনার নাম মঙ্গলময়, আপনার মাহাত্ম্য সর্বোচ্চ এবং আপনি ব্যতীত কোনো ইলাহ নেই।"
    }
  },
  {
    id: "fatiha",
    title: { en: "3. Surah Al-Fatiha & Recitation", bn: "৩. সূরা ফাতিহা ও অন্য সূরা মিলানো" },
    desc: {
      en: "Recite Surah Al-Fatiha. Say 'Ameen' silently. Then, recite any other portion/Surah from the Quran (e.g., one of our small Surahs like Surah Al-Ikhlas).",
      bn: "সূরা ফাতিহা তিলাওয়াত করুন। শেষ করে মনে মনে 'আমীন' বলুন। অতঃপর পবিত্র কুরআনের যেকোনো একটি সূরা বা সুরার অংশ তিলাওয়াত করুন (যেমন সূরা ইখলাস)।"
    }
  },
  {
    id: "ruku",
    title: { en: "4. Bowing (Ruku)", bn: "৪. রুকু বা রুকুতে অবনত হওয়া" },
    desc: {
      en: "Say 'Allahu Akbar' and bow down. Place your hands on your knees with fingers spread out. Keep your back straight, parallel to the ground. Reflect on your Creator’s greatness. Recite the Tasbeeh of Ruku 3 times.",
      bn: "'আল্লাহু আকবার' বলে রুকুতে যান। দুই হাত দিয়ে হাঁটু আঁকড়ে ধরুন, কনুই সোজা রাখুন এবং পিঠ সমান রাখুন। রুকুতে ৩ বার এই তাসবিহটি পড়ুন।"
    },
    arabic: "سُبْحَانَ رَبِّيَ الْعَظِيمِ",
    transliteration: { en: "Subhana Rabbiyal 'Azeem", bn: "সুবহানা রাব্বিয়াল আজীম" },
    tip: {
      en: "Meaning: Glory to my Lord, the Almighty (recite 3, 5, or 7 times).",
      bn: "অর্থ: আমার মহান রবের পবিত্রতা ঘোষণা করছি (কমপক্ষে ৩ বার)।"
    }
  },
  {
    id: "rising",
    title: { en: "5. Rising (Qaumah)", bn: "৫. রুকু হতে সোজা হয়ে দাঁড়ানো" },
    desc: {
      en: "Rise from bowing while saying 'Sami'Allahu liman hamidah'. Once fully straight, say 'Rabbana lakal hamd'.",
      bn: "রুকু হতে সোজা হয়ে দাঁড়াতে দাঁড়াতে বলুন 'সামিয়াল্লাহু লিমান হামিদাহ'। সোজা দাঁড়িয়ে বলুন 'রাব্বানা লাকাল হামদ'।"
    },
    arabic: "سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ، رَبَّنَا وَلَكَ الْحَمْدُ",
    transliteration: {
      en: "Sami'Allahu liman hamidah (rising)... Rabbana lakal hamd (standing)",
      bn: "সামিয়াল্লাহু লিমান হামিদাহ (দাঁড়ানোর সময়)... রাব্বানা লাকাল হামদ (সোজা দাঁড়িয়ে)"
    },
    tip: {
      en: "Meaning: Allah hears those who praise Him... Our Lord, to You belongs all praise.",
      bn: "অর্থ: যে আল্লাহর প্রশংসা করে, আল্লাহ তার প্রশংসা শোনেন... হে আমাদের রব, সমস্ত প্রশংসা আপনারই।"
    }
  },
  {
    id: "sujud",
    title: { en: "6. Prostration (Sajdah)", bn: "৬. সিজদা বা সাঁজদা" },
    desc: {
      en: "Say 'Allahu Akbar' and prostrate. Place your knees first on the floor, then hands, then nose, and then forehead. Your toes should be folded forward facing the Qiblah. Keep your hands flat at cheek/ear level, forearms lifted off the ground (men; women keep flat). Recite the Tasbeeh of Sujud 3 times.",
      bn: "'আল্লাহু আকবার' বলে সিজদায় যান। প্রথমে হাঁটু, তারপর হাত, নাক ও সবশেষে কপাল মাটিতে রাখুন। পায়ের আঙুলগুলো কিবলার দিকে বাঁকা করে মাটিতে রাখুন। সিজদায় নিম্নোক্ত তাসবিহটি ৩ বার পাঠ করুন।"
    },
    arabic: "سُبْحَانَ رَبِّيَ الْأَعْلَى",
    transliteration: { en: "Subhana Rabbiyal 'A'la", bn: "সুবহানা রাব্বিয়াল আলা" },
    tip: {
      en: "Meaning: Glory to my Lord, the Most High (recite 3, 5, or 7 times). This is the closest a servant is to Allah.",
      bn: "অর্থ: আমার পরম উন্নত রবের পবিত্রতা ঘোষণা করছি (কমপক্ষে ৩ বার)।"
    }
  },
  {
    id: "jalsah",
    title: { en: "7. Sitting Between Sujud", bn: "৭. দুই সিজদার মাঝখানে বসা" },
    desc: {
      en: "Say 'Allahu Akbar' and rise to sit flat. Place your weight on the left foot (left foot flat, right foot upright/standing; women sit flat on posterior with feet exiting right). Rest palms on thighs. Pray for forgiveness.",
      bn: "'আল্লাহু আকবার' বলে সোজা হয়ে বসুন। বাঁ পা বিছিয়ে তার ওপর বসুন এবং ডান পা খাড়া রাখুন। দুই হাত উরুর ওপর রাখুন। মাঝখানের বসার সময় ক্ষণিকের জন্য এই দোআটি পড়তে পারেন।"
    },
    arabic: "اللَّهُمَّ اغْفِرْ لِي وَارْحَمْنِي وَاجْبُرْنِي وَاهْدِنِي وَارْزُقْنِي",
    transliteration: {
      en: "Allahumma-ghfirli, war-hamni, waj-burni, wah-dini, war-zuqni.",
      bn: "আল্লাহুম্মাগফিরলী, ওয়ারহামনী, ওয়াজবুরনী, ওয়াহদিনী, ওয়ারযুকনী।"
    },
    tip: {
      en: "Meaning: O Allah! Forgive me, have mercy on me, mend my shortcomings, guide me, and sustain me.",
      bn: "অর্থ: হে আল্লাহ! আমাকে ক্ষমা করুন, আমার ওপর দয়া করুন, আমার ত্রুটি পূরণ করুন, আমাকে হেদায়েত দিন এবং রিযিক দান করুন।"
    }
  },
  {
    id: "sujud2",
    title: { en: "8. Second Prostration", bn: "৮. দ্বিতীয় সিজদা" },
    desc: {
      en: "Say 'Allahu Akbar' and perform the second Sajdah exactly like the first, reciting the same Tasbeeh 3 times. This completes one Rak'ah. For the second run, rise while saying 'Allahu Akbar' and stand up straight for Qiyam.",
      bn: "'আল্লাহু আকবার' বলে আবার সিজদায় যান এবং একই তাসবিহ ৩ বার পাঠ করুন। এটি প্রথম রাকাতে পূর্ণতা দিল। পরবর্তী রাকাতের জন্য 'আল্লাহু আকবার' বলে উঠে দাঁড়ান।"
    }
  },
  {
    id: "tashahhud",
    title: { en: "9. Sitting & Tashahhud", bn: "৯. তাশাহহুদ বা আত্তাহিয়াতু" },
    desc: {
      en: "In every 2nd & final Rak'ah, after the second Sajdah, sit up as in Jalsah. In this posture, recite Tashahhud (Attahiyyatu). When reciting 'Ash-hadu alla...', raise your right index finger to testify, then lower it.",
      bn: "প্রতি ২য় এবং শেষ রাকাতে দ্বিতীয় সিজদা শেষ করে 'আত্তাহিয়াতু' বা তাশাহহুদ পড়ার জন্য বসুন। 'আশহাদু আল্লা ইলাহা...' বলার সময় শাহাদাত আঙুল দিয়ে ইশারা করুন এবং পরে নামিয়ে নিন।"
    },
    arabic: "التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ ، السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ ، السَّلَامُ عَلَيْنَا وَعَلَى عِبَادِ اللَّهِ الصَّالِحِينَ ، أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ",
    transliteration: {
      en: "Attahiyyatu lillahi was-salawatu wat-tayyibatu, as-salamu 'alayka ayyuhan-nabiyyu wa rahmatullahi wa barakatuh, as-salamu 'alayna wa 'ala 'ibadillahis-salihin. Ash-hadu alla ilaha illallahu wa ash-hadu anna Muhammadan 'abduhu wa rasuluh.",
      bn: "আত্তাহিয়্যাতু লিল্লাহি ওয়াস-সালাওয়াতু ওয়াত-তাইয়্যিবাতু, আসসালামু আলাইকা আইয়্যুহান-নাবিইয়্যু ওয়া রাহমাতুল্লাহি ওয়া বারাকাতুহু, আসসালামু আলাইনা ওয়া আলা ইবাদিল্লাহিস-সালিহীন। আশহাদু আল্লা ইলাহা ইল্লাল্লাহু ওয়া আশহাদু আন্না মুহাম্মাদান আবদুহু ওয়া রাসুলুহু।"
    },
    tip: {
      en: "Translation: All compliments, prayers, and pure things are for Allah. Peace be upon you, O Prophet, and the mercy of Allah and His blessings...",
      bn: "অর্থ: যাবতীয় মৌখিক, শারীরিক ও আর্থিক ইবাদত আল্লাহর জন্য। হে নবী! আপনার ওপর শান্তি বর্ষিত হোক এবং আল্লাহর দয়া ও বরকত নাজিল হোক..."
    }
  },
  {
    id: "durood",
    title: { en: "10. Durood Ibrahim (Final Sitting)", bn: "১০. দুরুদে ইব্রাহিম (শেষ বৈঠকে)" },
    desc: {
      en: "In the final Rak'ah, after Tashahhud, proceed to recite the Durood Ibrahim to send blessings upon the Prophet Muhammad (PBUH).",
      bn: "নামাজের শেষ রাকাতে তাশাহহুদ পাঠ করার পর দাঁড়িয়ে না গিয়ে দুরুদে ইব্রাহিম পাঠ করতে হয়।"
    },
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ ، اللَّهُمَّ بَارِكْ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا بَارَكْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ",
    transliteration: {
      en: "Allahumma salli 'ala Muhammadin wa 'ala ali Muhammadin kama sallayta 'ala Ibrahima wa 'ala ali Ibrahima, innaka Hamidum Majid. Allahumma barik 'ala Muhammadin wa 'ala ali Muhammadin kama barakta 'ala Ibrahima wa 'ala ali Ibrahima, innaka Hamidum Majid.",
      bn: "আল্লাহুম্মা সাল্লি আলা মুহাম্মাদিন ওয়া আলা আলি মুহাম্মাদিন, কামা সাল্লাইতা আলা ইব্রাহিমা ওয়া আলা আলি ইব্রাহিমা, ইন্নাকা হামিদুম মাজিদ। আল্লাহুম্মা বারিক আলা মুহাম্মাদিন ওয়া আলা আলি মুহাম্মাদিন, কামা বারাকতা আলা ইব্রাহিমা ওয়া আলা আলি ইব্রাহিমা, ইন্নাকা হামিদুম মাজিদ।"
    },
    tip: {
      en: "Meaning: O Allah, send Your grace upon Muhammad and his family, as You sent grace upon Abraham and his family...",
      bn: "অর্থ: হে আল্লাহ! আপনি হযরত মুহাম্মদ (সা.) ও তাঁর বংশধরদের ওপর শান্তি বর্ষণ করুন, যেমন শান্তি বর্ষণ করেছিলেন হযরত ইব্রাহিম (আ.) ও তাঁর বংশধরদের ওপর..."
    }
  },
  {
    id: "masura",
    title: { en: "11. Doa Masura (Final Sitting)", bn: "১১. দোয়া মাসুরা" },
    desc: {
      en: "After Durood Ibrahim, recite Doa Masura before committing the final Salam.",
      bn: "দুরুদ পাঠ করার পর সালাম ফেরানোর পূর্বে দোয়া মাসুরা পড়বেন।"
    },
    arabic: "اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ",
    transliteration: {
      en: "Allahumma inni zalamtu nafsi zulman katheera, wa la yaghfirudh-dhunuba illa Anta. Faghfirli maghfiratan min 'indika war-hamni, innaka Antal-Ghafurur-Rahim.",
      bn: "আল্লাহুম্মা ইন্নী যালামতু নাফসী যুলমান কাছীরাও ওয়ালা ইয়াগফিরুয যুনূবা ইল্লা আনতা। ফাগফিরলী মাগফিরাতাম মিন ইনদিকা ওয়ারহামনী ইন্নাকা আনতাল গাফুরুর রাহীম।"
    },
    tip: {
      en: "Meaning: O Allah, I have greatly wronged myself, and no one forgives sins except You. So grant me forgiveness from You and have mercy on me...",
      bn: "অর্থ: হে আল্লাহ! আমি নিজের ওপর অনেক জুলুম করেছি, পাপ মোচনকারী একমাত্র আপনি ছাড়া আর কেউ নেই। অতএব আপনার পক্ষ থেকে আমাকে মার্জনা দান করুন..."
    }
  },
  {
    id: "salam",
    title: { en: "12. Closing (Salam)", bn: "১২. সালাম ফিরানো" },
    desc: {
      en: "Turn your face to the right, looking at your right shoulder, and say 'As-salamu 'alaykum wa rahmatullah' (Peace and blessings of Allah be upon you). Then turn your face to the left shoulder and say the same. Pray is now complete!",
      bn: "প্রথমে ডান দিকে মুখ ঘুরিয়ে ডান কাঁধের দিকে তাকিয়ে বলুন 'আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ' এবং পরে একইভাবে বাঁ দিকে তাকিয়ে বলুন। আপনার নামাজ সম্পন্ন হলো!"
    },
    arabic: "السلام عليكم ورحمة الله",
    transliteration: { en: "As-salam-u-'alaykum wa rahmatullah", bn: "আসসালামু আলাইকুম ওয়া রাহমাতুল্লাহ" },
    tip: { en: "Reflect: Salute the angels and fellow worshipers alongside you.", bn: "উপলব্ধি: আপনার ডানে ও বাঁয়ের ফেরেশতা ও নামাজের সাথীদের শান্তি কামনা করা।" }
  }
];

export const CURATED_SURAS: Surah[] = [
  {
    id: "al-fatiha",
    number: 1,
    nameArabic: "سورة الفاتحة",
    nameEnglish: "Al-Fatihah",
    nameBangla: "আল-ফাতিহা",
    revelationType: { en: "Meccan", bn: "মাক্কী" },
    versesCount: 7,
    meaning: { en: "The Opening", bn: "ভূমিকম্পনকারী বা সূচনা" },
    benefit: {
      en: "Fatiha is the core of Salah, healing, and the greatest Surah in Quran.",
      bn: "সূরা আল-ফাতিহা ছাড়া নামাজ হয় না। এটি আরোগ্যের মহৌষধ এবং কুরআনের শ্রেষ্ঠতম সূরা।"
    },
    verses: [
      {
        number: 1,
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        transliteration: { en: "Bismillahir-Rahmanir-Rahim", bn: "বিসমিল্লাহির রহমানির রাহিম" },
        translation: { en: "In the name of Allah, the Entirely Merciful, the Especially Merciful.", bn: "পরম করুণাময়, অতি দয়ালু আল্লাহর নামে শুরু করছি।" }
      },
      {
        number: 2,
        arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        transliteration: { en: "Al-Hamdu lillahi Rabbil-'alamin", bn: "আলহামদুলিল্লাহি রাব্বিল আলামিন" },
        translation: { en: "[All] praise is [due] to Allah, Lord of the worlds -", bn: "যাবতীয় প্রশংসা একমাত্র বিশ্বজগতের রব আল্লাহর জন্য।" }
      },
      {
        number: 3,
        arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
        transliteration: { en: "Ar-Rahmanir-Rahim", bn: "আর-রহমানির রাহিম" },
        translation: { en: "The Entirely Merciful, the Especially Merciful,", bn: "যিনি পরম করুণাময় ও অতি দয়ালু।" }
      },
      {
        number: 4,
        arabic: "مَالِكِ يَوْمِ الدِّينِ",
        transliteration: { en: "Maliki Yawmid-Din", bn: "মালিকি ইয়াওমিদ্দীন" },
        translation: { en: "Sovereign of the Day of Recompense.", bn: "যিনি বিচার দিবসের মালিক।" }
      },
      {
        number: 5,
        arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        transliteration: { en: "Iyyaka na'budu wa iyyaka nasta'in", bn: "ইয়্যাকা নাবুদু ওয়া ইয়্যাকা নাস্তায়ীন" },
        translation: { en: "It is You we worship and You we ask for help.", bn: "আমরা কেবল আপনারই ইবাদত করি এবং কেবল আপনারই সাহায্য চাই।" }
      },
      {
        number: 6,
        arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        transliteration: { en: "Ihdinas-siratal-mustaqim", bn: "ইহদিনাস সিরাতাল মুস্তাকীম" },
        translation: { en: "Guide us to the straight path -", bn: "আমাদের সরল পথ প্রদর্শন করুন।" }
      },
      {
        number: 7,
        arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        transliteration: { en: "Siratal-ladhina an'amta 'alayhim, ghayril-maghdubi 'alayhim walad-dallin", bn: "সিরাতাল্লাযীনা আনআমতা আলাইহীম, গাইরিল মাগদূবী আলাইহীম ওয়ালাদ্দাল্লীন" },
        translation: { en: "The path of those upon whom You have bestowed favor, not of those who have earned [Your] anger or of those who are astray.", bn: "তাদের পথ, যাদের আপনি পুরস্কৃত করেছেন। তাদের পথ নয়—যারা অভিশপ্ত এবং যারা পথভ্রষ্ট।" }
      }
    ]
  },
  {
    id: "al-asr",
    number: 103,
    nameArabic: "سورة العصر",
    nameEnglish: "Al-Asr",
    nameBangla: "আল-আসর",
    revelationType: { en: "Meccan", bn: "মাক্কী" },
    versesCount: 3,
    meaning: { en: "The Declining Day", bn: "সময় বা অপরাহ্ন" },
    benefit: {
      en: "Imam Ash-Shafi'i said if people pondered over this Surah, it would be sufficient for their guidance.",
      bn: "ইমাম শাফেয়ী বলেন, মানুষ যদি কেবল এই সূরাটি নিয়ে চিন্তা করত তবে এটিই তাদের পথনির্দেশের জন্য যথেষ্ট হতো।"
    },
    verses: [
      {
        number: 1,
        arabic: "وَالْعَصْرِ",
        transliteration: { en: "Wal-'asr", bn: "ওয়াল আসর" },
        translation: { en: "By time,", bn: "সময়ের শপথ," }
      },
      {
        number: 2,
        arabic: "إِنَّ الْإِنْسَانَ لَفِي خُسْرٍ",
        transliteration: { en: "Innal-insana lafi khusr", bn: "ইন্নাল ইন্সানা লাফী খুসর" },
        translation: { en: "Indeed, mankind is in loss,", bn: "নিশ্চয়ই মানুষ পরম ক্ষতির মধ্যে নিমজ্জিত," }
      },
      {
        number: 3,
        arabic: "إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ",
        transliteration: { en: "Illal-ladhina amanu wa 'amilus-salihati wa tawasaw bil-haqqi wa tawasaw bis-sabr", bn: "ইল্লাল্লাযীনা আমানু ওয়া আমিলুস সালিহাতি ওয়া তাওয়াসাও বিল হাক্কি ওয়া তাওয়াসাও বিস সবর" },
        translation: { en: "Except those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.", bn: "কিন্তু তারা ব্যতীত যারা ঈমান এনেছে, সৎকাজ করেছে এবং একে অপরকে সত্যের উপদেশ ও ধৈর্যের উপদেশ দিয়েছে।" }
      }
    ]
  },
  {
    id: "al-kauthar",
    number: 108,
    nameArabic: "سورة الكوثر",
    nameEnglish: "Al-Kawthar",
    nameBangla: "আল-কাওসার",
    revelationType: { en: "Meccan", bn: "মাক্কী" },
    versesCount: 3,
    meaning: { en: "The Abundance", bn: "প্রাচুর্য" },
    benefit: {
      en: "The shortest Surah in Quran. Brings mental strength and protection from adversaries.",
      bn: "কুরআনের ক্ষুদ্রতম সূরা। এটি মানসিক প্রশান্তি ও শত্রুর অনিষ্ট থেকে রক্ষা দেয়।"
    },
    verses: [
      {
        number: 1,
        arabic: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ",
        transliteration: { en: "Inna a'taynakal-kawthar", bn: "ইন্না আতায়নাকাল কাওসার" },
        translation: { en: "Indeed, We have granted you, [O Muhammad], Al-Kawthar (abundance).", bn: "নিশ্চয় আমি আপনাকে কাউসার (সর্বোত্তম প্রাচুর্য) দান করেছি।" }
      },
      {
        number: 2,
        arabic: "فَصَلِّ لِرَبِّكَ وَانْحَرْ",
        transliteration: { en: "Fasalli li-Rabbika wanhar", bn: "ফাসাল্লি লিরাব্বিকা ওয়ানহার" },
        translation: { en: "So pray to your Lord and sacrifice [to Him alone].", bn: "অতএব আপনার রবের উদ্দেশ্যেই সালাত আদায় করুন এবং কুরবানি করুন।" }
      },
      {
        number: 3,
        arabic: "إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ",
        transliteration: { en: "Inna shani'aka huwal-abtar", bn: "ইন্না শানিয়াকা হুয়াল আবতার" },
        translation: { en: "Indeed, your enemy is the one cut off.", bn: "নিশ্চয়ই আপনার প্রতি শত্রুতাকারীই নির্বংশ।" }
      }
    ]
  },
  {
    id: "al-ikhlas",
    number: 112,
    nameArabic: "سورة الإخلاص",
    nameEnglish: "Al-Ikhlas",
    nameBangla: "আল-ইখলাস",
    revelationType: { en: "Meccan", bn: "মাক্কী" },
    versesCount: 4,
    meaning: { en: "The Sincerity", bn: "একনিষ্ঠতা বা খাঁটি বিশ্বাস" },
    benefit: {
      en: "Equivalent to one-third of the Quran. Explains pure Monotheism (Tawhid).",
      bn: "সূরা ইখলাস ৩ বার পাঠ করলে সম্পূর্ণ কুরআন খতমের সমান মর্যাদা পাওয়া যায়। এটি আল্লাহর তাওহীদের প্রকাশ।"
    },
    verses: [
      {
        number: 1,
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        transliteration: { en: "Qul Huwal-lahu Ahad", bn: "কুল হুওয়াল্লাহু আহাদ" },
        translation: { en: "Say, 'He is Allah, [who is] One,", bn: "বলুন, তিনিই আল্লাহ, একক-অদ্বিতীয়।" }
      },
      {
        number: 2,
        arabic: "اللَّهُ الصَّمَدُ",
        transliteration: { en: "Allahus-Samad", bn: "আল্লাহুস সামাদ" },
        translation: { en: "Allah, the Eternal Refuge.", bn: "আল্লাহ কারো মুখাপেক্ষী নন, সকলেই তাঁর মুখাপেক্ষী।" }
      },
      {
        number: 3,
        arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        transliteration: { en: "Lam yalid wa lam yulad", bn: "লাম ইয়ালিদ ওয়া লাম ইউলাদ" },
        translation: { en: "He neither begets nor is born,", bn: "তিনি কাউকে জন্ম দেননি এবং তাঁকেও জন্ম দেয়া হয়নি," }
      },
      {
        number: 4,
        arabic: "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
        transliteration: { en: "Wa lam yakul-lahu kufuwan ahad", bn: "ওয়া লাম ইয়াকুল্লাহু কুফুওয়ান আহাদ" },
        translation: { en: "Nor is there to Him any equivalent.'", bn: "এবং তাঁর সমকক্ষ কেউই নেই।" }
      }
    ]
  },
  {
    id: "al-falaq",
    number: 113,
    nameArabic: "سورة الفلق",
    nameEnglish: "Al-Falaq",
    nameBangla: "আল-ফালক",
    revelationType: { en: "Meccan", bn: "মাক্কী" },
    versesCount: 5,
    meaning: { en: "The Daybreak", bn: "ঊষা বা প্রভাত" },
    benefit: {
      en: "Prophet Muhammad (PBUH) recited Al-Falaq and An-Nas after every prayer for protection from evil eye and black magic.",
      bn: "দুষ্ট চোখ, হিংসুক এবং জাদু-টোনার অনিষ্ট থেকে রক্ষা পেতে প্রতি নামাজ শেষে সূরা ফালাক ও নাস পাঠের নির্দেশ রয়েছে।"
    },
    verses: [
      {
        number: 1,
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        transliteration: { en: "Qul a'udhu bi-Rabbil-falaq", bn: "কুল আউযু বিরাব্বিল ফালাক" },
        translation: { en: "Say, 'I seek refuge in the Lord of daybreak", bn: "বলুন, আমি আশ্রয় প্রার্থনা করছি প্রভাতের রবের," }
      },
      {
        number: 2,
        arabic: "مِنْ شَرِّ مَا خَلَقَ",
        transliteration: { en: "Min sharri ma khalaq", bn: "মিন শাররি মা খালাক" },
        translation: { en: "From the evil of that which He created", bn: "তাঁর সৃষ্টির যাবতীয় অনিষ্ট থেকে," }
      },
      {
        number: 3,
        arabic: "وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ",
        transliteration: { en: "Wa min sharri ghasiqin idha waqab", bn: "ওয়া মিন শাররি গাসিকিন ইযা ওয়াকাব" },
        translation: { en: "And from the evil of darkness when it settles", bn: "এবং অন্ধকার রাত্রির অনিষ্ট থেকে যখন তা ঘোরতর হয়," }
      },
      {
        number: 4,
        arabic: "وَمِنْ شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
        transliteration: { en: "Wa min sharrin-naffathati fil-'uqad", bn: "ওয়া মিন শাররিন নাফ্ফাসাতি ফিল উকাদ" },
        translation: { en: "And from the evil of the blowers in knots", bn: "এবং গ্রন্থিতে ফুৎকার দিয়ে জাদুকারিনীদের অনিষ্ট থেকে," }
      },
      {
        number: 5,
        arabic: "وَمِنْ شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        transliteration: { en: "Wa min sharri hasidin idha hasad", bn: "ওয়া মিন শাররি হাসিদিন ইযা হাসাদ" },
        translation: { en: "And from the evil of an envier when he envies.'", bn: "এবং হিংসুকের অনিষ্ট থেকে যখন সে হিংসা করে।" }
      }
    ]
  },
  {
    id: "an-nas",
    number: 114,
    nameArabic: "سورة الناس",
    nameEnglish: "An-Nas",
    nameBangla: "আন্-নাস",
    revelationType: { en: "Meccan", bn: "মাক্কী" },
    versesCount: 6,
    meaning: { en: "Mankind", bn: "মানবজাতি" },
    benefit: {
      en: "Protects against the whispers of Satan and negative thoughts/anxieties.",
      bn: "শয়তানের কুপ্ররোচনা ও কুমন্ত্রণা এবং সব রকমের মনের ভয়-ভীতি ও দুশ্চিন্তা থেকে মুক্তির জন্য সর্বশেষ সুরক্ষা ঢাল।"
    },
    verses: [
      {
        number: 1,
        arabic: "قُل * أَعُوذُ بِرَبِّ النَّاسِ",
        transliteration: { en: "Qul a'udhu bi-Rabbin-nas", bn: "কুল আউযু বিরাব্বিন নাস" },
        translation: { en: "Say, 'I seek refuge in the Lord of mankind,", bn: "বলুন, আমি আশ্রয় প্রার্থনা করছি মানুষের লালনকর্তার," }
      },
      {
        number: 2,
        arabic: "مَلِكِ النَّاسِ",
        transliteration: { en: "Malikin-nas", bn: "মালিকিন নাস" },
        translation: { en: "The Sovereign of mankind,", bn: "মানুষের প্রকৃত অধিপতির," }
      },
      {
        number: 3,
        arabic: "إِلَٰهِ النَّاسِ",
        transliteration: { en: "Ilahin-nas", bn: "ইলাহিন নাস" },
        translation: { en: "The God of mankind,", bn: "মানুষের প্রকৃত মাবুদের বা উপাস্যের," }
      },
      {
        number: 4,
        arabic: "مِنْ شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        transliteration: { en: "Min sharril-waswasil-khannas", bn: "মিন শাররিল ওয়াসওয়াসিল খান্নাস" },
        translation: { en: "From the evil of the retreating whisperer -", bn: "আত্মগোপনকারী ফিসফিসানিদানকারী শয়তানের অনিষ্ট থেকে—" }
      },
      {
        number: 5,
        arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
        transliteration: { en: "Alladhi yuwaswisu fi sudurin-nas", bn: "আল্লাযী ইউওয়াসউইসু ফী ছু দূরিন নাস" },
        translation: { en: "Who whispers [evil] into the breasts of mankind -", bn: "যে মানুষের মনের মধ্যে কুপ্ররোচনা দেয়—" }
      },
      {
        number: 6,
        arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ",
        transliteration: { en: "Minal-jinnati wan-nas", bn: "মিনাল জিন্নাতি ওয়ান নাস" },
        translation: { en: "From among the jinn and mankind.'", bn: "জিনদের মধ্য থেকে হোক বা মানুষদের।" }
      }
    ]
  }
];

export const HADITHS: Hadith[] = [
  {
    id: "hadith-salah-coolness",
    source: "Sunan an-Nasa'i",
    narrator: { en: "Anas ibn Malik", bn: "আনাস ইবনে মালিক (রা.)" },
    text: {
      en: "\"Women and perfume have been made dear to me, but the coolness of my eyes has been placed in prayer (Salah).\"",
      bn: "\"আমার কাছে নারীদের ও সুগন্ধিকে প্রিয় করা হয়েছে, আর আমার চোখের শীতলতা স্থাপন করা হয়েছে নামাজের (সালাত) মাঝে।\""
    },
    reference: "Book 36, Hadith 3940",
    category: "Salah"
  },
  {
    id: "hadith-salah-keys",
    source: "Musnad Ahmad",
    narrator: { en: "Mu'adh ibn Jabal", bn: "মুয়ায ইবনে জাবাল (রা.)" },
    text: {
      en: "\"The head of the matter is Islam, its pillar is the prayer (Salah), and its peak is Jihad in the way of Allah.\"",
      bn: "\"সকল বিষয়ের মস্তক হলো ‘ইসলাম’, তার স্তম্ভ হলো ‘নামাজ’ এবং তার সর্বোচ্চ চূড়া হলো আল্লাহর পথে জিহাদ করা।\""
    },
    reference: "Musnad Ahmad 22028, Tirmidhi 2616",
    category: "Salah"
  },
  {
    id: "hadith-salah-river",
    source: "Sahih al-Bukhari",
    narrator: { en: "Abu Hurairah", bn: "আবু হুরায়রা (রা.)" },
    text: {
      en: "\"If there was a river at the door of anyone of you and he took a bath in it five times a day, would any dirt remain on him?\" They said: \"No dirt would be left.\" The Prophet said: \"That is the example of the five compulsory prayers by which Allah expiates evil deeds.\"",
      bn: "\"তোমাদের কারও বাড়ির দরজার সামনে যদি একটি নদী থকে এবং সে দৈনিক পাঁচবার তাতে গোসল করে, তবে কি তার শরীরে কোনো ধূলিময়লা অবশিষ্ট থাকবে?\" তাঁরা বললেন, \"কোনো ময়লাই থাকবে না।\" রাসূল (সা.) বললেন, \"অনুরূপ হলো পাঁচ ওয়াক্ত নামাজ, এর দ্বারা আল্লাহ তায়ালা বান্দার গুনাহসমূহ ক্ষমা করে দেন।\""
    },
    reference: "Sahih al-Bukhari 528",
    category: "Salah"
  },
  {
    id: "hadith-cleanliness-half",
    source: "Sahih Muslim",
    narrator: { en: "Abu Malik al-Ash'ari", bn: "আবু মালিক আল-আশআরী (রা.)" },
    text: {
      en: "\"Cleanliness (Purity) is half of faith (Iman).\"",
      bn: "\"পবিত্রতা হলো ঈমানের অর্ধেক (অর্ধ-অংশ)।\""
    },
    reference: "Sahih Muslim 223",
    category: "Wudu"
  },
  {
    id: "hadith-wudu-sins",
    source: "Sahih Muslim",
    narrator: { en: "Uthman ibn Affan", bn: "হযরত উসমান ইবনে আফফান (রা.)" },
    text: {
      en: "\"He who performs Wudu well, his sins would come out of his body, even coming out from under his nails.\"",
      bn: "\"যে ব্যক্তি উত্তমরূপে অজু করবে, তার শরীর থেকে তার গুনাহসমূহ বের হয়ে যাবে, এমনকি তার নখ তলা থেকেও গুনাহ ঝরে পড়বে।\""
    },
    reference: "Sahih Muslim 244",
    category: "Wudu"
  },
  {
    id: "hadith-first-question",
    source: "Sunan at-Tirmidhi",
    narrator: { en: "Abu Hurairah", bn: "আবু হুরায়রা (রা.)" },
    text: {
      en: "\"The first of his deeds for which a servant of Allah will be called to account on the Day of Resurrection will be his prayer. If it is found to be perfect, he will be safe and successful; but if it is defective, he will have failed and lost.\"",
      bn: "\"কিয়ামতের দিন বান্দার আমলসমূহের মধ্যে সবার আগে হিসাব নেওয়া হবে নামাজের। যদি নামাজ ঠিক পাওয়া যায় তবে সে সফলকাম ও পার পেয়ে গেল; আর যদি নামাজ ত্রুটিপূর্ণ হয় তবে সে ক্ষতিগ্রস্ত ও ব্যর্থ হলো।\""
    },
    reference: "Sunan at-Tirmidhi 413, Abu Dawud 864",
    category: "Salah"
  }
];
