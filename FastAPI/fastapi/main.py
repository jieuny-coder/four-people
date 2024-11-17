from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, Request
from fastapi.responses import JSONResponse, FileResponse
import shutil
from pathlib import Path
import torch
from PIL import Image
import logging
import cv2
import numpy as np
from paddleocr import PaddleOCR
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from datetime import datetime
import pathlib
import time
import re

################ 설정 ################
# 로깅 설정
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('app.log'),
        logging.StreamHandler()
    ]
)

pathlib.PosixPath = pathlib.WindowsPath

app = FastAPI()

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# 데이터베이스 설정
DATABASE_URL = "mysql+pymysql://Insa5_JSB_final_1:aischool1@project-db-stu3.smhrd.com:3307/Insa5_JSB_final_1"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


################ 데이터베이스 모델 ################
# DB 모델 정의
class User(Base):
    __tablename__ = 'USER'
    user_id = Column(Integer, primary_key=True, index=True)
    car_number = Column(String(20), unique=True, nullable=False)
    handicap = Column(Boolean, default=False)

class Violation(Base):
    __tablename__ = 'VIOLATION'
    violation_id = Column(Integer, primary_key=True, index=True)
    violation_number = Column(String(20))
    filename = Column(String(255), unique=True)
    url = Column(String(255))
    upload_time = Column(DateTime)

class ObstacleViolation(Base):
    __tablename__ = 'OBSTACLE_VIOLATION'
    id = Column(Integer, primary_key=True, index=True)
    description = Column(String(50))  # 적재물1, 적재물2 등을 저장
    detected_at = Column(DateTime, default=datetime.utcnow)
    video_url = Column(String(255)) 
    # __tablename__ = 'OBSTACLE_VIOLATION'
    # obstacle_id = Column(Integer, primary_key=True, index=True)
    # filename = Column(String(255), unique=True)
    # url = Column(String(255))
    # detection_time = Column(DateTime, default=datetime.utcnow)
    # status = Column(String(50))  # 처리상태 추가

# 테이블 생성
Base.metadata.create_all(bind=engine)


################ 유틸리티 함수 ################
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def clean_plate_number(text: str) -> str:
    """번호판 텍스트 정제 함수"""
    # 공백 제거
    cleaned = re.sub(r'\s+', '', text)
    
    # 한국 번호판 패턴 매칭
    pattern = r'(\d{2,3}[가-힣]\d{4})'  # 기본 패턴
    matches = re.findall(pattern, cleaned)
    if matches:
        return matches[0]
    
    # 패턴 매칭 실패시 숫자와 한글 결합
    numbers = re.findall(r'\d+', cleaned)
    korean = re.findall(r'[가-힣]+', cleaned)
    
    if korean and numbers:
        # 숫자+한글+숫자 형태로 결합
        return f"{numbers[0]}{korean[0]}{numbers[1]}" if len(numbers) > 1 else f"{numbers[0]}{korean[0]}"
    
    return cleaned


################ 모델 설정 및 분석 함수 ################
# 모델 경로 설정
plate_model_path = str(Path("C:/Users/USER/Desktop/LastProject/four-people/FastAPI/models/plate_ocr.pt"))
assist_model_path = str(Path("C:/Users/USER/Desktop/LastProject/four-people/FastAPI/models/assist_device1.pt"))
obstacle_model_path = str(Path("C:/Users/USER/Desktop/LastProject/four-people/FastAPI/models/parking_obj.pt"))

# 모델 로드 및 에러 처리
try:
    plate_model = torch.hub.load('ultralytics/yolov5', 'custom', path=plate_model_path, trust_repo=True)
    assist_model = torch.hub.load('ultralytics/yolov5', 'custom', path=assist_model_path, trust_repo=True)
    obstacle_model = torch.hub.load('ultralytics/yolov5', 'custom', path=obstacle_model_path, trust_repo=True)
    
    plate_model.eval()
    assist_model.eval()
    obstacle_model.eval()
    
    ocr = PaddleOCR(use_angle_cls=True, lang='korean')
except Exception as e:
    logging.error(f"모델 로드 실패: {e}")
    raise

# 분석 함수들
def analyze_plate_image(file_path: str) -> tuple[str, float]:
    """번호판 분석 함수"""
    try:
        print("\n=== 번호판 분석 시작 ===")
        image = Image.open(file_path)
        
        results = plate_model(image)
        results.show()  # 바로 결과 이미지 표시
        print("번호판 감지 모델 실행 완료")

        if len(results.xyxy[0]) == 0:
            print("번호판이 감지되지 않음")
            return "번호판이 감지되지 않음", 0.0

        best_texts = []
        overall_conf = 0.0
        
        for *box, conf, cls in results.xyxy[0]:
            if conf < 0.5:
                continue
                
            x1, y1, x2, y2 = map(int, box)
            plate_img = image.crop((x1, y1, x2, y2))
            
            print("OCR 분석 시작")
            ocr_result = ocr.ocr(np.array(plate_img), cls=True)
            
            if not ocr_result or not ocr_result[0]:
                print("OCR 결과 없음")
                continue

            for line in ocr_result[0]:
                text = line[1][0]
                confidence = float(line[1][1])
                if confidence > 0.5:
                    best_texts.append((text, confidence))
                    overall_conf = max(overall_conf, confidence)
                    print(f"텍스트 감지: {text}, 신뢰도: {confidence:.2f}")

        if best_texts:
            # 한글 번호판 패턴에 맞게 텍스트 조합
            number_part = None
            korean_part = None
            
            korean_chars = ['가', '나', '다', '라', '마', '거', '너', '더', '러', '머', 
                          '버', '서', '어', '저', '고', '노', '도', '로', '모', '보', 
                          '소', '오', '조', '구', '누', '두', '루', '무', '부', '수', 
                          '우', '주', '허', '하', '호']
            
            for text, _ in best_texts:
                # 숫자와 한글이 같이 있는 경우
                has_number = any(char.isdigit() for char in text)
                has_korean = any(korean in text for korean in korean_chars)
                
                if has_number and has_korean:
                    if any(korean in text for korean in korean_chars):
                        korean_part = text
                elif text.isdigit():  # 순수하게 숫자만 있는 경우
                    number_part = text

            # 결과 조합
            if korean_part and number_part:
                full_plate_number = f"{korean_part}{number_part}"
            elif korean_part:
                full_plate_number = korean_part
            else:
                full_plate_number = number_part if number_part else best_texts[0][0]

            print(f"최종 번호판 번호: {full_plate_number} (신뢰도: {overall_conf:.2f})")
            return full_plate_number, overall_conf
            
        print("번호판 텍스트 인식 실패")
        return "번호판 텍스트 인식 실패", 0.0

    except Exception as e:
        print(f"번호판 분석 중 에러 발생: {str(e)}")
        return f"에러: {str(e)}", 0.0


def analyze_assist_device(file_path: str) -> str:
    """보조기구 분석 함수"""
    try:
        print("\n=== 보조기구 분석 시작 ===")
        image = Image.open(file_path)
        
        results = assist_model(image)
        results.show()  # 바로 결과 이미지 표시
        print("보조기구 감지 모델 실행 완료")

        detected = len(results.xyxy[0]) > 0
        
        if detected:
            print("보조기구 감지됨")
            return "합법: 객체가 탐지되었습니다."
        else:
            print("보조기구 감지되지 않음")
            return "불법: 객체가 탐지되지 않았습니다."

    except Exception as e:
        print(f"보조기구 분석 중 에러 발생: {e}")
        return "Error during assist device analysis."
    

def detect_obstacle(file_path: str) -> bool:
    """적재물 탐지 함수"""
    try:
        print("\n=== 적재물 감지 시작 ===")
        image = Image.open(file_path)
        
        results = obstacle_model(image)
        results.show()  # 바로 결과 이미지 표시
        print("적재물 감지 모델 실행 완료")

        # 주차구역과 적재물 탐지 확인
        parking_detected = False
        object_detected = False

        # 탐지된 객체가 있는지 확인
        if len(results.pred[0]) > 0:
            for detection in results.pred[0]:
                class_id = int(detection[-1])
                class_name = results.names[class_id]
                if class_name == "parking":
                    parking_detected = True
                elif class_name == "object":
                    object_detected = True

        # 결과 출력
        if parking_detected:
            print("합법: 'parking' 바운딩박스가 탐지되었습니다.")
            return False  # 적재물 위반 없음
        elif object_detected:
            print("불법: 'object' 바운딩박스가 탐지되었습니다.")
            return True  # 적재물 위반 있음
        else:
            print("합법: 탐지된 바운딩박스가 없습니다.")
            return False  # 적재물 위반 없음

    except Exception as e:
        print(f"적재물 감지 중 에러 발생: {e}")
        return False

################ API 엔드포인트 ################

@app.get("/")
async def root():
    return {"status": "서버 정상 작동 중"}

@app.post("/upload/")
async def upload_file(request: Request, file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        print("\n=== 파일 업로드 및 번호판 분석 시작 ===")
        
        form_data = await request.form()
        video_filename = form_data.get("video_filename")
        
        if not video_filename:
            print("비디오 파일명이 누락되었습니다.")
            return JSONResponse(content={"error": "비디오 파일명이 누락되었습니다."}, status_code=400)

        # 파일 저장
        file_location = UPLOAD_DIR / file.filename
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        print(f"파일 저장 완료: {file_location}")

        # 1. 번호판 분석
        plate_number, confidence = analyze_plate_image(str(file_location))
        print(f"번호판 분석 결과: {plate_number}, 신뢰도: {confidence}")

        # violation_record 찾기
        violation_record = db.query(Violation).filter(
            Violation.filename == video_filename
        ).first()

        if not violation_record:
            return JSONResponse(content={"error": "비디오 파일 기록을 찾을 수 없습니다"}, status_code=404)
        
        if confidence < 0.5:
            print("번호판 인식 실패 - 적재물 탐지 시작")
            if detect_obstacle(str(file_location)):
                print("적재물 감지 완료")
                
                # 마지막 적재물 번호 조회
                last_obstacle = db.query(ObstacleViolation).order_by(
                    ObstacleViolation.id.desc()
                ).first()
                
                next_number = 1
                if last_obstacle:
                    # 마지막 description에서 숫자 추출
                    match = re.search(r'\d+', last_obstacle.description)
                    if match:
                        next_number = int(match.group()) + 1
                
                # **VIOLATION 테이블에서 URL 가져오기**
                violation_record = db.query(Violation).filter(
                    Violation.filename == video_filename
                ).first()

                if not violation_record or not violation_record.url:
                    print("VIOLATION 테이블에서 URL 정보를 찾을 수 없습니다.")
                    return JSONResponse(content={"error": "VIOLATION 테이블에 URL 정보 없음"}, status_code=404)

                # 새로운 적재물 위반 기록 생성
                new_obstacle = ObstacleViolation(
                    description=f"적재물{next_number}",
                    detected_at=datetime.now(),
                    video_url=violation_record.url  # VIOLATION 테이블의 URL 참조
                )
                
                try:
                    db.add(new_obstacle)
                    db.commit()
                    print(f"적재물 위반 기록 저장 완료: 적재물{next_number}")
                except Exception as db_error:
                    print(f"DB 저장 중 오류 발생: {db_error}")
                    db.rollback()
                
                return JSONResponse(content={
                    "status": "적재물 감지",
                    "type": "obstacle",
                    "description": f"적재물{next_number}",
                    "video_url": violation_record.url,
                    "detected_at": datetime.now().isoformat()
                })
            else:
                print("번호판 인식 실패 및 적재물 없음")
                return JSONResponse(content={"status": "번호판 인식 실패 및 적재물 없음"})

        # 2. DB 조회 - 차량 번호 확인
        logging.info(f"DB에서 차량 번호 조회 시작: {plate_number.strip()}")
        print(f"DB에서 차량 번호 조회 시작: {plate_number.strip()}")
        user_entry = db.query(User).filter(User.car_number == plate_number.strip()).first()
        
        if not user_entry:
            logging.info(f"미등록 차량으로 처리: {plate_number}")
            print(f"미등록 차량으로 처리: {plate_number}")
            violation_record.violation_number = plate_number
            db.commit()
            print(f"위반 차량 번호: {plate_number} DB 저장 완료")
            return JSONResponse(content={"status": "미등록 차량", "type": "illegal"})
        
        if not user_entry.handicap:
            logging.info(f"일반 등록 차량으로 처리: {plate_number}")
            print(f"일반 등록 차량으로 처리: {plate_number}")
            violation_record.violation_number = plate_number
            db.commit()
            print(f"위반 차량 번호: {plate_number} DB 저장 완료")
            return JSONResponse(content={"status": "일반 차량", "type": "illegal"})
        
        # 장애인 등록 차량인 경우
        logging.info(f"장애인 등록 차량 확인: {plate_number}")
        print(f"장애인 등록 차량 확인: {plate_number}")
        return JSONResponse(content={"status": "장애인 등록 차량", "action": "capture_assist", "plate_number": plate_number})

    except Exception as e:
        print(f"처리 중 에러 발생: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/assist_check/")
async def assist_check(request:Request, file: UploadFile = File(...), db: Session = Depends(get_db)):
    try:
        form_data = await request.form()
        video_filename = form_data.get("video_filename")
        plate_number = form_data.get("plate_number")

        if not video_filename or not plate_number:
            print("필수 정보 누락")
            return JSONResponse(
                content={"error": "비디오 파일명 또는 차량번호가 누락되었습니다"}, 
                status_code=400
            )

        print(f"Received file for assist_check: {file.filename}")
        print(f"Video filename: {video_filename}")
        print(f"Plate number: {plate_number}")
        print("\n=== 보조기구 확인 시작 ===")
        
        # 파일 저장
        file_location = UPLOAD_DIR / file.filename
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        print(f"파일 저장 완료: {file_location}")

        # 3. 보조기구 분석
        assist_result = analyze_assist_device(str(file_location))
        print(f"보조기구 분석 결과: {assist_result}")

        # violation_record 찾기
        violation_record = db.query(Violation).filter(
            Violation.filename == video_filename
        ).first()

        if not violation_record:
            print("비디오 파일 기록을 찾을 수 없습니다")
            return JSONResponse(content={"error": "비디오 파일 기록을 찾을 수 없습니다"}, status_code=404)

        if assist_result == "합법: 객체가 탐지되었습니다.":
            print("보조기구 확인 완료 - 합법 처리")
            violation_record.violation_number = None  # 합법이므로 위반 기록 제거
            db.commit()
            return JSONResponse(content={"status": "보조기구 확인", "type": "legal"})
        else:
            print("보조기구 없음 - 불법 처리")
            plate_number = form_data.get("plate_number")
            if plate_number:
                violation_record.violation_number = plate_number  # 불법이므로 위반 차량 번호 기록
                db.commit()
                print(f"위반 차량 번호 {plate_number} DB 저장 완료")
            return JSONResponse(content={"status": "보조기구 없음", "type": "illegal"})

    except Exception as e:
        print(f"처리 중 에러 발생: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/files/")
async def list_files():
    files = [f.name for f in UPLOAD_DIR.iterdir() if f.is_file()]
    return {"files": files}

@app.get("/files/{filename}")
async def get_file(filename: str):
    file_path = UPLOAD_DIR / filename
    if file_path.exists():
        return FileResponse(file_path)
    else:
        raise HTTPException(status_code=404, detail="File not found")
    
