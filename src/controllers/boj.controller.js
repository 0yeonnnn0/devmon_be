import { parseHtmlBOJ } from "../services/parser.service.js";
import { problemAnalysis } from "../services/analyzer.service.js";

// 문제 받아오기 및 OpenAI API 요청 처리
export const processProblem = async (html) => {
  try {
    // 문제 텍스트 추출
    const data = parseHtmlBOJ(html);

    // OpenAI API 요청
    const analysis = await problemAnalysis(data);
    console.log(`🥕🥕🥕 OpenAI API 요청 완료 🥕🥕🥕`);

    return analysis;
  } catch (error) {
    console.error(`처리 중 오류 발생: ${error.message}`);
    throw new Error("문제 처리 실패");
  }
};
