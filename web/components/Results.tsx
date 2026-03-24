'use client';

interface ResultsProps {
  results: {
    destination: string;
    videos: any[];
    transcripts: any[];
    places: any[];
  };
}

export default function Results({ results }: ResultsProps) {
  const { destination, videos, transcripts, places } = results;

  // Generate Google Maps search URL
  const getGoogleMapsUrl = (placeName: string, destination: string) => {
    const query = encodeURIComponent(`${placeName} ${destination}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          📊 "{destination}" 검색 결과
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
            <div className="text-sm text-purple-600 font-semibold mb-1">검색한 영상</div>
            <div className="text-4xl font-bold text-purple-700">{videos.length}</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl">
            <div className="text-sm text-indigo-600 font-semibold mb-1">자막 수집</div>
            <div className="text-4xl font-bold text-indigo-700">{transcripts.length}</div>
          </div>
          <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl">
            <div className="text-sm text-pink-600 font-semibold mb-1">추출된 장소</div>
            <div className="text-4xl font-bold text-pink-700">{places.length}</div>
          </div>
        </div>
      </div>

      {/* All Places */}
      {places.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">
              📍 추출된 모든 장소 ({places.length}개)
            </h3>
            <div className="text-sm text-gray-500">
              언급 횟수 기준 정렬
            </div>
          </div>
          <div className="space-y-4">
            {places.map((place, index) => (
              <div
                key={index}
                className="border-l-4 border-purple-600 bg-gray-50 p-4 rounded-r-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-gray-400">
                        #{index + 1}
                      </span>
                      <h4 className="text-xl font-semibold text-gray-800">
                        {place.name}
                      </h4>
                      <span className="px-3 py-1 bg-purple-600 text-white text-sm font-semibold rounded-full">
                        {place.category}
                      </span>
                      <a
                        href={getGoogleMapsUrl(place.name, destination)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-full transition-colors"
                        title="구글 지도에서 보기"
                      >
                        📍 지도
                      </a>
                    </div>
                    <p className="text-gray-600 mb-2">{place.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="text-purple-600 font-semibold">
                        🔥 {place.mentionCount}개 영상에서 언급
                      </div>
                      {place.videoTitles && place.videoTitles.length > 0 && (
                        <div className="text-gray-500">
                          📹 {place.videoTitles.slice(0, 2).join(', ')}
                          {place.videoTitles.length > 2 && ` 외 ${place.videoTitles.length - 2}개`}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
