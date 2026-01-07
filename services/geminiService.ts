
import { GoogleGenAI } from "@google/genai";
import { UserPreferences, TravelRecommendationResponse, GroundingSource } from "../types";

export const getTravelRecommendations = async (prefs: UserPreferences): Promise<TravelRecommendationResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    사용자의 여행 취향:
    - 분위기: ${prefs.vibe}
    - 예산: ${prefs.budget}
    - 동행: ${prefs.companion}
    - 선호 거리: ${prefs.distance}
    ${prefs.location ? `- 기준 위치: 위도 ${prefs.location.latitude}, 경도 ${prefs.location.longitude}` : ''}

    다음 4가지 섹션에 맞춰 최고의 여행 정보를 큐레이션해줘:

    1. 🍽️ 맛집 (CatchTable, Tabling 예약 가능 여부, 배민/쿠팡이츠 배달 팁 포함)
    2. 🎨 로컬 감성 (장인 공방, 숨겨진 소품샵, 감성 카페)
    3. 🚗 인프라 (감성 숙소, 렌트카/교통편, 주차 팁)
    4. 👕 스타일 & 날씨 (현재 현지 날씨와 그에 맞는 현지인 스타일링 제안)

    반드시 각 장소나 서비스의 공식 페이지 또는 예약 링크(캐치테이블 등)를 포함해줘.
    현지 날씨와 옷차림은 실시간 검색 정보를 바탕으로 구체적으로 알려줘.
  `;

  const response = await ai.models.generateContent({
    // Maps grounding is only supported in Gemini 2.5 series models.
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }, { googleMaps: {} }],
      toolConfig: {
        retrievalConfig: {
          latLng: prefs.location ? {
            latitude: prefs.location.latitude,
            longitude: prefs.location.longitude
          } : undefined
        }
      }
    },
  });

  const text = response.text || "";
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  const sources = groundingChunks
    .map((chunk: any) => {
      if (chunk.maps) return { title: chunk.maps.title, uri: chunk.maps.uri };
      if (chunk.web) return { title: chunk.web.title, uri: chunk.web.uri };
      return null;
    })
    // Fix: Added GroundingSource to imports to resolve the missing type reference here.
    .filter((source): source is GroundingSource => source !== null);

  return {
    content: text,
    sources: sources
  };
};
