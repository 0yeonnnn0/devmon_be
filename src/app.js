import express from "express";
import cors from "cors";
import crawlRoutes from "./routes/crawl.route.js";

const app = express();
const PORT = 8080;

// CORS 설정 (FastAPI의 CORS 설정을 Express로 변환)
app.use(
  cors({
    origin: "*", // 모든 출처 허용
    credentials: true, // 쿠키 전송 허용
    methods: ["GET", "POST", "PUT", "DELETE"], // 모든 HTTP 메서드 허용
    allowedHeaders: ["Content-Type", "Authorization"], // 모든 HTTP 헤더 허용
  })
);

// JSON 요청 본문 처리
app.use(express.json());

// 기본 라우트
app.get("/", (req, res) => {
  res.json({ message: "Welcome to devmon!" });
});

// API 라우트 등록
app.use("/crawl", crawlRoutes); // FastAPI의 app.include_router(router)에 해당

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
