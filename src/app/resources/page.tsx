"use client";

import { useState, useEffect } from "react";
import { Plus, X, Search, Star, Phone, FileText, Link2, Image, AlertCircle, MapPin } from "lucide-react";
import { emergencyContacts } from "@/lib/tripData";
import Modal from "@/components/Modal";
import ScrollReveal from "@/components/ScrollReveal";

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
  {
    id: "hotel-delhi-day7-voucher",
    type: "pdf",
    title: "델리 숙소 바우처 - Hotel Ramhan Palace",
    description: "2/19~2/20 (1박) Standard Double Room (Twin Beds) · 예약번호: 1697203885 (Agoda) · ₩53,084",
    url: "/vouchers/booking_1697203885.pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: "bus-jsa-udr-0215",
    type: "pdf",
    title: "2/15 자이살메르→우다이푸르 야간버스 (BS Maharaja Travels)",
    description: "20:45-06:45(+1) · A/C Sleeper · 좌석 L9/L10 · Booking: 3BQPHSXP",
    url: "/vouchers/bus_JSA_UDR_0215.pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: "bus-udr-jai-0217",
    type: "pdf",
    title: "2/18 우다이푸르→자이푸르 야간버스 (Patel Travels)",
    description: "01:00-08:45 · A/C Sleeper · 좌석 L8/L9 · Booking: 3BFFM366",
    url: "/vouchers/bus_UDR_JAI_0217.pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: "hotel-jaipur-day6-voucher",
    type: "pdf",
    title: "자이푸르 숙소 바우처 - Umaid Bhawan Heritage Hotel",
    description: "2/18~2/19 (1박) Royal Suite (Twin Beds) · 예약번호: 1697209146 (Agoda) · ₩139,242",
    url: "/vouchers/booking_1697209146.pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: "airbnb-varanasi-day8-voucher",
    type: "pdf",
    title: "바라나시 숙소 - Airbnb 일출 및 강 전망 객실",
    description: "2/20~2/21 (1박) Pandey Ghat · 예약코드: HMS59YB824 · ₩88,632",
    url: "/vouchers/airbnb_HMS59YB824.pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: "receipt-ramhan-palace",
    type: "pdf",
    title: "델리 숙소 영수증 - Hotel Ramhan Palace (Agoda)",
    description: "예약번호: 1697203885 · ₩53,084",
    url: "/vouchers/receipt_1697203885.pdf",
    createdAt: new Date().toISOString(),
  },
  {
    id: "receipt-umaid-bhawan",
    type: "pdf",
    title: "자이푸르 숙소 영수증 - Umaid Bhawan Heritage Hotel (Agoda)",
    description: "예약번호: 1697209146 · ₩139,242",
    url: "/vouchers/receipt_1697209146.pdf",
    createdAt: new Date().toISOString(),
  },
];

const typeConfig: Record<string, string> = {
  link: "링크",
  pdf: "PDF",
  image: "이미지",
};

const typeStyles: Record<string, { border: string; iconBg: string; iconColor: string }> = {
  pdf: {
    border: "border-l-4 border-red-400",
    iconBg: "bg-red-50 dark:bg-red-950/30",
    iconColor: "text-red-500",
  },
  link: {
    border: "border-l-4 border-blue-400",
    iconBg: "bg-blue-50 dark:bg-blue-950/30",
    iconColor: "text-blue-500",
  },
  image: {
    border: "border-l-4 border-green-400",
    iconBg: "bg-green-50 dark:bg-green-950/30",
    iconColor: "text-green-500",
  },
};

const dayMapping: Record<string, { day: number; city: string }> = {
  "2/13": { day: 1, city: "델리" },
  "2/14": { day: 2, city: "자이살메르" },
  "2/15": { day: 3, city: "자이살메르" },
  "2/16": { day: 4, city: "우다이푸르" },
  "2/17": { day: 5, city: "우다이푸르" },
  "2/18": { day: 6, city: "자이푸르" },
  "2/19": { day: 7, city: "자이푸르/델리" },
  "2/20": { day: 8, city: "바라나시" },
  "2/21": { day: 9, city: "바라나시/델리" },
  "2/22": { day: 10, city: "귀국" },
};

function getTypeIcon(type: string, size: number = 16) {
  switch (type) {
    case "pdf":
      return <FileText size={size} />;
    case "link":
      return <Link2 size={size} />;
    case "image":
      return <Image size={size} />;
    default:
      return <FileText size={size} />;
  }
}

function extractDayInfo(resource: Resource): { day: number; city: string } | null {
  const combined = `${resource.title} ${resource.description || ""}`;
  for (const [dateKey, info] of Object.entries(dayMapping)) {
    if (combined.includes(dateKey)) {
      return info;
    }
  }
  return null;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>(defaultResources);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
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

    const savedFavorites = localStorage.getItem("india-resource-favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const saveResources = (newResources: Resource[]) => {
    setResources(newResources);
    localStorage.setItem("india-resources", JSON.stringify(newResources));
  };

  const saveFavorites = (newFavorites: string[]) => {
    setFavorites(newFavorites);
    localStorage.setItem("india-resource-favorites", JSON.stringify(newFavorites));
  };

  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      saveFavorites(favorites.filter((f) => f !== id));
    } else {
      saveFavorites([...favorites, id]);
    }
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
    if (!window.confirm("이 자료를 삭제하시겠습니까?")) return;
    saveResources(resources.filter((r) => r.id !== id));
    if (favorites.includes(id)) {
      saveFavorites(favorites.filter((f) => f !== id));
    }
  };

  // Filter by type
  const typeFiltered = selectedType
    ? resources.filter((r) => r.type === selectedType)
    : resources;

  // Filter by search
  const filteredResources = typeFiltered.filter((r) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      r.title.toLowerCase().includes(query) ||
      (r.description || "").toLowerCase().includes(query)
    );
  });

  // Sort: favorites first
  const sortedResources = [...filteredResources].sort((a, b) => {
    const aFav = favorites.includes(a.id) ? 0 : 1;
    const bFav = favorites.includes(b.id) ? 0 : 1;
    return aFav - bFav;
  });

  // Group by day
  type GroupedResources = { key: string; label: string; resources: Resource[] };
  const grouped: GroupedResources[] = [];
  const dayGroups: Record<string, Resource[]> = {};
  const etcResources: Resource[] = [];

  for (const resource of sortedResources) {
    const dayInfo = extractDayInfo(resource);
    if (dayInfo) {
      const key = `day-${dayInfo.day}`;
      if (!dayGroups[key]) {
        dayGroups[key] = [];
      }
      dayGroups[key].push(resource);
    } else {
      etcResources.push(resource);
    }
  }

  // Sort day groups by day number
  const dayKeys = Object.keys(dayGroups).sort((a, b) => {
    const dayA = parseInt(a.replace("day-", ""));
    const dayB = parseInt(b.replace("day-", ""));
    return dayA - dayB;
  });

  for (const key of dayKeys) {
    const dayNum = parseInt(key.replace("day-", ""));
    const dateEntry = Object.entries(dayMapping).find(([, v]) => v.day === dayNum);
    const city = dateEntry ? dateEntry[1].city : "";
    grouped.push({
      key,
      label: `Day ${dayNum} — ${city}`,
      resources: dayGroups[key],
    });
  }

  if (etcResources.length > 0) {
    grouped.push({
      key: "etc",
      label: "기타",
      resources: etcResources,
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 sm:mb-10">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-1">자료실</h1>
          <p className="text-sm text-neutral-500">
            여행 관련 링크, 문서, 이미지를 저장하세요
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 btn-primary rounded-full font-medium text-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">자료 추가</span>
          <span className="sm:hidden">추가</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search
          size={18}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="자료 검색 (제목, 설명)"
          className="w-full pl-10 pr-4 py-3 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-600 focus:shadow-[0_0_0_3px_rgba(0,0,0,0.05)] dark:focus:shadow-[0_0_0_3px_rgba(255,255,255,0.05)] transition-all duration-300 text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
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
              onClick={() =>
                setSelectedType(selectedType === type ? null : type)
              }
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

      {/* Resources - Grouped by Day */}
      {sortedResources.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-neutral-500 text-lg">
            {searchQuery ? "검색 결과가 없습니다" : "저장된 자료가 없습니다"}
          </p>
          <p className="text-neutral-400 text-sm mt-2">
            {searchQuery
              ? "다른 검색어를 입력해 보세요"
              : "자료 추가 버튼을 눌러 새 자료를 추가하세요"}
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {grouped.map((group) => (
            <div key={group.key}>
              {/* Day Header */}
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={16} className="text-neutral-400" />
                <h2 className="text-base sm:text-lg font-bold text-neutral-700 dark:text-neutral-300">
                  {group.label}
                </h2>
                <span className="text-xs text-neutral-400 ml-1">
                  ({group.resources.length})
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.resources.map((resource, rIdx) => {
                  const style = typeStyles[resource.type];
                  const isFav = favorites.includes(resource.id);

                  return (
                    <div
                      key={resource.id}
                      className={`bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 hover:border-neutral-400 dark:hover:border-neutral-600 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group ${style.border}`}
                      style={{ transitionDelay: `${rIdx * 50}ms` }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div
                          className={`w-9 h-9 rounded-xl ${style.iconBg} ${style.iconColor} flex items-center justify-center`}
                        >
                          {getTypeIcon(resource.type, 18)}
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleFavorite(resource.id)}
                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                              isFav
                                ? "text-amber-500 bg-amber-50 dark:bg-amber-950/30"
                                : "text-neutral-300 dark:text-neutral-600 hover:text-amber-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            }`}
                            title={isFav ? "즐겨찾기 해제" : "즐겨찾기"}
                          >
                            <Star
                              size={16}
                              fill={isFav ? "currentColor" : "none"}
                            />
                          </button>
                          <button
                            onClick={() => deleteResource(resource.id)}
                            className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-950/30 dark:hover:text-red-400 flex items-center justify-center transition-colors sm:opacity-0 sm:group-hover:opacity-100"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>

                      <h3 className="font-semibold mb-2 line-clamp-2 text-sm sm:text-base">
                        {resource.title}
                      </h3>
                      {resource.description && (
                        <p className="text-sm text-neutral-500 mb-4 line-clamp-2">
                          {resource.description}
                        </p>
                      )}

                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
                          resource.type === "pdf"
                            ? "text-red-500 hover:text-red-700 dark:hover:text-red-400"
                            : resource.type === "link"
                            ? "text-blue-500 hover:text-blue-700 dark:hover:text-blue-400"
                            : "text-green-500 hover:text-green-700 dark:hover:text-green-400"
                        }`}
                      >
                        {getTypeIcon(resource.type, 14)}
                        열기 &rarr;
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Emergency Contacts Section */}
      <ScrollReveal>
      <div className="mt-16">
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-500 flex items-center justify-center">
            <AlertCircle size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold">긴급 연락처</h2>
            <p className="text-xs text-neutral-500">인도 현지 긴급 전화번호</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.number}
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 border-l-4 border-l-red-400 rounded-xl p-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{contact.name}</p>
                  <p className="text-xs text-neutral-400 mb-1">
                    {contact.nameEn}
                  </p>
                  <p className="text-xs text-neutral-500 line-clamp-1">
                    {contact.description}
                  </p>
                </div>
                <a
                  href={`tel:${contact.number}`}
                  className="ml-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors shrink-0"
                >
                  <Phone size={14} />
                  {contact.number}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
      </ScrollReveal>

      {/* Add Resource Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="새 자료 추가"
        footer={
          <div className="flex gap-3">
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
        }
      >
        <div>
          <label className="block text-[10px] sm:text-xs font-medium text-neutral-500 uppercase tracking-wide mb-1.5 sm:mb-2">
            자료 유형
          </label>
          <div className="flex gap-2">
            {Object.entries(typeConfig).map(([type, label]) => (
              <button
                key={type}
                onClick={() =>
                  setNewResource({
                    ...newResource,
                    type: type as Resource["type"],
                  })
                }
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  newResource.type === type
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                }`}
              >
                {getTypeIcon(type, 14)}
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
            onChange={(e) =>
              setNewResource({ ...newResource, title: e.target.value })
            }
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
            onChange={(e) =>
              setNewResource({ ...newResource, description: e.target.value })
            }
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
            onChange={(e) =>
              setNewResource({ ...newResource, url: e.target.value })
            }
            placeholder="https://..."
            className="w-full px-3 sm:px-4 py-3 border border-neutral-200 dark:border-neutral-700 rounded-lg sm:rounded-xl bg-transparent focus:outline-none focus:border-neutral-900 dark:focus:border-white"
          />
        </div>
      </Modal>
    </div>
  );
}
