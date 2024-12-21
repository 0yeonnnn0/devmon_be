import express from "express";
import { processProblem } from "../controllers/boj.controller.js";
import { fetchHtml } from "../services/fetcher.service.js";

const router = express.Router();

console.log(" >>> 서버님 등장 <<<");

// POST /crawl
router.post("/", async (req, res) => {
  const { url } = req.body;

  console.log(`🥕🥕🥕 문제 URL : ${url}`);

  try {
    // 1. URL에서 HTML 문자열 가져오기
    const html = await fetchHtml(url);

    // 2. HTML에서 데이터 추출 및 해설 불러오기
    const result = await processProblem(html);
    console.log(`🥕🥕🥕 문제 해설: ${result.solution}`);

    const responseData = { url, data: result };
    return res.json(responseData);
  } catch (error) {
    console.error(`처리 중 오류 발생: ${error.message}`);
    return res.status(500).json({ error: "처리 중 오류 발생" });
  }
});

export default router;
