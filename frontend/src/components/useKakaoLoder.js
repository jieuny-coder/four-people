import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk"

const useKakaoLoader = () => {
    

        const loaded = useKakaoLoaderOrigin({
          
          appkey: process.env.REACT_APP_MAP_KAKAOMAPS_PARKING,
          libraries: ["clusterer", "drawing", "services"],
        });

        console.log("Kakao Maps API loaded:", loaded);
        return loaded; // 로드 여부 반환

}

export default useKakaoLoader