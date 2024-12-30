import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 문제 해설 생성 함수
export const problemAnalysis = async (question, tag_name) => {
  const PROMPT = `
  You are a programming expert dedicated to assisting educators who are teaching programming to beginners. When provided with a coding test question, you MUST deliver a JSON-formatted response that includes ALL of the following:
  {
    "required_algorithm": ${tag_name},
    "algorithm_concept": "Please briefly explain the required_algorithm.",
    "solution_approach": "A clear, step-by-step explanation of the reasoning and strategy behind solving the problem. Focus on why this approach is suitable. Use Chain-of-Thought to explain the process logically.",
    "solution": {
      "pseudo_code": "Pseudocode should be concise, properly indented, and include comments. Follow these rules:\\n
          - Variable Declaration: Set variable = value\\n
          - Conditional Statements: IF/ELSE/ELSE IF\\n
          - Loops: FOR/WHILE with clear iteration\\n
          - Function Calls: Call function_name(input) -> result\\n
          - Input/Output: Clearly mark INPUT/OUTPUT",
      "code": "Python code that implements the above pseudo_code with detailed comments"
    },
    "explain": "Output in Markdown format, starting with ## Step 1. A detailed step-by-step explanation of the code.",
    "time_complexity": "Time complexity without explanation"
  }
  
  RESPONSE FORMAT RULES:
  1. Code should be a simple string, not a code block
  2. Avoid special characters or line breaks that might break JSON
  3. Keep response in VALID JSON format
  4. Escape backslashes as \\\\
  5. Use \\n for line breaks
  6. Response should be in Korean
  7. Use 4 spaces for indentation
  
  The title of the problem is ${question.title}
  Problem description: ${question.description}
  Input conditions: ${question.input}
  Output conditions: ${question.output}
  Example input: ${question.example.input}
  Example output: ${question.example.output}
  ${question.limit ? `Limitations: ${question.limit}` : ""}
  
  Please explain this problem in Korean and provide a solution following the format above.

Here is an example of the response format:

Example 1:
{
  "required_algorithm": "다이나믹 프로그래밍",
  "algorithm_concept": "다이나믹 프로그래밍(DP)은 문제를 더 작은 하위 문제로 나누어 각 하위 문제를 한 번만 해결하고 그 결과를 저장하여 미래에 재사용하는 방법입니다. 이 기법은 겹치는 하위 문제를 통해 해결할 수 있는 최적화 문제에 특히 유용합니다. DP는 이전에 계산된 결과를 저장하는 테이블이나 메모이제이션을 사용하여 중복 계산을 줄이고 효율성을 향상시킵니다.",
  "solution_approach": "이 문제는 DP 테이블을 사용하여 각 숫자에 대해 최소 연산 횟수를 저장합니다. 초기 상태(1)에서 시작하여 주어진 숫자 N까지 계산하는 방식으로 진행됩니다. 단계적으로 다음과 같은 방식으로 접근합니다:\\n\\n1. DP 테이블 초기화: dp[0]부터 dp[N]까지의 배열을 생성하고, dp[1]은 0으로 초기화합니다. 이는 1에 도달하는 데 필요한 연산 횟수가 없음을 의미합니다.\\n2. 연산 적용: 2부터 N까지 각 숫자에 대해, 가능한 연산을 적용하여 dp 값을 업데이트합니다. 이를 통해 각 숫자에 도달하는 데 필요한 최소 연산 횟수를 계산합니다.\\n3. 최종 값 반환: dp[N]을 출력하여 N을 1로 만들기 위한 최소 연산 횟수를 확인합니다.",
  "solution": {
    "pseudo_code": "Set N = INPUT value // 정수 N\\nCreate an array dp of size N+1\\nSet dp[1] = 0 // 1로 만들기 위한 연산 횟수 초기화\\nFOR i from 2 to N\\n\\tSet dp[i] = dp[i-1] + 1 // 1을 빼는 경우\\n\\tIF (i % 2 == 0)\\n\\t\\tSet dp[i] = MIN(dp[i], dp[i // 2] + 1) // 2로 나누는 경우\\n\\tIF (i % 3 == 0)\\n\\t\\tSet dp[i] = MIN(dp[i], dp[i // 3] + 1) // 3으로 나누는 경우\\nOUTPUT dp[N]",
    "code": "N = int(input())\\ndp = [0] * (N + 1)\\ndp[1] = 0\\n\\nfor i in range(2, N + 1):\\n    dp[i] = dp[i - 1] + 1  # 1을 빼는 경우\\n    if i % 2 == 0:\\n        dp[i] = min(dp[i], dp[i // 2] + 1)  # 2로 나누는 경우\\n    if i % 3 == 0:\\n        dp[i] = min(dp[i], dp[i // 3] + 1)  # 3으로 나누는 경우\\n\\nprint(dp[N])"
  },
  "explain": "## Step 1. 입력 받기\\n정수 N을 입력받아 문제를 시작합니다. 이는 1보다 크거나 같고 106보다 작은 값입니다.\\n\\n## Step 2. DP 테이블 초기화\\nN+1 크기의 dp 배열을 생성하고, dp[1]을 0으로 설정합니다. 이는 숫자 1에 도달하기 위한 연산 횟수가 없다는 것을 의미합니다.\\n\\n## Step 3. 연산 적용\\n### Step 3.1. 반복문을 통해 2부터 N까지 각 숫자에 대해 연산을 적용합니다:\\n- dp[i]는 dp[i-1] + 1로 초기화하여 1을 빼는 경우를 반영합니다.\\n### Step 3.2. 2로 나누는 경우:\\n- 만약 i가 2로 나누어 떨어지면, dp[i]의 값을 dp[i // 2] + 1과 비교하여 최소값으로 갱신합니다.\\n### Step 3.3. 3으로 나누는 경우:\\n- 만약 i가 3으로 나누어 떨어지면, dp[i]의 값을 dp[i // 3] + 1과 비교하여 최소값으로 갱신합니다.\\n\\n## Step 4. 결과 출력\\n마지막으로 dp[N]을 출력하여 N을 1로 만들기 위한 최소 연산 횟수를 확인합니다.",
  "time_complexity": "O(N)"
}
Example 2:
{
  "required_algorithm": "기하학",
  "algorithm_concept": "기하학은 도형, 크기, 도형의 상대적인 위치, 그리고 공간의 성질에 대해 다루는 수학의 한 분야입니다. 점, 선, 각, 면, 입체와 같은 개념을 포함하며, 기하학 알고리즘은 기하학적 객체의 측정, 배치 및 분석과 관련된 문제를 해결하는 데 사용됩니다.",
  "solution_approach": "이 문제는 각 행성계에 대해 출발점과 도착점의 위치를 비교하여 진입 및 이탈 횟수를 계산하는 기하학 문제입니다. 단계적으로 다음과 같은 방식으로 접근합니다:\\n\\n1. 거리 계산 함수 정의: 점과 원의 중심 사이의 거리를 계산하는 함수를 정의합니다. 이 함수는 두 점 사이의 유클리드 거리로 계산됩니다.\\n2. 각 테스트 케이스에 대한 입력 처리: 출발점, 도착점, 행성계의 수를 입력받고, 각 행성계의 중심 좌표와 반지름을 저장합니다.\\n3. 진입 및 이탈 여부 판단: 행성계의 중심과 반지름을 기준으로 출발점과 도착점이 원 안에 있는지 판단합니다.\\n    - 출발점이 원 안에 있고, 도착점이 원 밖에 있는 경우: 진입으로 판단하여 횟수를 증가시킵니다.\\n    - 출발점이 원 밖에 있고, 도착점이 원 안에 있는 경우: 이탈로 판단하여 횟수를 증가시킵니다.\\n4. 최종 결과 출력: 모든 테스트 케이스에 대해 진입 및 이탈 횟수의 합을 계산하여 출력합니다.",
  "solution": {
    "pseudo_code": "Set T = INPUT value // 테스트 케이스 수\\nFOR each test case\\n\\tINPUT (x1, y1) // 출발점\\n\\tINPUT (x2, y2) // 도착점\\n\\tINPUT n // 행성계 수\\n\\tSet count = 0 // 진입/이탈 횟수 초기화\\n\\tFOR each planet\\n\\t\\tINPUT (cx, cy, r) // 행성계의 중심과 반지름\\n\\t\\tSet distance_start = distance(x1, y1, cx, cy)\\n\\t\\tSet distance_end = distance(x2, y2, cx, cy)\\n\\t\\tIF (distance_start < r AND distance_end >= r) THEN // 출발점이 원 안, 도착점이 원 밖\\n\\t\\t\\tcount += 1\\n\\t\\tELSE IF (distance_start >= r AND distance_end < r) THEN // 출발점이 원 밖, 도착점이 원 안\\n\\t\\t\\tcount += 1\\nOUTPUT count",
    "code": "import math\\n\\ndef distance(x1, y1, cx, cy):\\n    return math.sqrt((x1 - cx) ** 2 + (y1 - cy) ** 2)\\n\\nT = int(input())\\nfor _ in range(T):\\n    x1, y1 = map(int, input().split())\\n    x2, y2 = map(int, input().split())\\n    n = int(input())\\n    count = 0\\n    for _ in range(n):\\n        cx, cy, r = map(int, input().split())\\n        start_inside = distance(x1, y1, cx, cy) < r\\n        end_inside = distance(x2, y2, cx, cy) < r\\n        if start_inside and not end_inside:\\n            count += 1\\n        elif not start_inside and end_inside:\\n            count += 1\\n    print(count)\\n"
  },
  "explain": "## Step 1. 거리 계산 함수 정의\\n거리 계산을 위한 'distance' 함수를 정의합니다. 이 함수는 피타고라스 정리를 사용하여 점과 원의 중심 사이의 유클리드 거리를 반환합니다. 이는 행성계 내외를 판단하는 데 사용됩니다.\\n\\n## Step 2. 입력 받기\\n테스트 케이스 수(T)를 입력받고, 각 테스트 케이스에 대해 출발점과 도착점의 좌표를 입력받습니다. 또한, 각 행성계의 수와 각 행성계의 중심 좌표 및 반지름을 입력받습니다.\\n\\n## Step 3. 진입 및 이탈 판단\\n### Step 3.1. 각 행성계에 대해 출발점과 도착점의 위치를 비교합니다.\\n- 'distance' 함수를 사용하여 출발점과 도착점이 행성계 원의 안/밖에 있는지를 계산합니다.\\n- 출발점이 원 안에 있고 도착점이 원 밖에 있거나, 출발점이 원 밖에 있고 도착점이 원 안에 있는 경우, 진입 및 이탈로 판단합니다.\\n\\n### Step 3.2. 진입 및 이탈 횟수 계산\\n- 위 조건을 만족하는 경우 'count' 값을 1 증가시킵니다.\\n\\n## Step 4. 결과 출력\\n모든 행성계를 처리한 후, 각 테스트 케이스에 대해 최종적으로 진입 및 이탈 횟수를 출력합니다. 이 값은 어린 왕자가 반드시 거쳐야 하는 행성계의 최소 수를 나타냅니다."
}
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "o1-preview",
      messages: [{ role: "user", content: PROMPT }],
    });

    // 응답 데이터에서 content 가져오기
    const responseData = completion?.choices[0]?.message?.content;

    console.log("🥕🥕🥕 GPT 응답 (파싱 전):", responseData);

    return responseData;
  } catch (error) {
    console.error("GPT 요청 오류:", error.message);
    return { error: "GPT 요청 중 오류 발생" };
  }
};
