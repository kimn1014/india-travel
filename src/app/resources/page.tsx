"use client";

import { useState, useEffect } from "react";
import { FolderOpen, Link2, FileText, Image, Plus, X, ExternalLink, Trash2, Plane } from "lucide-react";

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
];

const typeConfig = {
  link: { label: "링크", icon: Link2 },
  pdf: { label: "PDF", icon: FileText },
  image: { label: "이미지", icon: Image },
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
      setResources(JSON.parse(saved));
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

  const getIcon = (resource: Resource) => {
    if (resource.id === "hanatour-flight") return Plane;
    return typeConfig[resource.type].icon;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <FolderOpen size={22} className="text-neutral-600 dark:text-neutral-400" />
            </div>
            자료실
          </h1>
          <p className="text-neutral-500">여행 관련 링크, 문서, 이미지를 저장하세요</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 btn-primary rounded-full font-medium text-sm"
        >
          <Plus size={18} /> 자료 추가
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
        {Object.entries(typeConfig).map(([type, config]) => {
          const Icon = config.icon;
          const count = resources.filter((r) => r.type === type).length;
          return (
            <button
              key={type}
              onClick={() => setSelectedType(selectedType === type ? null : type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedType === type
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400"
              }`}
            >
              <Icon size={14} />
              {config.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Resources Grid */}
      {filteredResources.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-6">
            <FolderOpen size={32} className="text-neutral-400" />
          </div>
          <p className="text-neutral-500 text-lg">저장된 자료가 없습니다</p>
          <p className="text-neutral-400 text-sm mt-2">자료 추가 버튼을 눌러 새 자료를 추가하세요</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => {
            const Icon = getIcon(resource);
            return (
              <div
                key={resource.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                    <Icon size={20} className="text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => deleteResource(resource.id)}
                      className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <span className="text-xs font-medium px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-500">
                    {typeConfig[resource.type].label}
                  </span>
                </div>

                <h3 className="font-semibold mb-2 line-clamp-2">{resource.title}</h3>
                {resource.description && (
                  <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{resource.description}</p>
                )}

                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
                >
                  <ExternalLink size={14} />
                  열기
                </a>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 w-full max-w-md animate-scale-in shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">새 자료 추가</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                  자료 유형
                </label>
                <div className="flex gap-2">
                  {Object.entries(typeConfig).map(([type, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={type}
                        onClick={() => setNewResource({ ...newResource, type: type as Resource["type"] })}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          newResource.type === type
                            ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                            : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                        }`}
                      >
                        <Icon size={14} />
                        {config.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                  제목
                </label>
                <input
                  type="text"
                  value={newResource.title}
                  onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                  placeholder="자료 제목"
                  className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                  설명 (선택)
                </label>
                <input
                  type="text"
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  placeholder="간단한 설명"
                  className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-500 uppercase tracking-wide mb-2">
                  URL / 링크
                </label>
                <input
                  type="url"
                  value={newResource.url}
                  onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-xl font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
              >
                취소
              </button>
              <button
                onClick={addResource}
                className="flex-1 px-4 py-3 btn-primary rounded-xl font-medium"
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
