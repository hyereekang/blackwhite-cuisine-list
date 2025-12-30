import { GoogleGenAI, Type } from "@google/genai";
import { RestaurantResponse } from "../types";

export const fetchRestaurants = async (): Promise<RestaurantResponse> => {
  // 가이드라인: 반드시 process.env.API_KEY를 직접 사용해야 합니다.
  // 배포 환경의 환경 변수 설정에서 API_KEY가 등록되어 있어야 합니다.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.error("Critical: API_KEY is missing in process.env. Please check your deployment environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: apiKey as string });
  const sourceUrl = "https://map.naver.com/p/search/%ED%9D%91%EB%B0%B1%20%EC%9A%94%EB%A6%AC%EC%82%AC";
  
  const prompt = `
    [시스템 명령: 흑백요리사 2 성지순례 데이터 생성]
    당신은 '흑백요리사 시즌 2' 출연 셰프들이 운영하는 식당 정보를 제공하는 미식 가이드입니다.
    
    1. 'googleSearch' 도구를 사용하여 '흑백요리사 2 출연진 실제 운영 식당 목록'을 검색하세요.
    2. 현재 화제가 되고 있는 셰프들의 실제 식당 10곳을 선정하세요.
    3. 각 식당에 대해 다음 정보를 포함한 JSON을 생성하세요:
       - id: 1~10
       - name: 정확한 식당 이름
       - chef: 셰프 이름 및 프로그램 내 별칭
       - chefType: 'BLACK' (흑수저) 또는 'WHITE' (백수저)
       - specialty: 대표 요리 한 줄
       - location: 구체적인 지역 (예: 서울 강남구)
       - description: 식당의 특징 (1문장)
       - keywords: 핵심 키워드 3개
       - naverMapUrl: 네이버 지도 검색 URL 또는 "${sourceUrl}"
    
    반드시 한국어로 답변하며, 다른 설명 없이 유효한 JSON 형식으로만 응답하세요.
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
                  id: { type: Type.NUMBER },
                  name: { type: Type.STRING },
                  chef: { type: Type.STRING },
                  chefType: { type: Type.STRING, enum: ['BLACK', 'WHITE'] },
                  specialty: { type: Type.STRING },
                  location: { type: Type.STRING },
                  description: { type: Type.STRING },
                  keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
                  naverMapUrl: { type: Type.STRING }
                },
                required: ["id", "name", "chef", "chefType", "specialty", "location", "description", "keywords", "naverMapUrl"]
              }
            }
          },
          required: ["restaurants"]
        }
      }
    });

    const result = JSON.parse(response.text || '{"restaurants": []}');
    
    return {
      restaurants: result.restaurants,
      lastUpdated: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) + " 업데이트",
      sourceUrl: sourceUrl
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};