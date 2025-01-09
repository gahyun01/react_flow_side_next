// Desc : FlowBuilder에서 사용되는 유틸 함수 및 초기 데이터를 정의하는 파일이다.

// 클라이언트에서만 실행되는 React 컴포넌트임을 명시
"use client";
import React, { useState, useCallback } from "react";

import ReactFlow, {
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  BackgroundVariant,
  Panel,
  addEdge,
  MarkerType,
  updateEdge,
  useReactFlow,
  SelectionMode,
} from "reactflow"; // ReactFlow 관련 컴포넌트 및 훅 임포트

import { v4 as uuidv4, v4 } from "uuid";
import _ from "lodash";
import "./styles.css";

// ReactFlow 기본 스타일 시트
import "reactflow/dist/style.css";

// 초기 노드 || 엣지 데이터와 노드 타입 정의
import { NodeTypes, initialEdges, initialNodes } from "../flowbuilder/Utils";

import SelectNodeModal from "../flowbuilder/SelectNodeModal";
import NodeSelectTab from "../flowbuilder/NodeSelectTab";
import useFlowBuilder from "../hooks/useFlowBuilder";
import Navbar from "../flowbuilder/Navbar";
import SideBar from "../flowbuilder/sideBar";
import useElementSize from "@/hooks/useElementSize";



const Flowbuilder = () => {
   // FlowBuilder 관련 커스텀 훅에서 필요한 값 가져오기
  const {
    stepActionHandle,
    stepBlankNode,
    setIsModalOpen,
    setCurrentEdge,
    setCurrentNode,
    setCurrentSideData,
    isModalOpen,
    currentSideData,
    nodeTypes,
    edgeTypes,
  } = useFlowBuilder();

  // ReactFlow의 위치 계산 관련 훅 사용
  const { screenToFlowPosition } = useReactFlow();

  // 컴포넌트 상태 관리
  const [onlySteps, setOnlySteps] = useState(false); // 특정 단계만 활성화 여부
  const [openSidebar, setOpenSidebar] = useState(false); // 사이드바 열림 여부
  const [size, ref] = useElementSize(); // 컴포넌트 크기 측정
  const [nodePosition, setNodePosition] = useState({}); // 노드 위치 관리
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes); // 노드 상태 관리
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges); // 엣지 상태 관리
  const [reactFlowInstance, setReactFlowInstance] = useState(null); // ReactFlow 인스턴스 상태 관리
  const proOptions = { hideAttribution: true }; // ReactFlow Pro 옵션 설정

  // 노드 클릭 이벤트 핸들러
  const handleNodeClick = useCallback(
    (event, node) => {
      const tagName = event.target?.tagName;
      if (tagName !== "DIV" && node.type === NodeTypes.FloatNode) {
        setCurrentNode(node); // 현재 선택된 노드 설정
        setIsModalOpen(true); // 모달 열기
        setOnlySteps(false); // 단계 전용 비활성화
      }
      else if (node.type === NodeTypes.FloatNode) {
        return;
      }
      else {
        setCurrentSideData(node); // 현재 사이드바 데이터 설정
        setOpenSidebar(true); // 사이드바 열기
      }
    },
    [currentSideData.id]  // 의존성: currentSideData.id
  );

  // ReactFlow의 상태를 JSON으로 추출
  const extractedJsonStructure = {
    nodes,
    edges,
  };

  // ReactFlow의 초기 뷰포트 설정
  const defaultViewport = {
    x: size.width / 2 || 750,
    y: 20,
    zoom: 1,
  };

  // 엣지 연결 시 처리 함수
  const onConnect = useCallback(
    (params) => {
      // 노드가 자기 자신과 연결되지 않도록 방지
      if (params.source === params.target) return;

      const addNewEdge = {
        id: uuidv4(), // 유니크 ID 생성
        source: params.source,
        target: params.target,
        type: "custom", // 엣지 유형
        style: { stroke: "black", strokeWidth: "1" }, // 엣지 스타일
        labelBgBorderRadius: 4, // 엣지 라벨 배경 테두리
        markerEnd: {
          type: MarkerType.Arrow, // 화살표 표시
          width: 24,
          height: 24,
          color: "#335CCB",
        },
        data: {
          icon: false,
          condition: "", // 조건 값
        },
      };

      setEdges((eds) => addEdge({ ...addNewEdge, ...params }, eds));  // 엣지 추가
    },
    [setEdges]  // 의존성: setEdges
  );
  
  // 엣지 업데이트 시 처리 함수
  const onEdgeUpdate = useCallback(
    (oldEdge, newConnection) =>
      setEdges((els) => updateEdge(oldEdge, newConnection, els)), // 엣지 업데이트
    []
  );

  // 노드 초기 위치 설정 함수
  const handleInitialPosition = (e) => {
    const { clientX, clientY, offsetX, offsetY } = e.nativeEvent; // 클릭 이벤트 좌표
    const targetIsPane = e.target.classList.contains("react-flow__pane"); // 클릭된 대상이 ReactFlow 영역인지 확인
    if (targetIsPane) {
      const position = screenToFlowPosition({ x: clientX, y: clientY }); // 화면 좌표를 Flow 좌표로 변환
      setNodePosition({
        allPos: { clientX, clientY, offsetX, offsetY },
        position,
      });
    }
  };

  // 노드 최종 위치 설정 함수
  const handleLastPosition = (e) => {
    const { clientX, clientY, offsetX, offsetY } = e.nativeEvent; // 클릭 이벤트 좌표
    const lastNodePosition = { clientX, clientY, offsetX, offsetY }; // 마지막 노드 위치 계산
    const singleBlankNode = getNodeDimensionsAndPosition(
      nodePosition.allPos,
      lastNodePosition
    ); // 노드 크기 및 위치 계산
    Object.assign(singleBlankNode, {
      type: "blank", // 노드 타입
      label: "Blank Node", // 노드 라벨
      id: uuidv4(), // 노드 ID
      position: nodePosition.position,
    });
    stepBlankNode(singleBlankNode); // 새로운 노드 추가
  };

  // 두 위치 간의 노드 크기 및 위치 계산 함수
  function getNodeDimensionsAndPosition(obj1, obj2) {
    const width = Math.abs(obj2.clientX - obj1.clientX); // 폭 계산
    const height = Math.abs(obj2.clientY - obj1.clientY); // 높이 계산
    const left = Math.min(obj1.clientX, obj2.clientX); // 왼쪽 위치
    const top = Math.min(obj1.clientY, obj2.clientY); // 위쪽 위치

    return {
      width,
      height,
      left,
      top,
    };
  }

  // 특정 영역에서 드래그 이동 활성화
  const panOnDrag = [1, 2];

  return (
    <div>
      {/* 네비게이션 바 */}
      <Navbar jsonElements={extractedJsonStructure} />

      {/* 메인 컨테이너 */}
      <div
        style={{
          height: "calc(100vh - 75px)",
        }}
        className="flex justify-center gap-y2 bg-white w-screen"
      >

        {/* ReactFlow 컨테이너 */}
        <div
          className="bg-white"
          style={{
            width:
              openSidebar && currentSideData.id
                ? "calc(100%-40%)" // 사이드바가 열려 있으면 너비를 60%로 조정
                : "100%", // 사이드바가 닫혀 있으면 전체 너비 사용
          }}
        >

          {/* ReactFlow 라이브러리를 사용한 플로우 빌더 */}
          <ReactFlow
            ref={ref} // ReactFlow 인스턴스 참조
            nodes={nodes} // 노드 데이터
            edges={edges} // 엣지 데이터
            onEdgeUpdate={onEdgeUpdate} // 엣지 업데이트 이벤트 핸들러
            onConnect={onConnect} // 엣지 연결 이벤트 핸들러
            nodeTypes={nodeTypes} // 사용자 정의 노드 타입
            edgeTypes={edgeTypes} // 사용자 정의 엣지 타입
            proOptions={proOptions} // Pro 버전 옵션
            onSelectionStart={(e) => handleInitialPosition(e)} // 선택 시작 시 이벤트 핸들러
            onSelectionEnd={(e) => handleLastPosition(e)} // 선택 종료 시 이벤트 핸들러
            zoomOnScroll={false} // 스크롤로 확대/축소 비활성화
            zoomOnPinch={false} // 핀치 확대/축소 비활성화
            elementsSelectable={true} // 요소 선택 가능 여부
            onInit={setReactFlowInstance} // ReactFlow 초기화 핸들러
            zoomOnDoubleClick={false} // 더블 클릭 확대 비활성화
            panOnScroll // 스크롤로 이동 활성화
            selectionOnDrag // 드래그로 선택 가능
            panOnDrag={panOnDrag} // 드래그로 이동 설정
            selectionMode={SelectionMode.Partial} // 부분 선택 모드 활성화
            defaultViewport={defaultViewport} // 초기 뷰포트 설정
            onNodesChange={onNodesChange} // 노드 변경 이벤트 핸들러
            onEdgesChange={onEdgesChange} // 엣지 변경 이벤트 핸들러
            onPaneClick={() => {
              setOpenSidebar(false); // 패널 클릭 시 사이드바 닫기
            }}
            preventScrolling // ReactFlow 영역 내 스크롤 비활성화
            onEdgeClick={(e, f) => {
              // 엣지 클릭 이벤트 핸들러
              if (e.target.tagName === "BUTTON" || e.target.tagName === "svg") {
                setCurrentEdge(f); // 현재 엣지 설정
                setOnlySteps(true); // 특정 플래그 활성화
                setIsModalOpen(true); // 모달 열기
              } else {
                setCurrentSideData(f); // 사이드바에 표시할 데이터 설정
                setOpenSidebar(true); // 사이드바 열기
              }
            }}
            onNodeClick={(e, f) => handleNodeClick(e, f)} // 노드 클릭 이벤트 핸들러
          >

            {/* ReactFlow의 기본 컨트롤러 */}
            <Controls
              showInteractive={false} // 인터랙티브 컨트롤 비활성화
              position="bottom-left" // 컨트롤러 위치
              className="Controls"
            />

            {/* ReactFlow 배경 설정 */}
            <Background
              gap={100} // 배경 선 간격
              color="rgb(243 244 246)" // 배경 선 색상
              size={3} // 배경 선 크기
              variant={BackgroundVariant.Lines} // 배경 선 스타일
            />
            
            {/* ReactFlow 상단 버튼 패널 */}
            <Panel position="top-left">
              <button
                className="rounded-lg py-2.5 px-10 text-sm font-medium rounded-l-lg leading-5 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 bg-blue-800 shadow text-white"
                onClick={() => setIsModalOpen(true)} // 버튼 클릭 시 모달 열기
              >
                Add Empty Node
              </button>
            </Panel>
          </ReactFlow>
        </div>

        {/* 사이드바 컴포넌트 */}
        {openSidebar && currentSideData.id && (
          <SideBar
            sideBarOpen={openSidebar} // 사이드바 열림 여부
            currentSideData={currentSideData} // 현재 사이드바에 표시할 데이터
            openSidebar={openSidebar}
            setOpenSidebar={setOpenSidebar} // 사이드바 열림 상태 업데이트
          />
        )}

        {/* 노드 선택 모달 */}
        <SelectNodeModal
          isModalOpen={isModalOpen} // 모달 열림 여부
          setIsModalOpen={setIsModalOpen} // 모달 열림 상태 업데이트
        >
          <NodeSelectTab stepActionHandle={stepActionHandle} /> {/* 노드 선택 탭 */}
        </SelectNodeModal>
      </div>
    </div>
  );
};

// Home 컴포넌트 정의
const Home = () => {
  return (
    <ReactFlowProvider>
      <Flowbuilder /> {/* Flowbuilder 컴포넌트 렌더링 */}
    </ReactFlowProvider>
  );
};

export default Home; // Home 컴포넌트 내보내기
