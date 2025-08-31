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
            width={120}
            height={120}
            className="mx-auto mb-8 rounded-full shadow-lg"
          />
          <h1 className="text-6xl font-sans font-bold text-ink mb-6 tracking-tight">
            עידן חליווה
          </h1>
          <p className="text-xl text-foreground mb-10 font-light leading-relaxed">
            מומחה באדריכלות, עיצוב פנים וייצור מטבחים מותאמים אישית
          </p>
          <div className="flex justify-center flex-wrap gap-4">
            <span className="bg-brand text-on-dark px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow">
              🏠 אדריכלות
            </span>
            <span className="bg-accent text-on-dark px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow">
              🛋️ עיצוב פנים
            </span>
            <span className="bg-secondary text-on-dark px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow">
              🍳 ייצור מטבחים
            </span>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 px-4 bg-light-gray">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-sans font-bold text-ink text-center mb-16">
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
                  className="object-cover hover:brightness-110 transition-all"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-sans font-bold text-ink text-center mb-16">
            השירותים שלנו
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-6">🏠</div>
              <h3 className="text-2xl font-bold text-ink mb-4">אדריכלות</h3>
              <p className="text-foreground leading-relaxed">
                תכנון אדריכלי מקצועי לבתים ומבנים, עם דגש על פונקציונליות ואסתטיקה מודרנית.
              </p>
            </div>
            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-6">🛋️</div>
              <h3 className="text-2xl font-bold text-ink mb-4">עיצוב פנים</h3>
              <p className="text-foreground leading-relaxed">
                עיצוב חללים פנימיים יפים ומותאמים אישית לכל חדר בבית, עם סגנון מינימליסטי.
              </p>
            </div>
            <div className="card text-center hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-6">🍳</div>
              <h3 className="text-2xl font-bold text-ink mb-4">ייצור מטבחים</h3>
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
          <h2 className="text-4xl font-sans font-bold text-ink mb-12">
            צור קשר
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="card text-center">
              <h3 className="text-xl font-bold text-ink mb-6">פרטי התקשרות</h3>
              <div className="space-y-3">
                <p className="text-foreground">📞 <strong>054-4525927</strong></p>
                <p className="text-foreground">✉️ <strong>idan@halivas.com</strong></p>
                <p className="text-foreground">📍 המחקר 5, אשדוד</p>
              </div>
            </div>
            <div className="card text-center">
              <h3 className="text-xl font-bold text-ink mb-6">עקוב אחרינו</h3>
              <a
                href="https://www.instagram.com/halivas.brand?igsh=MTh2dWRlbmdkOGxtaA=="
                target="_blank"
                className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-medium hover:shadow-lg transition-all"
              >
                📷 Instagram
              </a>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 flex-wrap">
            {showInstallButton && (
              <button
                onClick={handleInstallClick}
                className="bg-green-500 text-white px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                📱 התקן כאפליקציה
              </button>
            )}
            <a
              href="tel:0544525927"
              className="bg-brand text-on-dark px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              📞 התקשר עכשיו
            </a>
            <a
              href="mailto:idan@halivas.com"
              className="bg-secondary text-on-dark px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              ✉️ שלח מייל
            </a>
            <a
              href="waze://?q=%D7%94%D7%9E%D7%97%D7%A7%D7%A8%205%2C%20%D7%90%D7%A9%D7%93%D7%95%D7%93"
              className="bg-accent text-on-dark px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              🗺️ נווט בווייז
            </a>
            <a
              href="/api/vcard"
              download="Idan_Haliva.vcf"
              className="bg-accent text-on-dark px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              💾 שמור באנשי קשר
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
              className="bg-secondary text-on-dark px-8 py-4 rounded-full font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              📤 שתף כרטיס ביקור
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
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedImage}
              alt="תמונה מוגדלת"
              width={800}
              height={600}
              className="object-contain max-h-[90vh] rounded-lg"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-white text-black rounded-full w-10 h-10 flex items-center justify-center font-bold hover:bg-gray-200 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
