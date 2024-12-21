import { JSDOM } from "jsdom";

// HTML 데이터 파싱
export const parseHtmlBOJ = (html) => {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  console.log(`🥕🥕🥕 문제 HTML 파싱 완료`);

  // 제목과 메타 설명 추출
  const title = document.querySelector("title")?.textContent || "No Title";
  const descriptionDiv = document.querySelector("#problem_description");
  const inputDiv = document.querySelector("#problem_input");
  const outputDiv = document.querySelector("#problem_output");

  const descriptionText = getText(descriptionDiv);
  const inputText = getText(inputDiv);
  const outputText = getText(outputDiv);

  // 결과 확인
  console.log("🥕🥕🥕 파싱된 데이터:", {
    title,
  });

  return {
    title,
    description: descriptionText,
    input: inputText,
    output: outputText,
  };
};

// HTML 데이터에서 텍스트만 가져옴
const getText = (div) => {
  return div?.textContent.trim() || "No Description";
};

export const parseRelatedProblem = (html) => {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const problemIds = Array.from(
    document.querySelectorAll(".list_problem_id")
  ).map((element) => element.textContent.trim());

  const randomProblems = problemIds
    .sort(() => Math.random() - 0.5) // 배열 랜덤 정렬
    .slice(0, 5); // 첫 5개 선택

  console.log("🥕🥕🥕 랜덤 문제 리스트: ", randomProblems);

  return randomProblems;
};
