'use client';

import { useState } from 'react';
import SearchForm from '@/components/SearchForm';
import Results from '@/components/Results';

export default function Home() {
  const [searchResults, setSearchResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState({ step: '', percent: 0 });

  const handleSearch = async (destination: string) => {
    setLoading(true);
    setSearchResults(null);
    setProgress({ step: 'YouTube 영상 검색 중...', percent: 10 });

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Search failed');
      }

      setProgress({ step: '자막 수집 중...', percent: 40 });

      const data = await response.json();

      setProgress({ step: 'AI로 장소 추출 중...', percent: 70 });

      await new Promise(resolve => setTimeout(resolve, 1000));

      setProgress({ step: '완료!', percent: 100 });
      setSearchResults(data.data);
    } catch (error: any) {
      alert(error.message || '오류가 발생했습니다');
    } finally {
      setLoading(false);
      setProgress({ step: '', percent: 0 });
    }
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white mb-4">
          🌍 Go-Travel
        </h1>
        <p className="text-xl text-white/90">
          AI 기반 여행지 장소 추출기
        </p>
        <p className="text-white/75 mt-2">
          YouTube 영상에서 자동으로 장소 정보를 추출합니다
        </p>
      </div>

      <SearchForm
        onSearch={handleSearch}
        loading={loading}
        progress={progress}
      />

      {searchResults && (
        <Results
          results={searchResults}
        />
      )}
    </main>
  );
}
