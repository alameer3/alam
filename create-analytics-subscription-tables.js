import { db } from './server/db.ts';
import { sql } from 'drizzle-orm';

async function createAnalyticsSubscriptionTables() {
  console.log('🔧 Creating analytics and subscription tables...');

  try {
    // Test connection
    await db.execute(sql`SELECT 1`);
    console.log('✅ Database connection successful');

    // Create subscription plans table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS subscription_plans (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        name_arabic TEXT NOT NULL,
        description TEXT,
        description_arabic TEXT,
        price DECIMAL(10,2) NOT NULL,
        currency TEXT DEFAULT 'USD' NOT NULL,
        duration INTEGER NOT NULL,
        features TEXT[] DEFAULT '{}',
        features_arabic TEXT[] DEFAULT '{}',
        max_streams INTEGER DEFAULT 1 NOT NULL,
        max_downloads INTEGER DEFAULT 0 NOT NULL,
        has_hd_access BOOLEAN DEFAULT FALSE NOT NULL,
        has_4k_access BOOLEAN DEFAULT FALSE NOT NULL,
        has_offline_access BOOLEAN DEFAULT FALSE NOT NULL,
        is_active BOOLEAN DEFAULT TRUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    // Create user subscriptions table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_subscriptions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        plan_id INTEGER NOT NULL,
        status TEXT NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        stripe_customer_id TEXT,
        stripe_subscription_id TEXT,
        auto_renew BOOLEAN DEFAULT TRUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    // Create user analytics table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS user_analytics (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        session_id TEXT NOT NULL,
        content_id INTEGER,
        action TEXT NOT NULL,
        platform TEXT,
        device_type TEXT,
        browser TEXT,
        ip_address TEXT,
        location TEXT,
        watch_duration INTEGER DEFAULT 0,
        quality TEXT,
        timestamp TIMESTAMP DEFAULT NOW() NOT NULL,
        metadata TEXT
      )
    `);

    // Create content analytics table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS content_analytics (
        id SERIAL PRIMARY KEY,
        content_id INTEGER NOT NULL,
        date TIMESTAMP NOT NULL,
        views INTEGER DEFAULT 0 NOT NULL,
        unique_views INTEGER DEFAULT 0 NOT NULL,
        total_watch_time INTEGER DEFAULT 0 NOT NULL,
        completion_rate DECIMAL(5,2) DEFAULT 0.00 NOT NULL,
        avg_rating DECIMAL(3,1) DEFAULT 0.0 NOT NULL,
        shares INTEGER DEFAULT 0 NOT NULL,
        downloads INTEGER DEFAULT 0 NOT NULL,
        comments INTEGER DEFAULT 0 NOT NULL,
        likes INTEGER DEFAULT 0 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    // Create system analytics table
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS system_analytics (
        id SERIAL PRIMARY KEY,
        date TIMESTAMP NOT NULL,
        total_users INTEGER DEFAULT 0 NOT NULL,
        active_users INTEGER DEFAULT 0 NOT NULL,
        new_users INTEGER DEFAULT 0 NOT NULL,
        total_content INTEGER DEFAULT 0 NOT NULL,
        total_views INTEGER DEFAULT 0 NOT NULL,
        total_watch_time INTEGER DEFAULT 0 NOT NULL,
        subscription_revenue DECIMAL(10,2) DEFAULT 0.00 NOT NULL,
        active_subscriptions INTEGER DEFAULT 0 NOT NULL,
        churn_rate DECIMAL(5,2) DEFAULT 0.00 NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `);

    console.log('✅ Analytics and subscription tables created successfully');

    // Insert sample subscription plans
    await db.execute(sql`
      INSERT INTO subscription_plans (name, name_arabic, description, description_arabic, price, duration, features, features_arabic, max_streams, max_downloads, has_hd_access, has_4k_access, has_offline_access) VALUES
      ('Basic', 'أساسي', 'Basic streaming plan with SD quality', 'خطة البث الأساسية بجودة SD', 5.99, 30, 
       ARRAY['SD Quality', 'Single Stream', 'Mobile Access'], 
       ARRAY['جودة عادية', 'بث واحد', 'وصول عبر الهاتف'], 
       1, 0, false, false, false),
      ('Premium', 'مميز', 'Premium plan with HD quality and downloads', 'خطة مميزة بجودة عالية وتحميل', 9.99, 30,
       ARRAY['HD Quality', 'Multiple Streams', 'Downloads', 'All Devices'],
       ARRAY['جودة عالية', 'بث متعدد', 'تحميل', 'جميع الأجهزة'],
       3, 10, true, false, true),
      ('Ultra', 'فائق', 'Ultra plan with 4K quality and unlimited downloads', 'خطة فائقة بجودة 4K وتحميل لا محدود', 15.99, 30,
       ARRAY['4K Quality', 'Unlimited Streams', 'Unlimited Downloads', 'All Features'],
       ARRAY['جودة 4K', 'بث لا محدود', 'تحميل لا محدود', 'جميع الميزات'],
       -1, -1, true, true, true)
    `);

    console.log('✅ Sample subscription plans inserted');

    // Insert sample analytics data
    const today = new Date().toISOString().split('T')[0];
    await db.execute(sql`
      INSERT INTO system_analytics (date, total_users, active_users, new_users, total_content, total_views, total_watch_time, subscription_revenue, active_subscriptions, churn_rate) VALUES
      (${today}, 1250, 890, 45, 1500, 15000, 450000, 12500.00, 680, 2.5)
    `);

    console.log('✅ Sample analytics data inserted');

    console.log('🎉 Analytics and subscription system setup completed successfully!');
  } catch (error) {
    console.error('❌ Error creating analytics and subscription tables:', error);
    throw error;
  }
}

createAnalyticsSubscriptionTables().catch(console.error);