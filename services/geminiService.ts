import { GoogleGenAI, Type } from "@google/genai";
import { RestaurantResponse } from "../types";

export const fetchRestaurants = async (): Promise<RestaurantResponse> => {
  // Use the API key exclusively from process.env.API_KEY as per guidelines
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("API_KEY is missing. Please ensure it is set in the environment variables.");
    throw new Error("API_KEY_MISSING");
  }

  // Create instance right before use
  const ai = new GoogleGenAI({ apiKey });
  const sourceUrl = "https://map.naver.com/p/search/%ED%9D%91%EB%B0%B1%20%EC%9A%94%EB%A6%AC%EC%82%AC";
  
  const prompt = `
    [성지순례 가이드 생성]
    넷플릭스 '흑백요리사: 요리 계급 전쟁' 시즌 2에 출연한 셰프들이 실제로 운영하는 식당 10곳을 찾아주세요.
    
    1. 'googleSearch'를 활용하여 셰프들의 실명과 현재 운영 중인 식당의 정확한 명칭을 확인하세요.
    2. '백수저'와 '흑수저' 셰프를 골고루 포함하세요.
    3. 각 식당에 대해 다음 정보를 추출하세요:
       - name: 식당 정식 명칭
       - chef: 셰프 이름 (예: 안성재, 최강록 등 시즌 2 관련 인물)
       - chefType: 'WHITE' (백수저/유명 셰프) 또는 'BLACK' (흑수저/도전자)
       - specialty: 대표 메뉴 또는 요리 스타일
       - location: 주소 (구/동 단위까지 포함)
       - description: 식당의 매력 포인트 (한 문장)
       - keywords: 분위기, 웨이팅 팁 등 관련 키워드 3개
       - naverMapUrl: 네이버 지도에서 해당 식당을 검색할 수 있는 링크
    
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
                required: ["name", "chef", "chefType", "specialty", "location", "description", "keywords", "naverMapUrl"]
              }
            }
          },
          required: ["restaurants"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    const result = JSON.parse(text);
    
    // Add IDs if missing and format last updated
    const formattedRestaurants = result.restaurants.map((r: any, idx: number) => ({
      ...r,
      id: r.id || idx + 1
    }));
    
    return {
      restaurants: formattedRestaurants,
      lastUpdated: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) + " 업데이트",
      sourceUrl: sourceUrl
    };
  } catch (error) {
    console.error("Gemini API Error details:", error);
    throw error;
  }
};