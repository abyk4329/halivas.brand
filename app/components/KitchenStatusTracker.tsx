import React from 'react';

interface Sketch {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  description: string;
}

interface KitchenStatus {
  currentPhase: string;
  progress: number;
  estimatedCompletion: string;
  nextMilestone: string;
  lastUpdate: string;
  deliveryDate: string;
  delayReason: string | null;
  sketches: Sketch[];
  updates: Array<{
    date: string;
    phase: string;
    description: string;
  }>;
}

interface KitchenStatusTrackerProps {
  kitchenStatus: KitchenStatus;
}

const KitchenStatusTracker: React.FC<KitchenStatusTrackerProps> = ({ kitchenStatus }) => {
  const phases = ['תכנון', 'ייצור', 'הובלה', 'התקנה', 'גימור'];
  const currentPhaseIndex = phases.indexOf(kitchenStatus.currentPhase);

  const getPhaseStatus = (phase: string, index: number) => {
    if (index < currentPhaseIndex) return 'completed';
    if (index === currentPhaseIndex) return 'current';
    return 'pending';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('he-IL');
  };

  const getDaysUntilDelivery = () => {
    const today = new Date();
    const deliveryDate = new Date(kitchenStatus.deliveryDate);
    const diffTime = deliveryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilDelivery = getDaysUntilDelivery();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">מעקב סטטוס מטבח</h2>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-600">התקדמות כללית</span>
          <span className="text-sm font-medium text-gray-600">{kitchenStatus.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${kitchenStatus.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className={`p-4 rounded-lg ${daysUntilDelivery > 0 ? 'bg-green-50' : 'bg-red-50'}`}>
          <h4 className="font-semibold text-gray-800 mb-2">תאריך הספקה</h4>
          <p className={`text-lg font-bold ${daysUntilDelivery > 0 ? 'text-green-700' : 'text-red-700'}`}>
            {formatDate(kitchenStatus.deliveryDate)}
          </p>
          <p className="text-sm text-gray-600">
            {daysUntilDelivery > 0
              ? `עוד ${daysUntilDelivery} ימים`
              : `עבר ב-${Math.abs(daysUntilDelivery)} ימים`
            }
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">שלב נוכחי</h4>
          <p className="text-blue-700 font-medium">{kitchenStatus.currentPhase}</p>
          <p className="text-sm text-blue-600">{kitchenStatus.nextMilestone}</p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-800 mb-2">עדכון אחרון</h4>
          <p className="text-gray-700">{formatDate(kitchenStatus.lastUpdate)}</p>
        </div>
      </div>

      {/* Delay Warning */}
      {kitchenStatus.delayReason && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <span className="text-yellow-600 text-lg mr-2">⚠️</span>
            <h4 className="font-semibold text-yellow-800">הודעת עיכוב</h4>
          </div>
          <p className="text-yellow-700">{kitchenStatus.delayReason}</p>
        </div>
      )}

      {/* Phases Timeline */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">שלבי הפרויקט</h3>
        <div className="flex justify-between items-center">
          {phases.map((phase, index) => {
            const status = getPhaseStatus(phase, index);
            return (
              <div key={phase} className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm mb-2 ${
                    status === 'completed'
                      ? 'bg-green-500'
                      : status === 'current'
                      ? 'bg-blue-500 animate-pulse'
                      : 'bg-gray-300'
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`text-xs text-center ${
                    status === 'current' ? 'text-blue-600 font-semibold' : 'text-gray-500'
                  }`}
                >
                  {phase}
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between mt-2">
          {phases.slice(0, -1).map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-1 mx-2 ${
                index < currentPhaseIndex ? 'bg-green-500' : 'bg-gray-300'
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Sketches Gallery */}
      {kitchenStatus.sketches && kitchenStatus.sketches.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">סקיצות והדמיות</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {kitchenStatus.sketches.map((sketch) => (
              <div key={sketch.id} className="border border-gray-200 rounded-lg p-4">
                <div className="aspect-video bg-gray-100 rounded-lg mb-3 flex items-center justify-center">
                  <a
                    href={sketch.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <div className="text-center">
                      <div className="text-4xl mb-2">🖼️</div>
                      <p className="text-sm">צפה בסקיצה</p>
                    </div>
                  </a>
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{sketch.name}</h4>
                <p className="text-sm text-gray-600 mb-2">{sketch.description}</p>
                <p className="text-xs text-gray-500">הועלה: {formatDate(sketch.uploadedAt)}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Updates Timeline */}
      <div>
        <h3 className="text-lg font-semibold text-gray-700 mb-4">עדכונים אחרונים</h3>
        <div className="space-y-4">
          {kitchenStatus.updates.slice(-3).reverse().map((update, index) => (
            <div key={index} className="flex items-start space-x-4 bg-gray-50 rounded-lg p-4">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-800">{update.phase}</span>
                  <span className="text-sm text-gray-500">{formatDate(update.date)}</span>
                </div>
                <p className="text-gray-600 text-sm">{update.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KitchenStatusTracker;
