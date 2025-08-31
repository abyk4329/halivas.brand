'use client';

import Image from 'next/image';

export default function BusinessCard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-blue-50">
      {/* Hero Section */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <Image
            src="/halivas-logo.png"
            alt="Halivas Logo"
            width={128}
            height={128}
            className="mx-auto mb-8 drop-shadow-lg"
          />
          <h1 className="text-5xl font-serif font-bold text-ink mb-4 drop-shadow-sm">
            עידן חליווה
          </h1>
          <p className="text-xl text-foreground mb-8">
            מומחה באדריכלות, עיצוב פנים וייצור מטבחים מותאמים אישית
          </p>
          <div className="flex justify-center space-x-4 rtl:space-x-reverse">
            <span className="bg-brand text-on-dark px-4 py-2 rounded-full font-semibold shadow-md">🏠 אדריכלות</span>
            <span className="bg-accent text-on-dark px-4 py-2 rounded-full font-semibold shadow-md">🛋️ עיצוב פנים</span>
            <span className="bg-secondary text-on-dark px-4 py-2 rounded-full font-semibold shadow-md">🍳 ייצור מטבחים</span>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-ink text-center mb-12">
            השירותים שלנו
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-2xl font-bold text-ink mb-4">אדריכלות</h3>
              <p className="text-foreground">
                תכנון אדריכלי מקצועי לבתים ומבנים, עם דגש על פונקציונליות ואסתטיקה.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-4">🛋️</div>
              <h3 className="text-2xl font-bold text-ink mb-4">עיצוב פנים</h3>
              <p className="text-foreground">
                עיצוב חללים פנימיים יפים ומותאמים אישית לכל חדר בבית.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-6xl mb-4">🍳</div>
              <h3 className="text-2xl font-bold text-ink mb-4">ייצור מטבחים</h3>
              <p className="text-foreground">
                מטבחים מותאמים אישית באיכות גבוהה, עם חומרים מתקדמים ועיצוב מודרני.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-ink mb-8">
            צור קשר
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-ink mb-4">פרטי התקשרות</h3>
              <p className="text-foreground mb-2">📞 <strong>054-4525927</strong></p>
              <p className="text-foreground mb-2">✉️ <strong>idan@halivas.com</strong></p>
              <p className="text-foreground">📍 המחקר 5, אשדוד</p>
            </div>
            <div className="bg-card p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-ink mb-4">עקוב אחרינו</h3>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                className="text-accent hover:text-brand transition-colors text-lg"
              >
                📷 Instagram
              </a>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 rtl:space-x-reverse">
            <a
              href="tel:0544525927"
              className="bg-brand text-on-dark px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              📞 התקשר עכשיו
            </a>
            <a
              href="mailto:idan@halivas.com"
              className="bg-secondary text-on-dark px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              ✉️ שלח מייל
            </a>
            <a
              href="waze://?q=%D7%94%D7%9E%D7%97%D7%A7%D7%A8%205%2C%20%D7%90%D7%A9%D7%93%D7%95%D7%93"
              className="bg-accent text-on-dark px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              🗺️ נווט בווייז
            </a>
            <a
              href="/api/vcard"
              download="Idan_Haliva.vcf"
              className="bg-accent text-on-dark px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
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
              className="bg-secondary text-on-dark px-8 py-4 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              📤 שתף כרטיס ביקור
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-ink text-on-dark text-center">
        <p>&copy; 2025 עידן חליווה - אדריכלות ועיצוב. כל הזכויות שמורות.</p>
      </footer>
    </div>
  );
}
