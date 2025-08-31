'use client';

import { useState, useEffect } from 'react';

interface Meeting {
  id: string;
  clientId: string;
  clientName: string;
  type: 'פגישה' | 'שיחת טלפון' | 'ביקור באתר' | 'וידאו קול';
  date: string;
  time: string;
  duration: number; // בדקות
  location?: string;
  purpose: string;
  status: 'מתוכנן' | 'הושלם' | 'בוטל' | 'דחוי';
  notes?: string;
  followUp?: string;
}

interface Reminder {
  id: string;
  meetingId: string;
  type: 'התראה' | 'תזכורת' | 'משימה';
  message: string;
  dueDate: string;
  completed: boolean;
}

export default function MeetingManager() {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showAddMeeting, setShowAddMeeting] = useState(false);
  const [meetingForm, setMeetingForm] = useState({
    clientId: '',
    clientName: '',
    type: 'פגישה' as Meeting['type'],
    date: '',
    time: '',
    duration: 60,
    location: '',
    purpose: '',
    notes: ''
  });

  useEffect(() => {
    loadMeetings();
    loadReminders();
  }, []);

  const loadMeetings = () => {
    // בפרויקט אמיתי זה יהיה מ-API
    const mockMeetings: Meeting[] = [
      {
        id: '1',
        clientId: '123456789',
        clientName: 'ישראל ישראלי',
        type: 'פגישה',
        date: '2025-09-20',
        time: '10:00',
        duration: 90,
        location: 'משרד ראשי',
        purpose: 'דיון בתכנית המטבח הסופית',
        status: 'מתוכנן',
        notes: 'הלקוח אישר את התכנית הראשונית'
      },
      {
        id: '2',
        clientId: '987654321',
        clientName: 'שרה כהן',
        type: 'שיחת טלפון',
        date: '2025-09-18',
        time: '14:00',
        duration: 30,
        purpose: 'עדכון סטטוס המטבח',
        status: 'הושלם',
        notes: 'המטבח בהתקנה, הלקוחה מרוצה'
      }
    ];
    setMeetings(mockMeetings);
  };

  const loadReminders = () => {
    const mockReminders: Reminder[] = [
      {
        id: '1',
        meetingId: '1',
        type: 'התראה',
        message: 'פגישה עם ישראל ישראלי בעוד יום',
        dueDate: '2025-09-19',
        completed: false
      },
      {
        id: '2',
        meetingId: '1',
        type: 'משימה',
        message: 'הכנת הצעת מחיר סופית למטבח',
        dueDate: '2025-09-19',
        completed: false
      }
    ];
    setReminders(mockReminders);
  };

  const handleAddMeeting = () => {
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      ...meetingForm,
      status: 'מתוכנן'
    };
    setMeetings(prev => [...prev, newMeeting]);
    setShowAddMeeting(false);
    resetForm();
  };

  const resetForm = () => {
    setMeetingForm({
      clientId: '',
      clientName: '',
      type: 'פגישה',
      date: '',
      time: '',
      duration: 60,
      location: '',
      purpose: '',
      notes: ''
    });
  };

  const getStatusColor = (status: Meeting['status']) => {
    switch (status) {
      case 'מתוכנן': return 'bg-blue-100 text-blue-800';
      case 'הושלם': return 'bg-green-100 text-green-800';
      case 'בוטל': return 'bg-red-100 text-red-800';
      case 'דחוי': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (date: string, time: string) => {
    return new Date(`${date}T${time}`).toLocaleString('he-IL');
  };

  const upcomingMeetings = meetings.filter(m => m.status === 'מתוכנן');
  const completedMeetings = meetings.filter(m => m.status === 'הושלם');
  const pendingReminders = reminders.filter(r => !r.completed);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ניהול פגישות ותזכורות</h1>
              <p className="text-gray-600">ארגון וניהול פגישות עם לקוחות</p>
            </div>
            <button
              onClick={() => setShowAddMeeting(true)}
              className="bg-[#8B5A3C] text-white px-6 py-3 rounded-lg hover:bg-[#A67C52] transition-colors font-medium"
            >
              📅 קביעת פגישה חדשה
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">📅</span>
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">פגישות מתוכננות</p>
                <p className="text-2xl font-bold text-gray-900">{upcomingMeetings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">✅</span>
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">פגישות הושלמו</p>
                <p className="text-2xl font-bold text-gray-900">{completedMeetings.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <span className="text-2xl">🔔</span>
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">תזכורות ממתינות</p>
                <p className="text-2xl font-bold text-gray-900">{pendingReminders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">⏰</span>
              </div>
              <div className="mr-4">
                <p className="text-sm text-gray-600">שעות פגישות החודש</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round(meetings.reduce((sum, m) => sum + m.duration, 0) / 60)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Meetings */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">פגישות מתוכננות</h2>

            {upcomingMeetings.length === 0 ? (
              <p className="text-gray-500 text-center py-8">אין פגישות מתוכננות</p>
            ) : (
              <div className="space-y-4">
                {upcomingMeetings.map(meeting => (
                  <div key={meeting.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">{meeting.clientName}</h3>
                        <p className="text-sm text-gray-600">{meeting.type}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(meeting.status)}`}>
                        {meeting.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <p>📅 {formatDateTime(meeting.date, meeting.time)}</p>
                      <p>⏱️ משך: {meeting.duration} דקות</p>
                      {meeting.location && <p>📍 {meeting.location}</p>}
                    </div>

                    <p className="text-sm text-gray-700 mt-3">{meeting.purpose}</p>

                    <div className="flex gap-2 mt-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        סמן כהושלם
                      </button>
                      <button className="text-gray-600 hover:text-gray-800 text-sm">
                        ערוך
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Reminders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">תזכורות ומשימות</h2>

            {pendingReminders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">אין תזכורות ממתינות</p>
            ) : (
              <div className="space-y-4">
                {pendingReminders.map(reminder => (
                  <div key={reminder.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">{reminder.message}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(reminder.dueDate).toLocaleDateString('he-IL')}
                          </p>
                        </div>
                      </div>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">
                        {reminder.type}
                      </span>
                    </div>

                    <button className="text-green-600 hover:text-green-800 text-sm font-medium">
                      סמן כהושלם
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Meeting Modal */}
        {showAddMeeting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">קביעת פגישה חדשה</h2>

              <form onSubmit={(e) => { e.preventDefault(); handleAddMeeting(); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    שם הלקוח
                  </label>
                  <input
                    type="text"
                    value={meetingForm.clientName}
                    onChange={(e) => setMeetingForm({...meetingForm, clientName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5A3C] focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    סוג פגישה
                  </label>
                  <select
                    value={meetingForm.type}
                    onChange={(e) => setMeetingForm({...meetingForm, type: e.target.value as Meeting['type']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5A3C] focus:border-transparent"
                  >
                    <option value="פגישה">פגישה</option>
                    <option value="שיחת טלפון">שיחת טלפון</option>
                    <option value="ביקור באתר">ביקור באתר</option>
                    <option value="וידאו קול">וידאו קול</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      תאריך
                    </label>
                    <input
                      type="date"
                      value={meetingForm.date}
                      onChange={(e) => setMeetingForm({...meetingForm, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5A3C] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      שעה
                    </label>
                    <input
                      type="time"
                      value={meetingForm.time}
                      onChange={(e) => setMeetingForm({...meetingForm, time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5A3C] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                  <input
                    type="number"
                    value={meetingForm.duration}
                    onChange={(e) => setMeetingForm({...meetingForm, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5A3C] focus:border-transparent"
                    min="15"
                    max="480"
                  />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    מיקום
                  </label>
                  <input
                    type="text"
                    value={meetingForm.location}
                    onChange={(e) => setMeetingForm({...meetingForm, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5A3C] focus:border-transparent"
                    placeholder="משרד, בית הלקוח, ועידה וכו'"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    מטרת הפגישה
                  </label>
                  <textarea
                    value={meetingForm.purpose}
                    onChange={(e) => setMeetingForm({...meetingForm, purpose: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5A3C] focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    הערות
                  </label>
                  <textarea
                    value={meetingForm.notes}
                    onChange={(e) => setMeetingForm({...meetingForm, notes: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#8B5A3C] focus:border-transparent"
                    rows={2}
                    placeholder="פרטים נוספים..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#8B5A3C] text-white py-2 px-4 rounded-lg hover:bg-[#A67C52] transition-colors"
                  >
                    קבע פגישה
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAddMeeting(false); resetForm(); }}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    ביטול
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
