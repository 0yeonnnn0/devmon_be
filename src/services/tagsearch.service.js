import axios from "axios";

const getTag = async (url) => {
  const extractProblemNumber = (url) => {
    const regex = /problem\/(\d+)/; // 문제 번호를 추출하기 위한 정규 표현식
    const match = url.match(regex); // URL에서 정규 표현식 매칭
    return match ? match[1] : null; // 매칭된 문제 번호 반환, 없으면 null 반환
  };

  const problemId = extractProblemNumber(url);

  try {
    const result = await axios.get(
      `https://solved.ac/api/v3/problem/show?problemId=${problemId}`
    );
    console.log(`🥕🥕🥕 태그 조회 성공: ${result.data.tags[0].bojTagId}`);

    const tagName = result.data.tags[0].displayNames;
    const filteredData = tagName.filter((item) => item.language === "ko");
    console.log(`🥕🥕🥕 태그 이름:`, filteredData[0].name);

    return {
      boj_tag_id: result.data.tags[0].bojTagId,
      tag_name: filteredData[0].name,
    };
  } catch (error) {
    console.error(`🥕🥕🥕 태그 조회 실패: ${error.message}`);
    throw error;
  }
};

export default getTag;
