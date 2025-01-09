// Desc : StartNode 컴포넌트를 정의

import { Handle, Position } from "reactflow";
import Flowlayout from "./Flowlayout";

// StartNode라는 함수형 React 컴포넌트를 정의합니다.
export default function StartNode(props) {
  return (
    <>
      {/* Flowlayout 컴포넌트를 사용해 노드 레이아웃을 정의합니다. */}
      <Flowlayout nodeData={props} type="startNode" />
      
      {/* React Flow의 Handle을 사용해 소스 핸들(출력 핸들)을 정의합니다. */}
      <Handle
        type="source" // 핸들의 타입을 소스(출력)으로 설정합니다.
        position={Position.Bottom} // 핸들의 위치를 노드 하단으로 설정합니다.
      />
    </>
  );
}
