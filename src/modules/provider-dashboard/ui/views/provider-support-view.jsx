"use client";
import { useState } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { HelpCircle, Send, CheckCircle2, AlertCircle } from "lucide-react";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";

export default function ProviderSupportView() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message) {
      setError("Subject and message are required");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/api/requests/support", { subject, message });
      setSuccess("Support ticket submitted! A verification officer will follow up shortly.");
      setSubject("");
      setMessage("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit ticket");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <PageHeader
        title="Provider Support & Verification Help"
        subtitle="Need assistance with state licensing verification, document uploads, or credential status updates?"
      />

      {success && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600" />
          {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Inquiry Subject / Topic
            </label>
            <Input
              type="text"
              placeholder="e.g. License expiration update, Expedited review request"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-gray-50 text-xs"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Detailed Description
            </label>
            <textarea
              rows={5}
              placeholder="Please describe your question or issue in detail..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full md:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            {loading ? "Submitting Ticket..." : "Submit Support Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}
