// Desc : EndNode 컴포넌트 정의

import { Handle, Position } from "reactflow";
import Flowlayout from "./Flowlayout";

// EndNode 컴포넌트를 정의하고 내보내기
export default function EndNode(props) {
  return (
    <>
      {/* Flowlayout 컴포넌트를 통해 노드 UI를 렌더링 */}
      {/* nodeData로 props를 전달하고 노드 타입을 "EndNode"로 지정 */}
      <Flowlayout nodeData={props} type="EndNode" />
      
      {/* 노드의 상단에 위치하는 타겟 핸들(입력 연결점) */}
      <Handle
        // style={{ visibility: "hidden" }} // 핸들을 숨길 수 있는 스타일 (현재는 주석 처리됨)
        type="target" // 이 핸들이 입력용 핸들임을 나타냄
        position={Position.Top} // 핸들의 위치를 노드의 상단으로 설정
      />
    </>
  );
}
