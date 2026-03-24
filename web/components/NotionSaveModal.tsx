'use client';

import { useState } from 'react';

interface NotionSaveModalProps {
  places: any[];
  destination: string;
  onClose: () => void;
}

export default function NotionSaveModal({ places, destination, onClose }: NotionSaveModalProps) {
  const [notionApiKey, setNotionApiKey] = useState('');
  const [notionDatabaseId, setNotionDatabaseId] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!notionApiKey.trim() || !notionDatabaseId.trim()) {
      alert('Notion API Key와 Database ID를 입력해주세요');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch('/api/save-to-notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          places,
          destination,
          notionApiKey: notionApiKey.trim(),
          notionDatabaseId: notionDatabaseId.trim(),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save');
      }

      const data = await response.json();
      alert(`성공! ${data.data.savedCount}개의 장소를 Notion에 저장했습니다.`);
      onClose();
    } catch (error: any) {
      alert(error.message || 'Notion 저장 중 오류가 발생했습니다');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Notion에 저장하기</h2>
            <p className="text-gray-600 mt-1">{places.length}개의 장소를 Notion 데이터베이스에 저장합니다</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="notion-api-key" className="block text-sm font-semibold text-gray-700 mb-2">
              Notion API Key
            </label>
            <input
              type="password"
              id="notion-api-key"
              value={notionApiKey}
              onChange={(e) => setNotionApiKey(e.target.value)}
              placeholder="secret_xxxxxxxxxxxxx"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
            />
            <p className="text-sm text-gray-500 mt-1">
              <a href="https://www.notion.so/my-integrations" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                Notion Integrations
              </a>에서 발급받으세요
            </p>
          </div>

          <div>
            <label htmlFor="notion-db-id" className="block text-sm font-semibold text-gray-700 mb-2">
              Notion Database ID
            </label>
            <input
              type="text"
              id="notion-db-id"
              value={notionDatabaseId}
              onChange={(e) => setNotionDatabaseId(e.target.value)}
              placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
            />
            <p className="text-sm text-gray-500 mt-1">
              Notion 데이터베이스 URL에서 ID를 복사하세요
            </p>
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 font-semibold mb-2">⚠️ 필수 데이터베이스 속성</p>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• <strong>name</strong> (Title)</li>
              <li>• <strong>category</strong> (Select)</li>
              <li>• <strong>destination</strong> (Select)</li>
              <li>• <strong>mention count</strong> (Number)</li>
              <li>• <strong>description</strong> (Text)</li>
              <li>• <strong>mentioned videos</strong> (Text)</li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                저장 중...
              </span>
            ) : (
              '저장하기'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
