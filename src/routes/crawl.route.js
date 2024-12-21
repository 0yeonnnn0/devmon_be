import express from "express";
import { processProblem } from "../controllers/boj.controller.js";
import { fetchHtml } from "../services/fetcher.service.js";
import getTag from "../services/tagsearch.service.js";
import getRelatedProblem from "../controllers/bojRelatedProblem.controller.js";

const router = express.Router();

console.log(" >>> 서버님 등장 <<<");

// POST /crawl
router.post("/", async (req, res) => {
  const { url } = req.body;

  console.log(`🥕🥕🥕 문제 URL : ${url}`);

  try {
    // 1. URL에서 HTML 문자열 가져오기
    const html = await fetchHtml(url);

    const { boj_tag_id, tag_name } = await getTag(url);
    console.log(`🥕🥕🥕 문제 태그: `, boj_tag_id);

    // 2. HTML에서 데이터 추출 및 해설 불러오기
    const result = await processProblem(html);
    console.log(`🥕🥕🥕 문제 해설:`, result.solution);

    // 3. 관련 문제 불러오기
    const related_problem = await getRelatedProblem(boj_tag_id);
    console.log(`🥕🥕🥕 관련 문제:`, related_problem);

    const responseData = { url, data: result, tag_name, related_problem };
    return res.json(responseData);
  } catch (error) {
    console.error(`처리 중 오류 발생: ${error.message}`);
    return res.status(500).json({ error: "처리 중 오류 발생" });
  }
});

export default router;
