'use client';

import { useState, useEffect } from 'react';
import SketchUploader from '../components/SketchUploader';

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

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  deals: Deal[];
}

export default function AdminClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddClient, setShowAddClient] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      // בפרויקט אמיתי היינו קוראים ל-API, אבל כאן נשתמש בנתונים מקומיים
      const response = await fetch('/data/clients.json');
      const data = await response.json();
      setClients(data);
    } catch (error) {
      console.error('Error loading clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('הלקוח נשמר בהצלחה!');
        setFormData({ id: '', name: '', phone: '', email: '' });
        setShowAddClient(false);
        setEditingClient(null);
        loadClients();
      } else {
        alert('שגיאה בשמירת הלקוח');
      }
    } catch (error) {
      console.error('Error saving client:', error);
      alert('שגיאה בשמירת הלקוח');
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      id: client.id,
      name: client.name,
      phone: client.phone,
      email: client.email
    });
    setShowAddClient(true);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B5A3C] mx-auto"></div>
          <p className="mt-4 text-[#8B5A3C] font-medium">טוען לקוחות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ניהול לקוחות - HALIVAS.BRAND</h1>
              <p className="text-gray-600">ניהול מסד הלקוחות והעסקאות</p>
            </div>
            <div className="flex gap-3">
              <a
                href="/conversation-manager"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                💬 ניהול שיחות
              </a>
              <a
                href="/meeting-manager"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                📅 ניהול פגישות
              </a>
              <button
                onClick={() => setShowAddClient(true)}
                className="bg-[#8B5A3C] text-white px-6 py-3 rounded-lg hover:bg-[#A67C52] transition-colors font-medium"
              >
                ➕ הוסף לקוח חדש
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">👥</span>
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">סך לקוחות</p>
                <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">💰</span>
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">סך הכנסות</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatPrice(clients.reduce((sum, client) =>
                    sum + client.deals.reduce((dealSum, deal) => dealSum + deal.price, 0), 0
                  ))}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">עסקאות פעילות</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.reduce((sum, client) =>
                    sum + client.deals.filter(deal => deal.status === 'בתהליך').length, 0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">עסקאות הושלמו</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clients.reduce((sum, client) =>
                    sum + client.deals.filter(deal => deal.status === 'הושלם').length, 0
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* Add/Edit Client Modal */}
        {showAddClient && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Client Form */}
                <div>
                  <h2 className="text-xl font-bold mb-4">
                    {editingClient ? 'עריכת לקוח' : 'הוספת לקוח חדש'}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        תעודת זהות
                      </label>
                      <input
                        type="text"
                        value={formData.id}
                        onChange={(e) => setFormData({...formData, id: e.target.value.replace(/\D/g, '').slice(0, 9)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5A3C] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        שם מלא
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5A3C] focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        טלפון
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5A3C] focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        אימייל
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5A3C] focus:border-transparent"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 bg-[#8B5A3C] text-white py-2 px-4 rounded-lg hover:bg-[#A67C52] transition-colors"
                      >
                        שמור
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddClient(false);
                          setEditingClient(null);
                          setFormData({ id: '', name: '', phone: '', email: '' });
                        }}
                        className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                      >
                        ביטול
                      </button>
                    </div>
                  </form>
                </div>

                {/* Sketch Uploader */}
                {editingClient && (
                  <div>
                    <SketchUploader
                      clientId={editingClient.id}
                      onSketchUploaded={() => {
                        // רענון רשימת הלקוחות לאחר העלאת סקיצה
                        loadClients();
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}        {/* Clients List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">רשימת לקוחות ({clients.length})</h2>
          </div>

          {clients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">אין לקוחות במערכת</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {clients.map((client) => (
                <div key={client.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                      <p className="text-gray-600">ת.ז: {client.id}</p>
                      <p className="text-gray-600">טלפון: {client.phone}</p>
                      <p className="text-gray-600">אימייל: {client.email}</p>

                      <div className="mt-4">
                        <h4 className="font-medium text-gray-900 mb-2">עסקאות ({client.deals.length})</h4>
                        {client.deals.length > 0 ? (
                          <div className="space-y-2">
                            {client.deals.map((deal) => (
                              <div key={deal.id} className="bg-gray-50 p-3 rounded">
                                <div className="flex justify-between items-center mb-2">
                                  <div>
                                    <p className="font-medium">{deal.description}</p>
                                    <p className="text-sm text-gray-600">{deal.type}</p>
                                  </div>
                                  <span className={`px-2 py-1 rounded text-xs ${
                                    deal.status === 'הושלם' ? 'bg-green-100 text-green-800' :
                                    deal.status === 'בתהליך' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {deal.status}
                                  </span>
                                </div>

                                {/* Payment Progress */}
                                <div className="mb-2">
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>תשלומים: {formatPrice(deal.paid)} / {formatPrice(deal.price)}</span>
                                    <span>{((deal.paid / deal.price) * 100).toFixed(0)}%</span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className="bg-green-500 h-2 rounded-full"
                                      style={{ width: `${(deal.paid / deal.price) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>

                                {/* Delivery Info */}
                                <div className="text-xs text-gray-500">
                                  <p>הספקה משוערת: {new Date(deal.estimatedDelivery).toLocaleDateString('he-IL')}</p>
                                  {deal.actualDelivery && (
                                    <p>הספקה בפועל: {new Date(deal.actualDelivery).toLocaleDateString('he-IL')}</p>
                                  )}
                                  {deal.delayReason && (
                                    <p className="text-yellow-600">עיכוב: {deal.delayReason}</p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">אין עסקאות</p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => handleEdit(client)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors ml-4"
                    >
                      ✏️ ערוך
                    </button>
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
