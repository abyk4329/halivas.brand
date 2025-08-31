'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function BusinessCard() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);

  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{
      outcome: 'accepted' | 'dismissed';
      platform: string;
    }>;
  }

  useEffect(() => {
    const handler = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);
    
    return () => window.removeEventListener('beforeinstallprompt', handler as EventListener);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallButton(false);
    }
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Image
            src="/halivas-logo.png"
            alt="Halivas Logo"
            width={100}
            height={100}
            className="mx-auto mb-12"
          />
          <h1 className="text-5xl font-sans font-medium text-ink mb-6 tracking-tight">
            עידן חליווה
          </h1>
          <p className="text-xl text-foreground mb-10 font-light leading-relaxed">
            מומחה באדריכלות, עיצוב פנים וייצור מטבחים מותאמים אישית
          </p>
          <p className="text-lg text-foreground mb-8 font-light leading-relaxed max-w-2xl mx-auto">
            עם ניסיון של למעלה מ-15 שנה בתחום, אני מתמחה ביצירת חללים יפים ופונקציונליים שמשקפים את האישיות והצרכים של כל לקוח.
            מהתכנון הראשוני ועד למימוש הסופי - אני כאן כדי להפוך את החלום שלכם למציאות.
          </p>
          <div className="flex justify-center mb-8">
            <a
              href="/gallery"
              className="bg-secondary text-on-dark px-6 py-3 rounded-lg font-medium shadow-sm hover:shadow-md transition-all hover:scale-105 mr-4"
            >
              צפה בגלריה
            </a>
          </div>
          <div className="flex justify-center flex-wrap gap-6">
            <span className="text-foreground font-medium tracking-wide">אדריכלות</span>
            <span className="text-foreground font-medium tracking-wide">עיצוב פנים</span>
            <span className="text-foreground font-medium tracking-wide">ייצור מטבחים</span>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 bg-light-gray">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-sans font-medium text-ink mb-8">
            הפרויקטים שלנו
          </h2>
          <p className="text-xl text-foreground mb-12 font-light leading-relaxed">
            גלריה דינמית עם הפרויקטים האחרונים שלנו מאינסטגרם
          </p>
          <a
            href="/gallery"
            className="inline-block bg-brand text-on-dark px-12 py-4 rounded-lg font-medium shadow-sm hover:shadow-md transition-all hover:scale-105"
          >
            צפה בגלריה המלאה
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-sans font-medium text-ink text-center mb-16">
            השירותים שלנו
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="card text-center">
              <h3 className="text-2xl font-medium text-ink mb-6">אדריכלות</h3>
              <p className="text-foreground leading-relaxed">
                תכנון אדריכלי מקצועי לבתים ומבנים, עם דגש על פונקציונליות ואסתטיקה מודרנית.
                מתכנן חללים שמשלבים בין יופי, נוחות ויעילות מקסימלית.
              </p>
            </div>
            <div className="card text-center">
              <h3 className="text-2xl font-medium text-ink mb-6">עיצוב פנים</h3>
              <p className="text-foreground leading-relaxed">
                עיצוב חללים פנימיים יפים ומותאמים אישית לכל חדר בבית, עם סגנון מינימליסטי ואלגנטי.
                יוצר אווירה הרמונית שמשקפת את הטעם האישי שלכם.
              </p>
            </div>
            <div className="card text-center">
              <h3 className="text-2xl font-medium text-ink mb-6">ייצור מטבחים</h3>
              <p className="text-foreground leading-relaxed">
                מטבחים מותאמים אישית באיכות גבוהה, עם חומרים מתקדמים ועיצוב מודרני ונקי.
                משלב טכנולוגיה מתקדמת עם עיצוב קלאסי וזמני.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 bg-light-gray">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-sans font-medium text-ink mb-12">
            צור קשר
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="card text-center">
              <h3 className="text-xl font-medium text-ink mb-6">פרטי התקשרות</h3>
              <div className="space-y-4">
                <p className="text-foreground font-medium">054-4525927</p>
                <p className="text-foreground font-medium">idan@halivas.com</p>
                <p className="text-foreground">המחקר 5, אשדוד</p>
              </div>
            </div>
            <div className="card text-center">
              <h3 className="text-xl font-medium text-ink mb-6">עקוב אחרינו</h3>
              <a
                href="https://www.instagram.com/halivas.brand?igsh=MTh2dWRlbmdkOGxtaA=="
                target="_blank"
                className="inline-block text-foreground hover:text-ink transition-colors font-medium"
              >
                Instagram
              </a>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-6 flex-wrap">
            {showInstallButton && (
              <button
                onClick={handleInstallClick}
                className="bg-brand text-on-dark px-8 py-4 rounded-lg font-medium shadow-sm hover:shadow-md transition-all hover:scale-105"
              >
                התקן כאפליקציה
              </button>
            )}
            <a
              href="tel:0544525927"
              className="bg-brand text-on-dark px-8 py-4 rounded-lg font-medium shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              התקשר עכשיו
            </a>
            <a
              href="mailto:idan@halivas.com"
              className="bg-secondary text-on-dark px-8 py-4 rounded-lg font-medium shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              שלח מייל
            </a>
            <a
              href="waze://?q=%D7%94%D7%9E%D7%97%D7%A7%D7%A8%205%2C%20%D7%90%D7%A9%D7%93%D7%95%D7%93"
              className="bg-accent text-depth px-8 py-4 rounded-lg font-medium shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              נווט בווייז
            </a>
            <a
              href="/api/vcard"
              download="Idan_Haliva.vcf"
              className="bg-accent text-depth px-8 py-4 rounded-lg font-medium shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              שמור באנשי קשר
            </a>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'כרטיס ביקור - עידן חליווה',
                    text: 'בקר בכרטיס הביקור הדיגיטלי שלי',
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                  alert('הקישור הועתק ללוח!');
                }
              }}
              className="bg-secondary text-on-dark px-8 py-4 rounded-lg font-medium shadow-sm hover:shadow-md transition-all hover:scale-105"
            >
              שתף כרטיס ביקור
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-ink text-on-dark text-center">
        <p className="font-light">&copy; 2025 עידן חליווה - אדריכלות ועיצוב. כל הזכויות שמורות.</p>
      </footer>
    </div>
  );
}
