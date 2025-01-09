// Desc : 버튼 요소를 렌더링하는 컴포넌트이다.

import React from "react";

// Button 컴포넌트 정의
export const Button = ({ children, ...props }) => {
  return (
    // 기본적인 스타일링 및 전달받은 props를 적용한 버튼
    <button className="px-5 py-2 bg-black text-white rounded" {...props}>
      {/* 버튼의 자식 요소를 렌더링 */}
      {children}
    </button>
  );
};