import { db } from './server/db.js';

/**
 * سكريپت إضافة بيانات تجريبية للمحتوى المتطور
 * يتضمن: فريق العمل، الصور الإضافية، التقييمات الخارجية
 */

async function addEnhancedContentData() {
  console.log("إضافة البيانات التجريبية للمحتوى المتطور...");

  try {
    // إضافة أعضاء فريق العمل
    console.log("إضافة أعضاء فريق العمل...");
    
    const castMembers = [
      // ممثلون عرب
      {
        name: "Adel Imam",
        name_arabic: "عادل إمام",
        role: "actor",
        biography: "Egyptian actor and comedian, known as the leader of Arabic comedy",
        birth_date: "1940-05-17",
        nationality: "Egyptian",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop",
        imdb_id: "nm0408937"
      },
      {
        name: "Fairuz",
        name_arabic: "فيروز",
        role: "actress",
        biography: "Lebanese singer and actress, one of the most admired singers in the Arab world",
        birth_date: "1935-11-21",
        nationality: "Lebanese",
        image_url: "https://images.unsplash.com/photo-1494790108755-2616b612b829?w=300&h=400&fit=crop"
      },
      {
        name: "Ahmed Zaki",
        name_arabic: "أحمد زكي",
        role: "actor",
        biography: "Egyptian actor known for his powerful dramatic performances",
        birth_date: "1949-11-18",
        nationality: "Egyptian",
        image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=400&fit=crop"
      },
      {
        name: "Yousra",
        name_arabic: "يسرا",
        role: "actress",
        biography: "Egyptian actress and singer",
        birth_date: "1955-03-10",
        nationality: "Egyptian",
        image_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=300&h=400&fit=crop"
      },
      // ممثلون أجانب
      {
        name: "Leonardo DiCaprio",
        name_arabic: "ليوناردو دي كابريو",
        role: "actor",
        biography: "American actor and film producer",
        birth_date: "1974-11-11",
        nationality: "American",
        image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=400&fit=crop",
        imdb_id: "nm0000138"
      },
      {
        name: "Marion Cotillard",
        name_arabic: "ماريون كوتيار",
        role: "actress",
        biography: "French actress and singer",
        birth_date: "1975-09-30",
        nationality: "French",
        image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=400&fit=crop",
        imdb_id: "nm0182839"
      },
      // مخرجون
      {
        name: "Christopher Nolan",
        name_arabic: "كريستوفر نولان",
        role: "director",
        biography: "British-American film director, producer, and screenwriter",
        birth_date: "1970-07-30",
        nationality: "British-American",
        image_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=400&fit=crop",
        imdb_id: "nm0634240"
      },
      {
        name: "Youssef Chahine",
        name_arabic: "يوسف شاهين",
        role: "director",
        biography: "Egyptian film director",
        birth_date: "1926-01-25",
        nationality: "Egyptian",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop"
      }
    ];

    for (const member of castMembers) {
      await db.execute(`
        INSERT INTO cast_members (name, name_arabic, role, biography, birth_date, nationality, image_url, imdb_id)
        VALUES ('${member.name}', '${member.name_arabic}', '${member.role}', '${member.biography}', 
                '${member.birth_date}', '${member.nationality}', '${member.image_url}', ${member.imdb_id ? `'${member.imdb_id}'` : 'NULL'});
      `);
    }
    console.log("✅ تم إضافة أعضاء فريق العمل");

    // ربط الممثلين بالمحتوى
    console.log("ربط الممثلين بالمحتوى...");
    
    // الحصول على المحتوى الموجود
    const contentResult = await db.execute('SELECT id, title FROM content LIMIT 10');
    const castResult = await db.execute('SELECT id, name, role FROM cast_members');
    
    if (contentResult.rows.length > 0 && castResult.rows.length > 0) {
      const contentItems = contentResult.rows;
      const cast = castResult.rows;
      
      // ربط كل محتوى بـ 2-4 أعضاء من فريق العمل
      for (const content of contentItems) {
        const shuffledCast = cast.sort(() => 0.5 - Math.random());
        const selectedCast = shuffledCast.slice(0, Math.floor(Math.random() * 3) + 2);
        
        for (let i = 0; i < selectedCast.length; i++) {
          const member = selectedCast[i];
          const character = member.role === 'actor' || member.role === 'actress' 
            ? `Character ${i + 1}` 
            : null;
            
          await db.execute(`
            INSERT INTO content_cast (content_id, cast_member_id, character, "order")
            VALUES (${content.id}, ${member.id}, ${character ? `'${character}'` : 'NULL'}, ${i});
          `);
        }
      }
      console.log("✅ تم ربط الممثلين بالمحتوى");
    }

    // إضافة صور إضافية للمحتوى
    console.log("إضافة صور إضافية للمحتوى...");
    
    const imageTypes = ['poster', 'backdrop', 'still', 'behind_scenes'];
    const sampleImages = [
      'https://images.unsplash.com/photo-1489599088293-daa0c0f60f0e?w=800&h=450&fit=crop',
      'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=800&h=450&fit=crop',
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&h=450&fit=crop',
      'https://images.unsplash.com/photo-1478720568477-b0ac8e8b700e?w=800&h=450&fit=crop',
      'https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=800&h=450&fit=crop'
    ];

    if (contentResult.rows.length > 0) {
      for (const content of contentResult.rows) {
        // إضافة 2-4 صور لكل محتوى
        const numImages = Math.floor(Math.random() * 3) + 2;
        
        for (let i = 0; i < numImages; i++) {
          const imageType = imageTypes[Math.floor(Math.random() * imageTypes.length)];
          const imageUrl = sampleImages[Math.floor(Math.random() * sampleImages.length)];
          
          await db.execute(`
            INSERT INTO content_images (content_id, image_url, type, description, description_arabic, "order")
            VALUES (${content.id}, '${imageUrl}', '${imageType}', 
                    '${imageType} image for ${content.title}', 'صورة ${imageType} لـ ${content.title}', ${i});
          `);
        }
      }
      console.log("✅ تم إضافة الصور الإضافية");
    }

    // إضافة تقييمات خارجية
    console.log("إضافة التقييمات الخارجية...");
    
    const ratingSources = [
      { source: 'imdb', maxRating: '10', url: 'https://www.imdb.com' },
      { source: 'rotten_tomatoes', maxRating: '100%', url: 'https://www.rottentomatoes.com' },
      { source: 'metacritic', maxRating: '100', url: 'https://www.metacritic.com' },
      { source: 'letterboxd', maxRating: '5', url: 'https://letterboxd.com' }
    ];

    if (contentResult.rows.length > 0) {
      for (const content of contentResult.rows) {
        // إضافة 2-3 تقييمات خارجية لكل محتوى
        const numRatings = Math.floor(Math.random() * 2) + 2;
        const shuffledSources = ratingSources.sort(() => 0.5 - Math.random());
        
        for (let i = 0; i < numRatings; i++) {
          const ratingSource = shuffledSources[i];
          let rating;
          
          // توليد تقييم عشوائي حسب المصدر
          switch (ratingSource.source) {
            case 'imdb':
              rating = (Math.random() * 3 + 7).toFixed(1); // 7.0-10.0
              break;
            case 'rotten_tomatoes':
              rating = Math.floor(Math.random() * 40 + 60) + '%'; // 60%-100%
              break;
            case 'metacritic':
              rating = Math.floor(Math.random() * 30 + 70).toString(); // 70-100
              break;
            case 'letterboxd':
              rating = (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5-5.0
              break;
          }
          
          await db.execute(`
            INSERT INTO external_ratings (content_id, source, rating, max_rating, url)
            VALUES (${content.id}, '${ratingSource.source}', '${rating}', '${ratingSource.maxRating}', '${ratingSource.url}');
          `);
        }
      }
      console.log("✅ تم إضافة التقييمات الخارجية");
    }

    // تحديث بعض المحتوى بمعلومات إضافية
    console.log("تحديث المحتوى بمعلومات إضافية...");
    
    if (contentResult.rows.length > 0) {
      const sampleTrailers = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.youtube.com/watch?v=ZZ5LpwO-An4',
        'https://www.youtube.com/watch?v=hTWKbfoikeg'
      ];
      
      for (let i = 0; i < Math.min(5, contentResult.rows.length); i++) {
        const content = contentResult.rows[i];
        const trailer = sampleTrailers[Math.floor(Math.random() * sampleTrailers.length)];
        
        await db.execute(`
          UPDATE content 
          SET 
            trailer_url = '${trailer}',
            imdb_id = 'tt${Math.floor(Math.random() * 9000000) + 1000000}',
            country = 'Mixed',
            awards = 'Winner of multiple awards'
          WHERE id = ${content.id};
        `);
      }
      console.log("✅ تم تحديث المحتوى بمعلومات إضافية");
    }

    console.log("🎉 تم إكمال إضافة جميع البيانات التجريبية للمحتوى المتطور بنجاح!");
    return true;

  } catch (error) {
    console.error("❌ خطأ في إضافة البيانات:", error);
    return false;
  }
}

// تشغيل السكريپت
addEnhancedContentData().then((success) => {
  if (success) {
    console.log("✅ تم إكمال إضافة البيانات التجريبية");
    process.exit(0);
  } else {
    console.error("❌ فشل في إضافة البيانات");
    process.exit(1);
  }
});