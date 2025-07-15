import { useParams } from "wouter";
import { AkStyleContentDetail } from "@/components/content/ak-style-content-detail";

export default function ShowDetail() {
  const params = useParams();
  const contentId = params.id as string;

  if (!contentId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-2xl font-bold mb-4">محتوى غير موجود</h1>
          <p>لم يتم العثور على المحتوى المطلوب</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-black">
      <div className="container mx-auto px-4 py-6">
        <AkStyleContentDetail contentId={contentId} />
      </div>
    </div>
  );
}