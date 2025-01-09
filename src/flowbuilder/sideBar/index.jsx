import React, { Fragment, useEffect, useState } from "react";
import SideBarTopPortion from "./SideBarTopPortion";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import ErrorMessage from "./ErrorMessage";

// 화면 전환 애니메이션
import { Transition } from "@headlessui/react";

// 노드 업데이트 훅
import useUpdateNode from "@/hooks/useUpdateNode";

// 고유 아이디 생성 함수
import { nanoid } from "nanoid";

// 자동 완성 컴포넌트
import AutoComplete from "./AutoComplete";

import { Button } from "@/components/button";
import { NodeTypes } from "../Utils";
import { getConnectedEdges, useReactFlow } from "reactflow";
import useUpdateEdge from "@/hooks/useUpdateEdge";


// 사이드바 컴포넌트 정의 ( 필요한 props 전달받음 )
const SideBar = ({ sideBarOpen, currentSideData, setOpenSidebar }) => {
  // React Flow에서 노드와 엣지를 가져오는 훅
  const { getNodes, getEdges } = useReactFlow();

  // 현재 노드 목록에서 시작 노드와 FloatNode를 제외한 노드들만 필터링
  const allNodes = getNodes();
  const except = allNodes.filter((item) => item.type !== NodeTypes.startNode);
  const exceptFloat = except.filter(
    (item) => item.type !== NodeTypes.FloatNode
  );
  const FinalNode = exceptFloat.filter(
    (item) => item.id !== currentSideData.id
  );

  // 필터링된 노드 목록에서 각 노드의 description과 id만 추출
  const renderNodes = FinalNode.map((item) => ({
    node: item.data.description,
    id: item.id,
  }));

  // 입력 추가 함수 (새로운 입력 필드를 추가)
  const addInput = () => {
    append({ id: nanoid(8), value: "", step: "" });
  };

  const initialDefault = {
    description: "",  // 기본값 (설명)
    gotoStep: "",  // 기본값 (이동할 단계)
  };

  // 상태 초기화
  const [defaultValues, setdefaultValues] = useState(initialDefault);

  const {
    handleSubmit,
    control,
    formState: { errors },
    register,
    reset,
  } = useForm({
    defaultValues,  // 기본값 설정
    mode: "onChange",  // 변경 시마다 폼 상태를 업데이트
  });

  const { handleSubmitNode } = useUpdateNode();  // 노드 업데이트 훅
  const { handleSubmitEdge } = useUpdateEdge();  // 엣지 업데이트 훅

  // 현재 노드와 연결된 엣지 목록을 필터링
  const edges = getConnectedEdges([currentSideData], getEdges()).filter(
    (item) => item.source !== "start-node" && item.source === currentSideData.id
  );

  useEffect(() => {
    if (currentSideData) {
      setdefaultValues((prev) => ({
        ...prev,
        description:
          currentSideData?.data?.description ||
          currentSideData?.data?.condition,
        gotoStep: currentSideData?.data?.gotoStep,
        conditions: edges.map((item) => {
          const step = FinalNode.find((i) => i.id === item.target).data;
          return {
            id: item.id,
            value: item.data.condition,
            step: { id: item.target, node: step.description },
            target: item.target,
          };
        }),
      }));
    }
  }, [currentSideData]);  // currentSideData가 변경될 때마다 실행

  useEffect(() => {
    reset(defaultValues);  // 폼을 defaultValues로 리셋
  }, [reset, defaultValues]);

  // 조건 필드 추가, 제거, 수정 등을 처리하는 훅
  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: "conditions",  // 조건 배열을 위한 필드
  });

  // 폼 제출 처리
  const onSubmit = async (data) => {
    if (currentSideData.source) {
      handleSubmitEdge(data, currentSideData);  // 엣지 업데이트
    } else {
      handleSubmitNode(data, currentSideData);  // 노드 업데이트
    }
    reset();  // 폼 리셋
    setOpenSidebar(false);  // 사이드바 닫기
  };

  return (
    // 화면 전환 효과 (사이드바 애니메이션)
    <Transition appear show={sideBarOpen} as={Fragment}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div
          style={{
            width: sideBarOpen ? "40%" : "0%",  // 사이드바가 열릴 때 너비 설정
            overflow: "auto",  // 내용이 넘칠 경우 스크롤 처리
          }}
          className="sidebarWrapper shadow-lg"
        >
          <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
            <div className="p-4">

              {/* 사이드바 상단 부분 렌더링 */}
              <SideBarTopPortion item={currentSideData} />
              <div className="space-y-5">
                <div className="space-y-2">
                  <label
                    htmlFor=""
                    className="w-full px-6 py-4 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none text-black select-none"
                  >
                    {/* 현재 노드 타입 표시 */}
                    {`Type : ${currentSideData.type}`}
                  </label>
                </div>

                {/* 클릭한 노드 타입에 따라 다른 폼을 렌더링 */}               
                {currentSideData.type === NodeTypes.startNode ||
                currentSideData.type === NodeTypes.End ? (
                  // 시작 노드 || 끝 노드
                  <div className="space-y-2">
                    <label htmlFor="" className="text-gray-900">
                      Description :
                    </label>
                    {/* 사용자로부터 'description'을 입력받는 텍스트 입력 필드 */}
                    <input
                      type="text"
                      {...register("description", {
                        required: {
                          value: true,  // 필수 입력값
                          message: "Please fill the title of message",  // 필수 입력 오류 메시지
                        },
                      })}
                      className={`w-full px-6 py-4 mt-5 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none text-black`}
                      placeholder="Begin the process"
                    />
                    {/* 'description' 필드에 대한 오류 메시지 출력 */}
                    <ErrorMessage errors={errors} name="description" />

                    <Button type="submit">Save</Button>
                  </div>
                ) : currentSideData.type === NodeTypes.InputNode ? (
                  <>
                    {/* 입력 노드 */}
                    <div className="space-y-2">
                      <label htmlFor="" className="text-gray-900">
                        Description :
                      </label>
                      {/* 사용자로부터 'description'을 입력받는 텍스트 입력 필드 */}
                      <input
                        type="text"
                        {...register("description", {
                          required: {
                            value: true,  // 필수 입력값
                            message: "Please fill the title of message",  // 필수 입력 오류 메시지
                          },
                        })}
                        className={`w-full px-6 py-4 mt-5 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none text-black`}
                        placeholder="Begin the process"
                      />
                      {/* 'description' 필드에 대한 오류 메시지 출력 */}
                      <ErrorMessage errors={errors} name="description" />

                      {/* 입력 필드 반복 렌더링 */}
                      {fields.map((item, index) => (
                        <div key={item.id} className="flex gap-x-3">
                          {/* 키 입력 필드 */}
                          <div className="space-y-2 pt-3">
                            <label
                              htmlFor={`key.${index}.value`}
                              className="text-gray-900"
                            >
                              key {index + 1}: {/* 키 번호 표시 */}
                            </label>
                            <input
                              id={`key.${index}.value`}
                              type="text"
                              {...register(`key.${index}.value`)}  // 키 값 등록
                              className={`w-full px-6 py-4 mt-5 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none text-black`}
                              placeholder="Write key here"
                            />
                            {/* 'key.{index}.value' 필드와 관련된 오류 메시지를 표시 */}
                            <ErrorMessage errors={errors} name={`key.${index}.value`} />
                          </div>

                          {/* 값 입력 필드 */}
                          <div className="space-y-2 pt-3 relative mb-10">
                            <label
                              htmlFor={`key.${index}.step`}
                              className="text-gray-900"
                            >
                              value:
                            </label>
                            {/* 'value.{index}.value' 필드에 대해 Controller를 사용하여 상태 제어 */}
                            <input
                              id={`value.${index}.value`}
                              type="text"
                              {...register(`value.${index}.value`)}  // 키 값 등록
                              className={`w-full px-6 py-4 mt-5 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none text-black`}
                              placeholder="Write value here"
                            />
                            {/* 'key.{index}.step' 필드와 관련된 오류 메시지를 표시 */}
                            <ErrorMessage errors={errors} name={`key.${index}.step`} />

                            {/* input 제거 버튼 */}
                            <span
                              onClick={() => remove(index)}
                              className="text-red-700 py-1 cursor-pointer absolute right-0 top-full mt-0"
                            >
                              Remove
                            </span>
                            <ErrorMessage
                              errors={errors}
                              name={`key.${index}.step`}
                            />
                          </div>
                        </div>
                      ))}

                      {/* input 추가 및 저장 버튼 */}
                      <div className="flex gap-2 pt-3">
                        {/* 'Add Condition' 버튼: 조건 추가 */}
                        {currentSideData.type !== "custom" && (
                          <button
                            type="button"
                            onClick={addInput}  // 조건 추가 핸들러 호출
                            className="bg-blue-400"
                          >
                            Add Input
                          </button>
                        )}
                        <Button type="submit">Save</Button>
                      </div>
                    </div>
                  </>
                ) : currentSideData.type === NodeTypes.StepNode ? (
                  <>
                    {/* 단계 노드 */}
                    <div className="space-y-2">
                      <label htmlFor="" className="text-gray-900">
                        Description :
                      </label>
                      {/* 사용자로부터 'description'을 입력받는 텍스트 입력 필드 */}
                      <input
                        type="text"
                        {...register("description", {
                          required: {
                            value: true,  // 필수 입력값
                            message: "Description field is required", // 필수 입력 오류 메시지
                          },
                        })}
                        className={`w-full px-6 py-4 mt-5 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none text-black`}
                        placeholder="Write description here"
                      />
                      {/* 'description' 필드에 대한 오류 메시지 출력 */}
                      <ErrorMessage errors={errors} name="description" />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="" className="text-gray-900">
                        Go to Step :
                      </label>
                      {/* 사용자로부터 'gotoStep'을 입력받는 텍스트 입력 필드 */}
                      <input
                        type="text"
                        {...register(
                          "gotoStep"
                          //  {
                          //   required: {
                          //     value: true,
                          //     message: "Step field is required",
                          //   },
                          // }
                        )}
                        className={`w-full px-6 py-4 mt-5 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none text-black`}
                        placeholder="Title of the message"
                      />
                      {/* 'gotoStep' 필드에 대한 오류 메시지 출력 */}
                      <ErrorMessage errors={errors} name="gotoStep" />
                    </div>

                    <Button type="submit">Save</Button>
                  </>
                ) : (
                  <>
                    {/* 조건 노드 */}
                    <div className="space-y-2">
                      <label htmlFor="" className="text-gray-900">
                        Description :
                      </label>
                      {/* 사용자로부터 'description'을 입력받는 텍스트 입력 필드 */}
                      <input
                        type="text"
                        {...register("description", {
                          required: {
                            value: true,  // 필수 입력
                            message: "Description is required", // 필수 입력 메시지
                          },
                        })}
                        className={`w-full px-6 py-4 mt-5 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none text-black`}
                        placeholder="Write description here"
                      />
                      {/* 'description' 필드에 대한 오류 메시지 출력 */}
                      <ErrorMessage errors={errors} name="description" />
                    </div>

                    {/* 조건 입력 필드 반복 렌더링 */}
                    {fields.map((item, index) => (
                      <div key={item.id} className="flex gap-x-3">
                        {/* 조건 값 입력 필드 */}
                        <div className="space-y-2">
                          <label
                            htmlFor={`conditions.${index}.value`}
                            className="text-gray-900"
                          >
                            Condition {index + 1} (Validation): {/* 조건 번호 표시 */}
                          </label>
                          <input
                            id={`conditions.${index}.value`}
                            type="text"
                            {...register(`conditions.${index}.value`)}  // 조건 값 등록
                            className={`w-full px-6 py-4 mt-5 bg-white border border-gray-200 rounded-md outline-none hover:border-violet-400 focus:outline-none text-black`}
                            placeholder="Write description here"
                          />
                          {/* 'conditions.{index}.value' 필드와 관련된 오류 메시지를 표시 */}
                          <ErrorMessage errors={errors} name={`conditions.${index}.value`} />
                        </div>

                        {/* 'Go to step' 입력 필드 */}
                        <div className="space-y-2">
                          <label
                            htmlFor={`conditions.${index}.step`}
                            className="text-gray-900"
                          >
                            Go to step: {/* 연결 단계 입력 안내 */}
                          </label>
                          {/* 'conditions.{index}.step' 필드에 대해 Controller를 사용하여 상태 제어 */}
                          <Controller
                            name={`conditions.${index}.step`}
                            control={control} // React Hook Form의 control 객체
                            render={({ field: { onChange, value, onBlur } }) => (
                              <AutoComplete
                                value={value} // 현재 값
                                onChange={onChange} // 값 변경 이벤트
                                onBlur={onBlur} // 입력 필드 포커스 해제 이벤트
                                renderNodes={renderNodes} // 렌더링할 노드들
                                currentSideData={currentSideData} // 현재 사이드 데이터를 전달
                              />
                            )}
                          />
                          {/* 'conditions.{index}.step' 필드와 관련된 오류 메시지를 표시 */}
                          <ErrorMessage errors={errors} name={`conditions.${index}.step`} />

                          {/* 조건 제거 버튼 */}
                          <span
                            onClick={() => remove(index)}
                            className="text-red-700 py-1 cursor-pointer"
                          >
                            Remove
                          </span>
                          <ErrorMessage
                            errors={errors}
                            name={`conditions.${index}.step`}
                          />
                        </div>
                      </div>
                    ))}

                     {/* 조건 추가 및 저장 버튼 */}
                    <div className="flex gap-2">
                      {/* 'Add Condition' 버튼: 조건 추가 */}
                      {currentSideData.type !== "custom" && (
                        <button
                          type="button"
                          onClick={addInput}  // 조건 추가 핸들러 호출
                          className="bg-blue-400"
                        >
                          Add Condition
                        </button>
                      )}
                      <Button type="submit">Save</Button>
                    </div>
                  </>
                )}
                <ErrorMessage errors={errors} name="email_subject" />
              </div>
            </div>
          </form>
        </div>
      </Transition.Child>
    </Transition>
  );
};

export default SideBar;
