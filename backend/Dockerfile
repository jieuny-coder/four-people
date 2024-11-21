# 1. Node.js 베이스 이미지 사용
FROM node:16

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 필요한 파일 복사
COPY package*.json /app/
RUN npm install

COPY . /app

# 4. 서버 실행 명령어 설정
CMD ["node", "server.js"]

# 5. 컨테이너 포트 노출
EXPOSE 3000
