import { AkStyleContentDetail } from "@/components/content/ak-style-content-detail";
import { useParams } from "wouter";

export default function ContentDetail() {
  const params = useParams();
  const contentId = params.id;

  if (!contentId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <p className="text-white text-xl">معرف المحتوى غير صحيح</p>
      </div>
    );
  }

  return <AkStyleContentDetail contentId={contentId} />;
}