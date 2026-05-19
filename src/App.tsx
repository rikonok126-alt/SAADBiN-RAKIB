import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Compass,
  Clock,
  BookOpen,
  Heart,
  MessageSquare,
  Search,
  Copy,
  Check,
  Info,
  AlertCircle,
  RefreshCw,
  Volume2,
  VolumeX,
  Menu,
  X,
  Globe,
  MapPin,
  Bookmark,
  ChevronRight,
  ChevronLeft,
  Play,
  Pause,
  CheckCircle,
  Award,
  Sparkles,
  HelpCircle
} from "lucide-react";
import {
  PRAYERS_RAKAH_DATA,
  WUDU_STEPS,
  NAMAZ_STEPS,
  CURATED_SURAS,
  HADITHS,
  Surah,
  Hadith,
  PrayerRakahInfo
} from "./data/islamicData";

// Major preset cities for prayer time retrieval
interface CityPreset {
  name: string;
  bnName: string;
  country: string;
  bnCountry: string;
}

const CITY_PRESETS: CityPreset[] = [
  { name: "Dhaka", bnName: "ঢাকা", country: "Bangladesh", bnCountry: "বাংলাদেশ" },
  { name: "Chittagong", bnName: "চট্টগ্রাম", country: "Bangladesh", bnCountry: "বাংলাদেশ" },
  { name: "Sylhet", bnName: "সিলেট", country: "Bangladesh", bnCountry: "বাংলাদেশ" },
  { name: "Rajshahi", bnName: "রাজশাহী", country: "Bangladesh", bnCountry: "বাংলাদেশ" },
  { name: "Khulna", bnName: "খুলনা", country: "Bangladesh", bnCountry: "বাংলাদেশ" },
  { name: "Mecca", bnName: "মক্কা", country: "Saudi Arabia", bnCountry: "সৌদি আরব" },
  { name: "Medina", bnName: "মদিনা", country: "Saudi Arabia", bnCountry: "সৌদি আরব" },
  { name: "London", bnName: "লন্ডন", country: "United Kingdom", bnCountry: "যুক্তরাজ্য" },
  { name: "New York", bnName: "নিউ ইয়র্ক", country: "United States", bnCountry: "যুক্তরাষ্ট্র" },
  { name: "Kuala Lumpur", bnName: "কুয়ালালামপুর", country: "Malaysia", bnCountry: "মালয়েশিয়া" }
];

export default function App() {
  // Navigation & Localization
  const [activeTab, setActiveTab] = useState<"dashboard" | "namaz" | "surahs" | "hadiths" | "ai">("dashboard");
  const [language, setLanguage] = useState<"en" | "bn">("bn"); // Bangladesh-first Namaz Shikkha context
  
  // Location States
  const [selectedCity, setSelectedCity] = useState<string>("Dhaka");
  const [selectedCountry, setSelectedCountry] = useState<string>("Bangladesh");
  const [customCityInput, setCustomCityInput] = useState<string>("");
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState<boolean>(false);
  
  // Prayer Times States
  const [prayerTimes, setPrayerTimes] = useState<any>(null);
  const [hijriDate, setHijriDate] = useState<string>("");
  const [gregorianDateStr, setGregorianDateStr] = useState<string>("");
  const [isLoadingPrayer, setIsLoadingPrayer] = useState<boolean>(true);
  const [prayerFetchError, setPrayerFetchError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<string>("00:00:00");
  const [activePrayer, setActivePrayer] = useState<string>("Dhuhr");
  const [nextPrayer, setNextPrayer] = useState<string>("Asr");
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");

  // Sub-modules navigation inside Namaz tab
  const [namazSubTab, setNamazSubTab] = useState<"step_by_step" | "wudu" | "rakah">("step_by_step");
  const [wuduStepIdx, setWuduStepIdx] = useState<number>(0);
  const [namazStepIdx, setNamazStepIdx] = useState<number>(0);

  // Surahs Memorization Tracker & Playing Simulation States
  const [selectedSurahId, setSelectedSurahId] = useState<string>("al-fatiha");
  const [isSynthesizedPlaying, setIsSynthesizedPlaying] = useState<boolean>(false);
  const [activeVerseNum, setActiveVerseNum] = useState<number>(0);
  const [surahMemoStatus, setSurahMemoStatus] = useState<Record<string, string>>(() => {
    try {
      const saved = localStorage.getItem("nour-salah-memorization");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Hadiths Tab Filter States
  const [hadithCategory, setHadithCategory] = useState<"All" | "Salah" | "Wudu">("All");
  const [hadithSearch, setHadithSearch] = useState<string>("");

  // AI Assistant Chat States
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [fallbackAICount, setFallbackAICount] = useState<number>(0);

  // Notifications Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pre-filled sample questions for AI Chat Helper
  const PRESET_QUESTIONS = {
    en: [
      { text: "How to perform Sajdah Sahw?", q: "How to perform Sajdah Sahw (prostration for mistake)?" },
      { text: "What breaks Wudu?", q: "What are the common actions that break or invalidate my Wudu?" },
      { text: "Guide for travel prayer (Qasr)", q: "What are the rules and guidelines for performing Qasr (shortening of prayers) while traveling?" },
      { text: "How to focus in Salah (Khushu)?", q: "Can you provide tips on how to increase my focus, presence of mind, and Khushu during prayer?" }
    ],
    bn: [
      { text: "সিজদা সাহু কিভাবে দেয়?", q: "নামাজে ভুল হলে সিজদায় সাহু (সিজদা সাহু) কিভাবে দিতে হয় এবং এর নিয়ম কি?" },
      { text: "অজু ভঙ্গের কারণগুলো কি?", q: "অজু কি কি কারণে ভঙ্গ বা নষ্ট হয়ে যায়? সহজ কোরআন ও হাদিস মতে বলুন।" },
      { text: "মুসাফিরের নামাজের নিয়ম", q: "ভ্রমণে গেলে কসর নামাজ কিভাবে পড়তে হয়? মুসাফিরের নামাজের দূরত্ব এবং নিয়ম কি?" },
      { text: "নামাজে মনযোগ বাড়ানোর উপায়", q: "নামাজে কিভাবে একাগ্রতা ও মনযোগ (খুশু) বৃদ্ধি করা যায়? কিছু আধ্যাত্মিক পরামর্শ দিন।" }
    ]
  };

  // Toast notifier triggers
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handle local storage storage of memorization status
  const updateSurahStatus = (surahId: string, status: string) => {
    const updated = { ...surahMemoStatus, [surahId]: status };
    setSurahMemoStatus(updated);
    localStorage.setItem("nour-salah-memorization", JSON.stringify(updated));
    showToast(
      language === "bn" 
        ? "সূরার মুখস্থ করার অগ্রগতি আপডেট করা হয়েছে!" 
        : "Surah memorization status updated!"
    );
  };

  // Copy helper
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(label);
  };

  // Convert English numbers to beautiful Bangla numbers if language is BN
  const formatBnNumber = (numStr: string | number): string => {
    if (typeof numStr === "number") numStr = numStr.toString();
    if (language === "en") return numStr;
    const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return numStr.replace(/\d/g, (d) => bnDigits[parseInt(d)]);
  };

  // Fetch Prayer Times
  const fetchPrayerTimesData = async (cityName: string, countryName: string) => {
    setIsLoadingPrayer(true);
    setPrayerFetchError(null);
    try {
      const response = await fetch(`/api/prayer-times?city=${encodeURIComponent(cityName)}&country=${encodeURIComponent(countryName)}`);
      if (!response.ok) {
        throw new Error("HTTP error " + response.status);
      }
      const parsed = await response.json();
      if (parsed.code === 200 && parsed.data) {
        setPrayerTimes(parsed.data.timings);
        
        // Setup Date
        const dateObj = parsed.data.date;
        const hijri = dateObj.hijri;
        const gregorian = dateObj.gregorian;
        
        let subHijri = `${hijri.day} ${hijri.month.en} ${hijri.year} AH`;
        if (language === "bn") {
          // Translate Hijri month names roughly to Bengali phonetics for beautiful look
          const monthsMaps: Record<string, string> = {
            "Muharram": "মহররম", "Ṣafar": "সফর", "Rabī' al-Awwal": "রবিউল আউয়াল",
            "Rabī' ath-Thānī": "রবিউস সানি", "Jumādā al-Ūlā": "জমাদিউল আউয়াল",
            "Jumādā al-Ākhirah": "জমাদিউস সানি", "Rajab": "রজব", "Sha'bān": "শাবান",
            "Ramaḍān": "রমজান", "Shawwāl": "শাওয়াল", "Dhū al-Qa'dah": "জিলকদ", "Dhū al-Ḥijjah": "জিলহজ্জ"
          };
          const translatedMonth = monthsMaps[hijri.month.en] || hijri.month.en;
          subHijri = `${formatBnNumber(hijri.day)} ${translatedMonth}, ${formatBnNumber(hijri.year)} হিজরি`;
        }
        setHijriDate(subHijri);
        
        let gregText = `${gregorian.day} ${dateObj.readable.split(' ')[1]} ${gregorian.year}`;
        if (language === "bn") {
          const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const monthsBn = ["জানুয়ারি", "ফেব্রুয়ারি", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টেম্বর", "অক্টোবর", "নভেম্বর", "ডিসেম্বর"];
          const monthIdx = dateObj.readable.split(' ')[1];
          let monthBnStr = monthIdx;
          monthsEn.forEach((m, idx) => {
            if (monthIdx.startsWith(m)) {
              monthBnStr = monthsBn[idx];
            }
          });
          gregText = `${formatBnNumber(gregorian.day)} ${monthBnStr}, ${formatBnNumber(gregorian.year)} খ্রিষ্টাব্দ`;
        }
        setGregorianDateStr(gregText);
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (err: any) {
      console.warn("Failed to fetch custom online prayer times. Loading cached location data as fallback gracefully.", err);
      // Fallback local timings (Dhaka average)
      const cachedTimings = {
        Fajr: "04:12",
        Sunrise: "05:23",
        Dhuhr: "12:02",
        Asr: "15:21",
        Maghrib: "18:41",
        Isha: "19:51"
      };
      setPrayerTimes(cachedTimings);
      setHijriDate(language === "bn" ? "০২ জিলহজ্জ ১৪৪৭ হিজরি" : "02 Dhul-Hijjah 1447 AH");
      setGregorianDateStr(language === "bn" ? "১৯ মে ২০২৬ খ্রিষ্টাব্দ" : "19 May 2026");
    } finally {
      setIsLoadingPrayer(false);
    }
  };

  // Trigger load on initial mount and location changes
  useEffect(() => {
    fetchPrayerTimesData(selectedCity, selectedCountry);
  }, [selectedCity, selectedCountry]);

  // Synchronized language adaptation for dates
  useEffect(() => {
    if (prayerTimes) {
      fetchPrayerTimesData(selectedCity, selectedCountry);
    }
  }, [language]);

  // Use GPS location to query Aladhan
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      showToast(language === "bn" ? "আপনার ব্রাউজার জিপিএস নির্ধারণ সমর্থন করে না।" : "Geolocation is not supported by your browser.");
      return;
    }
    showToast(language === "bn" ? "জিপিএস সংযোগ করা হচ্ছে..." : "Connecting to GPS...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const res = await fetch(`https://api.aladhan.com/v1/timings/${Math.floor(Date.now() / 1000)}?latitude=${lat}&longitude=${lon}&method=1`);
          const data = await res.json();
          if (data.code === 200 && data.data) {
            setPrayerTimes(data.data.timings);
            setSelectedCity("GPS Spot");
            setSelectedCountry("Local Grid");
            showToast(language === "bn" ? "আপনার লোকাল জিপিএস সময় লোড করা হয়েছে!" : "GPS localized times retrieved!");
          }
        } catch {
          showToast(language === "bn" ? "জিপিএস অবস্থান দ্বারা লোড ব্যর্থ হয়েছে।" : "Failed to load via GPS coordinates.");
        }
      },
      () => {
        showToast(language === "bn" ? "অবস্থান জানার অনুমতি দেওয়া হয়নি।" : "Location access permission denied.");
      }
    );
  };

  // Timers & Active prayer triggers
  useEffect(() => {
    if (!prayerTimes) return;

    const interval = setInterval(() => {
      const now = new Date();
      
      // Setup live clock string
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      setCurrentTimeStr(
        language === "bn" 
          ? `${formatBnNumber(hours)}:${formatBnNumber(minutes)}:${formatBnNumber(seconds)}` 
          : `${hours}:${minutes}:${seconds}`
      );

      // Parse prayer times into dates
      const prayers = [
        { name: "Fajr", time: prayerTimes.Fajr },
        { name: "Sunrise", time: prayerTimes.Sunrise },
        { name: "Dhuhr", time: prayerTimes.Dhuhr },
        { name: "Asr", time: prayerTimes.Asr },
        { name: "Maghrib", time: prayerTimes.Maghrib },
        { name: "Isha", time: prayerTimes.Isha }
      ];

      const prayerDates = prayers.map(p => {
        const [h, m] = p.time.split(":").map(Number);
        const d = new Date(now);
        d.setHours(h, m, 0, 0);
        return { name: p.name, time: d };
      });

      // Find current and next prayer
      let active = "Isha";
      let nextP = "Fajr";
      let nextDate = new Date(prayerDates[0].time);
      nextDate.setDate(nextDate.getDate() + 1); // Tomorrow's Fajr by default

      for (let i = 0; i < prayerDates.length; i++) {
        if (now >= prayerDates[i].time) {
          active = prayerDates[i].name;
          if (i === prayerDates.length - 1) {
            nextP = "Fajr";
            const tomFajr = new Date(prayerDates[0].time);
            tomFajr.setDate(tomFajr.getDate() + 1);
            nextDate = tomFajr;
          } else {
            nextP = prayerDates[i + 1].name;
            nextDate = prayerDates[i + 1].time;
          }
        }
      }

      // If before Fajr today
      if (now < prayerDates[0].time) {
        active = "Isha"; // Night active
        nextP = "Fajr";
        nextDate = prayerDates[0].time;
      }

      setActivePrayer(active);
      setNextPrayer(nextP);

      // Countdown logic
      const diffMs = nextDate.getTime() - now.getTime();
      const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);

      const fHrs = diffHrs.toString().padStart(2, "0");
      const fMins = diffMins.toString().padStart(2, "0");
      const fSecs = diffSecs.toString().padStart(2, "0");

      setCountdown(
        language === "bn"
          ? `${formatBnNumber(fHrs)} ঘন্টা ${formatBnNumber(fMins)} মিনিট ${formatBnNumber(fSecs)} সেকেন্ড`
          : `${fHrs}:${fMins}:${fSecs}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [prayerTimes, language]);

  // Simulated Surah Audio Recitation Reader Loop
  useEffect(() => {
    if (!isSynthesizedPlaying) {
      return;
    }

    const currentSurah = CURATED_SURAS.find(s => s.id === selectedSurahId);
    if (!currentSurah) return;

    setActiveVerseNum(0);

    const interval = setInterval(() => {
      setActiveVerseNum((prev) => {
        if (prev >= currentSurah.verses.length - 1) {
          setIsSynthesizedPlaying(false);
          clearInterval(interval);
          setLanguage(lang => {
            showToast(lang === "bn" ? "সূরা তিলাওয়াত সেশন সম্পন্ন হয়েছে!" : "Surah recitation complete!");
            return lang;
          });
          return 0;
        }
        return prev + 1;
      });
    }, 5500); // 5.5s reading visual block per Quranic verse

    return () => clearInterval(interval);
  }, [isSynthesizedPlaying, selectedSurahId]);

  // AI Chat Handler triggering Express server proxy endpoint
  const sendChatMessage = async (msgOverride?: string) => {
    const textSend = msgOverride || chatInput;
    if (!textSend.trim()) return;

    const userMsg = { role: "user" as const, content: textSend };
    const updatedMessages = [...messages, userMsg];
    
    setMessages(updatedMessages);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          language: language
        })
      });

      if (!response.ok) {
        throw new Error("Chat api failed");
      }

      const data = await response.json();
      if (data.success && data.message) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.message }]);
      } else {
        throw new Error(data.error || "Generation mismatch");
      }
    } catch (err) {
      console.error("Failed to query API Chat. Initiating local responsive fallback:", err);
      // Fallback response list if key is missing or system is offline
      let reply = "I am ready to help you construct a peaceful Namaz Routine. To unleash my advanced learning assistant logic, please configure a valid Google Gemini API Key in the Secrets tab.";
      if (language === "bn") {
        reply = "আমি এখানে নামাজ বা সুরার নিয়মাবলী নিয়ে আপনাকে সাহায্য করতে প্রস্তুত। জেমিনি এআই চ্যাট সক্রিয় করতে এআই স্টুডিওর Secrets এর মধ্যে GEMINI_API_KEY প্রদান করুন বা নিচের দ্রুত প্রশ্নোত্তর বাটন চাপুন।";
        
        if (textSend.includes("সিজদা সাহু") || textSend.includes("সাহু")) {
          reply = "**সিজদা সাহু (ভুলের সিজদা) আদায়ের নিয়ম:**\n\n১. নামাজের শেষ রাকাতে শুধুমাত্র তাশাহহুদ (আত্তাহিয়াতু) পড়ে ডানদিকে একটি সালাম ফেরাবেন।\n২. সালাম ফেরানোর পর তাকবির (আল্লাহু আকবার) বলে পরপর দুটি অতিরিক্ত সিজদা দিবেন।\n৩. সিজদা থেকে উঠে পুনরায় তাশাহহুদ, দুরুদ ইব্রাহিম ও দোয়া মাসুরা পড়ে বাম ও ডান দুই দিকে সালাম ফিরিয়ে নামাজ শেষ করবেন।\n\n*ব্যতিক্রম:* সিজদা সাহু দিতে ভুলে সালাম ফিরিয়ে ফেললে নামাজ পুনরুত্থাপন করাই নিরাপদ।";
        } else if (textSend.includes("অজু ভঙ্গ") || textSend.includes("ভেঙে")) {
          reply = "**অজু ভঙ্গের প্রধান ৭টি কারণ:**\n\n১. পায়খানা বা প্রস্রাবের রাস্তা দিয়ে কোনো কিছু বের হওয়া।\n২. মুখ ভরে বমি হওয়া।\n৩. শরীরের কোনো ক্ষতস্থান থেকে রক্ত বা পুঁজ বের হয়ে ছড়িয়ে পড়া।\n৪. চিৎ হয়ে, কাত হয়ে বা হেলান দিয়ে ঘুমিয়ে পড়া।\n৫. পাগল, মাতাল বা অচেতন হয়ে যাওয়া।\n৬. নামাজের মধ্যে উচ্চৈঃস্বরে হেসে ফেলা।\n৭. স্বামী-স্ত্রীর বিশেষ শারীরিক মেলামেশা।";
        } else if (textSend.includes("কসর") || textSend.includes("ভ্রমণ")) {
          reply = "**মুসাফিরের কসর নামাজের নিয়ম:**\n\n১. কেউ যদি ৪৮ মাইল বা তার বেশি দূরত্বের নিয়ত নিয়ে নিজ লোকালয় ত্যাগ করে তবে সে মুসাফির।\n২. মুসাফির অবস্থায় ৪ রাকাত বিশিষ্ট ফরজ নামাজ (যোহর, আসর ও এশা) অর্ধেক অর্থাৎ ২ রাকাত আদায় করা কোরআনের সরাসরি ছাড় (কসর)।\n৩. ফজর, মাগরিব ও বিতর নামাজের কোনো কসর বা কমতি নেই, এগুলো পূর্ণ পড়তে হবে।\n৪. দ্রুত চলন্ত যানবাহনে নামাজ পড়া সম্ভব হলে দাঁড়িয়ে, অন্যথায় বসে কিবলামুখী হয়ে ইশারায় নামাজ সম্পন্ন করা যাবে।";
        } else if (textSend.includes("মনযোগ") || textSend.includes("খুশু")) {
          reply = "**নামাজে মনযোগ (খুশু-খুযু) বাড়ানোর ৫টি পরামর্শ:**\n\n১. **অর্থ অনুধাবন:** সালাতে আপনি যেসব ছোট সুরা বা আরবী দোয়া তিলাওয়াত করছেন, তার বাংলা অনুবাদ মনে মনে বুঝার চেষ্টা করুন।\n২. **দৃষ্টি সংযম:** হাতের আঙুল বা এদিক ওদিক না তাকিয়ে সিজদার জায়গায় চোখ স্থির রাখুন।\n৩. **ধীরস্থিরতা:** প্রতিটি রুকু, সিজদা ও তাসবিহ অত্যন্ত শান্তিলগ্নভাবে সময় নিয়ে আদায় করুন। কোনো তাড়াহুড়ো করবেন না।\n৪. **মৃত্যুর নামাজ:** ভাবুন, এটিই হতে পারে আপনার জীবনের শেষ নামাজ।\n৫. **অজুর পবিত্রতা:** অত্যন্ত যত্নসহকারে সুন্নত মেনে অজু করুন। অজুর পবিত্রতা আত্মার মনোযোগ বাড়াতে প্ররোচনা দেয়।";
        }
      } else {
        if (textSend.toLowerCase().includes("sahw") || textSend.toLowerCase().includes("sahu")) {
          reply = "**Sajdah Sahw (Prostration of Forgetfulness) Rules:**\n\n1. In the final unit (Rak'ah) of prayer, recite *Tashahhud* (Attahiyyatu) only.\n2. Turn your face to the right, saying one side *Salam* ('As-salamu 'alaykum...').\n3. Immediately say *Allahu Akbar* and perform two normal prostrations (Sujud), reciting the usual tasbih three times in each.\n4. Rise to the sitting position, repeat *Tashahhud*, followed by *Durood Ibrahim* and *Doa Masura*.\n5. Finish your salah by turning the final Salam to both the right and left.";
        } else if (textSend.toLowerCase().includes("wudu") || textSend.toLowerCase().includes("breaks")) {
          reply = "**7 Common Invalidator Actions of Wudu:**\n\n1. Natural discharges from private parts (urine, flatulence, stools, etc.).\n2. Flow of blood, pus, or serum from any wound on the body.\n3. Vomiting a mouthful.\n4. Sleeping soundly while lying down or leaning back.\n5. Temporary loss of consciousness, fainting, or intoxication.\n6. Laughing aloud during a structured prayer (Salah).\n7. Direct skin contact beneath specific physical intimacy bounds.";
        } else if (textSend.toLowerCase().includes("travel") || textSend.toLowerCase().includes("qasr")) {
          reply = "**Qasr Prayer Rules (Shortening Prayers during Travel):**\n\n1. One is a traveler (*Musafir*) when embarking on a journey of 48 miles (~77 km) or more away from home bounds.\n2. While traveling, 4-unit Fard prayers (Dhuhr, Asr, and Isha) are shortened to **2 units** (this is a mandatory easement).\n3. Fajr (2 units), Maghrib (3 units), and Witr (3 units) must be prayed in full; there is no shortening for them.\n4. Sunnah acts are voluntary if the travel is hurried, but encouraged if you are staying comfortably.";
        } else if (textSend.toLowerCase().includes("khushu") || textSend.toLowerCase().includes("focus")) {
          reply = "**5 Keys to attain high focus (Khushu) in Salah:**\n\n1. **Reflect on Meanings:** Memorize translations. When chanting Surah Fatiha, picture the words inside your heart!\n2. **Gaze Placement:** Stare directly at the point of prostration (where your forehead touches). Don't look around.\n3. **Calm Movement:** Perform one motion at a time, allowing bones to settle before initiating the next posture.\n4. **Mindfulness:** Realize you are standing in front of the Creator of the Universe.\n5. **Pristine Wudu:** Start correctly. Doing wudu peacefully cleanses clutter from your mental focus.";
        }
      }

      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Helper calculation of overall memorization percentage
  const totalSurahs = CURATED_SURAS.length;
  const memorizedCount = CURATED_SURAS.filter(s => surahMemoStatus[s.id] === "memorized").length;
  const learningCount = CURATED_SURAS.filter(s => surahMemoStatus[s.id] === "learning").length;
  const memoPercent = Math.round((memorizedCount / totalSurahs) * 100);

  // Selected active surah details
  const activeSurah = CURATED_SURAS.find(s => s.id === selectedSurahId) || CURATED_SURAS[0];

  // Hadith search and category filters
  const filteredHadiths = HADITHS.filter((h) => {
    const matchCategory = hadithCategory === "All" || h.category === hadithCategory;
    const cleanSearch = hadithSearch.toLowerCase().trim();
    if (!cleanSearch) return matchCategory;
    const matchText = h.text.en.toLowerCase().includes(cleanSearch) || 
                      h.text.bn.includes(cleanSearch) ||
                      h.narrator.en.toLowerCase().includes(cleanSearch) || 
                      h.narrator.bn.includes(cleanSearch) ||
                      h.source.toLowerCase().includes(cleanSearch);
    return matchCategory && matchText;
  });

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200 selection:bg-accent-light selection:text-primary-dark bg-bg-minimal">
      {/* Toast notifications portal */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 py-3 px-6 bg-primary border border-accent/25 text-white font-sans shadow-lg rounded-full text-xs font-semibold flex items-center space-x-2"
          >
            <Sparkles className="h-4 w-4 text-accent animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Structural Navbar */}
      <header className="sticky top-0 z-40 bg-bg-minimal/90 backdrop-blur-md border-b border-border-minimal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          
          {/* Logo Brand Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center text-white border border-accent/20">
              <Compass className="h-5 w-5 animate-spin-slow text-accent" />
            </div>
            <div>
              <h1 className="text-lg font-serif font-medium text-primary tracking-tight flex items-center">
                <span>Nour Al-Salah</span>
                <span className="text-accent ml-1.5 text-base">✦</span>
              </h1>
              <p className="text-[9px] font-sans tracking-widest text-text-muted uppercase">
                {language === "bn" ? "নূর আল-সালাহ — নামাজ শিক্ষা" : "Faith, Prayer & Memorization"}
              </p>
            </div>
          </div>

          {/* Action Hubs: Location, Language toggle, Refresh */}
          <div className="flex items-center space-x-2">
            
            {/* Quick Country/City Selection panel */}
            <div className="relative">
              <button 
                onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
                className="px-3 py-1.5 rounded border border-border-minimal text-text-main bg-white hover:bg-bg-minimal active:scale-98 transition text-xs font-medium flex items-center space-x-2 shadow-2xs"
              >
                <MapPin className="h-3.5 w-3.5 text-accent" />
                <span className="max-w-[80px] sm:max-w-none truncate text-text-main">
                  {language === "bn" 
                    ? (CITY_PRESETS.find(p => p.name === selectedCity)?.bnName || selectedCity)
                    : selectedCity}
                </span>
              </button>

              {/* Presets absolute container dropdown */}
              {isCityDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white border border-border-minimal shadow-md overflow-hidden z-50 py-1 font-sans">
                  <div className="px-3 py-2 border-b border-border-minimal bg-bg-minimal">
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                      {language === "bn" ? "শহর নির্বাচন করুন" : "Select Location"}
                    </p>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {CITY_PRESETS.map((p) => (
                      <button
                        key={p.name}
                        onClick={() => {
                          setSelectedCity(p.name);
                          setSelectedCountry(p.country);
                          setIsCityDropdownOpen(false);
                          showToast(language === "bn" ? `${p.bnName} শহর সেট করা হয়েছে!` : `${p.name} location updated!`);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs transition flex items-center justify-between ${
                          selectedCity === p.name 
                            ? "bg-accent-light text-primary font-bold" 
                            : "text-text-muted hover:bg-bg-minimal hover:text-text-main"
                        }`}
                      >
                        <span>{language === "bn" ? p.bnName : p.name}</span>
                        <span className="text-[10px] text-text-muted/70">
                          {language === "bn" ? p.bnCountry : p.country}
                        </span>
                      </button>
                    ))}
                  </div>
                  
                  {/* Manual search query form */}
                  <div className="p-2 border-t border-border-minimal bg-bg-minimal flex flex-col space-y-1">
                    <input
                      type="text"
                      placeholder={language === "bn" ? "অন্য শহর... (যেমন: Sylhet)" : "Other City name..."}
                      value={customCityInput}
                      onChange={(e) => setCustomCityInput(e.target.value)}
                      className="w-full px-2 py-1 text-xs border border-border-minimal rounded bg-white text-text-main focus:ring-1 focus:ring-accent focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        if (customCityInput.trim()) {
                          setSelectedCity(customCityInput.trim());
                          setSelectedCountry(""); // Empty triggers smart fallback search on Aladhan
                          setIsCityDropdownOpen(false);
                          setCustomCityInput("");
                        }
                      }}
                      className="w-full py-1 text-[10px] font-semibold bg-primary hover:bg-primary-dark text-white rounded transition"
                    >
                      {language === "bn" ? "চালু করুন" : "Apply"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* GPS Trigger Button */}
            <button
              onClick={getUserLocation}
              title={language === "bn" ? "জিপিএস দিয়ে সন্ধান করুন" : "GPS Location Detection"}
              className="p-1.5 rounded border border-border-minimal bg-white text-primary hover:bg-bg-minimal active:scale-95 transition"
            >
              <Compass className="h-4 w-4" />
            </button>

            {/* Global English <-> Bangla Bilingual Toggle */}
            <button
              onClick={() => {
                const updatedLang = language === "en" ? "bn" : "en";
                setLanguage(updatedLang);
                showToast(updatedLang === "bn" ? "মাতৃভাষা বাংলায় পরিবর্তন করা হয়েছে!" : "App language set to English!");
              }}
              className="px-2.5 py-1.5 rounded bg-white border border-border-minimal hover:bg-bg-minimal text-text-main text-xs font-semibold font-sans tracking-tight transition flex items-center space-x-1.5"
            >
              <Globe className="h-3.5 w-3.5 text-accent" />
              <span>{language === "en" ? "বাংলা" : "English"}</span>
            </button>

          </div>
        </div>
      </header>

      {/* Main Container Workspace layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col lg:flex-row gap-6">
        
        {/* Sidebar Tabs (Visible on large viewports, sticky side list) */}
        <nav className="w-full lg:w-64 flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-1 lg:sticky lg:top-24 h-fit">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`flex items-center space-x-3 px-4 py-3 rounded-md text-xs font-medium transition cursor-pointer shrink-0 ${
              activeTab === "dashboard"
                ? "bg-white border border-border-minimal border-l-2 border-l-accent text-primary shadow-2xs font-semibold"
                : "text-text-muted hover:bg-white/60 hover:text-text-main"
            }`}
          >
            <Clock className="h-4 w-4 text-accent" />
            <span>{language === "bn" ? "নামাজের সময় ও সূচী" : "Prayer Schedule"}</span>
          </button>

          <button
            onClick={() => setActiveTab("namaz")}
            className={`flex items-center space-x-3 px-4 py-3 rounded-md text-xs font-medium transition cursor-pointer shrink-0 ${
              activeTab === "namaz"
                ? "bg-white border border-border-minimal border-l-2 border-l-accent text-primary shadow-2xs font-semibold"
                : "text-text-muted hover:bg-white/60 hover:text-text-main"
            }`}
          >
            <BookOpen className="h-4 w-4 text-accent" />
            <span>{language === "bn" ? "পরিপূর্ণ নামাজ শিক্ষা" : "Namaz Shikkha Guide"}</span>
          </button>

          <button
            onClick={() => setActiveTab("surahs")}
            className={`flex items-center space-x-3 px-4 py-3 rounded-md text-xs font-medium transition cursor-pointer shrink-0 ${
              activeTab === "surahs"
                ? "bg-white border border-border-minimal border-l-2 border-l-accent text-primary shadow-2xs font-semibold"
                : "text-text-muted hover:bg-white/60 hover:text-text-main"
            }`}
          >
            <Bookmark className="h-4 w-4 text-accent" />
            <span>{language === "bn" ? "ছোট সূরা শিক্ষা" : "Small Suras Hub"}</span>
          </button>

          <button
            onClick={() => setActiveTab("hadiths")}
            className={`flex items-center space-x-3 px-4 py-3 rounded-md text-xs font-medium transition cursor-pointer shrink-0 ${
              activeTab === "hadiths"
                ? "bg-white border border-border-minimal border-l-2 border-l-accent text-primary shadow-2xs font-semibold"
                : "text-text-muted hover:bg-white/60 hover:text-text-main"
            }`}
          >
            <Heart className="h-4 w-4 text-accent" />
            <span>{language === "bn" ? "সহিহ হাদিস ভাণ্ডার" : "Hadith Collection"}</span>
          </button>

          <button
            onClick={() => setActiveTab("ai")}
            className={`flex items-center space-x-3 px-4 py-3 rounded-md text-xs font-medium transition cursor-pointer shrink-0 ${
              activeTab === "ai"
                ? "bg-white border border-border-minimal border-l-2 border-l-accent text-primary shadow-2xs font-semibold"
                : "text-text-muted hover:bg-white/60 hover:text-text-main"
            }`}
          >
            <MessageSquare className="h-4 w-4 text-accent" />
            <span className="flex items-center gap-2">
              <span>{language === "bn" ? "নামাজ এআই সহকারী" : "Salah AI Assistant"}</span>
              <span className="text-[9px] bg-accent/10 border border-accent/20 text-accent font-medium px-1.5 py-0.5 rounded tracking-wide font-sans">Core</span>
            </span>
          </button>
        </nav>

        {/* Primary Workspace body containing the active view */}
        <section className="flex-1 bg-surface-minimal border border-border-minimal rounded-xl p-6 shadow-2xs min-h-[500px]">
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: Prayer Dashboard & Daily Reminder */}
            {activeTab === "dashboard" && (
              <motion.div
                key="dashboard-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Greeting banner with Hijri date */}
                <div className="bg-primary rounded-xl p-8 text-white relative overflow-hidden shadow-xs">
                  <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-12 translate-y-12">
                    <Compass className="h-64 w-64 text-white" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                      <span className="text-[10px] text-accent font-semibold tracking-widest uppercase block mb-1.5">{language === "bn" ? "আসসালামু আলাইকুম — স্মরণিকা" : "DAILY INSPIRATION"}</span>
                      <h2 className="text-xl md:text-2xl font-serif text-white font-medium mb-2 leading-snug">
                        {language === "bn" ? "সালাত আল্লাহু আকবার" : "Prayer commands mindfulness"}
                      </h2>
                      <p className="text-xs text-white/80 max-w-xl font-sans tracking-wide leading-relaxed">
                        {language === "bn"
                          ? "হে আমাদের রব! আমাদের নামাজ আদায়ের প্রতি অবিচল করুন এবং আমাদের বংশধরদের মধ্য থেকেও।"
                          : "My Lord, make me an establisher of prayer, and from my descendants. Our Lord, and accept our supplication."}
                      </p>
                    </div>

                    <div className="bg-white/5 backdrop-blur-xs px-5 py-4 rounded-lg border border-white/10 font-sans text-left md:text-right min-w-[220px]">
                      <div className="text-[10px] text-zinc-300 uppercase tracking-widest">{language === "bn" ? "আজকের হিযরী তারিখ" : "Hijri Calendar"}</div>
                      <div className="text-sm font-semibold text-accent mt-1">{hijriDate || "Calculating..."}</div>
                      <div className="text-xs text-white/70 font-light mt-0.5">{gregorianDateStr || "..."}</div>
                    </div>
                  </div>
                </div>

                {/* Main Prayer Times Grid + Live Countdown */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Countdown Module Panel (Large display) */}
                  <div className="md:col-span-1 rounded-xl bg-accent-light border border-accent/20 p-6 flex flex-col justify-between shadow-2xs">
                    <div>
                      <div className="flex items-center space-x-2 text-text-muted text-[10px] uppercase tracking-wider font-semibold">
                        <Clock className="h-3.5 w-3.5 text-accent animate-pulse" />
                        <span>{language === "bn" ? "চলমান নামাজ সময়" : "Current Active Phase"}</span>
                      </div>
                      
                      <div className="mt-4">
                        <span className="px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-md text-primary text-xs font-semibold tracking-tight">
                          {language === "bn" 
                            ? `${activePrayer === "Sunrise" ? "সূর্যোদয় কাল" : activePrayer + " ওয়াক্ত"}` 
                            : `${activePrayer} Time`}
                        </span>
                      </div>

                      <div className="mt-5">
                        <h3 className="text-[10px] px-0.5 font-bold uppercase tracking-wider text-text-muted">
                          {language === "bn" ? "পরবর্তী ওয়াক্ত:" : "Next Salah is:"}
                        </h3>
                        <p className="text-xl font-serif font-semibold text-primary mt-1">
                          {language === "bn" 
                            ? (nextPrayer === "Sunrise" ? "সূর্যোদয়" : nextPrayer)
                            : nextPrayer}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-accent/15">
                      <div className="text-[10px] font-medium text-text-muted uppercase tracking-widest">{language === "bn" ? "সময় বাকি আছে:" : "Remaining Countdown:"}</div>
                      <div className="text-sm font-mono font-bold text-primary mt-2 bg-white/75 px-3 py-2 rounded border border-accent/15 text-center shadow-2xs">
                        {countdown}
                      </div>
                    </div>
                  </div>

                  {/* Hourly Prayer Times Cards (Grid output list) */}
                  <div className="md:col-span-2 space-y-3">
                    <h3 className="text-xs font-bold uppercase text-text-muted tracking-widest flex items-center justify-between">
                      <span>
                        {language === "bn" 
                          ? `আজকের নামাজের সময়সূচী (${selectedCity})` 
                          : `Salah Timings for ${selectedCity}`}
                      </span>
                      {isLoadingPrayer && <RefreshCw className="h-3.5 w-3.5 text-text-muted animate-spin" />}
                    </h3>

                    {/* Full Times Array mapping */}
                    {prayerTimes ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {["Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map((name) => {
                          const timeVal = prayerTimes[name] || "--:--";
                          const isNow = activePrayer === name;
                          
                          // Format 24h into comfortable AM/PM
                          const [hStr, mStr] = timeVal.split(":");
                          const hourInt = parseInt(hStr);
                          const ampmVal = hourInt >= 12 ? "PM" : "AM";
                          const displayHours = hourInt % 12 === 0 ? 12 : hourInt % 12;
                          const formattedDisplayTime = `${displayHours}:${mStr} ${ampmVal}`;

                          // Bangla Names mapping and formatting
                          const namesBn: Record<string, string> = {
                            Fajr: "ফজর", Sunrise: "সূর্যোদয়", Dhuhr: "যোহর",
                            Asr: "আসর", Maghrib: "মাগরিব", Isha: "এশা"
                          };

                          return (
                            <div
                              key={name}
                              className={`relative p-4 rounded-xl border transition-all duration-300 flex flex-col justify-between ${
                                isNow
                                  ? "bg-accent-light border-accent text-primary shadow-xs scale-[1.01]"
                                  : "bg-white border-border-minimal text-text-main hover:border-accent/45"
                              }`}
                            >
                              {isNow && (
                                <div className="absolute top-2 right-2 flex items-center space-x-1">
                                  <span className="h-1.5 w-1.5 rounded-full bg-accent pulse-indicator"></span>
                                  <span className="text-[8px] font-bold text-accent uppercase tracking-widest">{language === "bn" ? "চলমান" : "Active"}</span>
                                </div>
                              )}

                              <div>
                                <h4 className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">
                                  {language === "bn" ? namesBn[name] : name}
                                </h4>
                                <p className="text-base font-serif font-semibold mt-1">
                                  {language === "bn" ? formatBnNumber(timeVal) : formattedDisplayTime}
                                </p>
                              </div>

                              <span className="text-[9px] text-text-muted/70 mt-2 font-light">
                                {name === "Sunrise" 
                                  ? (language === "bn" ? "নামাজ নিষিদ্ধ সময়" : "No Salah Period") 
                                  : (language === "bn" ? "ওয়াক্ত শুরু" : "Begins")}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-bg-minimal border border-border-minimal rounded-xl animate-pulse">
                        <RefreshCw className="h-5 w-5 animate-spin text-accent mx-auto mb-2" />
                        <p className="text-text-muted text-xs font-light">{language === "bn" ? "নামাজের সময় হিসাব করা হচ্ছে..." : "Locating geometric coordinates..."}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Premium Hadith of the Day (Spiritual highlight banner) */}
                <div className="bg-bg-minimal border border-border-minimal p-6 rounded-xl relative overflow-hidden">
                  <div className="absolute -top-4 -left-2 text-6xl font-serif text-accent/10 select-none">“</div>
                  <div className="relative z-10">
                    <div className="flex items-center space-x-2 mb-3">
                      <Sparkles className="h-3.5 w-3.5 text-accent" />
                      <span className="text-text-muted uppercase tracking-widest text-[9px] font-bold">
                        {language === "bn" ? "আজকের আত্মিক নির্দেশনা (হাদিস)" : "Hadith of the Day"}
                      </span>
                    </div>

                    <p className="text-sm font-serif italic text-text-main leading-relaxed max-w-3xl">
                      {language === "bn" ? HADITHS[2].text.bn : HADITHS[2].text.en}
                    </p>

                    <div className="mt-4 pt-3 border-t border-border-minimal flex items-center justify-between">
                      <span className="text-[10px] text-text-muted font-sans font-medium">
                        — {language === "bn" ? HADITHS[2].narrator.bn : HADITHS[2].narrator.en} ({HADITHS[2].source})
                      </span>
                      <button
                        onClick={() => copyToClipboard(language === "bn" ? HADITHS[2].text.bn : HADITHS[2].text.en, language === "bn" ? "হাদিস কপি হয়েছে!" : "Hadith text copied!")}
                        className="p-1 px-2.5 text-[10px] rounded hover:bg-white text-primary font-medium border border-border-minimal transition tracking-tight flex items-center space-x-1.5 shadow-2xs"
                      >
                        <Copy className="h-3 w-3 text-accent" />
                        <span>{language === "bn" ? "কপি করুন" : "Copy"}</span>
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* VIEW 2: Complete Namaz Shikkha Guide */}
            {activeTab === "namaz" && (
              <motion.div
                key="namaz-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 animate-fade"
              >
                {/* Visual Header */}
                <div className="border-b border-border-minimal pb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-serif font-semibold text-primary">
                      {language === "bn" ? "পরিপূর্ণ নামাজ শিক্ষা" : "Comprehensive Prayer Tutor"}
                    </h2>
                    <p className="text-text-muted text-xs font-light">
                      {language === "bn" 
                        ? "কোরআন ও সহিহ সুন্নাহ মোতাবেক অজুর নিয়ম, নামাজ আদায়ের নিয়ম এবং নামাজের রাকাতসমূহ।" 
                        : "Detailed step-by-step guidance on purifying oneself, structured postures, and correct counts."}
                    </p>
                  </div>

                  {/* Inner Navigation Subtabs */}
                  <div className="flex bg-bg-minimal p-1 rounded-lg border border-border-minimal">
                    <button
                      onClick={() => setNamazSubTab("step_by_step")}
                      className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition ${
                        namazSubTab === "step_by_step" 
                          ? "bg-white border border-border-minimal text-primary shadow-2xs font-semibold" 
                          : "text-text-muted hover:text-text-main hover:bg-white/40"
                      }`}
                    >
                      {language === "bn" ? "চিত্রসহ নামাজ আদায়" : "Prayer Postures"}
                    </button>
                    <button
                      onClick={() => setNamazSubTab("wudu")}
                      className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition ${
                        namazSubTab === "wudu" 
                          ? "bg-white border border-border-minimal text-primary shadow-2xs font-semibold" 
                          : "text-text-muted hover:text-text-main hover:bg-white/40"
                      }`}
                    >
                      {language === "bn" ? "অজু শিক্ষা" : "Wudu Steps"}
                    </button>
                    <button
                      onClick={() => setNamazSubTab("rakah")}
                      className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition ${
                        namazSubTab === "rakah" 
                          ? "bg-white border border-border-minimal text-primary shadow-2xs font-semibold" 
                          : "text-text-muted hover:text-text-main hover:bg-white/40"
                      }`}
                    >
                      {language === "bn" ? "ওয়াক্ত ও রাকাত" : "Rak'ah counts"}
                    </button>
                  </div>
                </div>

                {/* Sub-view A: Step-by-Step Prayer Posture Visual Deck */}
                {namazSubTab === "step_by_step" && (
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                    
                    {/* Left Quick Navigation steps list */}
                    <div className="md:col-span-4 space-y-1 bg-bg-minimal p-2 border border-border-minimal rounded-xl max-h-[460px] overflow-y-auto">
                      <p className="text-[9px] font-bold text-text-muted px-2 pb-1.5 uppercase tracking-wider">
                        {language === "bn" ? "সালাতের ধাপসমূহ" : "Prayer Timeline (Step)"}
                      </p>
                      {NAMAZ_STEPS.map((step, idx) => (
                        <button
                          key={step.id}
                          onClick={() => setNamazStepIdx(idx)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition duration-200 flex items-center space-x-2 ${
                            namazStepIdx === idx
                              ? "bg-primary text-white font-medium"
                              : "text-text-muted hover:bg-white hover:text-text-main"
                          }`}
                        >
                          <span className="font-mono text-[10px] opacity-60">
                            {formatBnNumber((idx + 1).toString().padStart(2, "0"))}
                          </span>
                          <span className="truncate">{language === "bn" ? step.title.bn : step.title.en}</span>
                        </button>
                      ))}
                    </div>

                    {/* Right active step details presentation container */}
                    <div className="md:col-span-8 bg-white border border-border-minimal p-6 rounded-xl flex flex-col justify-between shadow-2xs min-h-[400px]">
                      
                      {/* Text details content */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 bg-accent-light border border-accent/20 rounded text-accent text-[9px] font-bold uppercase tracking-wider">
                            {language === "bn" 
                              ? `ধাপ ${formatBnNumber(namazStepIdx + 1)} / ${formatBnNumber(NAMAZ_STEPS.length)}`
                              : `Step ${namazStepIdx + 1} of ${NAMAZ_STEPS.length}`}
                          </span>
                          <span className="text-text-muted text-[10px] tracking-wide font-light">
                            {language === "bn" ? "প্রার্থনা ভঙ্গি নির্দেশক" : "Mindful Body Guide"}
                          </span>
                        </div>

                        {/* Title of the Pose */}
                        <h3 className="text-lg font-serif font-semibold text-primary">
                          {language === "bn" ? NAMAZ_STEPS[namazStepIdx].title.bn : NAMAZ_STEPS[namazStepIdx].title.en}
                        </h3>

                        {/* Description text */}
                        <p className="text-xs text-text-muted leading-relaxed">
                          {language === "bn" ? NAMAZ_STEPS[namazStepIdx].desc.bn : NAMAZ_STEPS[namazStepIdx].desc.en}
                        </p>

                        {/* Arabic recitation box, if available */}
                        {NAMAZ_STEPS[namazStepIdx].arabic && (
                          <div className="bg-bg-minimal rounded-lg border border-border-minimal p-5 mt-4 text-center space-y-3 shadow-2xs">
                            <p className="text-2xl font-arabic text-primary text-right leading-loose" dir="rtl">
                              {NAMAZ_STEPS[namazStepIdx].arabic}
                            </p>
                            
                            {NAMAZ_STEPS[namazStepIdx].transliteration && (
                              <p className="text-xs font-serif italic text-text-main bg-white p-2.5 rounded border border-border-minimal">
                                <span className="font-semibold block text-[9px] text-accent not-italic uppercase tracking-widest mb-0.5">
                                  {language === "bn" ? "উচ্চারণ" : "Transliteration"}
                                </span>
                                {language === "bn" ? NAMAZ_STEPS[namazStepIdx].transliteration.bn : NAMAZ_STEPS[namazStepIdx].transliteration.en}
                              </p>
                            )}

                            {/* Meaning / Translation summary tip box */}
                            {NAMAZ_STEPS[namazStepIdx].tip && (
                              <p className="text-xs text-text-muted leading-normal">
                                {language === "bn" ? NAMAZ_STEPS[namazStepIdx].tip.bn : NAMAZ_STEPS[namazStepIdx].tip.en}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Timeline bottom button adjust controls */}
                      <div className="mt-6 pt-4 border-t border-border-minimal flex items-center justify-between">
                        <button
                          disabled={namazStepIdx === 0}
                          onClick={() => setNamazStepIdx((prev) => prev - 1)}
                          className="px-4 py-2 bg-bg-minimal border border-border-minimal hover:bg-border-minimal disabled:opacity-40 rounded text-xs font-medium text-text-main flex items-center space-x-1 select-none transition shadow-2xs"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          <span>{language === "bn" ? "পূর্ববর্তী" : "Previous"}</span>
                        </button>
                        
                        <div className="text-[11px] text-text-muted font-mono">
                          {formatBnNumber(namazStepIdx + 1)} / {formatBnNumber(NAMAZ_STEPS.length)}
                        </div>

                        <button
                          disabled={namazStepIdx === NAMAZ_STEPS.length - 1}
                          onClick={() => setNamazStepIdx((prev) => prev + 1)}
                          className="px-4 py-2 bg-primary text-white disabled:opacity-40 rounded text-xs font-semibold flex items-center space-x-1 select-none hover:bg-primary-dark transition shadow-2xs"
                        >
                          <span>{language === "bn" ? "পরবর্তী" : "Next"}</span>
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>

                    </div>
                  </div>
                )}

                {/* Sub-view B: Step-by-step Wudu deck */}
                {namazSubTab === "wudu" && (
                  <div className="space-y-6">
                    {/* Wudu top alert notes */}
                    <div className="p-4 bg-bg-minimal rounded-xl border border-border-minimal flex items-start space-x-3 text-text-main">
                      <Info className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-xs font-semibold text-primary">{language === "bn" ? "অজুর কতিপয় ফরজ कर्तव्यসমূহ" : "Four Core Fard Actions of Wudu"}</h4>
                        <p className="text-[11px] text-text-muted leading-normal mt-1">
                          {language === "bn"
                            ? "অজু শুদ্ধ হওয়ার জন্য ৪টি ফরজ কাজ পূর্ণ করা বাধ্যতামুলক: ১. সমস্ত মুখ ধোয়া, ২. কনুইসহ দুই হাত ধোয়া, ৩. মাথার এক চতুর্থাংশ মাসেহ করা এবং ৪. টাখনুসহ দুই পা ধোয়া।"
                            : "Wudu has 4 absolute mandatory obligations: 1. Washing face fully, 2. Washing hands to elbows, 3. Wiping head, and 4. Washing feet to ankles."}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      
                      {/* Left grid timeline map */}
                      <div className="md:col-span-4 bg-bg-minimal p-3 rounded-xl border border-border-minimal space-y-2">
                        <p className="text-[9px] font-bold tracking-wider text-text-muted uppercase">
                          {language === "bn" ? "অজু ধাপসমূহ" : "Ablution Steps Sequence"}
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-1.5 flex-wrap">
                          {WUDU_STEPS.map((step, idx) => (
                            <button
                              key={step.id}
                              onClick={() => setWuduStepIdx(idx)}
                              className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition ${
                                wuduStepIdx === idx
                                  ? "bg-primary text-white"
                                  : "bg-white hover:bg-bg-minimal text-text-muted border border-border-minimal"
                              }`}
                            >
                              {language === "bn" ? step.title.bn : step.title.en}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Right large active display card */}
                      <div className="md:col-span-8 bg-white border border-border-minimal p-6 rounded-xl min-h-[340px] flex flex-col justify-between shadow-2xs">
                        <div className="space-y-4">
                          <span className="px-2.5 py-1 text-[9px] font-bold text-accent bg-accent-light rounded border border-accent/20">
                            {language === "bn" 
                              ? `ধাপ ${formatBnNumber(wuduStepIdx + 1)} / ${formatBnNumber(WUDU_STEPS.length)}` 
                              : `Step ${wuduStepIdx + 1} of ${WUDU_STEPS.length}`}
                          </span>

                          <h3 className="text-lg font-serif font-semibold text-primary mt-2">
                            {language === "bn" ? WUDU_STEPS[wuduStepIdx].title.bn : WUDU_STEPS[wuduStepIdx].title.en}
                          </h3>

                          <p className="text-xs text-text-muted leading-relaxed">
                            {language === "bn" ? WUDU_STEPS[wuduStepIdx].desc.bn : WUDU_STEPS[wuduStepIdx].desc.en}
                          </p>

                          {/* Extra info tips box, if defined */}
                          {WUDU_STEPS[wuduStepIdx].tip && (
                            <p className="text-xs p-3 rounded bg-bg-minimal border-l-2 border-accent text-text-muted font-sans font-light">
                              {language === "bn" ? WUDU_STEPS[wuduStepIdx].tip.bn : WUDU_STEPS[wuduStepIdx].tip.en}
                            </p>
                          )}

                          {WUDU_STEPS[wuduStepIdx].arabic && (
                            <div className="p-4 bg-bg-minimal border border-border-minimal rounded text-center">
                              <p className="text-xl font-arabic text-primary mb-1.5" dir="rtl">{WUDU_STEPS[wuduStepIdx].arabic}</p>
                              {WUDU_STEPS[wuduStepIdx].transliteration && (
                                <p className="text-xs font-serif italic text-text-muted">
                                  {language === "bn" ? WUDU_STEPS[wuduStepIdx].transliteration.bn : WUDU_STEPS[wuduStepIdx].transliteration.en}
                                </p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Pagination adjust footer */}
                        <div className="mt-8 border-t border-border-minimal pt-4 flex justify-between items-center text-xs">
                          <button
                            disabled={wuduStepIdx === 0}
                            onClick={() => setWuduStepIdx(wuduStepIdx - 1)}
                            className="px-3 py-1.5 bg-bg-minimal border border-border-minimal hover:bg-border-minimal disabled:opacity-40 rounded text-text-main font-medium select-none cursor-pointer"
                          >
                            {language === "bn" ? "পূর্ববর্তী" : "Prev"}
                          </button>
                          
                          <span className="font-mono text-text-muted">{formatBnNumber(wuduStepIdx + 1)} / {formatBnNumber(WUDU_STEPS.length)}</span>

                          <button
                            disabled={wuduStepIdx === WUDU_STEPS.length - 1}
                            onClick={() => setWuduStepIdx(wuduStepIdx + 1)}
                            className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white disabled:opacity-40 rounded font-medium select-none cursor-pointer"
                          >
                            {language === "bn" ? "পরবর্তী" : "Next"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-view C: Detailed prayer Rak'ah Distribution sheet */}
                {namazSubTab === "rakah" && (
                  <div className="space-y-6">
                    <div className="overflow-x-auto border border-border-minimal rounded-xl bg-white shadow-2xs">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead className="bg-bg-minimal border-b border-border-minimal font-serif text-text-main">
                          <tr>
                            <th className="p-4 font-bold">{language === "bn" ? "ওয়াক্ত" : "Prayer"}</th>
                            <th className="p-4 text-center font-medium text-text-muted">{language === "bn" ? "সুন্নাত মুয়াক্কাদাহ" : "Sunnah Mu'akkadah"}</th>
                            <th className="p-4 text-center font-bold text-primary">{language === "bn" ? "ফরজ বা ফরয" : "Fard (Mandatory)"}</th>
                            <th className="p-4 text-center font-medium text-text-muted">{language === "bn" ? "সুন্নাত গায়রে মুয়াক্কাদাহ" : "Sunnah G. Mu'akkadah"}</th>
                            <th className="p-4 text-center font-medium text-text-muted">{language === "bn" ? "নফল" : "Nafl (Voluntary)"}</th>
                            <th className="p-4 text-center font-semibold text-accent">{language === "bn" ? "বিতর" : "Witr"}</th>
                            <th className="p-4 text-center font-bold">{language === "bn" ? "সর্বমোট রাকাত" : "Total Rak'ahs"}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border-minimal text-text-main">
                          {PRAYERS_RAKAH_DATA.map((info) => {
                            const r = info.rakahs;
                            return (
                              <tr key={info.name} className="hover:bg-bg-minimal/40 transition">
                                <td className="p-4 font-semibold font-serif whitespace-nowrap">
                                  <div className="text-sm font-semibold text-primary">
                                    {language === "bn" ? info.nameBn : info.name}
                                  </div>
                                  <span className="text-[10px] text-text-muted block font-sans font-light mt-0.5">
                                    {language === "bn" ? info.timeHint.bn : info.timeHint.en}
                                  </span>
                                </td>
                                <td className="p-4 text-center font-mono text-text-muted">
                                  {r.sunnahMuakkadah > 0 ? formatBnNumber(r.sunnahMuakkadah) : "—"}
                                </td>
                                <td className="p-4 text-center font-mono font-bold text-primary bg-accent-light/30">
                                  {formatBnNumber(r.fard)}
                                </td>
                                <td className="p-4 text-center font-mono text-text-muted/60">
                                  {r.sunnahGhairMuakkadah > 0 ? formatBnNumber(r.sunnahGhairMuakkadah) : "—"}
                                </td>
                                <td className="p-4 text-center font-mono text-text-muted/50">
                                  {r.nafl > 0 ? formatBnNumber(r.nafl) : "—"}
                                </td>
                                <td className="p-4 text-center font-mono text-accent">
                                  {r.witr > 0 ? formatBnNumber(r.witr) : "—"}
                                </td>
                                <td className="p-4 text-center font-mono font-bold text-primary text-sm">
                                  {formatBnNumber(r.total)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Explanatory notes footer */}
                    <div className="p-4 bg-bg-minimal rounded-xl border border-border-minimal text-[11px] text-text-muted space-y-1">
                      <p className="font-semibold block text-text-main">{language === "bn" ? "নামাজের নিয়মাবলী ও রাকাত পরিভাষা সমূহ:" : "Glossary Guidelines of Rakah terminology:"}</p>
                      <p>• <strong className="text-primary">{language === "bn" ? "ফরজ (ফরয):" : "Fard (Obligatory):"}</strong> {language === "bn" ? "যা অবশ্যই পালন করতে হবে, লঙ্ঘন করলে নামাজ বাতিল হয়ে যায়।" : "Mandatory actions. Neglecting these invalidates the entire prayer."}</p>
                      <p>• <strong>{language === "bn" ? "সুন্নত মুয়াক্কাদাহ:" : "Sunnah Mu'akkadah:"}</strong> {language === "bn" ? "রাসূল (সা.) যা নিয়মিত আদায় করতেন, বিনা কারণে তা পরিহার করা ঠিক নয়।" : "Highly stressed practice of Prophet Muhammad (PBUH) which shouldn't be missed without reasons."}</p>
                      <p>• <strong>{language === "bn" ? "বিতর নামাজ:" : "Witr Prayer:"}</strong> {language === "bn" ? "ইশা নামাজের ফরজ ও সুন্নাতের পর ৩ রাকাত বিশিষ্ট অত্যন্ত প্রয়োজনীয় ওয়াজিব বা গুরুত্বপূর্ণ নামাজ।" : "A 3-unit obligatory dry prayer prayed primarily after Isha."}</p>
                    </div>
                  </div>
                )}

              </motion.div>
            )}

            {/* VIEW 3: Memorization Hub & Quranic Suras Reader */}
            {activeTab === "surahs" && (
              <motion.div
                key="suras-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 animate-fade"
              >
                {/* Header with tracker progress card details */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center border-b border-border-minimal pb-6">
                  <div className="md:col-span-7">
                    <h2 className="text-xl font-serif font-semibold text-primary">
                      {language === "bn" ? "ছোট সূরাসমূহ তিলাওয়াত ও মুখস্থ সহকারী" : "Small Suras Memorization Helper"}
                    </h2>
                    <p className="text-text-muted text-xs mt-1 font-light">
                      {language === "bn"
                        ? "নামাজে সহজে ব্যবহার করার জন্য কুরআনের ১০টি ছোট এবং অতি প্রয়োজনীয় সূরা এখানে উচচারণ ও অর্থসহ সংরক্ষণ করা হয়েছে। আপনার অগ্রগতি চিহ্নিত করতে পারেন!"
                        : "Browse 10 shortest necessary Suras for daily prayer recitations. Click statuses to track memorization goals."}
                    </p>
                  </div>

                  {/* Progressive memorization meter bar */}
                  <div className="md:col-span-5 bg-bg-minimal border border-border-minimal p-4 rounded-xl font-sans shadow-2xs">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-semibold text-text-main flex items-center space-x-1.5">
                        <Award className="h-4 w-4 text-accent animate-bounce" />
                        <span>{language === "bn" ? "মুখস্থ করার লক্ষ্যমাত্রা" : "My Memorized Target"}</span>
                      </span>
                      <span className="font-mono text-primary font-bold">{formatBnNumber(memoPercent)}%</span>
                    </div>
                    {/* Visual meter bar background */}
                    <div className="w-full bg-border-minimal h-1.5 rounded-full overflow-hidden">
                      <div className="bg-accent h-full transition-all duration-500" style={{ width: `${memoPercent}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[10px] text-text-muted mt-2">
                      <span>{language === "bn" ? `${formatBnNumber(memorizedCount)}টি সূরা মুখস্থ` : `${memorizedCount} Memorized`}</span>
                      <span>{language === "bn" ? `${formatBnNumber(learningCount)}টি চলমান` : `${learningCount} In Progress`}</span>
                    </div>
                  </div>
                </div>

                {/* Sura display split panel */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  
                  {/* Left list pane of Suras */}
                  <div className="md:col-span-4 space-y-2 bg-bg-minimal p-2 border border-border-minimal rounded-xl max-h-[460px] overflow-y-auto">
                    <p className="text-[9px] font-bold text-text-muted px-3 uppercase tracking-wider">
                      {language === "bn" ? "সূরা তালিকা" : "Short Surah List"}
                    </p>
                    {CURATED_SURAS.map((s) => {
                      const memoState = surahMemoStatus[s.id] || "not_started";
                      
                      return (
                        <div
                          key={s.id}
                          className={`p-3 rounded-lg border transition duration-300 flex items-center justify-between cursor-pointer ${
                            selectedSurahId === s.id
                              ? "bg-primary text-white border-primary shadow-xs"
                              : "bg-white hover:bg-bg-minimal/60 text-text-main border-border-minimal"
                          }`}
                          onClick={() => {
                            setSelectedSurahId(s.id);
                            setIsSynthesizedPlaying(false);
                            setActiveVerseNum(0);
                          }}
                        >
                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className="text-[10px] font-mono opacity-50 font-bold">
                                {formatBnNumber(s.number)}
                              </span>
                              <h4 className="text-xs font-serif font-semibold">
                                {language === "bn" ? s.nameBangla : s.nameEnglish}
                              </h4>
                            </div>
                            <span className="text-[10px] opacity-75 mt-0.5 block font-sans font-light">
                              {language === "bn" ? s.meaning.bn : s.meaning.en}
                            </span>
                          </div>

                          {/* Tracking badge status cycle */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const nextMap: Record<string, string> = {
                                not_started: "learning",
                                learning: "memorized",
                                memorized: "not_started"
                              };
                              updateSurahStatus(s.id, nextMap[memoState]);
                            }}
                            className={`p-1 px-2 rounded text-[9px] font-bold tracking-tight select-none uppercase transition active:scale-95 border ${
                              memoState === "memorized"
                                ? "bg-accent-light border-accent/20 text-accent"
                                : memoState === "learning"
                                ? "bg-primary/10 border-primary/25 text-primary"
                                : "bg-bg-minimal text-text-muted border-border-minimal hover:bg-border-minimal"
                            }`}
                          >
                            {memoState === "memorized" 
                              ? (language === "bn" ? "মুখস্থ" : "Done")
                              : memoState === "learning" 
                              ? (language === "bn" ? "শিখছি" : "Study") 
                              : (language === "bn" ? "বাকি" : "New")}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* Right active surah interactive reader container */}
                  <div className="md:col-span-8 bg-white border border-border-minimal p-6 rounded-xl shadow-2xs">
                    
                    {/* Sura top description sheet */}
                    <div className="border-b border-border-minimal pb-4 mb-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-serif font-semibold text-primary">
                            {language === "bn" ? activeSurah.nameBangla : activeSurah.nameEnglish}
                          </h3>
                          <span className="text-sm font-arabic text-accent font-bold">
                            ({activeSurah.nameArabic})
                          </span>
                        </div>
                        <p className="text-[11px] text-text-muted mt-0.5 font-light">
                          {language === "bn" 
                            ? `অর্থ: “${activeSurah.meaning.bn}” — ${activeSurah.revelationType.bn} সূরা — ${formatBnNumber(activeSurah.versesCount)}টি আয়াত` 
                            : `Meaning: “${activeSurah.meaning.en}” — ${activeSurah.revelationType.en} — ${activeSurah.versesCount} verses`}
                        </p>
                      </div>

                      {/* Memorization toggle indicator */}
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] text-text-muted uppercase tracking-widest font-semibold">{language === "bn" ? "অগ্রগতি:" : "Status:"}</span>
                        <select
                          value={surahMemoStatus[activeSurah.id] || "not_started"}
                          onChange={(e) => updateSurahStatus(activeSurah.id, e.target.value)}
                          className="text-xs bg-bg-minimal border border-border-minimal rounded p-1 font-sans text-text-main font-medium focus:ring-1 focus:ring-accent outline-hidden"
                        >
                          <option value="not_started">{language === "bn" ? "শুরু করিনি" : "Not Started"}</option>
                          <option value="learning">{language === "bn" ? "শিখছি / মুখস্থ করছি" : "Learning"}</option>
                          <option value="memorized">{language === "bn" ? "মুখস্থ সম্পন্ন হয়েছে!" : "Memorized!"}</option>
                        </select>
                      </div>
                    </div>

                    {/* Integrated Simulated Hafidh Mode Player */}
                    <div className="p-4 bg-bg-minimal border border-border-minimal rounded-lg mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-primary flex items-center space-x-1.5">
                          <Volume2 className="h-4 w-4 text-accent animate-pitch" />
                          <span>{language === "bn" ? "ডিজিটাল তিলাওয়াত শিক্ষক চালু করুন" : "Synthesized Reading Tutor Loop"}</span>
                        </h4>
                        <p className="text-[10px] text-text-muted leading-normal mt-0.5 font-light">
                          {language === "bn"
                            ? "প্লে চাপলে প্রতিটি আয়াত ক্রমান্বয়ে ৫ সেকেন্ড সময় নিয়ে হাইলাইট হবে। নামাজে সূরাটি মনে মনে পড়ার চমৎকার অনুশীলন!"
                            : "Click play to automatically sequence verses every 5s with glowing visual aids to assist recall."}
                        </p>
                      </div>

                      <button
                        onClick={() => setIsSynthesizedPlaying(!isSynthesizedPlaying)}
                        className={`px-4 py-2 rounded text-xs font-semibold transition flex items-center space-x-1.5 select-none cursor-pointer shadow-2xs ${
                          isSynthesizedPlaying
                            ? "bg-red-700 text-white animate-pulse"
                            : "bg-primary text-white hover:bg-primary-dark"
                        }`}
                      >
                        {isSynthesizedPlaying ? (
                          <>
                            <Pause className="h-3.5 w-3.5" />
                            <span>{language === "bn" ? "থামুন" : "Pause"}</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5 fill-current text-accent" />
                            <span>{language === "bn" ? "অনুশীলন শুরু" : "Start Play Loop"}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Surah Verses List displays */}
                    <div className="space-y-6 max-h-[460px] overflow-y-auto pr-2 pb-6 font-sans">
                      
                      {/* Bismillah placeholder heading */}
                      {activeSurah.id !== "al-fatiha" && (
                        <div className="text-center py-4 border-b border-border-minimal">
                          <p className="font-arabic text-xl text-primary leading-normal">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
                          <p className="text-[10px] text-text-muted mt-1 italic font-serif">
                            {language === "bn" ? "পরম করুণাময় দয়ালু আল্লাহর নামে শুরু করছি" : "In the name of Allah, the Entirely Merciful, the Especially Merciful."}
                          </p>
                        </div>
                      )}

                      {/* Map verses items */}
                      {activeSurah.verses.map((v, index) => {
                        const isVerseHighlighted = isSynthesizedPlaying && activeVerseNum === index;
                        
                        return (
                          <div
                            key={v.number}
                            className={`p-4 rounded-xl transition duration-300 border ${
                              isVerseHighlighted
                                ? "bg-accent-light border-accent shadow-2xs"
                                : "border-transparent"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              {/* Verse designation numbers circle */}
                              <span className="h-5 w-5 rounded-full bg-white text-[10px] font-mono text-text-muted border border-border-minimal flex items-center justify-center shrink-0 shadow-2xs">
                                {formatBnNumber(v.number)}
                              </span>

                              {/* Arabic, Transliteration, Translation cluster */}
                              <div className="flex-1 text-right space-y-3">
                                <p className="text-2xl font-arabic text-primary leading-loose" dir="rtl">
                                  {v.arabic}
                                </p>
                                
                                <div className="text-left space-y-1.5 mt-3">
                                  <p className="text-xs font-serif italic text-text-muted">
                                    <span className="text-[8px] font-bold text-accent not-italic block uppercase tracking-wider mb-0.5">{language === "bn" ? "উচ্চারণ" : "Translit."}</span>
                                    {language === "bn" ? v.transliteration.bn : v.transliteration.en}
                                  </p>
                                  <p className="text-xs text-text-main leading-relaxed font-sans font-light">
                                    <span className="text-[8px] font-bold text-primary block uppercase tracking-wider mb-0.5">{language === "bn" ? "অনুবাদ" : "Translation"}</span>
                                    {language === "bn" ? v.translation.bn : v.translation.en}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Bottom notes on benefits */}
                    <div className="mt-8 pt-4 border-t border-border-minimal">
                      <div className="p-4 bg-bg-minimal border border-border-minimal rounded-xl text-xs text-text-main flex items-start space-x-3 shadow-2xs">
                        <Sparkles className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-primary">{language === "bn" ? "সূরাটির মাহাত্ম্য ও ফজিলত:" : "Surah Spiritual Benefits:"}</h5>
                          <p className="text-[11px] leading-relaxed text-text-muted mt-1 font-light font-serif">
                            {language === "bn" ? activeSurah.benefit.bn : activeSurah.benefit.en}
                          </p>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </motion.div>
            )}

            {/* VIEW 4: Searchable Authentic Hadith Treasure library */}
            {activeTab === "hadiths" && (
              <motion.div
                key="hadiths-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 animate-fade"
              >
                {/* Header text */}
                <div className="border-b border-border-minimal pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-serif font-semibold text-primary">
                      {language === "bn" ? "সহিহ নামাজ ও অজু বিষয়ক হাদিসসমূহ" : "Authentic Hadith Treasures"}
                    </h2>
                    <p className="text-text-muted text-xs font-light mt-1">
                      {language === "bn" 
                        ? "সালাত আদায়, অজু তিলাওয়াত এবং চারিত্রিক পবিত্রতা সম্পর্কিত সহিহ বুখারী, মুসলিম ও নাসায়ীর নির্ভরযোগ্য হাদিস ভাণ্ডার।"
                        : "Verified reports of Prophet Muhammad (PBUH) from Bukhari, Muslim, and Ahmad regarding Salah and clean states."}
                    </p>
                  </div>

                  {/* Hadith Category filter tab buttons */}
                  <div className="flex bg-bg-minimal p-1 rounded-lg border border-border-minimal">
                    {["All", "Salah", "Wudu"].map((cat) => {
                      const displayCat: Record<string, string> = {
                        All: language === "bn" ? "সব হাদিস" : "All",
                        Salah: language === "bn" ? "নামাজ" : "Salah",
                        Wudu: language === "bn" ? "অজু ও পবিত্রতা" : "Wudu"
                      };

                      return (
                        <button
                          key={cat}
                          onClick={() => setHadithCategory(cat as any)}
                          className={`px-3 py-1.5 rounded text-xs font-medium cursor-pointer transition ${
                            hadithCategory === cat
                              ? "bg-primary text-white font-semibold"
                              : "text-text-muted hover:text-text-main"
                          }`}
                        >
                          {displayCat[cat]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Hadith Search controls */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-text-muted/60" />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 pr-4 py-2.5 text-xs text-text-main bg-bg-minimal border border-border-minimal rounded focus:outline-hidden focus:ring-1 focus:ring-accent focus:bg-white transition"
                    placeholder={
                      language === "bn" 
                        ? "হাদিস, রাবী বা রেফারেন্স দিয়ে খুঁজুন... (বাংলা বা ইংরেজী)" 
                        : "Filter Hadith by narrator, content or reference book index..."
                    }
                    value={hadithSearch}
                    onChange={(e) => setHadithSearch(e.target.value)}
                  />
                </div>

                {/* Grid collection display map */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredHadiths.map((h) => (
                    <div
                      key={h.id}
                      className="bg-white border border-border-minimal p-5 rounded-xl flex flex-col justify-between hover:shadow-2xs hover:border-accent/40 transition-all duration-300"
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-[10px]">
                          <span className="px-2.5 py-0.5 rounded text-[9px] font-bold text-accent bg-accent-light border border-accent/20">
                            {h.category === "Salah" 
                              ? (language === "bn" ? "নামাজ" : "Salah") 
                              : (language === "bn" ? "অজু" : "Wudu")}
                          </span>
                          <span className="text-text-muted font-mono font-medium">{h.source}</span>
                        </div>

                        <p className="text-xs font-serif text-text-main leading-relaxed italic">
                          {language === "bn" ? h.text.bn : h.text.en}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-border-minimal flex items-center justify-between">
                        <div className="text-[10px] text-text-muted font-sans font-light">
                          {language === "bn" ? "বর্ণনাকারী:" : "Narrator:"} <span className="font-semibold text-text-main">{language === "bn" ? h.narrator.bn : h.narrator.en}</span>
                          <span className="block text-[8px] text-text-muted/65 font-mono">{h.reference}</span>
                        </div>

                        {/* Copy citation trigger button */}
                        <button
                          onClick={() => {
                            const rawText = `"${language === "bn" ? h.text.bn : h.text.en}"\n— ${language === "bn" ? h.narrator.bn : h.narrator.en} (${h.source}: ${h.reference})`;
                            copyToClipboard(rawText, language === "bn" ? "অনুলিপি কপি করা হয়েছে!" : "Hadith with citation copied!");
                          }}
                          className="p-1 px-2 text-[9px] hover:bg-bg-minimal border border-border-minimal rounded text-primary font-medium transition flex items-center space-x-1 shadow-2xs"
                        >
                          <Copy className="h-3 w-3 text-accent" />
                          <span>{language === "bn" ? "কপি" : "Copy"}</span>
                        </button>
                      </div>
                    </div>
                  ))}

                  {filteredHadiths.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-bg-minimal border border-border-minimal rounded-xl shadow-2xs">
                      <AlertCircle className="h-8 w-8 text-accent mx-auto mb-2 animate-bounce" />
                      <p className="text-text-muted text-xs font-light">{language === "bn" ? "পছন্দসই কোনো হাদিস খুঁজে পাওয়া যায়নি।" : "No matches discovered in Hadith index."}</p>
                    </div>
                  )}
                </div>

              </motion.div>
            )}

            {/* VIEW 5: Multi-lingual AI Consultation Chatbot panel */}
            {activeTab === "ai" && (
              <motion.div
                key="ai-view"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6 flex flex-col justify-between animate-fade"
              >
                {/* Header detail */}
                <div className="border-b border-border-minimal pb-4">
                  <div className="flex items-center space-x-2.5">
                    <div className="bg-accent-light p-1 rounded-sm border border-accent/20">
                      <Sparkles className="h-5 w-5 text-accent animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-xl font-serif font-semibold text-primary leading-none">
                        {language === "bn" ? "নামাজ এআই শরীয়াহ জিজ্ঞাসা" : "Namas AI Shariah Tutor"}
                      </h2>
                      <p className="text-text-muted text-xs font-light mt-1.5">
                        {language === "bn"
                          ? "নামাজ, অজু, দোআর উচ্চারণ বা শরীয়তের কোনো ভুল-ভ্রান্তি নিয়ে কৃত্রিম বুদ্ধিমত্তা সম্পন্ন ইসলামিক সহকারীর নিকট বিনম্র প্রশ্ন জিজ্ঞাসা করতে পারেন।"
                          : "Query any rulings about mistaken steps, travel limitations, or Arabic recitation definitions with our helpful guide companion."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Preset Fast Quick-fire widgets triggers */}
                <div className="space-y-2 bg-bg-minimal border border-border-minimal p-4 rounded-xl shadow-2xs">
                  <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-1">
                    {language === "bn" ? "দ্রুত সমাধান পাওয়ার সাধারণ প্রশ্নাবলি:" : "Frequently asked quick questions:"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {language === "bn"
                      ? PRESET_QUESTIONS.bn.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => sendChatMessage(item.q)}
                            className="bg-white hover:bg-bg-minimal border border-border-minimal text-text-main text-xs p-2.5 rounded-sm text-left transition active:scale-95 shadow-2xs hover:border-accent font-medium cursor-pointer"
                          >
                            💡 {item.text}
                          </button>
                        ))
                      : PRESET_QUESTIONS.en.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => sendChatMessage(item.q)}
                            className="bg-white hover:bg-bg-minimal border border-border-minimal text-text-main text-xs p-2.5 rounded-sm text-left transition active:scale-95 shadow-2xs hover:border-accent font-medium cursor-pointer"
                          >
                            💡 {item.text}
                          </button>
                        ))}
                  </div>
                </div>

                {/* Chat dialogues output pane list */}
                <div className="bg-bg-minimal/40 border border-border-minimal rounded-xl p-4 min-h-[300px] max-h-[380px] overflow-y-auto space-y-4 shadow-inner flex flex-col">
                  {messages.length === 0 && (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-text-muted space-y-3">
                      <HelpCircle className="h-8 w-8 text-accent animate-bounce" />
                      <div>
                        <p className="text-xs font-serif font-semibold text-text-main">
                          {language === "bn"
                            ? "আসসালামু আলাইকুম! কোনো নামাজ বা অজুর মাসআলা নিয়ে মনে কি সন্দেহ বা ভয় ঘুরছে?"
                            : "As-salamu 'alaykum! Reach out with your learning doubts and query me."}
                        </p>
                        <p className="text-[10px] text-text-muted mt-1 font-light">
                          {language === "bn"
                            ? "যেমন: 'অজুতে কনুই ধুতে ভুলে গেলে কি হবে?'"
                            : "E.g. 'What if I miss a prostration by accident during Tashahhud?'"}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Render messages */}
                  {messages.map((m, idx) => {
                    const isUser = m.role === "user";
                    return (
                      <div
                        key={idx}
                        className={`flex ${isUser ? "justify-end animate-slice" : "justify-start animate-fade"} text-xs`}
                      >
                        <div
                          className={`max-w-[85%] rounded-2xl p-4 shadow-2xs leading-relaxed ${
                            isUser
                              ? "bg-primary text-white rounded-tr-none px-4"
                              : "bg-white border border-border-minimal text-text-main rounded-tl-none prose prose-stone font-light"
                          }`}
                        >
                          <span className={`text-[8px] uppercase block mb-1 font-bold tracking-widest ${isUser ? "text-[#E6F4EA]" : "text-accent"}`}>
                            {isUser 
                              ? (language === "bn" ? "আপনার প্রশ্ন" : "You") 
                              : (language === "bn" ? "ইসলামিক সহকারীর বাণী" : "Nour Al-Salah Assistant")}
                          </span>
                          
                          {/* Markdown parsing simulated smoothly */}
                          <p className="whitespace-pre-wrap leading-relaxed">
                            {m.content}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                  {/* AI Generating Loading spinner */}
                  {isChatLoading && (
                    <div className="flex justify-start text-xs">
                      <div className="bg-white border border-border-minimal rounded-2xl p-4 rounded-tl-none shadow-2xs flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }}></div>
                          <div className="h-2 w-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }}></div>
                          <div className="h-2 w-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }}></div>
                        </div>
                        <span className="text-[10px] text-text-muted">{language === "bn" ? "উত্তম ফতোয়া বিশ্লেষক উত্তর অনুসন্ধান করছে..." : "Consulting authentic references..."}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Input action toolbar footer */}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                    placeholder={
                      language === "bn"
                        ? "আপনার নামাজ বা অজুর মাসআলা প্রশ্ন এখানে লিখুন..."
                        : "Ask a detailed question: e.g. What is the reward of congregation prayer..."
                    }
                    className="flex-1 bg-white border border-border-minimal hover:border-accent/40 rounded px-4 py-3 text-xs text-text-main focus:outline-hidden focus:ring-1 focus:ring-accent font-sans shadow-2xs transition"
                  />
                  <button
                    disabled={isChatLoading || !chatInput.trim()}
                    onClick={() => sendChatMessage()}
                    className="px-6 py-3 bg-primary border border-primary/20 text-white hover:bg-primary/90 rounded text-xs font-semibold transition disabled:opacity-40 font-sans shadow-2xs cursor-pointer select-none"
                  >
                    {language === "bn" ? "জিজ্ঞাসা" : "Send Query"}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </section>

      </main>

      {/* Structured Footer */}
      <footer className="bg-stone-900 text-stone-300 py-10 border-t border-stone-850 text-xs font-light font-sans mt-12 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <p className="font-serif text-base text-accent font-semibold tracking-wide mb-1">
            {language === "bn" ? "নূর আল-সালাহ — নামাজ শিক্ষা পোর্টাল" : "Nour Al-Salah • Faith Companion"}
          </p>
          <p className="max-w-lg mx-auto text-[10px] text-stone-400 leading-relaxed font-light">
            {language === "bn"
              ? "নামাজ ইসলামের স্তম্ভ। এই অ্যাপ্লিকেশনটি কেবলমাত্র নামাজ ও সহিহ সুন্নাহ মোতাবেক অজুর সাধারণ নিয়মাবলী শেখার জন্য তৈরি। কোনো গভীর ইসলামী মতাদর্শিক প্রশ্নের জন্য অভিজ্ঞ মুফতি বা ওলামাদের শরণাপন্ন হওয়া কর্তব্য।"
              : "Prayer is the second pillar of Islam. This application serves as an interactive educational aid for learning. Consult credentialed Muftis or scholars for formal theological queries."}
          </p>
          <div className="pt-4 border-t border-stone-800 text-[10px] text-stone-500 font-mono">
            &copy; {formatBnNumber("2026")} Nour Al-Salah. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
