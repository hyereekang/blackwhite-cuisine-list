
import { GoogleGenAI } from "@google/genai";
import { RestaurantResponse } from "../types";

export const fetchRestaurants = async (): Promise<RestaurantResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  // prompt specifically for Gasan Digital Complex area
  const prompt = `가산디지털단지역(Gasan Digital Complex Station) 주변에서 직장인들에게 인기 있는 맛집 5곳을 추천해줘. 
    구글 맵(Google Maps) 정보를 바탕으로 각 식당의 특징, 주력 메뉴, 그리고 분위기를 상세히 설명해줘.
    응답은 가독성이 좋은 마크다운 형식으로 작성해줘.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }, { googleSearch: {} }],
        // Note: responseMimeType: "application/json" and responseSchema are NOT allowed with googleMaps tool.
      }
    });

    const text = response.text || "맛집 정보를 불러올 수 없습니다.";
    
    // Extract grounding chunks for Maps and Web links as required by guidelines
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks.map((chunk: any) => {
      if (chunk.maps) {
        return {
          title: chunk.maps.title || "구글 맵 지점",
          uri: chunk.maps.uri
        };
      } else if (chunk.web) {
        return {
          title: chunk.web.title || "관련 정보",
          uri: chunk.web.uri
        };
      }
      return null;
    }).filter((s: any) => s !== null && s.uri);
    
    return {
      content: text,
      lastUpdated: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) + " 업데이트",
      sources: sources
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
