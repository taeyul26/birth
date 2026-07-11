# 돌 초대장

첫돌 모바일 초대장 정적 웹페이지입니다. 빌드 과정 없이 GitHub Pages로 바로 배포할 수 있습니다.

## 구조

```
birth-invitation/
├── index.html
├── css/style.css
├── js/main.js
├── images/        # 실제 사진 추가 위치
└── README.md
```

## 로컬 확인

`index.html` 파일을 브라우저로 열면 바로 확인할 수 있습니다.

## 내용 채우기 (현재는 전부 placeholder)

- `index.html`의 `OOO`, 날짜, 장소, 주소 등을 실제 정보로 교체
- `images/` 폴더에 사진을 넣고 `.cover-photo`, `.gallery-item` 배경/내용을 이미지로 교체
- 카카오맵 연동 방법은 `js/main.js` 하단 주석 참고

## GitHub Pages 배포

1. GitHub에 새 저장소 생성
2. 이 폴더 내용을 push
3. 저장소 Settings → Pages → Source를 `main` 브랜치 `/ (root)`로 설정
4. `https://<username>.github.io/<repo>` 로 접속 확인
