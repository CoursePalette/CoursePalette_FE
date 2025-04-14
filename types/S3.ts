// presigned url 발급 요청 시 백엔드로 보내는 데이터 타입
export interface PresignedUrlRequest {
  fileName: string;
  contentType: string; // 파일 MIME 타입
}

// presigned url 발급 응답 데이터 타입
export interface PresignedUrlResponse {
  presignedUrl: string; // s3 업로드용 임시 url
  imageUrl: string; // 업로드 완료 후 DB에 저장될 최종 이미지 url
}
