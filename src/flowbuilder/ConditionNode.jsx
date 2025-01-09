// Desc: ConditionNode 컴포넌트 정의

import { Handle, Position } from "reactflow";
import Flowlayout from "./Flowlayout";

// ConditionNode 컴포넌트 정의
const ConditionNode = (props) => {
  return (
    <>
      {/* 타겟 핸들(연결점)을 노드 상단에 위치 */}
      <Handle
        type="target" // 노드가 "입력"으로 연결될 수 있도록 설정
        // style={{ visibility: "hidden" }} // 핸들의 스타일을 숨길 수 있음 (현재 주석 처리)
        position={Position.Top} // 핸들의 위치를 "위쪽"으로 설정
      />
      
      {/* Flowlayout 컴포넌트로 조건 노드의 UI를 렌더링 */}
      <Flowlayout nodeData={props} type="condition" />
      
      {/* 소스 핸들(연결점)을 노드 하단에 위치 */}
      <Handle
        type="source" // 노드가 "출력"으로 연결될 수 있도록 설정
        // style={{ visibility: "hidden" }} // 핸들의 스타일을 숨길 수 있음 (현재 주석 처리)
        position={Position.Bottom} // 핸들의 위치를 "아래쪽"으로 설정
      />
    </>
  );
};

// ConditionNode 컴포넌트를 기본 내보내기로 설정
export default ConditionNode;
