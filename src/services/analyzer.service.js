import dotenv, { parse } from "dotenv";
import OpenAI from "openai";

dotenv.config();

// const SYSTEM_PROMPT = `
// You are a programming expert dedicated to assisting educators who are teaching programming to beginners. When provided with a coding test question, you will deliver a JSON-formatted response that includes:
// {
//   "required_algorithm": "The name of the data structure or algorithm needed to solve the problem, such as BFS, DFS, sorting, or dynamic programming.",
//   "key_concepts": "A broader explanation of theoretical concepts required for solving the problem.",
//   "solution_approach": "A clear explanation of the reasoning and strategy behind solving the problem. Focus on why this approach is suitable.",
//   "solution": {
//     "code": "Python code that solves the problem, complete with detailed comments to ensure readability and understanding for beginners."
//   },
//   "explain": "A step-by-step breakdown of the code, explaining each line or function to clarify its purpose and functionality.",
//   "time_complexity": "The time complexity of the solution, including both best-case and worst-case scenarios if applicable."
// }
// Maintain a supportive and educational tone, ensuring that even those new to programming can follow your explanations.
// `;

const SYSTEM_PROMPT = `
You are a programming expert dedicated to assisting educators who are teaching programming to beginners. When provided with a coding test question, you will deliver a JSON-formatted response that includes:
{
  "required_algorithm": "알고리즘 이름",
  "key_concepts": "필요한 이론적 개념 설명",
  "solution_approach": "문제 해결 전략 설명",
  "solution": {
    "language": "python",
    "code": "print('Hello World')"
  },
  "explain": "코드 설명",
  "time_complexity": "시간 복잡도 설명"
}

Please ensure:
1. The code in the solution should be a simple string, not a code block with backticks
2. Avoid using special characters or line breaks that might break JSON formatting
3. Keep the response in valid JSON format
`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 문제 해설 생성 함수
export const problemAnalysis = async (question) => {
  const USER_PROMPT = `
문제의 제목은 ${question.title}이고 문제의 내용은 다음과 같아: ${question.description}.
이 문제의 입력 조건은 다음과 같아: ${question.input}.
이 문제의 출력 조건은 다음과 같아: ${question.output}.
이 문제를 한국어로 해설해줘.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: USER_PROMPT },
      ],
      max_tokens: 5000,
      temperature: 1.0,
    });

    // 응답 데이터에서 content 가져오기
    const responseData = completion?.choices[0]?.message?.content;
    console.log("🥕🥕🥕 GPT 응답:", JSON.stringify(responseData, null, 2));

    if (!responseData) {
      throw new Error("OpenAI 응답에서 message.content를 찾을 수 없습니다.");
    }

    const parsedData = JSON.parse(responseData);

    if (
      parsedData.solution?.code &&
      !parsedData.solution.code.includes("```")
    ) {
      parsedData.solution.code = `\`\`\`${
        parsedData.solution.language || "python"
      }\n${parsedData.solution.code}\n\`\`\``;
    }
    return parsedData;

    // // const result = responseData.replace(/"""/g, '"');
    // const result = responseData
    //   .replace(/```python\n/g, "")
    //   .replace(/```/g, "")
    //   .replace(/\n/g, "\\n")
    //   .replace(/"""/g, '"');

    // return result;
  } catch (error) {
    console.error("GPT 요청 오류:", error.message);
    return { error: "GPT 요청 중 오류 발생" };
  }
};
