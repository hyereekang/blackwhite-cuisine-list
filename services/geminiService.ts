import { GoogleGenAI } from "@google/genai";
import { RestaurantResponse } from "../types";

export const fetchRestaurants = async (): Promise<RestaurantResponse> => {
  // Use gemini-2.5-flash as it's the required model for Google Maps grounding tools.
  // This model is available in the free tier of Google AI Studio.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const prompt = `가산디지털단지역(Gasan Digital Complex Station) 근처에서 직장인들에게 사랑받는 최고의 맛집 5곳을 찾아줘.
    구글 지도를 기반으로 실제 존재하는 장소여야 하며, 각 식당의 위치(구글 맵 링크)를 포함해서 알려줘.
    직장인들이 좋아하는 이유와 추천 메뉴도 짧게 설명해줘.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        // responseMimeType: "application/json" is NOT allowed when using the googleMaps tool.
      }
    });

    const text = response.text || "맛집 정보를 불러올 수 없습니다.";
    
    // Extract grounding chunks specifically for Maps URIs.
    // The model uses these chunks to cite its sources.
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter((chunk: any) => chunk.maps && chunk.maps.uri)
      .map((chunk: any) => ({
        title: chunk.maps.title || "지도 확인",
        uri: chunk.maps.uri
      }));

    // Remove potential duplicates by title
    const uniqueSources = Array.from(new Map(sources.map(item => [item.title, item])).values());
    
    return {
      content: text,
      lastUpdated: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
      sources: uniqueSources
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};