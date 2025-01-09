// Desc : BlankNode 컴포넌트

import { Handle, Position } from "reactflow";
import Flowlayout from "./Flowlayout";

export default function BlankNode(props) {
  // props 값을 콘솔에 출력 (디버깅용)
  console.log({ props });

  return (
    <>
      {/* 
        Handle 컴포넌트 : React Flow에서 노드의 입력 핸들 ( 연결점 ) 을 생성
        - type="target" : 입력 핸들을 정의
        - position={Position.Top} : 핸들의 위치를 노드의 상단으로 설정
      */}
      {/* <Handle type="target" position={Position.Top} /> */}


      {/* Flowlayout 컴포넌트를 렌더링 */}
      {/* Flowlayout 컴포넌트에 props와 유형(type)을 전달 */}
      <Flowlayout nodeData={props} type="stepNode" />


      {/* 
        Handle 컴포넌트 : React Flow에서 노드의 출력 핸들(연결점)을 생성
        - type="source" : 출력 핸들을 정의
        - position={Position.Bottom} : 핸들의 위치를 노드의 하단으로 설정
        (현재 주석 처리되어 사용되지 않음)
      */}
      {/* <Handle type="source" position={Position.Bottom} /> */}
    </>
  );
}
