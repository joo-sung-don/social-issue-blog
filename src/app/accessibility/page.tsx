import React from 'react';

export default function AccessibilityPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">접근성 안내</h1>
      
      <div className="prose prose-lg">
        <p className="mb-4">
          ISSUE:DA는 모든 이용자가 불편 없이 사이트의 콘텐츠와 기능에 접근할 수 있도록 최선을 다하고 있습니다.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">1. 접근성에 대한 약속</h2>
        <p>
          웹 콘텐츠 접근성 지침(WCAG) 2.1의 AA 수준을 준수하기 위해 노력하고 있으며, 모든 이용자에게 동등한 정보 접근과 서비스 이용 기회를 제공하고자 합니다.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-4">2. 접근성 기능</h2>
        <ul className="list-disc pl-6 mb-4">
          <li>적절한 대체 텍스트: 모든 이미지에는 스크린 리더가 읽을 수 있는 설명적인 대체 텍스트가 제공됩니다.</li>
          <li>키보드 접근성: 모든 기능은 키보드만으로도 이용할 수 있습니다.</li>
          <li>명확한 구조: 웹 페이지는 논리적이고 일관된 구조로 구성되어 있습니다.</li>
          <li>충분한 색상 대비: 텍스트와 배경 간의 색상 대비는 가독성을 높이기 위해 최적화되었습니다.</li>
          <li>반응형 디자인: 다양한 화면 크기와 기기에서 콘텐츠가 적절하게 표시됩니다.</li>
          <li>가독성 높은 글꼴: 읽기 쉬운 글꼴과 적절한 글자 크기를 사용합니다.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">3. 콘텐츠 이용 팁</h2>
        <ul className="list-disc pl-6 mb-4">
          <li><strong>텍스트 크기 조정</strong>: 대부분의 브라우저에서 Ctrl(Mac의 경우 Cmd) + '+' 또는 '-' 키를 사용하여 텍스트 크기를 조정할 수 있습니다.</li>
          <li><strong>키보드 탐색</strong>: Tab 키를 사용하여 페이지 요소 간 이동, Enter 키를 사용하여 링크 활성화가 가능합니다.</li>
          <li><strong>고대비 모드</strong>: 운영 체제의 고대비 모드를 활성화하면 사이트 내용을 더 쉽게 볼 수 있습니다.</li>
        </ul>

        <h2 className="text-2xl font-semibold mt-8 mb-4">4. 피드백 및 지원</h2>
        <p>
          사이트 이용 중 접근성 문제를 발견하셨거나, 개선 제안이 있으시면 다음 연락처로 알려주시기 바랍니다:
        </p>
        <p className="mb-4">
          이메일: contact@issueda.com
        </p>
        <p>
          귀하의 피드백은 사이트를 개선하는 데 큰 도움이 됩니다. 가능한 한 빠르게 문제를 해결하기 위해 노력하겠습니다.
        </p>

        <div className="mt-8 text-gray-600">
          <p>시행일자: 2023년 1월 1일</p>
          <p>최종 수정일: {new Date().getFullYear()}년 {new Date().getMonth() + 1}월 {new Date().getDate()}일</p>
        </div>
      </div>
    </div>
  );
} 