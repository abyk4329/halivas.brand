'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientLogin() {
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/clients?id=${id}`);
      const data = await response.json();

      if (response.ok) {
        // שמירת פרטי הלקוח ב-session storage
        sessionStorage.setItem('clientData', JSON.stringify(data));
        router.push('/client-dashboard');
      } else {
        setError(data.error || 'שגיאה בהתחברות');
      }
    } catch (err) {
      setError('שגיאה בחיבור לשרת');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8B5A3C] to-[#A67C52] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">HALIVAS.BRAND</h1>
          <h2 className="text-xl text-gray-600">אזור לקוחות</h2>
          <p className="text-gray-500 mt-2">הזן את מספר תעודת הזהות שלך</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="id" className="block text-sm font-medium text-gray-700 mb-2">
              מספר תעודת זהות
            </label>
            <input
              type="text"
              id="id"
              value={id}
              onChange={(e) => setId(e.target.value.replace(/\D/g, '').slice(0, 9))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5A3C] focus:border-transparent text-center text-lg font-mono"
              placeholder="123456789"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || id.length !== 9}
            className="w-full bg-[#8B5A3C] text-white py-3 px-4 rounded-lg hover:bg-[#A67C52] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <a
            href="/business-card"
            className="text-[#8B5A3C] hover:text-[#A67C52] transition-colors"
          >
            חזרה לאתר הראשי
          </a>
        </div>
      </div>
    </div>
  );
}
