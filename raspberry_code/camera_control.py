import cv2
import requests
import time
import os

# 서버 및 클라우드 URL
SERVER_URL = 'http://<fastapi-server-ip>:8000/upload/'  # FastAPI 서버 URL
CLOUD_UPLOAD_URL = 'https://kr.object.ncloudstorage.com/upload'  # 네이버 클라우드 URL

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

def send_to_server(file_path):
    """
    서버로 이미지 전송
    """
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(SERVER_URL, files=files)
        return response.json()

def upload_to_cloud(file_path):
    """
    클라우드에 동영상 업로드
    """
    with open(file_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(CLOUD_UPLOAD_URL, files=files)
        return response.json()

# 실행 흐름
if __name__ == "__main__":
    try:
        while True:
            ret, frame = camera.read()
            if not ret:
                break

            # 화면에 실시간 프레임 출력
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
                if photo_file:
                    print("Sending photo to server...")
                    response = send_to_server(photo_file)
                    print("Server Response:", response)

            elif key == ord('q'):
                print("Exiting...")
                break

            if is_recording:
                out.write(frame)

        # 동영상 업로드
        if is_recording:
            out.release()
            print("Uploading video to cloud...")
            cloud_response = upload_to_cloud(video_file)
            print("Cloud Upload Response:", cloud_response)

    finally:
        # 리소스 해제
        camera.release()
        cv2.destroyAllWindows()