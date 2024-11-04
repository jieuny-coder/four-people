from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import shutil
from pathlib import Path
import torch
from PIL import Image
import os

app = FastAPI()

# 업로드된 파일 저장 디렉토리
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# 학습된 모델 로드 (예: PyTorch)
MODEL_PATH = "models/best.pt"  # 모델 파일 경로
model = torch.hub.load('ultralytics/yolov5', 'custom', path=MODEL_PATH)
model.eval()

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    """
    라즈베리파이로부터 업로드된 이미지를 수신하고 모델 분석을 수행합니다.
    """
    try:
        # 업로드된 파일 저장
        file_location = UPLOAD_DIR / file.filename
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 모델 분석 수행
        result = analyze_image(file_location)

        return JSONResponse(content={"filename": file.filename, "result": result})

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def analyze_image(file_path: Path):
    """
    이미지 파일을 로드하여 모델로 분석합니다.
    """
    image = Image.open(file_path)
    # 모델 입력 형식으로 변환 및 예측 수행
    results = model(image)

    # 분석 결과 처리 (예시: 검출된 객체들의 클래스, 좌표 등 반환)
    output = []
    for *box, conf, cls in results.xyxy[0]:  # xyxy format, confidence, class
        output.append({
            "box": [int(coord) for coord in box],  # [x1, y1, x2, y2]
            "confidence": float(conf),
            "class": int(cls)
        })

    return output

@app.get("/")
async def root():
    return {"message": "FastAPI Server is running!"}






# from fastapi import FastAPI, File, UploadFile, HTTPException
# from typing import List
# import shutil
# import os
# from pydantic import BaseModel
# from sqlalchemy import create_engine, Column, String, Integer, MetaData, Table
# from sqlalchemy.orm import sessionmaker
# import ncloud_storage  # 네이버 클라우드 스토리지 SDK
# import torch  # PyTorch 사용 예시
# from PIL import Image
# import cv2
# import numpy as np
# from paddleocr import PaddleOCR

# app = FastAPI()

# # 1. MySQL 데이터베이스 설정
# DATABASE_URL = "mysql+pymysql://Insa5_JSB_final_1:aischool1@project-db-stu3.smhrd.com:3306/four-people"
# engine = create_engine(DATABASE_URL)
# metadata = MetaData()

# # 분석 결과를 저장할 테이블 정의
# analysis_table = Table(
#     'analysis',
#     metadata,
#     Column('id', Integer, primary_key=True, index=True),
#     Column('filename', String(255), index=True),
#     Column('result', String(255)),
#     Column('cloud_url', String(255)),
# )

# metadata.create_all(engine)
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# # 2. 네이버 클라우드 스토리지 설정
# ACCESS_KEY = 'your_access_key'
# SECRET_KEY = 'your_secret_key'
# ENDPOINT = 'https://kr.object.ncloudstorage.com'
# BUCKET_NAME = 'your-bucket-name'

# ncloud_client = ncloud_storage.NcloudStorage(ACCESS_KEY, SECRET_KEY, ENDPOINT)

# class AnalysisResult(BaseModel):
#     filename: str
#     result: str
#     cloud_url: str

# # 3. YOLO 모델 로드 (PyTorch)
# # '/path/to/local/best.pt'에 로컬 YOLO 모델 경로 설정
# model = torch.hub.load('ultralytics/yolov5', 'custom', path='C:/Users/USER/Desktop/four-people-내꺼/flask/models/plate_ocr.pt')
# model.eval()  # 평가 모드

# # 4. PaddleOCR 설정 (한국어 지원)
# ocr = PaddleOCR(use_angle_cls=True, lang='korean')

# def analyze_image(file_path: str) -> str:
#     """
#     업로드된 이미지를 분석하여 번호판, 보조기구, 장애물 등의 결과를 반환합니다.
#     """
#     # 이미지 로드 및 모델 예측
#     img = Image.open(file_path)
#     results = model(img)

#     # 번호판 및 보조기구 분석 결과 저장
#     text_results = []  # 검출된 텍스트와 좌표 저장 리스트

#     # 모델의 검출 결과에서 객체를 반복 처리
#     for *box, conf, cls in results.xyxy[0]:  # YOLO 결과에서 바운딩 박스 좌표와 클래스 가져오기
#         x1, y1, x2, y2 = map(int, box)
#         plate_img = img.crop((x1, y1, x2, y2))  # 바운딩 박스 내의 이미지 추출

#         # OpenCV 포맷으로 변환
#         plate_cv_img = cv2.cvtColor(np.array(plate_img), cv2.COLOR_RGB2BGR)

#         # PaddleOCR로 텍스트 인식
#         result = ocr.ocr(np.array(plate_img), cls=True)
#         for line in result[0]:  # OCR 결과가 여러 줄일 수 있으므로 반복
#             text = line[1][0]
#             text_results.append((x1, text))  # x 좌표와 텍스트 저장

#     # 검출된 텍스트를 x 좌표 기준으로 정렬하여 하나의 문자열로 반환
#     sorted_texts = sorted(text_results, key=lambda x: x[0])
#     final_text = ' '.join([text[1] for text in sorted_texts])
#     return final_text

# @app.post("/upload/")
# async def upload_file(file: UploadFile = File(...)):
#     """
#     사용자가 업로드한 파일을 수신, 분석하고 네이버 클라우드에 업로드한 후
#     결과를 MySQL 데이터베이스에 저장
#     """
#     try:
#         # 파일을 로컬에 저장
#         with open(file.filename, "wb") as buffer:
#             shutil.copyfileobj(file.file, buffer)

#         # 모델 분석 수행
#         analysis_result = analyze_image(file.filename)

#         # 네이버 클라우드에 파일 업로드
#         ncloud_client.upload_file(BUCKET_NAME, file.filename, file.filename)
#         cloud_url = f"{ENDPOINT}/{BUCKET_NAME}/{file.filename}"

#         # 분석 결과를 데이터베이스에 저장
#         db = SessionLocal()
#         new_entry = analysis_table.insert().values(
#             filename=file.filename, result=analysis_result, cloud_url=cloud_url
#         )
#         db.execute(new_entry)
#         db.commit()
#         db.close()

#         return {"filename": file.filename, "result": analysis_result, "cloud_url": cloud_url}

#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))
#     finally:
#         file.file.close()
#         os.remove(file.filename)

# @app.get("/results/")
# def get_results():
#     """
#     MySQL 데이터베이스에서 모든 분석 결과를 가져옵니다
#     """
#     db = SessionLocal()
#     results = db.execute(analysis_table.select()).fetchall()
#     db.close()
#     return [{"filename": r.filename, "result": r.result, "cloud_url": r.cloud_url} for r in results]
