import cv2
import requests
import time
import os
import boto3
import mysql.connector as mysql
import logging

# 서버 및 클라우드 URL
SERVER_URL = 'http://192.168.20.235:8000/upload/'  # FastAPI 서버 URL(컴퓨터 ip)
endpoint_url = 'https://kr.object.ncloudstorage.com'  # 네이버 클라우드 URL
service_name = 's3'
bucket_name = 'four-people-project'
region_name = 'kr-standard'
ACCESS_KEY = 'Access key ID'
SECRET_KEY = 'Secret key'

# MySQL 연결 설정
DB_CONFIG = {
    'user': 'Insa5_JSB_final_1',
    'password':'aischool1',
    'host':'project-db-stu3.smhrd.com',
    'database':'Insa5_JSB_final_1',
    'port':'3307'
}

# 저장 경로 설정
VIDEO_PATH = '/home/pi/videos/'
PHOTO_PATH = '/home/pi/photos/'

# 카메라 초기화
camera = cv2.VideoCapture(0)
is_recording = False  # 동영상 촬영 상태

# 동영상 저장 설정
fourcc = cv2.VideoWriter_fourcc(*'XVID')

def start_video_recording():
    """
    동영상 촬영 시작
    """
    os.makedirs(VIDEO_PATH, exist_ok=True)
    video_file = os.path.join(VIDEO_PATH, f"video_{int(time.time())}.avi")
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
                print("Capturing frame...")
                photo_file = capture_frame()
                if photo_file and 'video_file' in locals():  # 동영상 파일 확인
                    print('Uploading video to cloud before sending photo to server...')
                   
                    # 동영상 업로드
                    cloud_response = upload_to_cloud(video_file)
                    print('Cloud Upload Response:', cloud_response)

                    # 첫 번째 이미지 전송(번호판 분석)
                    print("Sending first photo to server...")
                    response = send_to_server(photo_file, os.path.basename(video_file))
                    print("Server Response:", response)

                    # 서버 응답 확인 및 추가 행동
                    if response.get("action") == "capture_assist":
                        print("Waiting 5 seconds for second capture...")
                        time.sleep(5)
                        
                        # 두 번째 캡처 수행
                        assist_photo_file = capture_frame()
                        if assist_photo_file:
                            print("Sending second photo to server for assistive device analysis...")
                            assist_response = send_to_server(assist_photo_file, os.path.basename(video_file))
                            print("Assist Server Response:", assist_response)
                else:
                    print("Video file is not available yet. Please start recording before capturing.")

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