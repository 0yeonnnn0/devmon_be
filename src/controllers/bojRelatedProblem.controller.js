import { fetchHtml } from "../services/fetcher.service.js";
import { parseRelatedProblem } from "../services/parser.service.js";

const getRelatedProblem = async (tagNumber) => {
  // 관련 문제 페이지
  const html = await fetchHtml(
    `https://www.acmicpc.net/problemset?sort=ac_desc&algo=${tagNumber}`
  );

  // 그 중 랜덤한 문제 5개 불러오기
  const problemList = parseRelatedProblem(html);

  return problemList;
};

export default getRelatedProblem;
