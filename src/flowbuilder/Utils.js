// Desc : FlowBuilder에서 사용되는 유틸 함수 및 초기 데이터를 정의하는 파일이다.

import { v4 as uuidv4 } from "uuid";
import { flowIcons } from "./flowIcons";

// lodash 라이브러리 임포트 ( 데이터 중복 제거 및 유틸 함수 사용 )
import _ from "lodash";

// React Flow에서 제공하는 MarkerType 임포트 ( 엣지의 화살표 마커 설정 )
import { MarkerType } from "reactflow";

// 노드 유형을 정의하는 객체
export const NodeTypes = {
  InputNode: "InputNode", // 입력 노드
  StepNode: "StepNode", // 일반적인 단계 노드
  Condition: "Condition", // 조건 노드
  startNode: "startNode", // 시작 노드
  FloatNode: "FloatNode", // 떠 있는 노드
  End: "EndNode", // 종료 노드
};

// 엣지 유형을 정의하는 객체
export const EdgeTypes = {
  bridge: "bridge", // 아이콘만 있는 브릿지 엣지
  custom: "custom", // 레이블과 아이콘을 포함한 커스텀 엣지
  default: "default", // 기본 엣지
  smoothstep: "smoothstep", // 부드러운 곡선 엣지
};

// 노드 유형의 예제를 정의하는 배열 (단계별 노드)
export const nodeTypeStage = [
  {
    id: 1,
    label: "Input", // 노드 이름
    type: "InputNode", // 노드 유형
    stepType: "email",  // 단계 유형
  },
  {
    id: 2,
    label: "Condition",
    type: "Condition",
    stepType: "email",
  },
  {
    id: 3,
    label: "End the process",
    type: "EndNode",
    stepType: "email",
  }
];

// 조건 노드의 예제를 정의하는 배열
export const nodeTypeCondtion = [
  {
    id: 1,
    label: "Condition",
    Icon: flowIcons.HasEmail,
    type: "Condition",
    stepType: "email",
  },
];

// 초기 노드 배열 정의 (프로세스 시작 노드)
const initialNodes = [
  {
    id: "start-node", // 고유 ID
    type: "startNode",  // 노드 유형
    position: { x: 0, y: 0 }, // 초기 위치
    data: {
      description: "Begin the process", // 설명
      stepType: "start",  // 단계 유형
      conditions: [], // 조건 배열
    },
  },
];

// 초기 엣지 배열 정의
const initialEdges = [
  {
    id: "edge-button2", // 고유 ID
    source: "start-node", // 시작 노드 ID
    target: "node-4", // 대상 노드 ID
    type: "default",  // 엣지 유형
    data: {
      condition: "",  // 조건
      icon: false,  // 아이콘 표시 여부
    },
    markerEnd: {
      type: MarkerType.Arrow, // 끝 마커 유형 ( 화살표 )
      width: 24,  // 화살표 너비
      height: 24, // 화살표 높이
      color: "#335CCB", // 색상
    },
  },
];


// 새로운 노드를 추가하는 함수
const addNewNode = (data, currentNode) => {
  let newFlowId = uuidv4(); // 고유 ID 생성
  let newNode = {
    id: newFlowId,
    type: data.type,
    position: {
      x: Math.floor(Math.random() * 100) + currentNode?.position?.x,  // 랜덤 X 좌표
      y: Math.floor(Math.random() * 400) + currentNode?.position?.y - 20, // 랜덤 Y 좌표
    },
    data: {
      description: data.label,  // 노드 설명
      conditions: [], // 조건 초기화
    },
  };
  return newNode;
};

// 빈 노드를 추가하는 함수
const addEmptyNode = (data) => {
  let newFlowId = uuidv4();
  let newNode = {
    id: newFlowId,
    type: data.type,
    position: {
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 400),
    },
    data: {
      description: data.label,
      stepType: data.stepType,
      conditions: [],
    },
  };
  return newNode;
};

// 특정 위치와 크기를 지정하여 노드를 추가하는 함수
const addBlankNode = (data) => {
  let newFlowId = uuidv4();
  let newNode = {
    id: newFlowId,
    type: data.type,
    position: data.position,
    data: {
      description: data.label,
      stepType: data.stepType,
      conditions: [],
      height: data.height,
      width: data.width,
    },
  };
  return newNode;
};

// Float 노드를 추가하는 함수
const addNewFloatNode = (currentNode) => {
  let newFlowId = uuidv4();
  let newNode = {
    id: newFlowId,
    type: NodeTypes.FloatNode,
    position: { x: currentNode.position.x, y: currentNode.position.y + 100 },
    data: {
      description: "",
      stepType: "",
      conditions: [],
    },
  };
  return newNode;
};

// 조건 엣지를 추가하는 함수
const addNewConditionEdge = (sourceId, targetId, condition, icon) => {
  let newEdgeId = uuidv4();
  let newEdge = {
    id: newEdgeId,
    source: sourceId,
    target: targetId,
    labelBgBorderRadius: 4,
    type: EdgeTypes.custom,
    data: {
      condition,
      icon,
    },
    style: { stroke: "black", strokeWidth: "1.3" },
    markerEnd: {
      type: MarkerType.Arrow,
      width: 24,
      height: 24,
      color: "#335CCB",
    },
  };
  return newEdge;
};

// 기본 엣지를 추가하는 함수
const addNewEdge = (sourceId, targetId, type, condition) => {
  let newEdgeId = `${sourceId + ">" + targetId}`;
  let newEdge = {
    id: newEdgeId,
    source: sourceId,
    target: targetId,
    type: type,
    style: { stroke: "black", strokeWidth: "1.3" },
    labelBgBorderRadius: 4,
    markerEnd: {
      type: MarkerType.Arrow,
      width: 24,
      height: 24,
      color: "#335CCB",
    },
    data: {
      icon: false,
      condition: condition ?? "",
    },
  };
  return newEdge;
};

// 노드 및 엣지 데이터를 JSON으로 변환하고 파일로 저장하는 함수
function toJSON(elements) {
  const downloadLink = document.createElement("a");
  const fileBlob = new Blob([JSON.stringify(elements, null, 2)], {
    type: "application/json",
  });
  downloadLink.href = URL.createObjectURL(fileBlob);
  downloadLink.download = `voiceBuilder.json`;
  downloadLink.click();
}

// 데이터 중복을 확인하는 함수
const checkduplicity = (arrayData) => {
  const itemsData = arrayData.filter((value, index) => {
    const _value = JSON.stringify(value);
    return (
      index ===
      arrayData.findIndex((obj) => {
        return JSON.stringify(obj) === _value;
      })
    );
  });
  return itemsData;
};

// 두 배열의 중복 요소를 제거하는 함수
const removeDuplicates = (array1, array2) =>
  array1.filter((item) => array2.includes(item));

// 배열의 ID를 기준으로 중복을 제거하는 함수
function removeDuplicatesById(array1, array2) {
  const combinedArray = [...array1, ...array2];
  const uniqueArray = _.uniqBy(combinedArray, "id");
  return uniqueArray;
}

// 배열의 ID를 기준으로 유사한 요소를 제거하는 함수
function removeSimilarById(array1, array2) {
  const uniqueArray1 = _.differenceBy(array1, array2, "id");
  return uniqueArray1;
}

// 여러 함수와 초기 데이터를 내보내기
export {
  addNewNode,
  addNewFloatNode,
  addNewConditionEdge,
  addNewEdge,
  toJSON,
  checkduplicity,
  removeDuplicates,
  removeDuplicatesById,
  removeSimilarById,
  addEmptyNode,
  addBlankNode,
  initialNodes,
  initialEdges,
};
