"use client";

import React, { useState } from "react";
import svgPaths from "@/assets/svgs/admin";

interface AIModelForm {
  modelName: string;
  displayName: string;
  displayExplain: string;
  input_price_per_1m: string;
  output_price_per_1m: string;
  isActive: string;
}

interface AIModel extends AIModelForm {
  id: number;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"register" | "edit" | "delete">("register");
  const [formData, setFormData] = useState<AIModelForm>({
    modelName: "gpt-4-turbo",
    displayName: "GPT-4 Turbo",
    displayExplain: "더 빠르고 저렴한 GPT-4",
    input_price_per_1m: "0.01",
    output_price_per_1m: "0.03",
    isActive: "true",
  });

  // Mock data for AI models list
  const [aiModels, setAiModels] = useState<AIModel[]>([
    { id: 1, modelName: "gpt-4-turbo", displayName: "GPT-4 turbo", displayExplain: "더빠르고저렴한GPT-4어쩌고...", input_price_per_1m: "0.01", output_price_per_1m: "0.03", isActive: "true" },
    { id: 2, modelName: "claude-3-opus", displayName: "Claude 3 Opus", displayExplain: "가장 강력한 Claude 모델", input_price_per_1m: "0.015", output_price_per_1m: "0.075", isActive: "true" },
    { id: 3, modelName: "gpt-3.5-turbo", displayName: "GPT-3.5 Turbo", displayExplain: "빠르고 경제적인 모델", input_price_per_1m: "0.0005", output_price_per_1m: "0.0015", isActive: "true" },
    { id: 4, modelName: "gemini-pro", displayName: "Gemini Pro", displayExplain: "Google의 고성능 AI", input_price_per_1m: "0.00025", output_price_per_1m: "0.00075", isActive: "true" },
    { id: 5, modelName: "claude-3-sonnet", displayName: "Claude 3 Sonnet", displayExplain: "균형잡힌 성능과 가격", input_price_per_1m: "0.003", output_price_per_1m: "0.015", isActive: "true" },
    { id: 6, modelName: "gpt-4", displayName: "GPT-4", displayExplain: "OpenAI의 최고 성능 모델", input_price_per_1m: "0.03", output_price_per_1m: "0.06", isActive: "true" },
    { id: 7, modelName: "claude-3-haiku", displayName: "Claude 3 Haiku", displayExplain: "가장 빠른 Claude 모델", input_price_per_1m: "0.00025", output_price_per_1m: "0.00125", isActive: "true" },
    { id: 8, modelName: "llama-2-70b", displayName: "Llama 2 70B", displayExplain: "Meta의 오픈소스 모델", input_price_per_1m: "0.0007", output_price_per_1m: "0.0009", isActive: "true" },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editFormData, setEditFormData] = useState<AIModelForm | null>(null);

  const handleInputChange = (field: keyof AIModelForm, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleEditInputChange = (field: keyof AIModelForm, value: string) => {
    if (editFormData) {
      setEditFormData({ ...editFormData, [field]: value });
    }
  };

  const handleSubmit = () => {
    // alert("AI 모델이 등록되었습니다!");
    // Reset form
    setFormData({
      modelName: "",
      displayName: "",
      displayExplain: "",
      input_price_per_1m: "",
      output_price_per_1m: "",
      isActive: "true",
    });
  };

  const handleEdit = (model: AIModel) => {
    setEditingId(model.id);
    setEditFormData({
      modelName: model.modelName,
      displayName: model.displayName,
      displayExplain: model.displayExplain,
      input_price_per_1m: model.input_price_per_1m,
      output_price_per_1m: model.output_price_per_1m,
      isActive: model.isActive,
    });
  };

  const handleSaveEdit = (id: number) => {
    if (editFormData) {
      setAiModels(aiModels.map(model =>
        model.id === id ? { ...model, ...editFormData } : model
      ));
      setEditingId(null);
      setEditFormData(null);
      alert("AI 모델이 수정되었습니다!");
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditFormData(null);
  };

  return (
    <div
      className="min-h-screen w-full bg-zinc-950"
      data-name="관리자 백오피스-AI모델 등록"
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 py-8">
        {/* Header */}
        <div className="flex flex-col gap-3 mb-12">
          <div className="flex items-center gap-4 sm:gap-8">
            {/* Logo */}
            <div className="relative h-[48px] w-[66px] sm:h-[64px] sm:w-[88px] flex-shrink-0">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 88 65"
              >
                <g id="Group 71">
                  <path d={svgPaths.p1e3578f2} stroke="#444648" />
                  <path
                    d={svgPaths.p1d5cd6f1}
                    stroke="#929292"
                    strokeWidth="2"
                  />
                </g>
              </svg>
            </div>

            {/* Title */}
            <h1 className="font-['Pretendard:SemiBold',sans-serif] text-neutral-100 text-[32px] sm:text-[48px] lg:text-[64px]">
              AI HUB BACK_Office
            </h1>
            {/* Admin Notice */}
            <p className="font-['Pretendard:Regular',sans-serif] text-[#929292] text-[14px] sm:text-[16px] lg:text-[18px]">
              관리자 전용 페이지 입니다.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-zinc-950 h-auto flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:gap-8 mb-8 sm:mb-12">
          <button
            onClick={() => setActiveTab("register")}
            className={`h-[48px] sm:h-[53px] px-6 sm:px-8 lg:px-12 rounded-[7px] font-['Pretendard:Regular',sans-serif] text-[16px] sm:text-[20px] lg:text-[24px] text-white transition-all ${
              activeTab === "register"
                ? "bg-gradient-to-b from-[#ff7600] from-[29.808%] to-[#ff983f]"
                : "bg-transparent hover:bg-zinc-900"
            }`}
          >
            AI모델 등록
          </button>
          <button
            onClick={() => setActiveTab("edit")}
            className={`h-[48px] sm:h-[53px] px-6 sm:px-8 lg:px-12 rounded-[7px] font-['Pretendard:Regular',sans-serif] text-[16px] sm:text-[20px] lg:text-[24px] text-white transition-all ${
              activeTab === "edit"
                ? "bg-gradient-to-b from-[#ff7600] from-[29.808%] to-[#ff983f]"
                : "bg-transparent hover:bg-zinc-900"
            }`}
          >
            AI 모델 수정
          </button>
          <button
            onClick={() => setActiveTab("delete")}
            className={`h-[48px] sm:h-[53px] px-6 sm:px-8 lg:px-12 rounded-[7px] font-['Pretendard:Regular',sans-serif] text-[16px] sm:text-[20px] lg:text-[24px] text-white transition-all ${
              activeTab === "delete"
                ? "bg-gradient-to-b from-[#ff7600] from-[29.808%] to-[#ff983f]"
                : "bg-transparent hover:bg-zinc-900"
            }`}
          >
            AI 모델 삭제
          </button>
        </div>

        {/* Register Form */}
        {activeTab === "register" && (
          <div className="max-w-[1200px] mx-auto space-y-6 sm:space-y-8">
            {/* modelName */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4 lg:gap-8">
              <label className="font-['Pretendard:SemiBold',sans-serif] text-white text-[24px] sm:text-[28px] lg:text-[36px] lg:w-[400px]">
                modelName
              </label>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={formData.modelName}
                  onChange={(e) =>
                    handleInputChange("modelName", e.target.value)
                  }
                  className="w-full h-[40px] sm:h-[46px] rounded-[8px] bg-transparent border border-[#444648] px-4 sm:px-6 font-['Pretendard:Regular',sans-serif] text-[18px] sm:text-[20px] lg:text-[24px] text-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] focus:outline-none focus:border-[#ff7600]"
                  placeholder="예: gpt-4-turbo"
                />
              </div>
            </div>

            {/* displayName */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4 lg:gap-8">
              <label className="font-['Pretendard:SemiBold',sans-serif] text-white text-[24px] sm:text-[28px] lg:text-[36px] lg:w-[400px]">
                displayName
              </label>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={formData.displayName}
                  onChange={(e) =>
                    handleInputChange("displayName", e.target.value)
                  }
                  className="w-full h-[40px] sm:h-[46px] rounded-[8px] bg-transparent border border-[#444648] px-4 sm:px-6 font-['Pretendard:Regular',sans-serif] text-[18px] sm:text-[20px] lg:text-[24px] text-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] focus:outline-none focus:border-[#ff7600]"
                  placeholder="예: GPT-4 Turbo"
                />
              </div>
            </div>

            {/* displayExplain */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-3 sm:gap-4 lg:gap-8">
              <label className="font-['Pretendard:SemiBold',sans-serif] text-white text-[24px] sm:text-[28px] lg:text-[36px] lg:w-[400px]">
                displayExplain
              </label>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={formData.displayExplain}
                  onChange={(e) =>
                    handleInputChange("displayExplain", e.target.value)
                  }
                  className="w-full h-[40px] sm:h-[46px] rounded-[8px] bg-transparent border border-[#444648] px-4 sm:px-6 font-['Pretendard:Regular',sans-serif] text-[18px] sm:text-[20px] lg:text-[24px] text-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] focus:outline-none focus:border-[#ff7600]"
                  placeholder="예: 더 빠르고 저렴한 GPT-4"
                />
                <p className="flex items-center gap-2 mt-2 font-['Pretendard:Regular',sans-serif] text-[#fe2828] text-[12px] sm:text-[14px] lg:text-[16px]">
                  <svg
                    className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] flex-shrink-0"
                    fill="none"
                    viewBox="0 0 22 20"
                  >
                    <path
                      d={svgPaths.p285a7c00}
                      stroke="#FE2828"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  50자 내외로 작성해주세요.
                </p>
              </div>
            </div>

            {/* 1백만 input 토큰 당 가격 */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-3 sm:gap-4 lg:gap-8">
              <div className="lg:w-[400px]">
                <label className="font-['Pretendard:SemiBold',sans-serif] text-white text-[24px] sm:text-[28px] lg:text-[36px] block">
                  1백만 input 토큰 당 가격
                </label>
                <p className="font-['Pretendard:SemiBold',sans-serif] text-white text-[18px] sm:text-[20px] lg:text-[24px] mt-2">
                  input_price_per_1m
                </p>
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={formData.input_price_per_1m}
                  onChange={(e) =>
                    handleInputChange("input_price_per_1m", e.target.value)
                  }
                  className="w-full h-[40px] sm:h-[46px] rounded-[8px] bg-transparent border border-[#444648] px-4 sm:px-6 font-['Pretendard:Regular',sans-serif] text-[18px] sm:text-[20px] lg:text-[24px] text-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] focus:outline-none focus:border-[#ff7600]"
                  placeholder="예: 0.01"
                />
                <p className="flex items-center gap-2 mt-2 font-['Pretendard:Regular',sans-serif] text-[#fe2828] text-[12px] sm:text-[14px] lg:text-[16px]">
                  <svg
                    className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] flex-shrink-0"
                    fill="none"
                    viewBox="0 0 22 20"
                  >
                    <path
                      d={svgPaths.p285a7c00}
                      stroke="#FE2828"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  api문서에 써있는 1M 당 가격 쓰세요
                </p>
              </div>
            </div>

            {/* 1백만 output 토큰 당 가격 */}
            <div className="flex flex-col lg:flex-row lg:items-start gap-3 sm:gap-4 lg:gap-8">
              <div className="lg:w-[400px]">
                <label className="font-['Pretendard:SemiBold',sans-serif] text-white text-[24px] sm:text-[28px] lg:text-[36px] block">
                  1백만 output 토큰 당 가격
                </label>
                <p className="font-['Pretendard:SemiBold',sans-serif] text-white text-[18px] sm:text-[20px] lg:text-[24px] mt-2">
                  output_price_per_1m
                </p>
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={formData.output_price_per_1m}
                  onChange={(e) =>
                    handleInputChange("output_price_per_1m", e.target.value)
                  }
                  className="w-full h-[40px] sm:h-[46px] rounded-[8px] bg-transparent border border-[#444648] px-4 sm:px-6 font-['Pretendard:Regular',sans-serif] text-[18px] sm:text-[20px] lg:text-[24px] text-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] focus:outline-none focus:border-[#ff7600]"
                  placeholder="예: 0.03"
                />
                <p className="flex items-center gap-2 mt-2 font-['Pretendard:Regular',sans-serif] text-[#fe2828] text-[12px] sm:text-[14px] lg:text-[16px]">
                  <svg
                    className="w-[16px] h-[16px] sm:w-[18px] sm:h-[18px] flex-shrink-0"
                    fill="none"
                    viewBox="0 0 22 20"
                  >
                    <path
                      d={svgPaths.p285a7c00}
                      stroke="#FE2828"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                  api문서에 써있는 1M 당 가격 쓰세요.
                </p>
              </div>
            </div>

            {/* isActive */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4 lg:gap-8">
              <label className="font-['Pretendard:SemiBold',sans-serif] text-white text-[24px] sm:text-[28px] lg:text-[36px] lg:w-[400px]">
                isActive
              </label>
              <div className="flex-1 relative">
                <select
                  value={formData.isActive}
                  onChange={(e) =>
                    handleInputChange("isActive", e.target.value)
                  }
                  className="w-full h-[40px] sm:h-[46px] rounded-[8px] bg-zinc-900 border border-[#444648] px-4 sm:px-6 font-['Pretendard:Regular',sans-serif] text-[18px] sm:text-[20px] lg:text-[24px] text-white shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] focus:outline-none focus:border-[#ff7600]"
                >
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-6 sm:pt-8">
              <button
                onClick={handleSubmit}
                className="bg-gradient-to-b from-[#ff7600] from-[29.808%] to-[#ff983f] h-[48px] sm:h-[53px] px-12 sm:px-16 rounded-[7px] font-['Pretendard:SemiBold',sans-serif] text-white text-[18px] sm:text-[20px] lg:text-[24px] hover:opacity-90 transition-opacity"
              >
                등록하기
              </button>
            </div>
          </div>
        )}

        {/* Edit Table */}
        {activeTab === "edit" && (
          <div className="w-full">
            {/* Table */}
            <div className="overflow-x-auto flex justify-center">
              <div className="min-w-[1200px] max-w-[1400px]">
                {/* Table Header */}
                <div className="grid grid-cols-[150px_150px_320px_140px_140px_140px_auto] gap-3 mb-6 px-2">
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-white text-[14px] sm:text-[16px]">
                    modelName
                  </p>
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-white text-[14px] sm:text-[16px]">
                    displayName
                  </p>
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-white text-[14px] sm:text-[16px]">
                    displayExplain
                  </p>
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-white text-[14px] sm:text-[16px]">
                    input_price
                  </p>
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-white text-[14px] sm:text-[16px]">
                    output_price
                  </p>
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-white text-[14px] sm:text-[16px]">
                    isActive
                  </p>
                  <p className="font-['Pretendard:SemiBold',sans-serif] text-white text-[14px] sm:text-[16px]"></p>
                </div>

                {/* Table Rows */}
                <div className="space-y-3">
                  {aiModels.map((model) => (
                    <div
                      key={model.id}
                      className="grid grid-cols-[150px_150px_320px_140px_140px_140px_auto] gap-3 items-center"
                    >
                      {editingId === model.id && editFormData ? (
                        <>
                          {/* Editing Mode */}
                          <div className="h-[40px] sm:h-[46px] rounded-[8px] border border-[#ff7600] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-3">
                            <input
                              type="text"
                              value={editFormData.modelName}
                              onChange={(e) =>
                                handleEditInputChange(
                                  "modelName",
                                  e.target.value
                                )
                              }
                              className="w-full bg-transparent font-['Pretendard:Regular',sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white focus:outline-none"
                            />
                          </div>
                          <div className="h-[40px] sm:h-[46px] rounded-[8px] border border-[#ff7600] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-3">
                            <input
                              type="text"
                              value={editFormData.displayName}
                              onChange={(e) =>
                                handleEditInputChange(
                                  "displayName",
                                  e.target.value
                                )
                              }
                              className="w-full bg-transparent font-['Pretendard:Regular',sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white focus:outline-none"
                            />
                          </div>
                          <div className="h-[40px] sm:h-[46px] rounded-[8px] border border-[#ff7600] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-3">
                            <input
                              type="text"
                              value={editFormData.displayExplain}
                              onChange={(e) =>
                                handleEditInputChange(
                                  "displayExplain",
                                  e.target.value
                                )
                              }
                              className="w-full bg-transparent font-['Pretendard:Regular',sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white focus:outline-none"
                            />
                          </div>
                          <div className="h-[40px] sm:h-[46px] rounded-[8px] border border-[#ff7600] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-3">
                            <input
                              type="text"
                              value={editFormData.input_price_per_1m}
                              onChange={(e) =>
                                handleEditInputChange(
                                  "input_price_per_1m",
                                  e.target.value
                                )
                              }
                              className="w-full bg-transparent font-['Pretendard:Regular',sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white focus:outline-none"
                            />
                          </div>
                          <div className="h-[40px] sm:h-[46px] rounded-[8px] border border-[#ff7600] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-3">
                            <input
                              type="text"
                              value={editFormData.output_price_per_1m}
                              onChange={(e) =>
                                handleEditInputChange(
                                  "output_price_per_1m",
                                  e.target.value
                                )
                              }
                              className="w-full bg-transparent font-['Pretendard:Regular',sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white focus:outline-none"
                            />
                          </div>
                          <div className="h-[40px] sm:h-[46px] rounded-[8px] border border-[#ff7600] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-3">
                            <select
                              value={editFormData.isActive}
                              onChange={(e) =>
                                handleEditInputChange(
                                  "isActive",
                                  e.target.value
                                )
                              }
                              className="w-full bg-zinc-900 font-['Pretendard:Regular',sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white focus:outline-none"
                            >
                              <option value="true">true</option>
                              <option value="false">false</option>
                            </select>
                          </div>
                          <div className="flex gap-2 flex-nowrap whitespace-nowrap">
                            <button
                              onClick={() => handleSaveEdit(model.id)}
                              className="bg-gradient-to-b from-[#ff7600] from-[29.808%] to-[#ff983f] h-[22px] px-3 rounded-[7px] font-['Pretendard:Regular',sans-serif] text-white text-[12px] sm:text-[14px] hover:opacity-90 transition-opacity flex-shrink-0"
                            >
                              저장
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="bg-[#444648] h-[22px] px-3 rounded-[7px] font-['Pretendard:Regular',sans-serif] text-white text-[12px] sm:text-[14px] hover:opacity-90 transition-opacity flex-shrink-0"
                            >
                              취소
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {/* Display Mode */}
                          <div className="h-[40px] sm:h-[46px] rounded-[8px] border border-[#444648] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-3">
                            <p className="font-['Pretendard:Regular',sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white truncate">
                              {model.modelName}
                            </p>
                          </div>
                          <div className="h-[40px] sm:h-[46px] rounded-[8px] border border-[#444648] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-3">
                            <p className="font-['Pretendard:Regular',sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white truncate">
                              {model.displayName}
                            </p>
                          </div>
                          <div className="h-[40px] sm:h-[46px] rounded-[8px] border border-[#444648] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-3">
                            <p className="font-['Pretendard:Regular',sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white truncate">
                              {model.displayExplain}
                            </p>
                          </div>
                          <div className="h-[40px] sm:h-[46px] rounded-[8px] border border-[#444648] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-3">
                            <p className="font-['Pretendard:Regular',sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white truncate">
                              {model.input_price_per_1m}
                            </p>
                          </div>
                          <div className="h-[40px] sm:h-[46px] rounded-[8px] border border-[#444648] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-3">
                            <p className="font-['Pretendard:Regular',sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white truncate">
                              {model.output_price_per_1m}
                            </p>
                          </div>
                          <div className="h-[40px] sm:h-[46px] rounded-[8px] border border-[#444648] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] flex items-center px-3">
                            <p className="font-['Pretendard:Regular',sans-serif] text-[16px] sm:text-[18px] lg:text-[20px] text-white truncate">
                              {model.isActive}
                            </p>
                          </div>
                          <button
                            onClick={() => handleEdit(model)}
                            className="bg-gradient-to-b from-[#ff7600] from-[29.808%] to-[#ff983f] h-[22px] w-[6.8rem] rounded-[7px] font-['Pretendard:Regular',sans-serif] text-white text-[14px] sm:text-[16px] hover:opacity-90 transition-opacity"
                          >
                            수정
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Tab */}
        {activeTab === "delete" && (
          <div className="flex items-center justify-center h-[300px] sm:h-[400px] mx-auto max-w-[1400px]">
            <p className="font-['Pretendard:Regular',sans-serif] text-white text-[24px] sm:text-[28px] lg:text-[32px]">
              AI 모델 삭제 기능은 준비 중입니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
