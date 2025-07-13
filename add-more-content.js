// Add more content to the database
import { DatabaseStorage } from './server/storage.ts';
import { insertContentSchema } from './shared/schema.ts';

const storage = new DatabaseStorage();

async function addMoreContent() {
  console.log('🔧 Adding more content to database...');
  
  const moreContent = [
    {
      title: 'الملك',
      titleArabic: 'الملك',
      description: 'مسلسل تاريخي عن الملك عبد العزيز',
      descriptionArabic: 'مسلسل تاريخي عن الملك عبد العزيز',
      type: 'series',
      year: 2020,
      language: 'Arabic',
      quality: 'HD',
      resolution: '1080p',
      rating: '8.5',
      duration: 45,
      episodes: 30,
      posterUrl: 'https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?w=400&h=600&fit=crop',
      videoUrl: '',
      downloadUrl: '',
      isActive: true
    },
    {
      title: 'جعفر العمدة',
      titleArabic: 'جعفر العمدة',
      description: 'مسلسل كوميدي عن عمدة قرية',
      descriptionArabic: 'مسلسل كوميدي عن عمدة قرية',
      type: 'series',
      year: 2021,
      language: 'Arabic',
      quality: 'HD',
      resolution: '1080p',
      rating: '7.8',
      duration: 50,
      episodes: 20,
      posterUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=400&h=600&fit=crop',
      videoUrl: '',
      downloadUrl: '',
      isActive: true
    },
    {
      title: 'Avengers: Endgame',
      titleArabic: 'المنتقمون: نهاية اللعبة',
      description: 'Final battle of the Avengers',
      descriptionArabic: 'المعركة الأخيرة للمنتقمون',
      type: 'movie',
      year: 2019,
      language: 'English',
      quality: '4K',
      resolution: '2160p',
      rating: '8.4',
      duration: 181,
      episodes: 0,
      posterUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
      videoUrl: '',
      downloadUrl: '',
      isActive: true
    },
    {
      title: 'Parasite',
      titleArabic: 'الطفيلي',
      description: 'Korean thriller about social class',
      descriptionArabic: 'فيلم كوري مثير عن الطبقات الاجتماعية',
      type: 'movie',
      year: 2019,
      language: 'Korean',
      quality: 'HD',
      resolution: '1080p',
      rating: '8.6',
      duration: 132,
      episodes: 0,
      posterUrl: 'https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?w=400&h=600&fit=crop',
      videoUrl: '',
      downloadUrl: '',
      isActive: true
    },
    {
      title: 'Money Heist',
      titleArabic: 'سرقة الأموال',
      description: 'Spanish crime thriller series',
      descriptionArabic: 'مسلسل إسباني مثير عن الجريمة',
      type: 'series',
      year: 2017,
      language: 'Spanish',
      quality: 'HD',
      resolution: '1080p',
      rating: '8.3',
      duration: 60,
      episodes: 41,
      posterUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=400&h=600&fit=crop',
      videoUrl: '',
      downloadUrl: '',
      isActive: true
    },
    {
      title: 'Dangal',
      titleArabic: 'النزال',
      description: 'Indian sports drama',
      descriptionArabic: 'دراما رياضية هندية',
      type: 'movie',
      year: 2016,
      language: 'Hindi',
      quality: 'HD',
      resolution: '1080p',
      rating: '8.4',
      duration: 161,
      episodes: 0,
      posterUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
      videoUrl: '',
      downloadUrl: '',
      isActive: true
    },
    {
      title: 'The Lion King',
      titleArabic: 'ملك الأسود',
      description: 'Animated family movie',
      descriptionArabic: 'فيلم عائلي كرتوني',
      type: 'movie',
      year: 2019,
      language: 'English',
      quality: '4K',
      resolution: '2160p',
      rating: '6.8',
      duration: 118,
      episodes: 0,
      posterUrl: 'https://images.unsplash.com/photo-1489875347897-49f64b51c1f8?w=400&h=600&fit=crop',
      videoUrl: '',
      downloadUrl: '',
      isActive: true
    },
    {
      title: 'Planet Earth',
      titleArabic: 'كوكب الأرض',
      description: 'Nature documentary series',
      descriptionArabic: 'مسلسل وثائقي عن الطبيعة',
      type: 'misc',
      year: 2006,
      language: 'English',
      quality: 'HD',
      resolution: '1080p',
      rating: '9.4',
      duration: 60,
      episodes: 11,
      posterUrl: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=400&h=600&fit=crop',
      videoUrl: '',
      downloadUrl: '',
      isActive: true
    }
  ];

  try {
    for (const content of moreContent) {
      try {
        const validatedData = insertContentSchema.parse(content);
        await storage.createContent(validatedData);
        console.log(`✅ Added content: ${content.title}`);
      } catch (error) {
        console.log(`⚠️  Content ${content.title} already exists or error occurred: ${error.message}`);
      }
    }
    console.log('✅ More content added successfully!');
  } catch (error) {
    console.error('❌ Failed to add more content:', error);
  }
}

addMoreContent();