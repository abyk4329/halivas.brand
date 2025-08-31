'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import KitchenStatusTracker from '../components/KitchenStatusTracker';

interface Deal {
  id: string;
  type: string;
  description: string;
  price: number;
  paid: number;
  remaining: number;
  status: string;
  date: string;
  estimatedDelivery: string;
  actualDelivery: string | null;
  delayReason: string | null;
  summary: string;
}

interface KitchenStatus {
  currentPhase: string;
  progress: number;
  estimatedCompletion: string;
  nextMilestone: string;
  lastUpdate: string;
  deliveryDate: string;
  delayReason: string | null;
  sketches: Array<{
    id: string;
    name: string;
    url: string;
    uploadedAt: string;
    description: string;
  }>;
  updates: Array<{
    date: string;
    phase: string;
    description: string;
  }>;
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  kitchenStatus?: KitchenStatus;
  deals: Deal[];
}

export default function ClientDashboard() {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // קריאת נתוני הלקוח מ-session storage
    const clientData = sessionStorage.getItem('clientData');
    if (clientData) {
      setClient(JSON.parse(clientData));
    } else {
      router.push('/client-login');
    }
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    sessionStorage.removeItem('clientData');
    router.push('/client-login');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'הושלם':
        return 'bg-green-100 text-green-800';
      case 'בתהליך':
        return 'bg-blue-100 text-blue-800';
      case 'ממתין':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5A3C] mx-auto"></div>
          <p className="mt-4 text-[#8B5A3C] font-medium">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">שלום, {client.name}</h1>
              <p className="text-gray-600">ברוך הבא לאזור הלקוחות של HALIVAS.BRAND</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              התנתק
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Client Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">פרטי התקשרות</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">שם מלא</p>
              <p className="font-medium">{client.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">טלפון</p>
              <p className="font-medium">{client.phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">אימייל</p>
              <p className="font-medium">{client.email}</p>
            </div>
          </div>
        </div>

        {/* Kitchen Status */}
        {client.kitchenStatus && (
          <div className="mb-8">
            <KitchenStatusTracker kitchenStatus={client.kitchenStatus} />
          </div>
        )}

        {/* Deals */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">העסקאות שלי</h2>

          {client.deals.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">אין עסקאות להצגה</p>
            </div>
          ) : (
            <div className="space-y-6">
              {client.deals.map((deal) => (
                <div key={deal.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{deal.description}</h3>
                      <p className="text-[#8B5A3C] font-medium">{deal.type}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-2xl font-bold text-gray-900">{formatPrice(deal.price)}</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(deal.status)}`}>
                        {deal.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">תאריך</p>
                      <p className="font-medium">{formatDate(deal.date)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">מספר עסקה</p>
                      <p className="font-medium">{deal.id}</p>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">סטטוס תשלומים</h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">סכום כולל</p>
                        <p className="text-lg font-bold text-gray-900">{formatPrice(deal.price)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">שולם</p>
                        <p className="text-lg font-bold text-green-600">{formatPrice(deal.paid)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">נותר</p>
                        <p className="text-lg font-bold text-red-600">{formatPrice(deal.remaining)}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(deal.paid / deal.price) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {((deal.paid / deal.price) * 100).toFixed(1)}% שולם
                      </p>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">תאריך הספקה משוער</p>
                      <p className="font-medium">{formatDate(deal.estimatedDelivery)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">תאריך הספקה בפועל</p>
                      <p className="font-medium">
                        {deal.actualDelivery ? formatDate(deal.actualDelivery) : 'טרם הושלם'}
                      </p>
                    </div>
                  </div>

                  {/* Delay Warning */}
                  {deal.delayReason && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                      <div className="flex items-center mb-1">
                        <span className="text-yellow-600 mr-2">⚠️</span>
                        <span className="font-medium text-yellow-800">הודעת עיכוב</span>
                      </div>
                      <p className="text-yellow-700 text-sm">{deal.delayReason}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-sm text-gray-500 mb-2">סיכום</p>
                    <p className="text-gray-700 leading-relaxed">{deal.summary}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="text-center">
            <a
              href="/business-card"
              className="text-[#8B5A3C] hover:text-[#A67C52] transition-colors"
            >
              חזרה לאתר HALIVAS.BRAND
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
