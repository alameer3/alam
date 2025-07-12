import OpenAI from "openai";
import { Content } from "../../shared/schema";
import { DatabaseStorage } from "../storage";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface UserPreferences {
  favoriteGenres: string[];
  favoriteCategories: string[];
  ratingPreference: number;
  watchHistory: Content[];
  reviewHistory: any[];
}

export interface RecommendationScore {
  contentId: number;
  score: number;
  reasons: string[];
}

export class RecommendationEngine {
  private storage: DatabaseStorage;

  constructor(storage: DatabaseStorage) {
    this.storage = storage;
  }

  /**
   * Generate personalized recommendations for a user
   */
  async generateRecommendations(
    userId: number, 
    limit: number = 10
  ): Promise<RecommendationScore[]> {
    try {
      // Get user preferences
      const preferences = await this.getUserPreferences(userId);
      
      // Get all available content
      const allContent = await this.getAllContent();
      
      // Filter out already watched content
      const unwatchedContent = allContent.filter(
        content => !preferences.watchHistory.some(watched => watched.id === content.id)
      );

      // Generate AI-powered recommendations
      const recommendations = await this.generateAIRecommendations(
        preferences,
        unwatchedContent
      );

      return recommendations.slice(0, limit);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      // Fallback to basic recommendations with enhanced logic
      return this.generateEnhancedBasicRecommendations(userId, limit, preferences);
    }
  }

  /**
   * Generate AI-powered recommendations using OpenAI
   */
  private async generateAIRecommendations(
    preferences: UserPreferences,
    content: Content[]
  ): Promise<RecommendationScore[]> {
    const prompt = `
      تحليل تفضيلات المستخدم وتقديم توصيات ذكية:
      
      تفضيلات المستخدم:
      - الأنواع المفضلة: ${preferences.favoriteGenres.join(', ')}
      - الفئات المفضلة: ${preferences.favoriteCategories.join(', ')}
      - التقييم المفضل: ${preferences.ratingPreference}
      - تاريخ المشاهدة: ${preferences.watchHistory.slice(-5).map(c => c.title).join(', ')}
      
      المحتوى المتاح:
      ${content.slice(0, 20).map(c => `
        - ID: ${c.id}
        - العنوان: ${c.title}
        - النوع: ${c.type}
        - التقييم: ${c.rating}
        - الوصف: ${c.description?.substring(0, 100) || 'لا يوجد وصف'}
      `).join('\n')}
      
      قم بتقييم كل عنصر من المحتوى وإعطاء نقاط من 1-100 مع تفسير الأسباب.
      أجب بصيغة JSON فقط:
      {
        "recommendations": [
          {
            "contentId": number,
            "score": number,
            "reasons": ["السبب الأول", "السبب الثاني"]
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 2000,
    });

    const result = JSON.parse(response.choices[0].message.content || '{"recommendations": []}');
    return result.recommendations || [];
  }

  /**
   * Analyze user sentiment from reviews and comments
   */
  async analyzeSentiment(text: string): Promise<{
    rating: number;
    confidence: number;
    emotions: string[];
    keywords: string[];
  }> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "أنت خبير في تحليل المشاعر للنصوص العربية. قم بتحليل النص وإعطاء تقييم من 1-5 نجوم، مستوى الثقة، المشاعر المكتشفة، والكلمات المفتاحية. أجب بصيغة JSON فقط."
          },
          {
            role: "user",
            content: `حلل هذا النص: "${text}"
            
            أجب بهذا التنسيق:
            {
              "rating": number (1-5),
              "confidence": number (0-1),
              "emotions": ["المشاعر المكتشفة"],
              "keywords": ["الكلمات المفتاحية"]
            }`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        rating: Math.max(1, Math.min(5, result.rating || 3)),
        confidence: Math.max(0, Math.min(1, result.confidence || 0.5)),
        emotions: result.emotions || [],
        keywords: result.keywords || []
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      // Fallback to basic sentiment analysis
      return this.basicSentimentAnalysis(text);
    }
  }

  /**
   * Perform semantic search on content
   */
  async semanticSearch(
    query: string,
    type?: string,
    limit: number = 10
  ): Promise<Content[]> {
    try {
      // Get all content
      const allContent = await this.getAllContent();
      let content = type ? allContent.filter(c => c.type === type) : allContent;

      // Use AI to understand search intent and match content
      const prompt = `
        المستخدم يبحث عن: "${query}"
        
        المحتوى المتاح:
        ${content.map(c => `
          - ID: ${c.id}
          - العنوان: ${c.title}
          - النوع: ${c.type}
          - الوصف: ${c.description?.substring(0, 100) || 'لا يوجد وصف'}
        `).join('\n')}
        
        قم بترتيب المحتوى حسب الصلة بالبحث وإعطاء نقاط من 1-100.
        أجب بصيغة JSON فقط:
        {
          "results": [
            {
              "contentId": number,
              "relevanceScore": number,
              "matchReason": "سبب المطابقة"
            }
          ]
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3,
        max_tokens: 1500,
      });

      const result = JSON.parse(response.choices[0].message.content || '{"results": []}');
      const sortedResults = result.results
        .sort((a: any, b: any) => b.relevanceScore - a.relevanceScore)
        .slice(0, limit);

      // Return content in order of relevance
      return sortedResults
        .map((r: any) => content.find(c => c.id === r.contentId))
        .filter(Boolean);
    } catch (error) {
      console.error('Error in semantic search:', error);
      // Fallback to basic search
      return this.basicSearch(query, type, limit);
    }
  }

  /**
   * Auto-categorize content using AI
   */
  async autoCategorizeCcontent(content: Content): Promise<{
    suggestedGenres: string[];
    suggestedCategories: string[];
    contentTags: string[];
    ageRating: string;
  }> {
    try {
      const prompt = `
        قم بتحليل وتصنيف هذا المحتوى:
        
        العنوان: ${content.title}
        النوع: ${content.type}
        الوصف: ${content.description || 'لا يوجد وصف'}
        سنة الإنتاج: ${content.year}
        
        قم بتقديم:
        1. الأنواع المقترحة (الأكشن، الكوميديا، الدراما، إلخ)
        2. الفئات المقترحة (عربي، أجنبي، هندي، تركي، إلخ)
        3. العلامات المناسبة
        4. تقييم العمر المناسب
        
        أجب بصيغة JSON فقط:
        {
          "suggestedGenres": ["النوع الأول", "النوع الثاني"],
          "suggestedCategories": ["الفئة الأولى", "الفئة الثانية"],
          "contentTags": ["علامة 1", "علامة 2"],
          "ageRating": "التقييم العمري"
        }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.5,
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return {
        suggestedGenres: result.suggestedGenres || [],
        suggestedCategories: result.suggestedCategories || [],
        contentTags: result.contentTags || [],
        ageRating: result.ageRating || 'غير محدد'
      };
    } catch (error) {
      console.error('Error auto-categorizing content:', error);
      return {
        suggestedGenres: [],
        suggestedCategories: [],
        contentTags: [],
        ageRating: 'غير محدد'
      };
    }
  }

  /**
   * Get user preferences from their interaction history
   */
  private async getUserPreferences(userId: number): Promise<UserPreferences> {
    try {
      const favorites = await this.storage.getUserFavorites(userId);
      const watchHistory = await this.storage.getUserWatchHistory(userId);
      
      // Extract favorite genres and categories
      const favoriteGenres = [...new Set(favorites.flatMap(c => c.genres?.map(g => g.name) || []))];
      const favoriteCategories = [...new Set(favorites.flatMap(c => c.categories?.map(cat => cat.name) || []))];
      
      // Calculate average rating preference
      const ratingPreference = favorites.reduce((sum, c) => sum + (c.rating || 0), 0) / favorites.length || 3;

      return {
        favoriteGenres,
        favoriteCategories,
        ratingPreference,
        watchHistory,
        reviewHistory: [] // TODO: Get from reviews table
      };
    } catch (error) {
      console.error('Error getting user preferences:', error);
      return {
        favoriteGenres: [],
        favoriteCategories: [],
        ratingPreference: 3,
        watchHistory: [],
        reviewHistory: []
      };
    }
  }

  /**
   * Get all content from database
   */
  private async getAllContent(): Promise<Content[]> {
    try {
      const types = ['movie', 'series', 'tv', 'misc'];
      const allContent: Content[] = [];
      
      for (const type of types) {
        const { content } = await this.storage.getContentByType(type, 1, 100);
        allContent.push(...content);
      }
      
      return allContent;
    } catch (error) {
      console.error('Error getting all content:', error);
      return [];
    }
  }

  /**
   * Enhanced basic recommendations fallback
   */
  private async generateEnhancedBasicRecommendations(
    userId: number, 
    limit: number,
    preferences: UserPreferences
  ): Promise<RecommendationScore[]> {
    try {
      const allContent = await this.getAllContent();
      const recommendations: RecommendationScore[] = [];
      
      // Filter out already watched content
      const unwatchedContent = allContent.filter(
        content => !preferences.watchHistory.some(watched => watched.id === content.id)
      );
      
      // Score content based on user preferences
      for (const content of unwatchedContent) {
        let score = content.rating || 50;
        const reasons: string[] = [];
        
        // Boost score for preferred genres
        if (preferences.favoriteGenres.length > 0) {
          const contentGenres = content.genres?.map(g => g.name) || [];
          const genreMatch = contentGenres.some(genre => 
            preferences.favoriteGenres.includes(genre)
          );
          if (genreMatch) {
            score += 20;
            reasons.push('يتطابق مع أنواعك المفضلة');
          }
        }
        
        // Boost score for preferred categories
        if (preferences.favoriteCategories.length > 0) {
          const contentCategories = content.categories?.map(c => c.name) || [];
          const categoryMatch = contentCategories.some(category => 
            preferences.favoriteCategories.includes(category)
          );
          if (categoryMatch) {
            score += 15;
            reasons.push('يتطابق مع فئاتك المفضلة');
          }
        }
        
        // Boost score for similar rating preferences
        if (preferences.ratingPreference > 0) {
          const ratingDiff = Math.abs((content.rating || 0) - preferences.ratingPreference);
          if (ratingDiff <= 1) {
            score += 10;
            reasons.push('تقييم مشابه لتفضيلاتك');
          }
        }
        
        // Boost score for highly rated content
        if (content.rating && content.rating >= 4) {
          score += 5;
          reasons.push('تقييم عالي');
        }
        
        // Add default reason if no specific reasons
        if (reasons.length === 0) {
          reasons.push('محتوى مقترح بناءً على جودته');
        }
        
        recommendations.push({
          contentId: content.id,
          score: Math.min(100, score),
          reasons
        });
      }
      
      // Sort by score and return top recommendations
      return recommendations
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
        
    } catch (error) {
      console.error('Error generating enhanced basic recommendations:', error);
      return this.generateBasicRecommendations(userId, limit);
    }
  }

  /**
   * Simple basic recommendations fallback
   */
  private async generateBasicRecommendations(
    userId: number, 
    limit: number
  ): Promise<RecommendationScore[]> {
    try {
      const { content } = await this.storage.getContentByType('movie', 1, limit);
      return content.map(c => ({
        contentId: c.id,
        score: c.rating || 50,
        reasons: ['توصية أساسية بناءً على التقييم']
      }));
    } catch (error) {
      console.error('Error generating basic recommendations:', error);
      return [];
    }
  }

  /**
   * Basic sentiment analysis fallback
   */
  private basicSentimentAnalysis(text: string): {
    rating: number;
    confidence: number;
    emotions: string[];
    keywords: string[];
  } {
    const positiveWords = ['رائع', 'ممتاز', 'جميل', 'أعجبني', 'مفيد', 'رائع', 'جيد', 'ممتع'];
    const negativeWords = ['سيء', 'مملل', 'لا أعجبني', 'ضعيف', 'سيء', 'مخيب'];
    
    const words = text.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    words.forEach(word => {
      if (positiveWords.some(pos => word.includes(pos))) positiveCount++;
      if (negativeWords.some(neg => word.includes(neg))) negativeCount++;
    });
    
    let rating = 3; // Default neutral
    if (positiveCount > negativeCount) {
      rating = 4 + (positiveCount - negativeCount > 2 ? 1 : 0);
    } else if (negativeCount > positiveCount) {
      rating = 2 - (negativeCount - positiveCount > 2 ? 1 : 0);
    }
    
    const emotions = [];
    if (positiveCount > 0) emotions.push('إيجابي');
    if (negativeCount > 0) emotions.push('سلبي');
    if (positiveCount === 0 && negativeCount === 0) emotions.push('محايد');
    
    return {
      rating: Math.max(1, Math.min(5, rating)),
      confidence: 0.6,
      emotions,
      keywords: words.slice(0, 5)
    };
  }

  /**
   * Basic search fallback
   */
  private async basicSearch(
    query: string,
    type?: string,
    limit: number = 10
  ): Promise<Content[]> {
    try {
      return await this.storage.searchContent(query, type);
    } catch (error) {
      console.error('Error in basic search:', error);
      return [];
    }
  }
}