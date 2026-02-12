"use client";

import { useState } from "react";
import { Phone } from "lucide-react";
import { emergencyContacts } from "@/lib/tripData";
import Modal from "./Modal";

export default function EmergencyFAB() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-40 w-12 h-12 rounded-full bg-red-500 text-white shadow-lg shadow-red-500/30 flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all"
        aria-label="긴급 연락처"
      >
        <Phone size={20} />
      </button>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="긴급 연락처">
        <div className="space-y-2">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.number}
              className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm">{contact.name}</p>
                <p className="text-xs text-neutral-500">{contact.description}</p>
              </div>
              <a
                href={`tel:${contact.number}`}
                className="ml-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors shrink-0"
              >
                <Phone size={14} />
                {contact.number}
              </a>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
