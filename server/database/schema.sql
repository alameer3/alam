-- مخطط قاعدة البيانات الشاملة لموقع AK.SV
-- تم إنشاؤه بناءً على متطلبات المستخدم للتوسع المستقبلي

PRAGMA foreign_keys = ON;

-- جدول إعدادات الموقع
CREATE TABLE IF NOT EXISTS site_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL UNIQUE,
    value TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('string', 'number', 'boolean', 'json')),
    category TEXT NOT NULL CHECK (category IN ('general', 'appearance', 'social', 'advanced')),
    description TEXT,
    is_active BOOLEAN DEFAULT 1,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول المستخدمين
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    avatar TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user', 'moderator')),
    is_active BOOLEAN DEFAULT 1,
    last_login DATETIME,
    join_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    preferences TEXT, -- JSON format
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول الفئات
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    is_active BOOLEAN DEFAULT 1,
    order_index INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول الأنواع
CREATE TABLE IF NOT EXISTS genres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    description TEXT,
    color TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول الأشخاص (ممثلين، مخرجين، كتاب)
CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    biography TEXT,
    photo TEXT,
    birth_date DATE,
    birth_place TEXT,
    roles TEXT, -- JSON array: ['actor', 'director', 'writer', 'producer']
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول المحتوى الرئيسي
CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    description TEXT,
    description_ar TEXT,
    type TEXT NOT NULL CHECK (type IN ('movie', 'series', 'program', 'game', 'application', 'theater', 'wrestling', 'sports')),
    poster TEXT,
    backdrop TEXT,
    trailer TEXT,
    release_date DATE,
    rating REAL DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    duration INTEGER, -- بالدقائق
    language TEXT DEFAULT 'ar',
    country TEXT DEFAULT 'YE',
    quality TEXT DEFAULT 'HD',
    status TEXT DEFAULT 'completed' CHECK (status IN ('completed', 'ongoing', 'cancelled')),
    is_active BOOLEAN DEFAULT 1,
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول الحلقات
CREATE TABLE IF NOT EXISTS episodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    title_ar TEXT NOT NULL,
    description TEXT,
    episode_number INTEGER NOT NULL,
    season_number INTEGER NOT NULL,
    duration INTEGER, -- بالدقائق
    release_date DATE,
    thumbnail TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
);

-- جدول ربط المحتوى بالفئات
CREATE TABLE IF NOT EXISTS content_categories (
    content_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (content_id, category_id),
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- جدول ربط المحتوى بالأنواع
CREATE TABLE IF NOT EXISTS content_genres (
    content_id INTEGER NOT NULL,
    genre_id INTEGER NOT NULL,
    PRIMARY KEY (content_id, genre_id),
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    FOREIGN KEY (genre_id) REFERENCES genres(id) ON DELETE CASCADE
);

-- جدول ربط المحتوى بالأشخاص
CREATE TABLE IF NOT EXISTS content_people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_id INTEGER NOT NULL,
    person_id INTEGER NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('actor', 'director', 'writer', 'producer')),
    character_name TEXT, -- اسم الشخصية للممثلين
    order_index INTEGER DEFAULT 0,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    FOREIGN KEY (person_id) REFERENCES people(id) ON DELETE CASCADE
);

-- جدول روابط التحميل
CREATE TABLE IF NOT EXISTS download_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_id INTEGER NOT NULL,
    episode_id INTEGER,
    quality TEXT NOT NULL,
    size TEXT,
    url TEXT NOT NULL,
    server TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    download_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE
);

-- جدول روابط المشاهدة
CREATE TABLE IF NOT EXISTS streaming_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content_id INTEGER NOT NULL,
    episode_id INTEGER,
    quality TEXT NOT NULL,
    url TEXT NOT NULL,
    server TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    view_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE
);

-- جدول المراجعات
CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_recommended BOOLEAN DEFAULT 1,
    is_active BOOLEAN DEFAULT 1,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    UNIQUE (user_id, content_id)
);

-- جدول التعليقات
CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content_id INTEGER NOT NULL,
    parent_id INTEGER,
    text TEXT NOT NULL,
    is_active BOOLEAN DEFAULT 1,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- جدول تفاعلات المستخدمين
CREATE TABLE IF NOT EXISTS user_interactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content_id INTEGER NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('favorite', 'watchlist', 'watched', 'rating', 'like', 'dislike')),
    value INTEGER, -- للتقييم
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE
);

-- جدول تاريخ المشاهدة
CREATE TABLE IF NOT EXISTS watch_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content_id INTEGER NOT NULL,
    episode_id INTEGER,
    progress INTEGER DEFAULT 0, -- بالثواني
    watched_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_completed BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE
);

-- جدول الإشعارات
CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- جدول الإعلانات
CREATE TABLE IF NOT EXISTS advertisements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    image TEXT,
    url TEXT,
    position TEXT NOT NULL CHECK (position IN ('header', 'sidebar', 'footer', 'content', 'popup')),
    is_active BOOLEAN DEFAULT 1,
    start_date DATE NOT NULL,
    end_date DATE,
    click_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- جدول الاشتراكات
CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    plan TEXT NOT NULL CHECK (plan IN ('free', 'premium', 'vip')),
    start_date DATE NOT NULL,
    end_date DATE,
    is_active BOOLEAN DEFAULT 1,
    features TEXT, -- JSON array
    price REAL,
    payment_method TEXT,
    renewal_date DATE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- جدول سجل الأنشطة
CREATE TABLE IF NOT EXISTS activity_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    action TEXT NOT NULL,
    target TEXT NOT NULL,
    target_id INTEGER,
    ip TEXT,
    user_agent TEXT,
    details TEXT, -- JSON format
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- جدول التقارير
CREATE TABLE IF NOT EXISTS reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content_id INTEGER,
    comment_id INTEGER,
    review_id INTEGER,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME,
    resolved_by INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES content(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE,
    FOREIGN KEY (resolved_by) REFERENCES users(id) ON DELETE SET NULL
);

-- فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
CREATE INDEX IF NOT EXISTS idx_content_active ON content(is_active);
CREATE INDEX IF NOT EXISTS idx_content_rating ON content(rating);
CREATE INDEX IF NOT EXISTS idx_content_release_date ON content(release_date);
CREATE INDEX IF NOT EXISTS idx_content_view_count ON content(view_count);
CREATE INDEX IF NOT EXISTS idx_episodes_content_id ON episodes(content_id);
CREATE INDEX IF NOT EXISTS idx_episodes_season_episode ON episodes(season_number, episode_number);
CREATE INDEX IF NOT EXISTS idx_reviews_content_id ON reviews(content_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_content_id ON comments(content_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_content_id ON user_interactions(content_id);
CREATE INDEX IF NOT EXISTS idx_watch_history_user_id ON watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);