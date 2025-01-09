// Desc : FloatNode 컴포넌트 정의

import { PlusIcon } from "@heroicons/react/24/outline";
import { Handle, Position } from "reactflow";

// FloatNode 컴포넌트를 정의
const FloatNode = ({ data }) => {
  return (
    // 노드의 외부 컨테이너 설정
    <div className="flex justify-center min-h-[70px] w-[360px] cursor-grab">
      {/* 타겟 핸들(입력 핸들) 정의 */}
      <Handle
        type="target" // 입력 핸들로 설정
        position={Position.Top} // 핸들의 위치를 노드 상단으로 설정
        style={{ visibility: "hidden" }} // 핸들을 숨김 처리
      />
      {/* 내부 컨텐츠 정의 */}
      <div>
        {/* 플러스 버튼 렌더링 */}
        <button className="edgebutton shadow-lg cursor-pointer">
          {/* 플러스 아이콘 렌더링 */}
          <PlusIcon className="h-4 w-4 flex-shrink-0 font-medium text-[#6039DB]" />
        </button>
      </div>
    </div>
  );
};

// 컴포넌트를 기본 내보내기로 설정
export default FloatNode;
