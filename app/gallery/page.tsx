'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface InstagramPost {
  id: string;
  url: string;
  permalink: string;
  caption: string;
  timestamp: string;
}

export default function GalleryPage() {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<InstagramPost | null>(null);

  useEffect(() => {
    fetchInstagramPosts();

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered in gallery: ', registration);
          // Check for updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New content is available, notify user
                  if (confirm('יש גרסה חדשה זמינה! האם ברצונך לרענן את הדף?')) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log('SW registration failed in gallery: ', registrationError);
        });
    }
  }, []);

  const fetchInstagramPosts = async () => {
    try {
      const response = await fetch('/api/instagram');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Failed to fetch Instagram posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5A3C] mx-auto"></div>
          <p className="mt-4 text-[#8B5A3C] font-medium">טוען גלריה...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-[#8B5A3C] to-[#A67C52] text-white py-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">גלריה - HALIVAS.BRAND</h1>
          <p className="text-xl opacity-90 mb-6">הפרויקטים האחרונים שלנו מאינסטגרם</p>
          <p className="text-lg opacity-80 max-w-3xl mx-auto">
            כאן תוכלו לראות את העבודות האחרונות שלנו - מטבחים מותאמים אישית, עיצובי פנים יוקרתיים ואדריכלות מודרנית.
            הגלריה מתעדכנת אוטומטית עם כל פוסט חדש באינסטגרם של HALIVAS.BRAND.
          </p>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">אין תמונות זמינות כרגע</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => setSelectedImage(post)}
              >
                <div className="aspect-square relative">
                  <Image
                    src={post.url}
                    alt={post.caption || 'Instagram post'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-center p-4">
                    <p className="text-sm font-medium">לחץ לצפייה</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10"
              onClick={() => setSelectedImage(null)}
            >
              ✕
            </button>
            <div className="relative">
              <Image
                src={selectedImage.url}
                alt={selectedImage.caption || 'Instagram post'}
                width={800}
                height={800}
                className="max-w-full max-h-[80vh] object-contain"
              />
              {selectedImage.caption && (
                <div className="mt-4 text-white text-center">
                  <p className="text-lg">{selectedImage.caption}</p>
                  <a
                    href={selectedImage.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 px-4 py-2 bg-[#8B5A3C] text-white rounded-lg hover:bg-[#A67C52] transition-colors"
                  >
                    צפה באינסטגרם
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Back to Home */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="text-center">
          <a
            href="/business-card"
            className="inline-block px-8 py-3 bg-[#8B5A3C] text-white rounded-lg hover:bg-[#A67C52] transition-colors font-medium"
          >
            חזרה ל-HALIVAS.BRAND
          </a>
        </div>
      </div>
    </div>
  );
}
