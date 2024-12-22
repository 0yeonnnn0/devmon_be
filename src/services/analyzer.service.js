import dotenv, { parse } from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 문제 해설 생성 함수
export const problemAnalysis = async (question, tag_name) => {
  const SYSTEM_PROMPT = `
You are a programming expert dedicated to assisting educators who are teaching programming to beginners. When provided with a coding test question, you MUST deliver a JSON-formatted response that includes ALL of the following:
{
  "required_algorithm": ${tag_name},
  "key_concepts": "A broader step-by-step explanation of theoretical concepts required for solving the problem.",
  "solution_approach": "A clear explanation of the reasoning and strategy behind solving the problem. Focus on why this approach is suitable.",
  "solution": {
    "pseudo_code": Pseudocode is an informal way to describe an algorithm. Please follow these rules:

            Variable Declaration: Specify the variables and their initial values.
                Example: Set count = 0

            Conditional Statements: Use IF, ELSE, ELSE IF to describe conditions.
                Example:
                IF (condition)
                    Do something
                ELSE
                    Do something else

            Loops: Use FOR, WHILE, etc., to describe repetitive tasks.
                Example:
                FOR each item in list
                    Do something

            Function Calls: Mention the function name along with its input and output.
                Example: Call function_name(input) -> result

            Input and Output: Clearly describe the input and output processes.
                Example:
                INPUT: User's age  
                OUTPUT: Eligibility status
            The pseudocode should be concise, properly indented, and include comments."
,
     "code": "Python code that implements the above pseudo_code. Include detailed comments for beginners to understand. Clearly demonstrate how each step of the pseudo_code is implemented in the actual code.",
  },
  "explain": "Output in Markdown format, starting with ## Step 1. A step-by-step breakdown of the code, explaining each line or function to clarify its purpose and functionality. Divide it into major Steps, and then break down each Step into smaller groups for explanation.",
  "time_complexity": "The time complexity of the solution, including both best-case and worst-case scenarios if applicable., Please do not explain"
}

Please ensure:
1. The code in the solution should be a simple string, not a code block with backticks
2. Avoid using special characters or line breaks that might break JSON formatting
3. Keep the response in VALID JSON format
4. Any backslashes (\) in the code must be escaped as \\\\
5. Line breaks should use two backslashes like \\n
6. Response should be in Korean


{
    "required_algorithm": "동적 프로그래밍",
    "key_concepts": "이 문제를 해결하기 위해서는 동적 프로그래밍의 기본 개념을 이해해야 합니다. 동적 프로그래밍은 큰 문제를 작은 문제로 나누어 해결하는 방법입니다. 이 문제에서는 각 위치에서 가져올 수 있는 사탕의 수를 계산하여 점진적으로 최대 사탕 수를 구하는 방식으로 접근합니다.",
    "solution_approach": "이 문제는 그리드 형태의 미로에서 이동할 수 있는 경로가 제한되어 있으므로, 각 위치에서 최대 사탕 수를 계산하기 위해 DP 테이블을 사용합니다. (i, j) 위치에서 가능한 이동 경로 (위, 왼쪽, 대각선 위 왼쪽)에서 가져온 사탕 수를 이용해 현재 위치에서의 최대 사탕 수를 업데이트합니다. 이 방법은 최적의 해를 보장하며, 각 셀을 한 번씩만 방문하므로 효율적입니다.",
    "solution": {
        "pseudo_code": "Set N, M = INPUT values\nCreate a 2D array dp of size (N+1) x (M+1) initialized to 0\nFOR i from 1 to N\n\tFOR j from 1 to M\n\t\tSet dp[i][j] = MAX(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + grid[i][j]\nOUTPUT dp[N][M]",
        "code": "N, M = map(int, input().split())\ngrid = [list(map(int, input().split())) for _ in range(N)]\ndp = [[0] * (M + 1) for _ in range(N + 1)]\n\nfor i in range(1, N + 1):\n    for j in range(1, M + 1):\n        dp[i][j] = max(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + grid[i-1][j-1]\n\nprint(dp[N][M])\n"
    },
    "explain": "## Step 1. 입력 받기\n첫 번째 줄에서 N과 M을 입력받아 미로의 크기를 설정합니다.\n\n## Step 2. 그리드와 DP 테이블 초기화\n그리드 배열을 N x M 크기로 생성하고, 각 방에 있는 사탕의 수를 입력받습니다.\nDP 테이블 dp를 (N+1) x (M+1) 크기로 0으로 초기화합니다. 이는 경계 조건을 쉽게 처리하기 위함입니다.\n\n## Step 3. DP 테이블 업데이트\n이중 FOR 루프를 통해 각 방에 대해 다음을 계산합니다:\n- dp[i][j] = MAX(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + grid[i-1][j-1]\n이 계산은 현재 방에서 위, 왼쪽, 대각선 위 왼쪽 방에서의 최대 사탕 수를 비교하여 결정됩니다.\n\n## Step 4. 결과 출력\n마지막으로 dp[N][M]을 출력하여 (N, M) 위치에서 가져올 수 있는 사탕의 최대 개수를 출력합니다.",
    "time_complexity": "O(N * M)"
}
`;
  const USER_PROMPT = `
    The title of the problem is ${question.title} and the problem description is as follows: ${question.description}.
    The input conditions for this problem are: ${question.input}.
    The output conditions for this problem are: ${question.output}.
    The example input for this problem is: ${question.example.input}.
    The example output for this problem is: ${question.example.output}.
    Please explain this problem in Korean.
    `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: USER_PROMPT },
      ],
      max_tokens: 5000,
      temperature: 0.7,
    });

    // 응답 데이터에서 content 가져오기
    const responseData = completion?.choices[0]?.message?.content;

    console.log("🥕🥕🥕 GPT 응답 (파싱 전):", responseData);

    try {
      const responseData = completion?.choices[0]?.message?.content;

      // 1. 응답이 이미 객체인 경우
      if (typeof responseData === "object") {
        return responseData;
      }

      // 2. 문자열 정리
      const cleanedString = responseData.trim();

      // 3. 직접 파싱 시도
      try {
        // 문자열이 이미 유효한 JSON인 경우
        if (cleanedString.startsWith("{") && cleanedString.endsWith("}")) {
          return JSON.parse(cleanedString);
        }
      } catch (initialError) {
        console.log("⚠️ 초기 파싱 실패, 문자열 정리 시도");

        // 4. 문자열 정리 후 다시 시도
        try {
          // 줄바꿈과 특수문자 처리
          const sanitizedString = cleanedString
            .replace(/\r?\n|\r/g, "") // 모든 줄바꿈 제거
            .replace(/\s+/g, " ") // 연속된 공백을 하나로
            .replace(/\\/g, "\\\\") // 백슬래시 이스케이프
            .replace(/"/g, '\\"') // 따옴표 이스케이프
            .trim(); // 앞뒤 공백 제거

          // JSON 형식 검증
          if (
            !sanitizedString.startsWith("{") ||
            !sanitizedString.endsWith("}")
          ) {
            throw new Error("Invalid JSON structure");
          }

          return JSON.parse(sanitizedString);
        } catch (error) {
          // 5. 마지막 시도: JSON.parse 대신 eval 사용
          try {
            const result = eval("(" + cleanedString + ")");
            if (typeof result === "object" && result !== null) {
              return result;
            }
          } catch (evalError) {
            console.error("❌ 모든 파싱 시도 실패");
            return { error: "GPT 응답 파싱 실패" };
          }
        }
      }
    } catch (error) {
      console.error("❌ GPT 요청 오류:", error.message);
      return { error: "GPT 요청 중 오류 발생" };
    }
  } catch (error) {
    console.error("GPT 요청 오류:", error.message);
    return { error: "GPT 요청 중 오류 발생" };
  }
};
