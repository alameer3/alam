import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/layout/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Brain, 
  MessageSquare, 
  Star, 
  Heart, 
  Meh, 
  Frown, 
  Smile, 
  Loader2,
  TrendingUp,
  Tag
} from "lucide-react";
import { useSentimentAnalysis } from "@/hooks/useAI";
import { toast } from "@/hooks/use-toast";

interface SentimentAnalysisProps {
  onAnalysisComplete?: (analysis: any) => void;
  initialText?: string;
}

export function SentimentAnalyzer({ onAnalysisComplete, initialText = "" }: SentimentAnalysisProps) {
  const [text, setText] = useState(initialText);
  const sentimentMutation = useSentimentAnalysis();

  const handleAnalyze = () => {
    if (!text.trim()) {
      toast({
        title: "أدخل النص",
        description: "يجب إدخال نص لتحليله",
        variant: "destructive",
      });
      return;
    }

    sentimentMutation.mutate(
      { text: text.trim() },
      {
        onSuccess: (data) => {
          onAnalysisComplete?.(data);
          toast({
            title: "تم تحليل المشاعر",
            description: `تم تحليل النص بنجاح - التقييم: ${data.rating}/5`,
          });
        },
        onError: () => {
          toast({
            title: "خطأ في التحليل",
            description: "حدث خطأ أثناء تحليل المشاعر",
            variant: "destructive",
          });
        }
      }
    );
  };

  const getRatingIcon = (rating: number) => {
    if (rating >= 4) return <Smile className="h-5 w-5 text-green-500" />;
    if (rating >= 3) return <Meh className="h-5 w-5 text-yellow-500" />;
    return <Frown className="h-5 w-5 text-red-500" />;
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600";
    if (rating >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-500";
    if (confidence >= 0.6) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getEmotionIcon = (emotion: string) => {
    switch (emotion.toLowerCase()) {
      case 'سعادة':
      case 'فرح':
        return <Smile className="h-3 w-3" />;
      case 'حب':
      case 'إعجاب':
        return <Heart className="h-3 w-3" />;
      case 'حزن':
      case 'غضب':
        return <Frown className="h-3 w-3" />;
      default:
        return <MessageSquare className="h-3 w-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-purple-500" />
          <h2 className="text-2xl font-bold">تحليل المشاعر</h2>
        </div>
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          <MessageSquare className="h-3 w-3 mr-1" />
          تحليل ذكي للنصوص
        </Badge>
      </div>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            أدخل النص للتحليل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="أدخل تعليقاً أو مراجعة لتحليل المشاعر... (مثل: هذا فيلم رائع وأعجبني كثيراً)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[100px] text-right"
            maxLength={1000}
          />
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {text.length}/1000 حرف
            </span>
            <Button
              onClick={handleAnalyze}
              disabled={sentimentMutation.isPending || !text.trim()}
              className="flex items-center gap-2"
            >
              {sentimentMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  يحلل...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4" />
                  تحليل المشاعر
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Section */}
      {sentimentMutation.data && (
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              نتائج التحليل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Overall Rating */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {getRatingIcon(sentimentMutation.data.rating)}
                <span className="text-lg font-semibold">التقييم العام:</span>
              </div>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < sentimentMutation.data.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className={`text-xl font-bold ${getRatingColor(sentimentMutation.data.rating)}`}>
                  {sentimentMutation.data.rating}/5
                </span>
              </div>
            </div>

            {/* Confidence Level */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">مستوى الثقة في التحليل:</span>
                <span className="text-sm font-bold">
                  {Math.round(sentimentMutation.data.confidence * 100)}%
                </span>
              </div>
              <Progress 
                value={sentimentMutation.data.confidence * 100} 
                className="h-2"
              />
            </div>

            {/* Emotions */}
            {sentimentMutation.data.emotions.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Heart className="h-4 w-4 text-pink-500" />
                  المشاعر المكتشفة:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {sentimentMutation.data.emotions.map((emotion, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {getEmotionIcon(emotion)}
                      {emotion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Keywords */}
            {sentimentMutation.data.keywords.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4 text-blue-500" />
                  الكلمات المفتاحية:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {sentimentMutation.data.keywords.map((keyword, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Analysis Summary */}
            <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
              <h4 className="font-medium mb-2">ملخص التحليل:</h4>
              <p className="text-sm text-muted-foreground">
                يظهر تحليل النص تقييماً عاماً بـ {sentimentMutation.data.rating} من 5 نجوم
                مع مستوى ثقة {Math.round(sentimentMutation.data.confidence * 100)}%.
                {sentimentMutation.data.emotions.length > 0 && (
                  <> تم اكتشاف المشاعر التالية: {sentimentMutation.data.emotions.join(', ')}.</>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {sentimentMutation.error && (
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <Frown className="h-5 w-5" />
              <span className="font-medium">خطأ في التحليل</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              حدث خطأ أثناء تحليل المشاعر. يرجى المحاولة مرة أخرى.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}