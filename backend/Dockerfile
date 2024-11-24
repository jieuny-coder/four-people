# 1. AWS Lambda Node.js 18.x 런타임 베이스 이미지 사용
FROM public.ecr.aws/lambda/nodejs:18

# 2. 코드 복사
COPY . ${LAMBDA_TASK_ROOT}

# 3. 의존성 설치
RUN npm install

# 4. Lambda 핸들러 설정 (index.js 파일에서 handler 함수 호출)
CMD ["index.handler"]
