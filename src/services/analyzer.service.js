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
  "solution_approach": "A clear, step-by-step explanation of the reasoning and strategy behind solving the problem. Focus on why this approach is suitable. Use Chain-of-Thought to explain the process logically.",
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
  "explain": "Output in Markdown format, starting with ## Step 1. A detailed step-by-step explanation of the code, focusing on how and why each step is performed. Use Chain-of-Thought to break down the problem and solution logically, dividing the explanation into smaller, easily understandable sections.",
  "time_complexity": "The time complexity of the solution, including both best-case and worst-case scenarios if applicable., Please do not explain"
}

RESPONSE FORMAT RULES:
1. The code in the solution should be a simple string, not a code block with backticks
2. Avoid using special characters or line breaks that might break JSON formatting
3. Keep the response in VALID JSON format
4. Any backslashes (\) in the code must be escaped as \\\\
5. Line breaks MUST use two backslashes like \\n
6. Response should be in Korean
7. Indentation should be 4 spaces

Here is an example of the response format:

Example 1:
{
  "required_algorithm": "다이나믹 프로그래밍",
  "key_concepts": "이 문제는 최소 연산 횟수를 구하는 데 있어서 동적 프로그래밍의 개념을 활용합니다. 주어진 정수 N에서 1로 만들기 위해 각 연산의 결과를 저장하고, 이를 기반으로 최적의 해를 계산하는 방식입니다. 이전 상태의 결과를 활용하여 현재 상태를 업데이트하는 것이 핵심입니다.",
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
  "key_concepts": "이 문제를 해결하기 위해서는 기하학적 개념, 특히 원과 점의 관계를 이해해야 합니다. 주어진 출발점과 도착점이 각 행성계의 경계에 위치하는지를 판단하고, 이를 통해 진입 및 이탈 횟수를 계산해야 합니다. 원의 중심과 반지름을 이용해 점이 원 안에 있는지, 바깥에 있는지를 확인하는 방법을 이해해야 합니다.",
  "solution_approach": "이 문제는 각 행성계에 대해 출발점과 도착점의 위치를 비교하여 진입 및 이탈 횟수를 계산하는 기하학 문제입니다. 단계적으로 다음과 같은 방식으로 접근합니다:\\n\\n1. 거리 계산 함수 정의: 점과 원의 중심 사이의 거리를 계산하는 함수를 정의합니다. 이 함수는 두 점 사이의 유클리드 거리로 계산됩니다.\\n2. 각 테스트 케이스에 대한 입력 처리: 출발점, 도착점, 행성계의 수를 입력받고, 각 행성계의 중심 좌표와 반지름을 저장합니다.\\n3. 진입 및 이탈 여부 판단: 행성계의 중심과 반지름을 기준으로 출발점과 도착점이 원 안에 있는지 판단합니다.\\n    - 출발점이 원 안에 있고, 도착점이 원 밖에 있는 경우: 진입으로 판단하여 횟수를 증가시킵니다.\\n    - 출발점이 원 밖에 있고, 도착점이 원 안에 있는 경우: 이탈로 판단하여 횟수를 증가시킵니다.\\n4. 최종 결과 출력: 모든 테스트 케이스에 대해 진입 및 이탈 횟수의 합을 계산하여 출력합니다.",
  "solution": {
    "pseudo_code": "Set T = INPUT value // 테스트 케이스 수\\nFOR each test case\\n\\tINPUT (x1, y1) // 출발점\\n\\tINPUT (x2, y2) // 도착점\\n\\tINPUT n // 행성계 수\\n\\tSet count = 0 // 진입/이탈 횟수 초기화\\n\\tFOR each planet\\n\\t\\tINPUT (cx, cy, r) // 행성계의 중심과 반지름\\n\\t\\tSet distance_start = distance(x1, y1, cx, cy)\\n\\t\\tSet distance_end = distance(x2, y2, cx, cy)\\n\\t\\tIF (distance_start < r AND distance_end >= r) THEN // 출발점이 원 안, 도착점이 원 밖\\n\\t\\t\\tcount += 1\\n\\t\\tELSE IF (distance_start >= r AND distance_end < r) THEN // 출발점이 원 밖, 도착점이 원 안\\n\\t\\t\\tcount += 1\\nOUTPUT count",
    "code": "import math\\n\\ndef distance(x1, y1, cx, cy):\\n    return math.sqrt((x1 - cx) ** 2 + (y1 - cy) ** 2)\\n\\nT = int(input())\\nfor _ in range(T):\\n    x1, y1 = map(int, input().split())\\n    x2, y2 = map(int, input().split())\\n    n = int(input())\\n    count = 0\\n    for _ in range(n):\\n        cx, cy, r = map(int, input().split())\\n        start_inside = distance(x1, y1, cx, cy) < r\\n        end_inside = distance(x2, y2, cx, cy) < r\\n        if start_inside and not end_inside:\\n            count += 1\\n        elif not start_inside and end_inside:\\n            count += 1\\n    print(count)\\n"
  },
  "explain": "## Step 1. 거리 계산 함수 정의\\n거리 계산을 위한 'distance' 함수를 정의합니다. 이 함수는 피타고라스 정리를 사용하여 점과 원의 중심 사이의 유클리드 거리를 반환합니다. 이는 행성계 내외를 판단하는 데 사용됩니다.\\n\\n## Step 2. 입력 받기\\n테스트 케이스 수(T)를 입력받고, 각 테스트 케이스에 대해 출발점과 도착점의 좌표를 입력받습니다. 또한, 각 행성계의 수와 각 행성계의 중심 좌표 및 반지름을 입력받습니다.\\n\\n## Step 3. 진입 및 이탈 판단\\n### Step 3.1. 각 행성계에 대해 출발점과 도착점의 위치를 비교합니다.\\n- 'distance' 함수를 사용하여 출발점과 도착점이 행성계 원의 안/밖에 있는지를 계산합니다.\\n- 출발점이 원 안에 있고 도착점이 원 밖에 있거나, 출발점이 원 밖에 있고 도착점이 원 안에 있는 경우, 진입 및 이탈로 판단합니다.\\n\\n### Step 3.2. 진입 및 이탈 횟수 계산\\n- 위 조건을 만족하는 경우 'count' 값을 1 증가시킵니다.\\n\\n## Step 4. 결과 출력\\n모든 행성계를 처리한 후, 각 테스트 케이스에 대해 최종적으로 진입 및 이탈 횟수를 출력합니다. 이 값은 어린 왕자가 반드시 거쳐야 하는 행성계의 최소 수를 나타냅니다."
}

`;
  const USER_PROMPT = `
    The title of the problem is ${
      question.title
    } and the problem description is as follows: ${question.description}.
    The input conditions for this problem are: ${question.input}.
    The output conditions for this problem are: ${question.output}.
    The example input for this problem is: ${question.example.input}.
    The example output for this problem is: ${question.example.output}.
    ${
      question.limit
        ? `The limitations for this problem are: ${question.limit}.`
        : ""
    }

    Here is an example of the response format:

Example 1:
{
  "required_algorithm": "다이나믹 프로그래밍",
  "key_concepts": "이 문제는 최소 연산 횟수를 구하는 데 있어서 동적 프로그래밍의 개념을 활용합니다. 주어진 정수 N에서 1로 만들기 위해 각 연산의 결과를 저장하고, 이를 기반으로 최적의 해를 계산하는 방식입니다. 이전 상태의 결과를 활용하여 현재 상태를 업데이트하는 것이 핵심입니다.",
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
  "key_concepts": "이 문제를 해결하기 위해서는 기하학적 개념, 특히 원과 점의 관계를 이해해야 합니다. 주어진 출발점과 도착점이 각 행성계의 경계에 위치하는지를 판단하고, 이를 통해 진입 및 이탈 횟수를 계산해야 합니다. 원의 중심과 반지름을 이용해 점이 원 안에 있는지, 바깥에 있는지를 확인하는 방법을 이해해야 합니다.",
  "solution_approach": "이 문제는 각 행성계에 대해 출발점과 도착점의 위치를 비교하여 진입 및 이탈 횟수를 계산하는 기하학 문제입니다. 단계적으로 다음과 같은 방식으로 접근합니다:\\n\\n1. 거리 계산 함수 정의: 점과 원의 중심 사이의 거리를 계산하는 함수를 정의합니다. 이 함수는 두 점 사이의 유클리드 거리로 계산됩니다.\\n2. 각 테스트 케이스에 대한 입력 처리: 출발점, 도착점, 행성계의 수를 입력받고, 각 행성계의 중심 좌표와 반지름을 저장합니다.\\n3. 진입 및 이탈 여부 판단: 행성계의 중심과 반지름을 기준으로 출발점과 도착점이 원 안에 있는지 판단합니다.\\n    - 출발점이 원 안에 있고, 도착점이 원 밖에 있는 경우: 진입으로 판단하여 횟수를 증가시킵니다.\\n    - 출발점이 원 밖에 있고, 도착점이 원 안에 있는 경우: 이탈로 판단하여 횟수를 증가시킵니다.\\n4. 최종 결과 출력: 모든 테스트 케이스에 대해 진입 및 이탈 횟수의 합을 계산하여 출력합니다.",
  "solution": {
    "pseudo_code": "Set T = INPUT value // 테스트 케이스 수\\nFOR each test case\\n\\tINPUT (x1, y1) // 출발점\\n\\tINPUT (x2, y2) // 도착점\\n\\tINPUT n // 행성계 수\\n\\tSet count = 0 // 진입/이탈 횟수 초기화\\n\\tFOR each planet\\n\\t\\tINPUT (cx, cy, r) // 행성계의 중심과 반지름\\n\\t\\tSet distance_start = distance(x1, y1, cx, cy)\\n\\t\\tSet distance_end = distance(x2, y2, cx, cy)\\n\\t\\tIF (distance_start < r AND distance_end >= r) THEN // 출발점이 원 안, 도착점이 원 밖\\n\\t\\t\\tcount += 1\\n\\t\\tELSE IF (distance_start >= r AND distance_end < r) THEN // 출발점이 원 밖, 도착점이 원 안\\n\\t\\t\\tcount += 1\\nOUTPUT count",
    "code": "import math\\n\\ndef distance(x1, y1, cx, cy):\\n    return math.sqrt((x1 - cx) ** 2 + (y1 - cy) ** 2)\\n\\nT = int(input())\\nfor _ in range(T):\\n    x1, y1 = map(int, input().split())\\n    x2, y2 = map(int, input().split())\\n    n = int(input())\\n    count = 0\\n    for _ in range(n):\\n        cx, cy, r = map(int, input().split())\\n        start_inside = distance(x1, y1, cx, cy) < r\\n        end_inside = distance(x2, y2, cx, cy) < r\\n        if start_inside and not end_inside:\\n            count += 1\\n        elif not start_inside and end_inside:\\n            count += 1\\n    print(count)\\n"
  },
  "explain": "## Step 1. 거리 계산 함수 정의\\n거리 계산을 위한 'distance' 함수를 정의합니다. 이 함수는 피타고라스 정리를 사용하여 점과 원의 중심 사이의 유클리드 거리를 반환합니다. 이는 행성계 내외를 판단하는 데 사용됩니다.\\n\\n## Step 2. 입력 받기\\n테스트 케이스 수(T)를 입력받고, 각 테스트 케이스에 대해 출발점과 도착점의 좌표를 입력받습니다. 또한, 각 행성계의 수와 각 행성계의 중심 좌표 및 반지름을 입력받습니다.\\n\\n## Step 3. 진입 및 이탈 판단\\n### Step 3.1. 각 행성계에 대해 출발점과 도착점의 위치를 비교합니다.\\n- 'distance' 함수를 사용하여 출발점과 도착점이 행성계 원의 안/밖에 있는지를 계산합니다.\\n- 출발점이 원 안에 있고 도착점이 원 밖에 있거나, 출발점이 원 밖에 있고 도착점이 원 안에 있는 경우, 진입 및 이탈로 판단합니다.\\n\\n### Step 3.2. 진입 및 이탈 횟수 계산\\n- 위 조건을 만족하는 경우 'count' 값을 1 증가시킵니다.\\n\\n## Step 4. 결과 출력\\n모든 행성계를 처리한 후, 각 테스트 케이스에 대해 최종적으로 진입 및 이탈 횟수를 출력합니다. 이 값은 어린 왕자가 반드시 거쳐야 하는 행성계의 최소 수를 나타냅니다."
}

    Please explain this problem in Korean and complete the remaining items in the same format and structure as shown in the example below.
    The code is in Python syntax.
    {
        "required_algorithm": ${tag_name},
    `;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: USER_PROMPT },
      ],
      max_tokens: 5000,
      temperature: 0.5,
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

const formatGPTResponse = (response) => {
  try {
    if (typeof response === "object") {
      return response;
    }

    // 코드 들여쓰기를 4칸 공백으로 표준화하는 함수
    const formatCode = (code) => {
      return code
        .split("\n")
        .map((line) => {
          const indentLevel = (line.match(/^[\t ]*(?=\S)/) || [""])[0].length;
          const standardIndent = Math.floor(indentLevel / 4) * 4;
          return " ".repeat(standardIndent) + line.trim();
        })
        .join("\\n");
    };

    // JSON 문자열 정리 함수
    const sanitizeJsonString = (str) => {
      // 먼저 JSON 객체 부분만 추출
      const start = str.indexOf("{");
      const end = str.lastIndexOf("}") + 1;
      if (start === -1 || end === 0) {
        throw new Error("유효한 JSON 객체를 찾을 수 없습니다.");
      }
      let jsonStr = str.substring(start, end);

      // 코드와 의사코드 부분을 임시 저장
      const codeMatches = [];
      const pseudoCodeMatches = [];

      // 코드 부분 추출 및 임시 저장
      jsonStr = jsonStr.replace(
        /"code"\s*:\s*"((\\"|[^"])*?)"/g,
        (match, code) => {
          codeMatches.push(code);
          return `"code":"{{CODE_${codeMatches.length - 1}}}"`;
        }
      );

      // 의사코드 부분 추출 및 임시 저장
      jsonStr = jsonStr.replace(
        /"pseudo_code"\s*:\s*"((\\"|[^"])*?)"/g,
        (match, pseudoCode) => {
          pseudoCodeMatches.push(pseudoCode);
          return `"pseudo_code":"{{PSEUDO_${pseudoCodeMatches.length - 1}}}"`;
        }
      );

      // 일반 문자열 내의 특수 문자 처리
      jsonStr = jsonStr.replace(/:\s*"([^"]*)"/g, (match, content) => {
        return `: "${content
          .replace(/\\/g, "\\\\")
          .replace(/\n/g, "\\n")
          .replace(/\r/g, "\\r")
          .replace(/\t/g, "\\t")
          .replace(/"/g, '\\"')}"`;
      });

      // 기본 문자열 정리
      jsonStr = jsonStr
        .replace(/[\n\r\t]/g, " ")
        .replace(/\s+/g, " ")
        .trim();

      // 코드 섹션 복원
      codeMatches.forEach((code, index) => {
        const formattedCode = formatCode(code);
        jsonStr = jsonStr.replace(`"{{CODE_${index}}}"`, `"${formattedCode}"`);
      });

      pseudoCodeMatches.forEach((pseudoCode, index) => {
        const formattedPseudoCode = formatCode(pseudoCode);
        jsonStr = jsonStr.replace(
          `"{{PSEUDO_${index}}}"`,
          `"${formattedPseudoCode}"`
        );
      });

      return jsonStr;
    };

    // 파싱 시도
    const cleanedJson = sanitizeJsonString(response);
    try {
      return JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error("❌ JSON 파싱 실패:", parseError.message);
      console.error("정리된 JSON:", cleanedJson);
      return { error: "JSON 파싱 실패" };
    }
  } catch (error) {
    console.error("❌ 전체 처리 실패:", error.message);
    return { error: "응답 처리 실패" };
  }
};
