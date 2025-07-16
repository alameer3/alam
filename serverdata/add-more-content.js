const fs = require('fs');
const path = require('path');

// قراءة قاعدة البيانات الحالية
const databasePath = path.join(__dirname, 'database.json');
const currentData = JSON.parse(fs.readFileSync(databasePath, 'utf8'));

// إضافة محتوى جديد
const newContent = [
  {
    id: 25,
    title: "Game of Thrones",
    title_arabic: "صراع العروش",
    description: "Nine noble families fight for control over the lands of Westeros, while an ancient enemy returns after being dormant for millennia.",
    description_arabic: "تسع عائلات نبيلة تتصارع من أجل السيطرة على أراضي ويستيروس، بينما يعود عدو قديم بعد أن كان نائماً لآلاف السنين.",
    type: "series",
    year: 2011,
    language: "English",
    quality: "4K",
    resolution: "2160p",
    rating: 9.3,
    duration: 57,
    episodes: 73,
    poster_url: "/serverdata/images/game-of-thrones.svg",
    video_url: null,
    download_url: null,
    trailer_url: null,
    imdb_id: "tt0944947",
    tmdb_id: null,
    rotten_tomatoes_score: null,
    metacritic_score: null,
    country: "USA",
    budget: null,
    box_office: null,
    awards: null,
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z",
    updated_at: "2025-07-16T20:00:00.000Z"
  },
  {
    id: 26,
    title: "Stranger Things",
    title_arabic: "أشياء غريبة",
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    description_arabic: "عندما يختفي صبي صغير، يجب على والدته ورئيس الشرطة وأصدقائه مواجهة قوى خارقة للطبيعة من أجل إعادته.",
    type: "series",
    year: 2016,
    language: "English",
    quality: "4K",
    resolution: "2160p",
    rating: 8.7,
    duration: 51,
    episodes: 42,
    poster_url: "/serverdata/images/stranger-things.svg",
    video_url: null,
    download_url: null,
    trailer_url: null,
    imdb_id: "tt4574334",
    tmdb_id: null,
    rotten_tomatoes_score: null,
    metacritic_score: null,
    country: "USA",
    budget: null,
    box_office: null,
    awards: null,
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z",
    updated_at: "2025-07-16T20:00:00.000Z"
  },
  {
    id: 27,
    title: "تشويق الجمعة",
    title_arabic: "تشويق الجمعة",
    description: "A weekly thriller program featuring mysterious and suspenseful stories.",
    description_arabic: "برنامج تشويق أسبوعي يضم قصص غامضة ومثيرة.",
    type: "television",
    year: 2024,
    language: "Arabic",
    quality: "HD",
    resolution: "1080p",
    rating: 8.4,
    duration: 45,
    episodes: 52,
    poster_url: "/serverdata/images/friday-thriller.svg",
    video_url: null,
    download_url: null,
    trailer_url: null,
    imdb_id: null,
    tmdb_id: null,
    rotten_tomatoes_score: null,
    metacritic_score: null,
    country: "Egypt",
    budget: null,
    box_office: null,
    awards: null,
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z",
    updated_at: "2025-07-16T20:00:00.000Z"
  },
  {
    id: 28,
    title: "برنامج الأسرة",
    title_arabic: "برنامج الأسرة",
    description: "A family-oriented program discussing social issues and family values.",
    description_arabic: "برنامج أسري يناقش القضايا الاجتماعية والقيم الأسرية.",
    type: "shows",
    year: 2024,
    language: "Arabic",
    quality: "HD",
    resolution: "1080p",
    rating: 8.1,
    duration: 60,
    episodes: 30,
    poster_url: "/serverdata/images/family-show.svg",
    video_url: null,
    download_url: null,
    trailer_url: null,
    imdb_id: null,
    tmdb_id: null,
    rotten_tomatoes_score: null,
    metacritic_score: null,
    country: "Saudi Arabia",
    budget: null,
    box_office: null,
    awards: null,
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z",
    updated_at: "2025-07-16T20:00:00.000Z"
  },
  {
    id: 29,
    title: "كورس التصميم الجرافيكي",
    title_arabic: "كورس التصميم الجرافيكي",
    description: "A comprehensive course on graphic design and digital art.",
    description_arabic: "كورس شامل في التصميم الجرافيكي والفن الرقمي.",
    type: "programs",
    year: 2024,
    language: "Arabic",
    quality: "HD",
    resolution: "1080p",
    rating: 9.0,
    duration: 90,
    episodes: 20,
    poster_url: "/serverdata/images/graphic-design-course.svg",
    video_url: null,
    download_url: null,
    trailer_url: null,
    imdb_id: null,
    tmdb_id: null,
    rotten_tomatoes_score: null,
    metacritic_score: null,
    country: "UAE",
    budget: null,
    box_office: null,
    awards: null,
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z",
    updated_at: "2025-07-16T20:00:00.000Z"
  },
  {
    id: 30,
    title: "لعبة الألغاز العربية",
    title_arabic: "لعبة الألغاز العربية",
    description: "An Arabic puzzle game featuring traditional riddles and brain teasers.",
    description_arabic: "لعبة ألغاز عربية تتضمن ألغاز تقليدية وأحاجي للعقل.",
    type: "games",
    year: 2024,
    language: "Arabic",
    quality: "HD",
    resolution: "1080p",
    rating: 8.2,
    duration: 0,
    episodes: null,
    poster_url: "/serverdata/images/arabic-puzzle-game.svg",
    video_url: null,
    download_url: null,
    trailer_url: null,
    imdb_id: null,
    tmdb_id: null,
    rotten_tomatoes_score: null,
    metacritic_score: null,
    country: "Jordan",
    budget: null,
    box_office: null,
    awards: null,
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z",
    updated_at: "2025-07-16T20:00:00.000Z"
  }
];

// إضافة المحتوى الجديد
currentData.content.push(...newContent);

// إضافة المزيد من الحلقات
const newEpisodes = [
  {
    id: 7,
    content_id: 25,
    season_number: 1,
    episode_number: 1,
    title: "Winter Is Coming",
    title_arabic: "الشتاء قادم",
    description: "Lord Stark is torn between his family and an old friend when asked to serve at the side of King Robert Baratheon.",
    description_arabic: "اللورد ستارك ممزق بين عائلته وصديق قديم عندما يُطلب منه الخدمة بجانب الملك روبرت باراثيون.",
    duration: 62,
    air_date: "2011-04-17",
    poster_url: "/serverdata/images/got-s1e1.svg",
    video_url: null,
    download_url: null,
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z"
  },
  {
    id: 8,
    content_id: 25,
    season_number: 1,
    episode_number: 2,
    title: "The Kingsroad",
    title_arabic: "طريق الملك",
    description: "While Bran recovers from his fall, Ned takes only his daughters to King's Landing. Jon Snow goes with his uncle Benjen to the Wall.",
    description_arabic: "بينما يتعافى براندون من سقوطه، يأخذ نيد بناته فقط إلى كينغز لاندنج. يذهب جون سنو مع عمه بينجين إلى الجدار.",
    duration: 56,
    air_date: "2011-04-24",
    poster_url: "/serverdata/images/got-s1e2.svg",
    video_url: null,
    download_url: null,
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z"
  },
  {
    id: 9,
    content_id: 26,
    season_number: 1,
    episode_number: 1,
    title: "The Vanishing of Will Byers",
    title_arabic: "اختفاء ويل بايرز",
    description: "On his way home from a friend's house, young Will sees something terrifying. Nearby, a sinister secret lurks in the depths of a government lab.",
    description_arabic: "في طريقه إلى المنزل من بيت صديق، يرى الصغير ويل شيئاً مرعباً. في المنطقة المجاورة، يكمن سر شرير في أعماق مختبر حكومي.",
    duration: 47,
    air_date: "2016-07-15",
    poster_url: "/serverdata/images/st-s1e1.svg",
    video_url: null,
    download_url: null,
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z"
  }
];

// إضافة الحلقات الجديدة
currentData.episodes.push(...newEpisodes);

// إضافة المزيد من التعليقات
const newComments = [
  {
    id: 11,
    content_id: 25,
    user_id: 1,
    comment: "مسلسل رائع جداً! أحد أفضل المسلسلات التي شاهدتها على الإطلاق.",
    rating: 10,
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z"
  },
  {
    id: 12,
    content_id: 25,
    user_id: 2,
    comment: "صراع العروش مسلسل أسطوري، كل حلقة أفضل من السابقة.",
    rating: 9,
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z"
  },
  {
    id: 13,
    content_id: 26,
    user_id: 1,
    comment: "أشياء غريبة مسلسل مثير ومخيف في نفس الوقت. أحببته كثيراً!",
    rating: 9,
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z"
  },
  {
    id: 14,
    content_id: 1,
    user_id: 2,
    comment: "فيلم كلاسيكي عظيم، يستحق المشاهدة مرة أخرى.",
    rating: 10,
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z"
  }
];

// إضافة التعليقات الجديدة
currentData.comments.push(...newComments);

// إضافة المزيد من المراجعات
const newReviews = [
  {
    id: 11,
    content_id: 25,
    user_id: 1,
    review: "صراع العروش هو مسلسل فانتازي درامي أمريكي من إنتاج HBO. يستند المسلسل إلى سلسلة روايات أغنية الجليد والنار للكاتب جورج ر. ر. مارتن. المسلسل يدور حول صراع عدة عائلات نبيلة من أجل السيطرة على العرش الحديدي لممالك ويستيروس السبع.",
    rating: 9.5,
    likes: 15,
    dislikes: 1,
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z",
    updated_at: "2025-07-16T20:00:00.000Z"
  },
  {
    id: 12,
    content_id: 26,
    user_id: 2,
    review: "أشياء غريبة (Stranger Things) هو مسلسل خيال علمي ورعب أمريكي من إنتاج Netflix. يدور المسلسل حول مجموعة من الأطفال في بلدة هوكينز الخيالية في إنديانا خلال الثمانينيات، وهم يواجهون قوى خارقة للطبيعة.",
    rating: 8.8,
    likes: 12,
    dislikes: 0,
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z",
    updated_at: "2025-07-16T20:00:00.000Z"
  }
];

// إضافة المراجعات الجديدة
currentData.reviews.push(...newReviews);

// إضافة المزيد من روابط التحميل
const newDownloadLinks = [
  {
    id: 11,
    content_id: 25,
    episode_id: 7,
    quality: "4K",
    resolution: "2160p",
    file_size: "5.2 GB",
    download_url: "https://example.com/download/got-s1e1-2160p.mp4",
    server_name: "سيرفر 4K",
    language: "English",
    subtitle: "Arabic",
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z"
  },
  {
    id: 12,
    content_id: 25,
    episode_id: 8,
    quality: "HD",
    resolution: "1080p",
    file_size: "2.8 GB",
    download_url: "https://example.com/download/got-s1e2-1080p.mp4",
    server_name: "سيرفر 1",
    language: "English",
    subtitle: "Arabic",
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z"
  },
  {
    id: 13,
    content_id: 26,
    episode_id: 9,
    quality: "4K",
    resolution: "2160p",
    file_size: "4.1 GB",
    download_url: "https://example.com/download/st-s1e1-2160p.mp4",
    server_name: "سيرفر 4K",
    language: "English",
    subtitle: "Arabic",
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z"
  }
];

// إضافة روابط التحميل الجديدة
currentData.downloadLinks.push(...newDownloadLinks);

// إضافة المزيد من روابط المشاهدة
const newStreamingLinks = [
  {
    id: 3,
    content_id: 25,
    episode_id: 7,
    quality: "4K",
    resolution: "2160p",
    streaming_url: "https://example.com/stream/got-s1e1-2160p.m3u8",
    server_name: "سيرفر المشاهدة 4K",
    language: "English",
    subtitle: "Arabic",
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z"
  },
  {
    id: 4,
    content_id: 26,
    episode_id: 9,
    quality: "HD",
    resolution: "1080p",
    streaming_url: "https://example.com/stream/st-s1e1-1080p.m3u8",
    server_name: "سيرفر المشاهدة 1",
    language: "English",
    subtitle: "Arabic",
    is_active: true,
    created_at: "2025-07-16T20:00:00.000Z"
  }
];

// إضافة روابط المشاهدة الجديدة
currentData.streamingLinks.push(...newStreamingLinks);

// حفظ قاعدة البيانات المحدثة
fs.writeFileSync(databasePath, JSON.stringify(currentData, null, 2), 'utf8');

console.log('✅ تم إضافة المحتوى الجديد بنجاح!');
console.log(`📊 إجمالي المحتوى: ${currentData.content.length}`);
console.log(`📺 إجمالي الحلقات: ${currentData.episodes.length}`);
console.log(`💬 إجمالي التعليقات: ${currentData.comments.length}`);
console.log(`⭐ إجمالي المراجعات: ${currentData.reviews.length}`);
console.log(`⬇️ إجمالي روابط التحميل: ${currentData.downloadLinks.length}`);
console.log(`📱 إجمالي روابط المشاهدة: ${currentData.streamingLinks.length}`);