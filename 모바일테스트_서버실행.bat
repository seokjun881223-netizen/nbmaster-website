@echo off
chcp 65001 > nul
echo.
echo [난방 마스터] 모바일 테스트 서버를 시작합니다.
echo PC와 휴대폰을 같은 Wi-Fi에 연결하세요.
echo 휴대폰에서는 127.0.0.1이 아니라 PC의 IPv4 주소를 사용하세요.
echo 예: http://172.30.1.83:5500/index.html
echo.
python -m http.server 5500 --bind 0.0.0.0
pause
