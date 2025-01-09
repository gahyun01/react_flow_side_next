// Desc : FlowBuilder에서 사용되는 노드 삭제 확인을 위한 모달 컴포넌트이다.

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useContext } from "react";
import { flowIcons } from "../flowIcons";
import { GlobalContext } from "@/app/context/context";

const { Warning } = flowIcons;

const InstandDialogue = ({
  isOpen,  // 모달이 열려 있는지 여부
  setIsOpen,  // 모달을 열거나 닫을 수 있는 함수
  handleDelete,  // 삭제 처리 함수
  nodeData,  // 삭제할 노드 데이터
  children,  // 자식 컴포넌트 (모달 내에 표시할 내용)
  title,  // 모달 제목
}) => {
  const { state, dispatch } = useContext < any > GlobalContext; // GlobalContext에서 상태와 dispatch를 가져옴

  // 모달을 닫는 함수
  function closeModal() {
    setIsOpen(false);  // isOpen 상태를 false로 설정하여 모달을 닫음
  }

  // 삭제 조건을 처리하는 함수
  const handleDeleteCondition = () => {
    handleDelete(nodeData.id);
    closeModal();
    nodeData.id === state.nodeSideBarOpen.activeId && // 삭제한 노드가 사이드바에서 열려있는 상태인 경우
      dispatch({
        type: "NODE_SIDE_BAR",  // 사이드바 상태 업데이트
        payload: {
          open: false,  // 사이드바 닫기
          activeId: "",  // 활성 노드 ID 초기화
        },
      });
  };
  return (
    <>
      {/* Transition으로 모달의 애니메이션 효과 적용 */}
      <Transition appear show={isOpen} as={Fragment}>

        {/* Dialog 컴포넌트를 사용하여 모달을 구현 */}
        <Dialog as="div" className="relative z-10" onClose={closeModal}>

          {/* 모달 배경에 애니메이션 효과 적용 */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            {/* 모달 배경을 어둡게 설정 */}
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">

              {/* 모달 패널에 애니메이션 효과 적용 */}
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg py-2 font-semibold leading-6 text-gray-900 flex justify-start items-center gap-2"
                  >
                    <Warning />  {/* 경고 아이콘 표시 */}
                    {title}  {/* 모달 제목 표시 */}
                  </Dialog.Title>

                  {/* nodeData.id가 있으면 삭제 관련 UI 표시 */}
                  {nodeData?.id ? (
                    <>
                      <div className="mt-2">
                        {/* 삭제 경고 메시지 */}
                        <p className="text-sm text-gray-500">
                          The condition and all the steps that follow from it
                          will be deleted, do you want to continue?
                        </p>
                      </div>

                      <div className="mt-4 flex justify-between items-center ">
                        {/* 취소 버튼 클릭 시 모달 닫기 */}
                        <button
                          type="button"
                          className="inline-flex underline justify-center rounded-md border border-transparent   text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={closeModal}
                        >
                          Cancel
                        </button>

                         {/* 삭제 버튼 클릭 시 handleDeleteCondition 함수 실행 */}
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-[#ec4343] px-4 py-2 text-sm font-medium text-white  focus:outline-none focus-visible:ring-2 focus-visible:bg-red-700 focus-visible:ring-offset-2"
                          onClick={() => handleDeleteCondition()}
                        >
                          Yes, delete this condition
                        </button>
                      </div>
                    </>
                  ) : (
                    children  // nodeData.id가 없으면 children을 렌더링 (기본 내용)
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default InstandDialogue;
