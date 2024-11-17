import cv2
import requests
import time
import os
import boto3
import mysql.connector as mysql
import logging
 # import sys
# import threading

# 서버 및 클라우드 URL
SERVER_URL = 'http://192.168.200.161:8000/upload/'  # FastAPI 서버 URL(컴퓨터ip)
# 네이버 클라우드 URL
service_name = 's3'
endpoint_url = 'https://kr.object.ncloudstorage.com'
bucket_name = 'four-people-project'
region_name = 'kr-standard'
ACCESS_KEY = 'ACCESS_KEY'
SECRET_KEY = 'SECERT_KEY'

# MySQL 연결 설정
DB_CONFIG = {
    'user': 'Insa5_JSB_final_1',
    'password': 'aischool1',
    'host': 'project-db-stu3.smhrd.com',
    'database': 'Insa5_JSB_final_1',
    'port':'3307'
    }

# 저장 경로 설정
VIDEO_PATH = '/home/pi/videos/'
PHOTO_PATH = '/home/pi/photos/'
 
# 카메라 초기화
camera = cv2.VideoCapture(0)
is_recording = False  # 동영상 촬영 상태

# 동영상 저장 설정
# fourcc = cv2.VideoWriter_fourcc(*'XVID')

def start_video_recording():
    """
    동영상 촬영 시작
    """
    os.makedirs(VIDEO_PATH, exist_ok=True)
    video_file = os.path.join(VIDEO_PATH, f"video_{int(time.time())}.mp4")
   
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(video_file, fourcc, 20.0, (640, 480))
    return video_file, out

def capture_frame():
    """
    현재 프레임 캡처
    """
    os.makedirs(PHOTO_PATH, exist_ok=True)
    ret, frame = camera.read()
    if ret:
        photo_file = os.path.join(PHOTO_PATH, f"photo_{int(time.time())}.jpg")
        cv2.imwrite(photo_file, frame)
        print(f"Captured photo: {photo_file}")
        return photo_file
    return None

def send_to_server(image_path, video_filename):
    """
    서버로 이미지 전송과 동영상 파일명을 함께 전송
    """
    with open(image_path, 'rb') as f:
        files = {'file': f}
        data = {'video_filename': video_filename}
        response = requests.post(SERVER_URL, files=files, data=data)
        return response.json()

def upload_to_cloud(file_path):
    """
    클라우드에 동영상 업로드
    """
    s3 = boto3.client(service_name, endpoint_url=endpoint_url, aws_access_key_id=ACCESS_KEY,
                      aws_secret_access_key=SECRET_KEY)
    filename = os.path.basename(file_path)
    cloud_url = f'{endpoint_url}/{bucket_name}/{filename}'

    try:
        s3.upload_file(file_path, bucket_name, filename)
        print(f'Successfully uploaded {filename} to {bucket_name}')

        # 메타데이터(동영상url)를 DB에 저장
        store_metadata_in_db(filename, cloud_url)
        return {'message': 'Upload successful', 'url': cloud_url}
   
    except Exception as e:
        print(f'Failed to upload {filename}: {str(e)}')
        return {'error': str(e)}

def store_metadata_in_db(filename, url):
    """
    MySQL 데이터베이스에 메타데이터 저장
    """
    upload_time = time.strftime('%Y-%m-%d %H:%M:%S')
    conn = None

    print(f'Attempting to store metadata in DB for filename: {filename}, URL: {url}')

    try:
        conn = mysql.connect(**DB_CONFIG)
        cursor = conn.cursor()

        logging.info(f'Inserting into DB - Filename: {filename}, URL: {url}, Upload Time: {upload_time}')

        sql = 'INSERT INTO VIOLATION (filename, url, upload_time) VALUES (%s, %s, %s)'
        cursor.execute(sql, (filename, url, upload_time))

        conn.commit()
        print(f'Metadata for {filename} inserted into database.')

    except mysql.Error as err:
        print(f'Error: {err}')
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# 실행 흐름
if __name__ == "__main__":
    try:
        while True:
            ret, frame = camera.read()
            if not ret:
                break

            cv2.imshow("Press 'r' to start/stop recording, 'c' to capture frame, 'q' to quit", frame)

            key = cv2.waitKey(1) & 0xFF

            if key == ord('r'):
                if not is_recording:
                    print("Starting video recording...")
                    video_file, out = start_video_recording()
                    is_recording = True
                else:
                    print("Stopping video recording...")
                    is_recording = False
                    out.release()

           
            elif key == ord('c') and is_recording:
                try:
                    print("첫 번째 캡처 - 번호판 분석용...")
                    plate_photo = capture_frame()
                    if plate_photo and 'video_file' in locals():
                        # 클라우드 업로드
                        print('클라우드에 영상 업로드')
                        cloud_response = upload_to_cloud(video_file)
                        print('Cloud Upload Response:', cloud_response)
                       
                        # 첫 번째 사진으로 번호판 분석
                        print("번호판 분석을 위해 서버로 전송중...")
                        print(f"전송할 파일: {plate_photo}")
                        plate_response = send_to_server(plate_photo, os.path.basename(video_file))
                        print(f"번호판 분석 응답: {plate_response}")
                       
                        if plate_response:
                            if plate_response.get("status") == "장애인 등록 차량" and plate_response.get("action") == "capture_assist":
                                print("\n장애인 차량 확인됨 - 보조기구 확인을 위해 5초 대기...")
                                time.sleep(5)
                               
                                # 두 번째 캡처 - 보조기구 확인용
                                # 카메라 프레임 갱신을 위한 루프
                            for _ in range(10):  # 몇 프레임 읽어서 버퍼 초기화
                                ret, frame = camera.read()
                                cv2.imshow("Press 'c' to capture assist device, 'q' to quit", frame)
                                cv2.waitKey(1)
                           
                            print("\n보조기구 확인을 위해 프레임 캡처 준비...")
                            print("'c' 키를 눌러 보조기구를 캡처하세요...")
                           
                            # 보조기구 캡처를 위한 대기
                            while True:
                                ret, frame = camera.read()
                                if not ret:
                                    break
                               
                                cv2.imshow("Press 'c' to capture assist device, 'q' to quit", frame)
                                key = cv2.waitKey(1) & 0xFF
                               
                                if key == ord('c'):
                                    print("보조기구 캡처 중...")
                                    assist_photo = capture_frame()
                                    if assist_photo:
                                        print(f"보조기구 확인용 사진 촬영 완료: {assist_photo}")
                                        # 보조기구 분석 요청
                                        assist_url = "http://192.168.200.161:8000/assist_check/"  # 컴터 IP 주소 수정
                                        try:
                                            with open(assist_photo, 'rb') as f:
                                                assist_files = {'file': f}
                                                assist_data = {
                                                    'video_filename': os.path.basename(video_file),
                                                    'plate_number': plate_response.get('plate_number')          
                                                               }
                                                print(f"Sending assist device check request with data: {assist_data}")
                                                assist_response = requests.post(
                                                    assist_url,
                                                    files=assist_files,
                                                    data=assist_data
                                                )
                                            if assist_response.status_code == 200:
                                                print("보조기구 분석 결과:", assist_response.json())
                                            else:
                                                print(f"보조기구 분석 요청 실패: {assist_response.status_code}")
                                        except Exception as e:
                                            print(f"보조기구 분석 요청 중 에러 발생: {e}")
                                    break
                                elif key == ord('q'):
                                    print("보조기구 캡처 취소")
                                    break
                        else:
                            print("일반 차량 또는 미등록 차량으로 처리됨:", plate_response.get("status"))
                    else:
                        print('영상 파일이 준비되지 않았습니다. 녹화를 먼저 시작하세요.')
                except Exception as e:
                    print(f"캡처 및 분석 중 에러 발생: {e}")

            elif key == ord('q'):
                print("Exiting...")
                break

            if is_recording:
                out.write(frame)

        if is_recording:
            out.release()
            print("Uploading video to cloud...")
            cloud_response = upload_to_cloud(video_file)
            print("Cloud Upload Response:", cloud_response)

    finally:
        camera.release()
        cv2.destroyAllWindows()