import axios from "axios";

export const fetchHtml = async (url) => {
  try {
    // HTTP 요청 헤더 설정
    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
    };

    // HTTP GET 요청
    const response = await axios.get(url, { headers });

    // 요청 실패 시 에러 발생
    if (response.status !== 200) {
      throw new Error(`HTTP 요청 실패: ${response.status}`);
    }

    // HTML 반환
    return response.data;
  } catch (error) {
    console.error(`HTML 가져오기 실패: ${error.message}`);
    throw error;
  }
};
