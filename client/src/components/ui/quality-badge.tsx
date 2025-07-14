import { cn } from "@/lib/utils";
import { Monitor, Zap, Star, Crown } from "lucide-react";

interface QualityBadgeProps {
  quality: string;
  className?: string;
}

export function QualityBadge({ quality, className }: QualityBadgeProps) {
  const getQualityConfig = (quality: string) => {
    switch (quality?.toLowerCase()) {
      case '4k':
      case 'uhd':
        return {
          icon: Crown,
          color: "bg-gradient-to-r from-purple-600 to-purple-800",
          textColor: "text-white",
          label: "4K"
        };
      case 'hd':
      case '1080p':
        return {
          icon: Monitor,
          color: "bg-gradient-to-r from-blue-600 to-blue-800",
          textColor: "text-white",
          label: "HD"
        };
      case '720p':
        return {
          icon: Zap,
          color: "bg-gradient-to-r from-green-600 to-green-800",
          textColor: "text-white",
          label: "720p"
        };
      case 'sd':
      case '480p':
        return {
          icon: Star,
          color: "bg-gradient-to-r from-orange-600 to-orange-800",
          textColor: "text-white",
          label: "SD"
        };
      default:
        return {
          icon: Monitor,
          color: "bg-gradient-to-r from-gray-600 to-gray-800",
          textColor: "text-white",
          label: quality || "HD"
        };
    }
  };

  const config = getQualityConfig(quality);
  const Icon = config.icon;

  return (
    <div className={cn(
      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shadow-lg",
      config.color,
      config.textColor,
      className
    )}>
      <Icon className="w-3 h-3" />
      <span>{config.label}</span>
    </div>
  );
}