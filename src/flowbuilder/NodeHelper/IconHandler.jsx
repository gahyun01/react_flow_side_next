// Desc : 노드 타입에 따라 아이콘을 렌더링하는 컴포넌트입니다.

import { NodeTypes } from "../Utils";
import { Imaged } from "../flowIcons";

const IconHandler = ({ props, data }) => {
  return (
    <>
      {/* 조건부 렌더링: 노드 타입이 시작 노드인지 확인 */}
      {props?.nodeData?.type === NodeTypes.startNode ? (
        // 시작 노드일 경우 빈 <p> 태그 렌더링
        <p></p>
      ) : (
        // 시작 노드가 아닐 경우 버튼 렌더링
        <button
          className="py-2 px-2 nodrag bg-white text-black font-semibold hover:border-none rounded hover:outline-none focus:outline-none"
        >
          {/* Imaged 컴포넌트 렌더링: stepType 데이터를 전달 */}
          <Imaged stepType={data?.stepType} />
        </button>
      )}
    </>
  );
};

// IconHandler 컴포넌트를 기본 내보내기로 설정
export default IconHandler;
