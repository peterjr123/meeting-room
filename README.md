# 애플리케이션 설치 및 실행 가이드

## 1. 저장소 클론
먼저 애플리케이션 저장소를 클론합니다
```bash
git clone https://github.com/peterjr123/meeting-room.git
```

## 2. 폴더명 변경
Next.js와 FastAPI 애플리케이션의 루트 폴더의 이름을 변경해야 합니다
```bash
cd meeting-room
chmod 500 ./*.sh # 스크립트 권한 설정
./rename.sh # 폴더 이름을 변경
./delete.sh # 이전 폴더 삭제
```

## 5. Docker 설치 (필요한 경우)
Docker가 설치되어 있지 않은 환경이라면 아래 스크립트를 실행하여 Docker를 설치합니다
```bash
./install_docker
```

## 6. 애플리케이션 실행
Docker Compose를 사용하여 애플리케이션을 빌드하고 백그라운드에서 실행합니다
```bash
docker compose up -d --build
```

## 참고
- Docker 설치 후, 권한 문제로 `sudo`가 필요할 수 있습니다
     ```bash
    sudo docker compose up -d --build
    ```
- 애플리케이션이 정상적으로 실행되었는지 확인하려면 다음 명령어를 사용하시면 됩니다
    ```bash
    docker container ls
    ```

## 실행시 오류
- ### docker container ls에서 meeting_room_fastapi가 정상적으로 실행되지 않은 경우   
  FastAPI의 경우 MySQL이 실행되기 전에 Load된 경우에 Connection 연결에 실패할 수 있습니다.  
  Docker Compose에서 health check를 수행하지 있으나, 특히 첫 compose up에서는 사양에 따라 load 시간이 오래 걸려 실패할 수 있습니다. 
  ```bash
    docker logs meeting_room_fastapi
    ```
     해당 명령어를 통해 Connection Refused 에러가 발생한 것을 확인한 경우 compose down 후 다시 compose up을 시도해 주시길 바랍니다.
