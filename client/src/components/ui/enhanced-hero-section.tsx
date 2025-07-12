import { useState } from "react";
import { Film, Crown, Star, Sparkles, Flag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useAdvancedTheme } from "@/components/theme/advanced-theme-provider";
import { useResponsive } from "@/components/layout/responsive-layout";

interface EnhancedHeroSectionProps {
  title: string;
  subtitle: string;
  description: string;
  stats?: {
    movies: string;
    series: string;
    tv: string;
    misc: string;
  };
}

export function EnhancedHeroSection({ title, subtitle, description, stats }: EnhancedHeroSectionProps) {
  const { theme } = useAdvancedTheme();
  const { isMobile, isTablet } = useResponsive();
  const [isHovered, setIsHovered] = useState(false);

  const getThemeIcon = () => {
    switch (theme) {
      case "yemen": return <Flag className="w-8 h-8 text-primary" />;
      case "cinema": return <Film className="w-8 h-8 text-primary" />;
      case "royal": return <Crown className="w-8 h-8 text-primary" />;
      case "heritage": return <Star className="w-8 h-8 text-primary" />;
      default: return <Sparkles className="w-8 h-8 text-primary" />;
    }
  };

  const getThemeGradient = () => {
    switch (theme) {
      case "yemen": return "from-yemen-red via-yemen-white to-accent";
      case "cinema": return "from-cinema-gold via-cinema-dark to-cinema-gold";
      case "royal": return "from-royal-purple via-royal-gold to-royal-purple";
      case "heritage": return "from-heritage-gold via-heritage-copper to-heritage-gold";
      default: return "from-primary via-accent to-primary";
    }
  };

  return (
    <section className={`hero-section relative overflow-hidden py-16 lg:py-24 ${
      theme === 'yemen' ? 'bg-gradient-to-br from-background via-muted/20 to-accent/10' :
      theme === 'cinema' ? 'bg-gradient-to-br from-cinema-dark via-cinema-card to-cinema-dark' :
      theme === 'royal' ? 'bg-gradient-to-br from-background via-royal-purple/10 to-royal-gold/10' :
      theme === 'heritage' ? 'bg-gradient-to-br from-background via-heritage-gold/10 to-heritage-copper/10' :
      'bg-gradient-to-br from-background via-background to-muted/20'
    }`}>
      
      {/* Background decorative elements */}
      {!isMobile && (
        <>
          <div className={`absolute top-20 left-20 w-64 h-64 rounded-full blur-3xl animate-pulse floating-animation
            ${theme === 'yemen' ? 'bg-yemen-red/20' :
              theme === 'cinema' ? 'bg-cinema-gold/20' :
              theme === 'royal' ? 'bg-royal-purple/20' :
              theme === 'heritage' ? 'bg-heritage-gold/20' :
              'bg-primary/10'}`} 
          />
          <div className={`absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000
            ${theme === 'yemen' ? 'bg-accent/15' :
              theme === 'cinema' ? 'bg-cinema-gold/15' :
              theme === 'royal' ? 'bg-royal-gold/15' :
              theme === 'heritage' ? 'bg-heritage-copper/15' :
              'bg-primary/5'}`}
          />
        </>
      )}

      {/* Central content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Logo with theme-based styling */}
          <div 
            className="hero-logo mb-6"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${
              isHovered ? 'transform scale-110 pulse-glow' : ''
            } ${
              theme === 'yemen' ? 'bg-gradient-to-br from-yemen-red to-accent' :
              theme === 'cinema' ? 'bg-gradient-to-br from-cinema-gold to-cinema-dark' :
              theme === 'royal' ? 'bg-gradient-to-br from-royal-purple to-royal-gold' :
              theme === 'heritage' ? 'bg-gradient-to-br from-heritage-gold to-heritage-copper' :
              'bg-gradient-to-br from-primary to-primary/70'
            }`}>
              {getThemeIcon()}
            </div>
          </div>
          
          {/* Main title with gradient text */}
          <h1 className={`font-bold mb-6 ${
            isMobile ? "text-3xl" : "text-4xl md:text-6xl"
          }`}>
            <span className={`gradient-text bg-gradient-to-r ${getThemeGradient()} bg-clip-text text-transparent`}>
              {title}
            </span>
          </h1>
          
          {/* Subtitle */}
          <h2 className={`text-muted-foreground mb-6 font-medium ${
            isMobile ? "text-lg" : "text-xl md:text-2xl"
          }`}>
            {subtitle}
          </h2>
          
          {/* Description */}
          <p className={`text-muted-foreground mb-8 leading-relaxed ${
            isMobile ? "text-base" : "text-lg md:text-xl"
          }`}>
            {description}
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className={`px-8 py-3 text-base font-medium transition-all duration-300 hover:scale-105 ${
                theme === 'yemen' ? 'bg-yemen-red hover:bg-yemen-red/90' :
                theme === 'cinema' ? 'bg-cinema-gold text-cinema-dark hover:bg-cinema-gold/90' :
                theme === 'royal' ? 'bg-royal-purple hover:bg-royal-purple/90' :
                theme === 'heritage' ? 'bg-heritage-gold text-heritage-copper hover:bg-heritage-gold/90' :
                ''
              }`}
            >
              <Film className="w-5 h-5 mr-2" />
              ابدأ المشاهدة
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="px-8 py-3 text-base font-medium transition-all duration-300 hover:scale-105"
            >
              <Star className="w-5 h-5 mr-2" />
              تصفح المحتوى
            </Button>
          </div>

          {/* Stats cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: "أفلام", value: stats.movies, icon: Film },
                { label: "مسلسلات", value: stats.series, icon: Crown },
                { label: "برامج تلفزيونية", value: stats.tv, icon: Star },
                { label: "متنوعات", value: stats.misc, icon: Sparkles },
              ].map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <Card key={stat.label} className="enhanced-card">
                    <CardContent className="p-4 text-center">
                      <IconComponent className="w-6 h-6 mx-auto mb-2 text-primary" />
                      <div className="text-2xl font-bold text-primary">{stat.value}</div>
                      <div className="text-sm text-muted-foreground">{stat.label}</div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}