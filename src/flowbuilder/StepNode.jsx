// Desc : StepNode 컴포넌트 정의

import { Handle, Position } from "reactflow";
import Flowlayout from "./Flowlayout";

// StepNode라는 함수형 React 컴포넌트를 정의합니다.
export default function StepNode(props) {
  return (
    <>
      {/* React Flow의 Handle 컴포넌트를 사용해 입력 핸들(타겟 핸들)을 정의합니다. */}
      <Handle
        type="target" // 핸들의 타입을 타겟(입력)으로 설정합니다.
        position={Position.Top} // 핸들의 위치를 노드 상단으로 설정합니다.
      />
      
      {/* Flowlayout 컴포넌트를 사용해 노드 레이아웃을 정의합니다. */}
      <Flowlayout nodeData={props} type="stepNode" />
      
      {/* React Flow의 Handle 컴포넌트를 사용해 출력 핸들(소스 핸들)을 정의합니다. */}
      <Handle
        type="source" // 핸들의 타입을 소스(출력)으로 설정합니다.
        position={Position.Bottom} // 핸들의 위치를 노드 하단으로 설정합니다.
      />
    </>
  );
}
