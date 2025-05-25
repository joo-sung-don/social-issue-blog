import React from 'react';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">이용약관</h1>
      
      <div className="prose prose-lg">
        <p className="mb-4">
          본 이용약관은 ISSUE:DA(이하 "사이트")를 이용함에 있어 사이트와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">제1조 (목적)</h2>
        <p>
          본 약관은 ISSUE:DA가 제공하는 모든 서비스(이하 "서비스")의 이용조건 및 절차, 이용자와 ISSUE:DA의 권리, 의무, 책임사항을 규정함을 목적으로 합니다.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">제2조 (약관의 효력과 변경)</h2>
        <p>
          1. 본 약관은 서비스를 이용하고자 하는 모든 이용자에게 적용됩니다.<br />
          2. ISSUE:DA는 합리적인 사유가 있는 경우 약관을 변경할 수 있으며, 변경된 약관은 사이트 내 공지사항에 게시하거나 기타 방법으로 이용자에게 공지함으로써 효력이 발생합니다.<br />
          3. 이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단할 수 있으며, 계속적인 서비스 이용은 약관 변경에 대한 동의로 간주됩니다.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">제3조 (서비스 이용)</h2>
        <p>
          1. 이용자는 ISSUE:DA의 서비스를 이용함에 있어 관련 법령, 본 약관, 세부 이용지침 및 공지사항 등을 준수해야 합니다.<br />
          2. 이용자는 ISSUE:DA의 서비스를 이용함에 있어 다음 각 호의 행위를 해서는 안 됩니다:<br />
          &nbsp;&nbsp;&nbsp;&nbsp;a. 타인의 개인정보를 도용하거나 허위정보를 등록하는 행위<br />
          &nbsp;&nbsp;&nbsp;&nbsp;b. ISSUE:DA가 제공하는 서비스를 이용하여 얻은 정보를 ISSUE:DA의 사전 승낙 없이 복제, 변경, 출판, 방송 등에 사용하거나 제3자에게 제공하는 행위<br />
          &nbsp;&nbsp;&nbsp;&nbsp;c. ISSUE:DA 및 제3자의 저작권, 상표권 등 지적재산권을 침해하는 행위<br />
          &nbsp;&nbsp;&nbsp;&nbsp;d. 범죄 행위를 목적으로 하거나 범죄를 교사하는 행위<br />
          &nbsp;&nbsp;&nbsp;&nbsp;e. 선량한 풍속, 기타 사회질서를 해치는 행위
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">제4조 (저작권)</h2>
        <p>
          1. ISSUE:DA가 제공하는 서비스 및 콘텐츠에 대한 저작권 및 기타 지적재산권은 ISSUE:DA에 귀속됩니다.<br />
          2. 이용자는 ISSUE:DA가 제공하는 서비스를 이용함으로써 얻은 정보를 ISSUE:DA의 사전 승낙 없이 복제, 송신, 출판, 배포, 방송 기타 방법에 의하여 영리목적으로 이용하거나 제3자에게 이용하게 하여서는 안 됩니다.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">제5조 (면책조항)</h2>
        <p>
          1. ISSUE:DA는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등 불가항력적인 사유로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 대한 책임을 지지 않습니다.<br />
          2. ISSUE:DA는 이용자의 귀책사유로 인한 서비스 이용의 장애에 대하여 책임을 지지 않습니다.<br />
          3. ISSUE:DA는 이용자가 서비스를 이용하여 기대하는 수익을 상실한 것에 대하여 책임을 지지 않으며, 그 밖에 서비스를 통하여 얻은 자료로 인한 손해에 관하여 책임을 지지 않습니다.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">제6조 (약관의 해석)</h2>
        <p>
          본 약관에 명시되지 않은 사항이나 해석에 관한 사항은 관련 법령 및 ISSUE:DA의 세부이용지침, 공지사항 등에 따릅니다.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">제7조 (관할법원)</h2>
        <p>
          서비스 이용으로 발생한 분쟁에 대해 소송이 제기될 경우 ISSUE:DA의 소재지를 관할하는 법원을 전속 관할법원으로 합니다.
        </p>
        
        <div className="mt-8 text-gray-600">
          <p>시행일자: 2023년 1월 1일</p>
          <p>최종 수정일: {new Date().getFullYear()}년 {new Date().getMonth() + 1}월 {new Date().getDate()}일</p>
        </div>
      </div>
    </div>
  );
} 