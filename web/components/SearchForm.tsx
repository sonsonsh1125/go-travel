'use client';

import { useState } from 'react';

interface SearchFormProps {
  onSearch: (destination: string) => void;
  loading: boolean;
  progress: { step: string; percent: number };
}

export default function SearchForm({ onSearch, loading, progress }: SearchFormProps) {
  const [destination, setDestination] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (destination.trim() && !loading) {
      onSearch(destination.trim());
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="destination" className="block text-lg font-semibold text-gray-700 mb-2">
            여행지를 입력하세요
          </label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="예: 교토, 오사카, 파리, 방콕"
            disabled={loading}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <p className="text-sm text-gray-500 mt-2">
            검색할 여행지를 입력하면 YouTube에서 관련 영상을 찾아 장소를 추출합니다
          </p>
        </div>

        <button
          type="submit"
          disabled={loading || !destination.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-lg"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              검색 중...
            </span>
          ) : (
            '🔍 검색 시작'
          )}
        </button>

        {loading && progress.step && (
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full transition-all duration-300"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
            <p className="text-center text-sm text-gray-600">{progress.step}</p>
          </div>
        )}
      </form>
    </div>
  );
}
