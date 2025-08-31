'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

const galleryImages = [
  '/IMG_5280.PNG',
  '/IMG_5281.PNG', 
  '/IMG_5282.PNG',
  '/IMG_5283.PNG',
  '/IMG_5284.PNG',
  '/IMG_5285.PNG',
  '/IMG_5286.PNG',
  '/IMG_5287.PNG',
  '/IMG_5288.PNG',
  '/IMG_5289.PNG',
  '/IMG_5290.PNG',
  '/IMG_5291.PNG',
  '/IMG_5292.PNG'
];

export default function BusinessCard() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
          <div className="flex justify-center flex-wrap gap-6">
            <span className="text-foreground font-medium tracking-wide">אדריכלות</span>
            <span className="text-foreground font-medium tracking-wide">עיצוב פנים</span>
            <span className="text-foreground font-medium tracking-wide">ייצור מטבחים</span>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 bg-light-gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-sans font-medium text-ink text-center mb-16">
            הפרויקטים שלנו
          </h2>
          <div className="gallery-grid">
            {galleryImages.map((image, index) => (
              <div 
                key={index}
                className="gallery-item cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={image}
                  alt={`פרויקט ${index + 1}`}
                  fill
                  className="object-cover transition-all duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-5 transition-all duration-300"></div>
              </div>
            ))}
          </div>
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
              </p>
            </div>
            <div className="card text-center">
                            <h3 className="text-2xl font-medium text-ink mb-6">עיצוב פנים</h3>
              <p className="text-foreground leading-relaxed">
                עיצוב חללים פנימיים יפים ומותאמים אישית לכל חדר בבית, עם סגנון מינימליסטי.
              </p>
            </div>
            <div className="card text-center">
                            <h3 className="text-2xl font-medium text-ink mb-6">ייצור מטבחים</h3>
              <p className="text-foreground leading-relaxed">
                מטבחים מותאמים אישית באיכות גבוהה, עם חומרים מתקדמים ועיצוב מודרני ונקי.
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

            {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-full">
            <Image
              src={selectedImage}
              alt="תמונה מוגדלת"
              width={1000}
              height={750}
              className="object-contain max-h-[90vh] rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white text-black rounded-full w-12 h-12 flex items-center justify-center font-bold hover:bg-gray-200 transition-colors shadow-lg"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
