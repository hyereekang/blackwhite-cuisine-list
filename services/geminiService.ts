
import { GoogleGenAI, Type } from "@google/genai";
import { RestaurantResponse } from "../types";

export const fetchRestaurants = async (): Promise<RestaurantResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const sourceUrl = "https://map.naver.com/p/search/%ED%9D%91%EB%B0%B1%20%EC%9A%94%EB%A6%AC%EC%82%AC?c=14.00,0,0,0,dh";
  
  const prompt = `
    [시스템 명령: 흑백요리사 2 성지순례 식당 리스트]
    당신은 '흑백요리사 시즌 2' 출연 셰프들의 식당 정보를 가장 정확하게 전달하는 큐레이터입니다.
    
    1. 'googleSearch' 도구를 사용하여 '흑백요리사 2 출연진 식당 리스트'를 검색하세요.
    2. 현재 대중적으로 가장 인기가 많고 추천되는 셰프들의 실제 식당 10곳을 선정하세요.
    3. 각 식당에 대해 다음 정보를 포함한 JSON을 생성하세요:
       - id: 1~10
       - name: 식당 이름
       - chef: 출연 셰프 이름 (별명 포함)
       - chefType: 'BLACK' (흑수저) 또는 'WHITE' (백수저)
       - specialty: 대표 메뉴 또는 요리 스타일
       - location: 식당의 실제 위치 (예: 서울 강남구)
       - description: 식당이나 셰프의 특징을 한 문장으로 설명 (지하철에서 읽기 좋게 핵심만)
       - keywords: 핵심 키워드 3개
       - naverMapUrl: 식당 이름으로 검색 가능한 네이버 지도 결과 링크 (또는 "${sourceUrl}")
    
    4. 반드시 한국어로 답변하며, JSON 형식으로만 응답하세요.
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
      lastUpdated: new Date().toLocaleDateString('ko-KR') + " 업데이트",
      sourceUrl: sourceUrl
    };
  } catch (error) {
    console.error("데이터 로드 실패:", error);
    throw error;
  }
};
