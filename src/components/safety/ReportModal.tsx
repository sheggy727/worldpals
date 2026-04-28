"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";

const REPORT_REASONS = [
  "Harassment or bullying",
  "Inappropriate content",
  "Spam or fake account",
  "Hate speech",
  "Underage user",
  "Other",
];

interface ReportModalProps {
  reportedId: string;
  reportedName: string;
  onClose: () => void;
}

export default function ReportModal({ reportedId, reportedName, onClose }: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (!reason) { toast.error("Please select a reason"); return; }
    setSubmitting(true);

    const res = await fetch("/api/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportedId, reason, description }),
    });

    setSubmitting(false);
    if (res.ok) {
      setSubmitted(true);
    } else {
      toast.error("Failed to submit report");
    }
  };

  const handleBlock = async () => {
    await fetch("/api/block", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId: reportedId }),
    });
    toast.success(`${reportedName} has been blocked`);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="bg-white rounded-4xl w-full max-w-md p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {submitted ? (
            <div className="text-center py-4">
              <div className="text-5xl mb-4">✅</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Report submitted</h3>
              <p className="text-gray-500 text-sm mb-6">
                Thank you. Our team will review this report within 24 hours.
              </p>
              <div className="flex flex-col gap-3">
                <button onClick={handleBlock} className="btn-secondary text-red-500 border-red-100 hover:bg-red-50">
                  Also block {reportedName}
                </button>
                <button onClick={onClose} className="btn-ghost">Close</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  <h3 className="text-lg font-bold text-gray-900">Report {reportedName}</h3>
                </div>
                <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <p className="text-gray-500 text-sm mb-4">
                Help us maintain a safe community. Your report is confidential.
              </p>

              <div className="space-y-2 mb-4">
                {REPORT_REASONS.map((r) => (
                  <button
                    key={r}
                    onClick={() => setReason(r)}
                    className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
                      reason === r
                        ? "bg-orange-50 border-2 border-orange-300 text-orange-700"
                        : "bg-gray-50 border-2 border-transparent text-gray-700 hover:border-gray-200"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <textarea
                className="input-field resize-none mb-4"
                rows={2}
                placeholder="Additional details (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
              />

              <div className="flex gap-3">
                <button onClick={handleBlock} className="btn-secondary flex-1 text-sm text-red-500">
                  Block user
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!reason || submitting}
                  className="btn-primary flex-1 text-sm"
                >
                  {submitting ? "Submitting..." : "Submit report"}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
