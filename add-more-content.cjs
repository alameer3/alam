const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function addMoreContent() {
  console.log('🎬 إضافة المزيد من المحتوى...');
  
  try {
    // محتوى عربي إضافي
    const arabicContent = [
      ['Al-Risala', 'الرسالة', 'The story of the Prophet Muhammad (peace be upon him).', 'قصة النبي محمد صلى الله عليه وسلم.', 'movie', 1976, 'Arabic', 'HD', '1080p', 8.8, 180, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Al-Risala', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Wadjda', 'وجدة', 'An 11-year-old girl who dreams of owning a bicycle.', 'فتاة تبلغ من العمر 11 عامًا تحلم بامتلاك دراجة.', 'movie', 2012, 'Arabic', 'HD', '1080p', 7.5, 98, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Wadjda', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Theeb', 'ذيب', 'A young Bedouin boy experiences a coming-of-age adventure.', 'فتى بدوي صغير يخوض مغامرة نضج.', 'movie', 2014, 'Arabic', 'HD', '1080p', 7.3, 100, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Theeb', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Bab El-Hara', 'باب الحارة', 'A Syrian historical drama series.', 'مسلسل درامي تاريخي سوري.', 'series', 2006, 'Arabic', 'HD', '1080p', 8.2, null, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Bab+El-Hara', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Hareesh wa Nareesh', 'حريش ونريش', 'A comedy series about two friends.', 'مسلسل كوميدي عن صديقين.', 'series', 2010, 'Arabic', 'HD', '1080p', 7.8, null, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Hareesh+wa+Nareesh', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Ramadan Karim', 'رمضان كريم', 'A family drama during the holy month.', 'دراما عائلية خلال الشهر الكريم.', 'series', 2017, 'Arabic', 'HD', '1080p', 8.0, null, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Ramadan+Karim', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
    ];

    // أفلام أجنبية شهيرة
    const foreignMovies = [
      ['Inception', 'بداية', 'A skilled thief is given a chance at redemption.', 'لص ماهر يحصل على فرصة للخلاص.', 'movie', 2010, 'English', 'HD', '1080p', 8.8, 148, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Inception', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['The Dark Knight', 'فارس الظلام', 'Batman faces the Joker in Gotham City.', 'باتمان يواجه الجوكر في مدينة جوثام.', 'movie', 2008, 'English', 'HD', '1080p', 9.0, 152, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Dark+Knight', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Forrest Gump', 'فورست غامب', 'Life story of a simple man with a big heart.', 'قصة حياة رجل بسيط بقلب كبير.', 'movie', 1994, 'English', 'HD', '1080p', 8.8, 142, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Forrest+Gump', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Pulp Fiction', 'خيال رخيص', 'Multiple storylines weave together in this crime saga.', 'قصص متعددة تتداخل في هذه الملحمة الإجرامية.', 'movie', 1994, 'English', 'HD', '1080p', 8.9, 154, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Pulp+Fiction', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['The Matrix', 'المصفوفة', 'A computer hacker learns the truth about reality.', 'قرصان كمبيوتر يكتشف الحقيقة عن الواقع.', 'movie', 1999, 'English', 'HD', '1080p', 8.7, 136, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=The+Matrix', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
    ];

    // مسلسلات أجنبية
    const foreignSeries = [
      ['Stranger Things', 'أشياء غريبة', 'Kids in a small town encounter supernatural forces.', 'أطفال في بلدة صغيرة يواجهون قوى خارقة.', 'series', 2016, 'English', 'HD', '1080p', 8.7, null, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Stranger+Things', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['The Office', 'المكتب', 'A mockumentary about office workers.', 'وثائقي ساخر عن موظفي المكتب.', 'series', 2005, 'English', 'HD', '1080p', 8.9, null, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=The+Office', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Friends', 'الأصدقاء', 'Six friends living in New York City.', 'ستة أصدقاء يعيشون في نيويورك.', 'series', 1994, 'English', 'HD', '1080p', 8.9, null, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Friends', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['The Crown', 'التاج', 'The reign of Queen Elizabeth II.', 'عهد الملكة إليزابيث الثانية.', 'series', 2016, 'English', 'HD', '1080p', 8.7, null, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=The+Crown', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
    ];

    // أفلام هندية
    const hindiMovies = [
      ['3 Idiots', 'ثلاثة أغبياء', 'Three friends in engineering college.', 'ثلاثة أصدقاء في كلية الهندسة.', 'movie', 2009, 'Hindi', 'HD', '1080p', 8.4, 170, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=3+Idiots', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Dangal', 'دانغال', 'A wrestler trains his daughters to become world-class wrestlers.', 'مصارع يدرب بناته ليصبحن مصارعات عالميات.', 'movie', 2016, 'Hindi', 'HD', '1080p', 8.4, 161, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Dangal', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Lagaan', 'لاغان', 'Villagers accept a cricket match challenge.', 'القرويون يقبلون تحدي مباراة الكريكيت.', 'movie', 2001, 'Hindi', 'HD', '1080p', 8.1, 224, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Lagaan', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
    ];

    // أفلام تركية
    const turkishMovies = [
      ['Kış Uykusu', 'نوم الشتاء', 'A hotel owner confronts his past.', 'مالك فندق يواجه ماضيه.', 'movie', 2014, 'Turkish', 'HD', '1080p', 8.0, 196, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Kis+Uykusu', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Mustang', 'موستانغ', 'Five sisters fight for their freedom.', 'خمس أخوات يناضلن من أجل حريتهن.', 'movie', 2015, 'Turkish', 'HD', '1080p', 7.6, 97, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Mustang', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
    ];

    // مسلسلات تركية
    const turkishSeries = [
      ['Diriliş: Ertuğrul', 'قيامة أرطغرل', 'The story of Ertugrul Ghazi.', 'قصة أرطغرل غازي.', 'series', 2014, 'Turkish', 'HD', '1080p', 9.0, null, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Ertugrul', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Muhteşem Yüzyıl', 'القرن العظيم', 'The Ottoman Empire during Sultan Suleiman.', 'الإمبراطورية العثمانية في عهد السلطان سليمان.', 'series', 2011, 'Turkish', 'HD', '1080p', 8.5, null, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Muhtesem+Yuzyil', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Aşk-ı Memnu', 'العشق الممنوع', 'A forbidden love story.', 'قصة حب محرمة.', 'series', 2008, 'Turkish', 'HD', '1080p', 8.3, null, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Ask-i+Memnu', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
    ];

    // أفلام كورية
    const koreanMovies = [
      ['Parasite', 'طفيلي', 'A poor family schemes to become employed by a wealthy family.', 'عائلة فقيرة تخطط للعمل لدى عائلة غنية.', 'movie', 2019, 'Korean', 'HD', '1080p', 8.5, 132, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Parasite', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Oldboy', 'أولد بوي', 'A man seeks revenge after 15 years of imprisonment.', 'رجل يسعى للانتقام بعد 15 عامًا من السجن.', 'movie', 2003, 'Korean', 'HD', '1080p', 8.4, 120, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Oldboy', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Train to Busan', 'قطار إلى بوسان', 'Passengers fight for survival on a zombie-infested train.', 'الركاب يقاتلون من أجل البقاء في قطار مصاب بالزومبي.', 'movie', 2016, 'Korean', 'HD', '1080p', 7.6, 118, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Train+to+Busan', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
    ];

    // مسلسلات كورية
    const koreanSeries = [
      ['Squid Game', 'لعبة الحبار', 'People compete in deadly games for money.', 'أشخاص يتنافسون في ألعاب قاتلة من أجل المال.', 'series', 2021, 'Korean', 'HD', '1080p', 8.0, null, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Squid+Game', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Crash Landing on You', 'هبوط اضطراري عليك', 'A South Korean woman crash-lands in North Korea.', 'امرأة كورية جنوبية تهبط اضطراريًا في كوريا الشمالية.', 'series', 2019, 'Korean', 'HD', '1080p', 8.7, null, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Crash+Landing', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
      ['Goblin', 'الجني', 'An immortal goblin seeks to end his eternal life.', 'جني خالد يسعى لإنهاء حياته الأبدية.', 'series', 2016, 'Korean', 'HD', '1080p', 8.8, null, 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=Goblin', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4', true],
    ];

    // دمج جميع المحتوى
    const allContent = [
      ...arabicContent,
      ...foreignMovies,
      ...foreignSeries,
      ...hindiMovies,
      ...turkishMovies,
      ...turkishSeries,
      ...koreanMovies,
      ...koreanSeries
    ];

    // إضافة المحتوى إلى قاعدة البيانات
    let addedCount = 0;
    for (const contentItem of allContent) {
      const contentResult = await pool.query(`
        SELECT id FROM content WHERE title = $1;
      `, [contentItem[0]]);
      
      if (contentResult.rows.length === 0) {
        await pool.query(`
          INSERT INTO content (title, title_arabic, description, description_arabic, type, year, language, quality, resolution, rating, duration, poster_url, video_url, is_active) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);
        `, contentItem);
        addedCount++;
      }
    }

    console.log(`✅ تم إضافة ${addedCount} محتوى جديد`);
    console.log(`📊 إجمالي المحتوى المضاف: ${allContent.length} عنصر`);
    console.log('🎉 تم إضافة المحتوى بنجاح!');
    
  } catch (error) {
    console.error('❌ خطأ في إضافة المحتوى:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

addMoreContent().catch(console.error);