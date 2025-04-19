/**
 * 이미지 파일을 최대 크기로 리사이징하는 유틸리티 함수
 */

/**
 * 이미지 파일을 canvas를 사용하여 리사이징합니다.
 * @param file 원본 이미지 파일
 * @param maxWidth 최대 너비 (기본값: 1200px)
 * @param maxHeight 최대 높이 (기본값: 800px)
 * @param quality JPEG 압축 품질 (0~1, 기본값: 0.8)
 * @returns Promise<File> 리사이징된 이미지 파일
 */
export async function resizeImage(
  file: File,
  maxWidth: number = 1200,
  maxHeight: number = 800,
  quality: number = 0.8
): Promise<File> {
  return new Promise((resolve, reject) => {
    // 이미지가 아니면 원본 파일 반환
    if (!file.type.startsWith('image/')) {
      return resolve(file);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        // 이미지 크기 계산
        let width = img.width;
        let height = img.height;

        // 이미 충분히 작은 경우 원본 반환
        if (width <= maxWidth && height <= maxHeight) {
          return resolve(file);
        }

        // 비율 유지하면서 크기 조정
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        // Canvas에 그리기
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        // 파일 형식 결정 (원본 유지)
        const format = file.type;

        // Canvas를 Blob으로 변환
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            // 새 파일 생성
            const resizedFile = new File([blob], file.name, {
              type: format,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          },
          format,
          quality
        );
      };

      img.onerror = () => {
        reject(new Error('Image loading error'));
      };
    };

    reader.onerror = () => {
      reject(new Error('FileReader error'));
    };
  });
}

/**
 * 이미지 파일의 용량을 체크하고 필요시 압축합니다.
 * @param file 이미지 파일
 * @param maxSizeMB 최대 용량 (MB) (기본값: 2MB)
 * @returns Promise<File> 압축된 파일
 */
export async function compressImageIfNeeded(
  file: File,
  maxSizeMB: number = 2
): Promise<File> {
  // 최대 용량 (바이트 단위)
  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  // 파일 크기가 최대 용량보다 작으면 원본 반환
  if (file.size <= maxSizeBytes) {
    return file;
  }

  // 용량이 클 경우, 압축 품질 조정
  let quality = 0.8;
  if (file.size > maxSizeBytes * 2) {
    quality = 0.6; // 매우 큰 파일은 더 많이 압축
  } else if (file.size > maxSizeBytes * 1.5) {
    quality = 0.7; // 큰 파일 압축
  }

  // 리사이징 + 압축
  return resizeImage(file, 1200, 800, quality);
} 