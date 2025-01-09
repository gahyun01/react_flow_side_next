// Desc : 노드의 라벨을 렌더링하는 컴포넌트이다.

const LabelRenderer = ({ data }) => {
  return (
    // div를 사용하여 가운데 정렬 및 flexbox를 이용해 아이템을 배치
    <div className={"flex justify-center flex-1"}>
      {/* `data` 객체에서 `description` 값을 표시. 값이 없으면 기본적으로 비어있을 수 있음 */}
      <p className="font-semibold text-gray-900 text-sm">{data?.description}</p>
    </div>
  );
};

// 이 컴포넌트를 다른 곳에서 사용하기 위해 내보냄
export default LabelRenderer;