
import { GoogleGenAI, Type } from "@google/genai";
import { RestaurantResponse } from "../types";

export const fetchRestaurants = async (): Promise<RestaurantResponse> => {
  // Use the API key directly from process.env.API_KEY as injected by the platform.
  // We instantiate right before the call to pick up the most current key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  const sourceUrl = "https://map.naver.com/p/search/%ED%9D%91%EB%B0%B1%20%EC%9A%94%EB%A6%AC%EC%82%AC";
  
  const prompt = `
    [성지순례 가이드 생성]
    넷플릭스 '흑백요리사: 요리 계급 전쟁' 시즌 2에 출연한 셰프들이 실제로 운영하는 식당 10곳을 찾아주세요.
    
    1. 'googleSearch' 도구를 반드시 사용하여 최신 데이터를 확인하세요.
    2. '백수저'와 '흑수저' 셰프를 골고루 포함하세요.
    3. 각 식당에 대해 다음 정보를 추출하세요:
       - name: 식당 정식 명칭
       - chef: 셰프 이름
       - chefType: 'WHITE' (백수저) 또는 'BLACK' (흑수저)
       - specialty: 대표 메뉴 또는 요리 스타일
       - location: 주소 (구/동 단위까지)
       - description: 식당의 매력 포인트 (한 문장)
       - keywords: 분위기, 웨이팅 팁 등 관련 키워드 3개
       - naverMapUrl: 네이버 지도 검색 결과 링크
    
    응답은 반드시 한국어로 작성하며, JSON 스키마를 엄격히 따르세요.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview", 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            restaurants: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  chef: { type: Type.STRING },
                  chefType: { type: Type.STRING, enum: ['BLACK', 'WHITE'] },
                  specialty: { type: Type.STRING },
                  location: { type: Type.STRING },
                  description: { type: Type.STRING },
                  keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  naverMapUrl: { type: Type.STRING }
                },
                required: ["name", "chef", "chefType", "specialty", "location", "description", "keywords", "naverMapUrl"]
              }
            }
          },
          required: ["restaurants"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("AI 응답이 비어있습니다.");
    
    const result = JSON.parse(text);
    const formattedRestaurants = result.restaurants.map((r: any, idx: number) => ({
      ...r,
      id: idx + 1
    }));
    
    // Extract grounding chunks as required by Gemini API guidelines for search grounding
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources = groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || "검색 출처",
      uri: chunk.web?.uri
    })).filter((s: any) => s.uri) || [];
    
    return {
      restaurants: formattedRestaurants,
      lastUpdated: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) + " 업데이트",
      sourceUrl: sourceUrl,
      sources: sources
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
