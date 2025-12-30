
import { RestaurantResponse } from "../types";

/**
 * API 호출 없이 가산디지털단지 맛집 데이터를 즉시 반환합니다.
 */
export const fetchRestaurants = async (): Promise<RestaurantResponse> => {
  // 인위적인 로딩 체감을 위해 짧은 지연시간을 둡니다.
  await new Promise((resolve) => setTimeout(resolve, 800));

  const staticContent = `가산디지털단지역 주변은 수많은 직장인들이 밀집해 있어 가성비와 맛을 모두 잡은 식당들이 많습니다. 구글 맵 데이터를 기반으로 가장 평점이 높고 인기 있는 곳들을 선정했습니다.

1. **가산물갈비 백년불고기**
가산을 대표하는 산더미 물갈비 맛집입니다. 매콤한 국물과 압도적인 비주얼의 고기가 특징이며, 퇴근 후 회식 장소로 부동의 1위를 지키고 있습니다.

2. **춘천옥**
수십 년 전통의 보쌈과 막국수 전문점입니다. 부드러운 고기와 깔끔한 밑반찬, 그리고 새콤달콤한 막국수의 조합이 일품이라 점심 시간에도 대기가 필수인 곳입니다.

3. **텐마루**
가산에서 손꼽히는 정통 일식 텐동 맛집입니다. 바삭한 튀김의 퀄리티가 매우 높으며, 혼밥하기 좋은 바 좌석이 있어 직장인들에게 인기가 많습니다.

4. **두껍삼 가산점**
숙성 삼겹살의 진수를 보여주는 곳입니다. 전문가가 직접 고기를 구워주어 편하게 식사할 수 있으며, 고기의 육즙과 풍미가 남달라 직장인들의 선호도가 매우 높습니다.

5. **월래순교자관**
최자로드에 소개되어 더욱 유명해진 만두 전문점입니다. 소룡포와 군만두의 육즙이 환상적이며, 합리적인 가격에 정통 중식을 즐길 수 있는 성지 같은 곳입니다.`;

  const staticSources = [
    { title: "가산물갈비 백년불고기", uri: "https://www.google.com/maps/search/가산물갈비+백년불고기" },
    { title: "춘천옥", uri: "https://www.google.com/maps/search/춘천옥+가산" },
    { title: "텐마루", uri: "https://www.google.com/maps/search/텐마루+가산" },
    { title: "두껍삼 가산점", uri: "https://www.google.com/maps/search/두껍삼+가산점" },
    { title: "월래순교자관", uri: "https://www.google.com/maps/search/월래순교자관" }
  ];

  return {
    content: staticContent,
    lastUpdated: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
    sources: staticSources
  };
};
