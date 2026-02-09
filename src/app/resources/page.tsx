"use client";

import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

interface Resource {
  id: string;
  type: "link" | "pdf" | "image";
  title: string;
  description?: string;
  url: string;
  createdAt: string;
}

const defaultResources: Resource[] = [
  {
    id: "hanatour-flight",
    type: "link",
    title: "하나투어 항공권 예약 상세",
    description: "인도 여행 비행기표 예약 정보 (AI0313, AI0312)",
    url: "https://www.hanatour.com/com/mpg/CHPC0MPG0303M200",
    createdAt: new Date().toISOString(),
  },
  {
    id: "hotel-delhi-voucher",
    type: "pdf",
    title: "델리 숙소 바우처 - Pride Plaza Hotel Aerocity",
    description: "2/13~2/14 (1박) Superior Twin Room · 예약번호: HH2632177268",
    url: "/vouchers/voucher_HH2632177268.pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: "hotel-jaisalmer-voucher",
    type: "pdf",
    title: "자이살메르 숙소 예약 - Rupal Residency",
    description: "2/14~2/15 (1박) Premium Room · 예약번호: 1697174974 (Agoda)",
    url: "/vouchers/booking_1697174974.pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: "flight-del-jsa-0214",
    type: "pdf",
    title: "2/14 델리→자이살메르 항공권 (AI-1783)",
    description: "13:30-15:00 · PNR: DWRIFE · 좌석 24A/24B · ₹12,571",
    url: "/vouchers/flight_DEL_JSA_0214.pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: "flight-jai-del-0219",
    type: "pdf",
    title: "2/19 자이푸르→델리 항공권 (IX-1289)",
    description: "18:55-19:55 · PNR: K158RL · 좌석 26E/26F · ₹6,631",
    url: "/vouchers/flight_JAI_DEL_0219.pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: "flight-hdo-vns-0220",
    type: "pdf",
    title: "2/20 델리(힌돈)→바라나시 항공권 (6E-2571)",
    description: "09:45-11:00 · PNR: W5LE4S · 좌석 21D/21E · ₹13,719",
    url: "/vouchers/flight_HDO_VNS_0220.pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: "flight-vns-del-0221",
    type: "pdf",
    title: "2/21 바라나시→델리 항공권 (IX-1252)",
    description: "14:45-16:20 · PNR: TZUT5L · 좌석 26A/26B · ₹11,932",
    url: "/vouchers/flight_VNS_DEL_0221.pdf",
    createdAt: new Date().toISOString(),
  },
];

const typeConfig: Record<string, string> = {
  link: "링크",
  pdf: "PDF",
  image: "이미지",
};

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>(defaultResources);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newResource, setNewResource] = useState({
    type: "link" as Resource["type"],
    title: "",
    description: "",
    url: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("india-resources");
    if (saved) {
      const savedItems: Resource[] = JSON.parse(saved);
      const missingDefaults = defaultResources.filter(
        (d) => !savedItems.some((s) => s.id === d.id)
      );
      if (missingDefaults.length > 0) {
        const merged = [...missingDefaults, ...savedItems];
        saveResources(merged);
      } else {
        setResources(savedItems);
      }
    }
  }, []);

  const saveResources = (newResources: Resource[]) => {
    setResources(newResources);
    localStorage.setItem("india-resources", JSON.stringify(newResources));
  };

  const addResource = () => {
    if (!newResource.title || !newResource.url) return;

    const resource: Resource = {
      id: Date.now().toString(),
      type: newResource.type,
      title: newResource.title,
      description: newResource.description,
      url: newResource.url,
      createdAt: new Date().toISOString(),
    };

    saveResources([...resources, resource]);
    setNewResource({ type: "link", title: "", description: "", url: "" });
    setShowAddModal(false);
  };

  const deleteResource = (id: string) => {
    saveResources(resources.filter((r) => r.id !== id));
  };

  const filteredResources = selectedType
    ? resources.filter((r) => r.type === selectedType)
    : resources;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">자료실</h1>
          <p className="text-sm text-neutral-500">여행 관련 링크, 문서, 이미지를 저장하세요</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 btn-primary rounded-full font-medium text-sm"
        >
          <Plus size={16} /> <span className="hidden sm:inline">자료 추가</span><span className="sm:hidden">추가</span>
        </button>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedType(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            selectedType === null
              ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
              : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
          }`}
        >
          전체 ({resources.length})
        </button>
        {Object.entries(typeConfig).map(([type, label]) => {
          const count = resources.filter((r) => r.type === type).length;
          return (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? null : type)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedType === type
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-500 text-lg">저장된 자료가 없습니다</p>
          <p className="text-neutral-400 text-sm mt-2">자료 추가 버튼을 눌러 새 자료를 추가하세요</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <span className="text-xs font-medium px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-500">
                  {typeConfig[resource.type]}
                </span>
                <button
                  onClick={() => deleteResource(resource.id)}
                  className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={14} />
                </button>
              </div>

              <h3 className="font-semibold mb-2 line-clamp-2">{resource.title}</h3>
              {resource.description && (
                <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{resource.description}</p>
              )}

              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                열기 &rarr;
              </a>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 sm:p-4 animate-fade-in modal-mobile">
          <div className="bg-white dark:bg-neutral-900 rounded-t-2xl sm:rounded-2xl p-5 sm:p-6 w-full sm:max-w-md animate-scale-in shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h3 className="text-lg sm:text-xl font-bold">새 자료 추가</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">
                  자료 유형
                </label>
                <div className="flex gap-2">
                  {Object.entries(typeConfig).map(([type, label]) => (
                    <button
                      key={type}
                      onClick={() => setNewResource({ ...newResource, type: type as Resource["type"] })}
                      className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        newResource.type === type
                          ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">
                  제목
                </label>
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  placeholder="자료 제목"
                  className="w-full px-3 sm:px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">
                  설명 (선택)
                </label>
                <input
                  type="text"
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  placeholder="간단한 설명"
                  className="w-full px-3 sm:px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">
                  URL / 링크
                </label>
                <input
                  type="url"
                  value={newResource.url}
                  onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 sm:px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-5 sm:mt-6 pb-safe">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors active:scale-[0.98]"
              >
                취소
              </button>
              <button
                onClick={addResource}
                className="flex-1 px-4 py-3 btn-primary rounded-lg sm:rounded-xl font-medium active:scale-[0.98]"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
