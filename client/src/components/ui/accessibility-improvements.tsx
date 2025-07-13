import { useEffect, useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Switch } from './switch';
import { Label } from './label';
import { Contrast, Type, Volume2 } from 'lucide-react';

// High contrast mode toggle
export function HighContrastToggle() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('high-contrast');
    if (stored === 'true') {
      setIsHighContrast(true);
      document.documentElement.classList.add('high-contrast');
    }
  }, []);

  const toggleHighContrast = () => {
    const newValue = !isHighContrast;
    setIsHighContrast(newValue);
    localStorage.setItem('high-contrast', newValue.toString());
    
    if (newValue) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="high-contrast"
        checked={isHighContrast}
        onCheckedChange={toggleHighContrast}
      />
      <Label htmlFor="high-contrast" className="flex items-center gap-2">
        <Contrast className="h-4 w-4" />
        وضع التباين العالي
      </Label>
    </div>
  );
}

// Font size adjustment
export function FontSizeAdjustment() {
  const [fontSize, setFontSize] = useState('medium');

  useEffect(() => {
    const stored = localStorage.getItem('font-size');
    if (stored) {
      setFontSize(stored);
      document.documentElement.setAttribute('data-font-size', stored);
    }
  }, []);

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem('font-size', size);
    document.documentElement.setAttribute('data-font-size', size);
  };

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Type className="h-4 w-4" />
        حجم الخط
      </Label>
      <div className="flex gap-2">
        <Button
          variant={fontSize === 'small' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFontSizeChange('small')}
        >
          صغير
        </Button>
        <Button
          variant={fontSize === 'medium' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFontSizeChange('medium')}
        >
          متوسط
        </Button>
        <Button
          variant={fontSize === 'large' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleFontSizeChange('large')}
        >
          كبير
        </Button>
      </div>
    </div>
  );
}

// Screen reader announcements
export function ScreenReaderAnnouncement({ 
  message, 
  priority = 'polite' 
}: { 
  message: string; 
  priority?: 'polite' | 'assertive' 
}) {
  return (
    <div
      role="status"
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  );
}

// Skip to content link
export function SkipToContent() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded-md z-50"
    >
      انتقل إلى المحتوى الرئيسي
    </a>
  );
}

// Accessibility panel
export function AccessibilityPanel() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50"
        aria-label="إعدادات إمكانية الوصول"
      >
        <Volume2 className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-80">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">إعدادات إمكانية الوصول</CardTitle>
        <CardDescription>
          اضبط الإعدادات لتحسين تجربة الاستخدام
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <HighContrastToggle />
        <FontSizeAdjustment />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(false)}
          className="w-full"
        >
          إغلاق
        </Button>
      </CardContent>
    </Card>
  );
}

// Keyboard navigation helper
export function useKeyboardNavigation() {
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Add keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            // Focus search input
            const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
            searchInput?.focus();
            break;
          case 'h':
            e.preventDefault();
            // Go to home
            window.location.href = '/';
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);
}