import React from 'react';

export default function CopyrightPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">저작권 정책</h1>
      
      <div className="prose prose-lg">
        <p className="mb-4">
          ISSUE:DA(이하 "사이트")는 지식 재산권을 존중하며, 사이트에 게시된 모든 콘텐츠의 저작권 보호를 위해 최선을 다하고 있습니다. 이 저작권 정책은 사이트의 콘텐츠 이용에 관한 지침을 제공합니다.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. 저작권 소유</h2>
        <p>
          사이트에 게시된 모든 콘텐츠(텍스트, 이미지, 그래픽, 로고, 아이콘, 오디오 클립, 디지털 다운로드, 데이터 편집물, 소프트웨어 등)는 사이트 또는 콘텐츠 제공자의 자산이며 국내 및 국제 저작권법에 의해 보호받습니다. 사이트의 편집 구성 및 배열을 포함한 모든 콘텐츠는 사이트의 독점적 재산입니다.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. 콘텐츠 이용 제한</h2>
        <p>
          사이트는 개인적, 비상업적 용도로 사이트의 콘텐츠를 보거나 다운로드할 수 있는 제한적 라이선스를 부여합니다. 이 라이선스는 다음을 허용하지 않습니다:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>사이트 콘텐츠의 상업적 이용</li>
          <li>사이트 콘텐츠의 재배포, 공개 전시, 공개 실행, 복제, 다운로드, 저장 또는 전송</li>
          <li>사이트 콘텐츠의 수정 또는 파생물 제작</li>
          <li>저작권, 상표 또는 기타 소유권 표시 제거</li>
        </ul>
        <p>
          위의 제한 사항 외에, 사이트의 콘텐츠는 사전 서면 동의 없이 다른 웹사이트나 네트워크 컴퓨터 환경에서 어떠한 목적으로도 복제, 복사, 또는 재사용할 수 없습니다.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. 인용 및 출처 표시</h2>
        <p>
          학술, 교육, 연구 또는 비상업적 목적으로 사이트의 콘텐츠를 부분적으로 인용할 경우, 다음과 같이 출처를 명확히 표시해야 합니다:
        </p>
        <div className="bg-gray-100 p-4 rounded my-4">
          <p className="italic">
            출처: ISSUE:DA, "[게시물 제목]", [게시일], [URL]
          </p>
        </div>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. 제3자 콘텐츠</h2>
        <p>
          사이트는 때때로 제3자가 소유한 콘텐츠를 포함할 수 있습니다. 이러한 콘텐츠는 해당 소유자의 허가를 받아 사용되며, 해당 소유자의 저작권 및 이용 약관의 적용을 받습니다. 사이트는 제3자 콘텐츠에 대해 명확한 출처를 표시하기 위해 노력합니다.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">5. 사용자 제출 콘텐츠</h2>
        <p>
          사용자가 사이트에 댓글, 리뷰 또는 기타 자료를 제출함으로써, 사용자는 사이트에 해당 콘텐츠를 사용, 복제, 수정, 배포, 전시할 수 있는 비독점적, 무료, 영구적, 취소 불가능한 라이선스를 부여합니다. 사용자는 자신이 제출한 콘텐츠에 대한 저작권을 보유하지만, 사이트가 해당 콘텐츠를 자유롭게 사용할 수 있음을 인정합니다.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">6. 저작권 침해 신고</h2>
        <p>
          사이트는 타인의 저작권을 존중하며, 사이트의 사용자도 같은 태도를 가지기를 기대합니다. 사이트에 게시된 콘텐츠가 귀하의 저작권을 침해한다고 생각하는 경우, 다음 정보와 함께 저작권 침해 신고를 제출해 주시기 바랍니다:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>저작권 소유자 또는 대리인의 서명(전자 또는 물리적)</li>
          <li>침해되었다고 주장하는 저작물의 식별</li>
          <li>침해하는 것으로 주장하는 자료의 식별 및 위치 정보</li>
          <li>연락처 정보(주소, 전화번호, 이메일 등)</li>
          <li>침해 주장이 선의로 이루어졌다는 진술</li>
          <li>위의 정보가 정확하며 귀하가 저작권 소유자 또는 소유자를 대리할 권한이 있다는 진술</li>
        </ul>
        <p>
          저작권 침해 신고는 다음 이메일 주소로 보내주시기 바랍니다: [이메일 주소]
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">7. 정책 위반에 대한 조치</h2>
        <p>
          본 저작권 정책을 위반하는 경우, 사이트는 다음과 같은 조치를 취할 수 있습니다:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>위반 콘텐츠의 삭제</li>
          <li>위반 사용자의 사이트 접근 제한 또는 계정 정지</li>
          <li>저작권법에 따른 법적 조치</li>
        </ul>

        <div className="mt-8 text-gray-600">
          <p>시행일자: 2023년 1월 1일</p>
          <p>최종 수정일: {new Date().getFullYear()}년 {new Date().getMonth() + 1}월 {new Date().getDate()}일</p>
        </div>
      </div>
    </div>
  );
} 