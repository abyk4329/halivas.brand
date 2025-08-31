'use client';

import { useState } from 'react';

interface Sketch {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
  description: string;
}

interface SketchUploaderProps {
  clientId: string;
  onSketchUploaded: (sketch: Sketch) => void;
}

export default function SketchUploader({ clientId, onSketchUploaded }: SketchUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: '',
    file: null as File | null
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.name.trim()) {
      alert('נא לבחור קובץ ולהזין שם');
      return;
    }

    setIsUploading(true);

    try {
      // יצירת FormData להעלאת הקובץ
      const formData = new FormData();
      formData.append('file', uploadForm.file);
      formData.append('clientId', clientId);
      formData.append('name', uploadForm.name);
      formData.append('description', uploadForm.description);

      // קריאה ל-API להעלאה לגיטהאב
      const response = await fetch('/api/upload-sketch', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();

        const newSketch: Sketch = {
          id: `sketch_${Date.now()}`,
          name: uploadForm.name,
          url: result.githubUrl,
          uploadedAt: new Date().toISOString(),
          description: uploadForm.description
        };

        onSketchUploaded(newSketch);

        // איפוס הטופס
        setUploadForm({
          name: '',
          description: '',
          file: null
        });

        alert('הסקיצה הועלתה בהצלחה!');
      } else {
        throw new Error('שגיאה בהעלאת הקובץ');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('שגיאה בהעלאת הסקיצה. נסה שוב.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">העלאת סקיצה חדשה</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            שם הסקיצה *
          </label>
          <input
            type="text"
            value={uploadForm.name}
            onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="לדוגמה: תכנית מטבח ראשונית"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            תיאור
          </label>
          <textarea
            value={uploadForm.description}
            onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="תאר את הסקיצה..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            קובץ סקיצה *
          </label>
          <input
            type="file"
            accept="image/*,.pdf,.dwg"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            פורמטים נתמכים: JPG, PNG, PDF, DWG
          </p>
        </div>

        {uploadForm.file && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              קובץ נבחר: {uploadForm.file.name}
            </p>
            <p className="text-xs text-blue-600">
              גודל: {(uploadForm.file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={isUploading || !uploadForm.file || !uploadForm.name.trim()}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isUploading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              מעלה...
            </div>
          ) : (
            'העלה סקיצה לגיטהאב'
          )}
        </button>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-2">💡 טיפים להעלאה:</h4>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• השתמש בשמות ברורים ותיאוריים</li>
          <li>• הוסף תיאור מפורט של הסקיצה</li>
          <li>• הקבצים יישמרו בגיטהאב ויהיו זמינים ללקוח</li>
          <li>• ניתן להעלות קבצי תמונה, PDF או קבצי DWG</li>
        </ul>
      </div>
    </div>
  );
}
