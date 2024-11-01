import { useKakaoLoader as useKakaoLoaderOrigin } from "react-kakao-maps-sdk"

const useKakaoLoader = () => {
    

        const loaded = useKakaoLoaderOrigin({
          
          appkey: "901fd1648461594b0c964018195d06b2" ,
          libraries: ["clusterer", "drawing", "services"],
        });

        console.log("Kakao Maps API loaded:", loaded);
        return loaded; // 로드 여부 반환

}

export default useKakaoLoader