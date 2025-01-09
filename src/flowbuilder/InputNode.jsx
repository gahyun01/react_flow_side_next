// Desc : InputNode 컴포넌트 정의

import { Handle, Position } from "reactflow";
import Flowlayout from "./Flowlayout";

const InputNode = (props) => {
    return (
        <>
        {/* Flowlayout으로 InputNode의 레이아웃과 데이터를 처리 */}
        <Flowlayout nodeData={props} type="InputNode" />
        
        {/* 출력 핸들(소스 핸들): 하단에 위치하며 다른 노드와 연결 */}
        <Handle
            type="source" // 데이터가 다른 노드로 출력
            position={Position.Bottom} // 핸들의 위치를 하단에 설정
        />
        </>
    );
}

export default InputNode;