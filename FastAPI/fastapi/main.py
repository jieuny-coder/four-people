from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, FileResponse
import shutil
from pathlib import Path
import torch
from PIL import Image
import logging
import cv2
import numpy as np
from paddleocr import PaddleOCR
import matplotlib.pyplot as plt
import pathlib
pathlib.PosixPath = pathlib.WindowsPath

# 로깅 설정
logging.basicConfig(level=logging.INFO)

app = FastAPI()

# 업로드된 파일 저장 디렉토리
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# 모델 경로(문자열로 변환하여 사용) 
plate_model_path = str(Path("C:/Users/USER/Documents/GitHub/four-people/four-people/FastAPI/models/plate_ocr.pt"))
assist_model_path = str(Path("C:/Users/USER/Documents/GitHub/four-people/four-people/FastAPI/models/assist_device.pt"))

# 모델 로드
plate_model = torch.hub.load('ultralytics/yolov5', 'custom', path=plate_model_path, trust_repo=True, force_reload=True)
assist_model = torch.hub.load('ultralytics/yolov5', 'custom', path=assist_model_path, trust_repo=True, force_reload=True)

plate_model.eval()
assist_model.eval()

# PaddleOCR 설정(한국어 인식)
ocr = PaddleOCR(use_angle_cls=True, lang='korean')

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    try:
        # 업로드된 파일 저장
        file_location = UPLOAD_DIR / file.filename
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        logging.info(f"File {file.filename} uploaded and saved at {file_location}")

        # 번호판 분석 수행
        plate_result_text = analyze_plate_image(str(file_location))

        # 보조기구 탐지 수행
        assist_result_text = analyze_assist_device(str(file_location))

        return JSONResponse(content={
            "filename": file.filename,
            "plate_analysis": plate_result_text,
            "assist_analysis": assist_result_text,
            "result": "File uploaded and analyzed successfully"
        })

    except Exception as e:
        logging.error(f"Error during processing: {e}")
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {e}")

def analyze_plate_image(file_path: str):
    try:
        image = Image.open(file_path)
        results = plate_model(image)

        # 결과 로그
        logging.info(f"Plate model detection results: {results.pandas().xyxy[0]}")
        results.show()

        text_results = []
        for *box, conf, cls in results.xyxy[0]:
            x1, y1, x2, y2 = map(int, box)
            plate_img = image.crop((x1, y1, x2, y2))
            plate_cv_img = cv2.cvtColor(np.array(plate_img), cv2.COLOR_RGB2BGR)

            # OCR로 텍스트 인식
            ocr_result = ocr.ocr(np.array(plate_img), cls=True)
            if not ocr_result or not ocr_result[0]:  # OCR 결과가 없을 경우
                logging.warning("OCR did not detect any text.")
                print("OCR did not detect any text.")
                continue  # 다음 박스로 넘어감

            for line in ocr_result[0]:
                text = line[1][0]
                x_pos = int(line[0][0][0])
                y_pos = int(line[0][0][1])
                text_results.append((x_pos, y_pos, text))

        if text_results:
            text_results = sorted(text_results, key=lambda x: (x[1], x[0]))
            lines = []
            current_line = [text_results[0]]
            for i in range(1, len(text_results)):
                if abs(text_results[i][1] - current_line[0][1]) > 10:
                    lines.append(current_line)
                    current_line = [text_results[i]]
                else:
                    current_line.append(text_results[i])
            lines.append(current_line)

            final_text = '\n'.join([' '.join([text[2] for text in sorted(line, key=lambda x: x[0])]) for line in lines])
            logging.info(f"Extracted text: {final_text}")
            print(f"Extracted text: {final_text}")  # 터미널에 출력
            return final_text
        else:
            logging.warning("No license plate text detected.")
            print("No license plate text detected.")  # 터미널에 출력
            return "No license plate text detected."

    except Exception as e:
        logging.error(f"Error in analyze_plate_image: {e}")
        print(f"Error in analyze_plate_image: {e}")  # 터미널에 오류 출력
        return "Error during plate analysis."



def analyze_assist_device(file_path: str):
    try:
        image = Image.open(file_path)
        results = assist_model(image)

        if len(results.xyxy[0]) > 0:
            logging.info("Assistive device detected.")
            assist_status = "합법: 객체가 탐지되었습니다."
            print("Assistive device detected. Status: 합법: 객체가 탐지되었습니다.")
        else:
            logging.info("No assistive device detected.")
            assist_status = "불법: 객체가 탐지되지 않았습니다."
            print("No assistive device detected. Status: 불법: 객체가 탐지되지 않았습니다.")

        # 바운딩 박스 시각화 및 출력
        results.show()  # 모델의 기본 시각화 기능을 사용하여 바운딩 박스 표시
        return assist_status

    except Exception as e:
        logging.error(f"Error in analyze_assist_device: {e}")
        print(f"Error in analyze_assist_device: {e}")
        return "Error during assist device analysis."



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

@app.get("/")
async def root():
    return {"message": "FastAPI Server is running!"}
