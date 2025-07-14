import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";

interface ContentSectionProps {
  title: string;
  subtitle?: string;
  viewAllLink?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
  color?: string;
  gradient?: string;
}

export function ContentSection({ 
  title, 
  subtitle, 
  viewAllLink, 
  children, 
  className,
  icon: Icon = Sparkles,
  color = "text-primary",
  gradient = "from-primary/20 to-transparent"
}: ContentSectionProps) {
  return (
    <section className={cn("py-8", className)}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-3 rounded-full bg-gradient-to-br shadow-lg",
              gradient
            )}>
              <Icon className={cn("w-6 h-6", color)} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {title}
              </h2>
              {subtitle && (
                <p className="text-muted-foreground mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          
          {viewAllLink && (
            <Link href={viewAllLink}>
              <Button 
                variant="ghost" 
                className="group hover:bg-primary/10 transition-all duration-300"
              >
                <span className="font-medium">عرض الكل</span>
                <ArrowRight className="w-4 h-4 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </Link>
          )}
        </div>
        
        {/* Content */}
        <div className="relative">
          {children}
        </div>
      </div>
    </section>
  );
}