"use client";
import { useState, useEffect, use } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusTimeline } from "@/components/StatusTimeLine";
import { Badge } from "@/components/ui/Badge";
import { FileText, Download, Trash2, UploadCloud, Loader2, ArrowLeft, Building2, User, Calendar, ShieldCheck } from "lucide-react";
import Link from "next/link";
import api from "@/lib/axios";

export default function ProviderRequestDetailView({ params }) {
  const resolvedParams = use(params);
  const requestId = resolvedParams.id;

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fetchRequestDetails = async () => {
    try {
      const { data } = await api.get(`/api/provider/requests/${requestId}`);
      setRequest(data);
    } catch (err) {
      console.error("Error loading request details:", err);
      setError(err.response?.data?.message || "Failed to load request details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [requestId]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type) && !file.name.toLowerCase().endsWith(".pdf")) {
      setUploadError("Only PDF and image files are allowed");
      return;
    }

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("document", file);

    try {
      const { data: newDoc } = await api.post(`/api/provider/requests/${requestId}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      setRequest((prev) => ({
        ...prev,
        documents: [...(prev.documents || []), newDoc]
      }));
    } catch (err) {
      setUploadError(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await api.delete(`/api/provider/requests/${requestId}/documents/${docId}`);
      setRequest((prev) => ({
        ...prev,
        documents: prev.documents.filter((d) => d._id !== docId)
      }));
    } catch (err) {
      alert("Failed to delete document");
    }
  };

  if (loading) return (
    <div className="py-12 text-center text-gray-500">
      <p>Loading credential verification details...</p>
    </div>
  );

  if (error || !request) return (
    <div className="py-12 text-center">
      <p className="text-red-500 mb-4">{error || "Request not found"}</p>
      <Link href="/provider/requests" className="px-4 py-2 bg-teal-600 text-white rounded-md text-xs font-semibold">
        Back to Requests
      </Link>
    </div>
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <Link href="/provider/requests" className="p-2 border rounded-lg bg-white hover:bg-gray-50 text-gray-600 transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Credential Verification #{request._id.slice(-6)}</h1>
          <p className="text-xs text-gray-500">Submitted on {new Date(request.submitted_at).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Main Info Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Status</span>
              <div className="mt-1">
                <Badge label={request.status.replace("_", " ")} variant={request.status.toLowerCase()} />
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Specialty</span>
              <p className="text-sm font-semibold text-gray-900 mt-1">{request.specialty}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm pt-2">
            <div>
              <p className="text-xs text-gray-400 font-medium">Provider Name</p>
              <p className="font-semibold text-gray-900 mt-0.5">{request.provider_name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Requesting Institution</p>
              <p className="font-semibold text-gray-900 mt-0.5">
                {request.client_id?.company_name || request.client_id?.user_id?.name || "Healthcare Facility"}
              </p>
            </div>
          </div>

          {request.notes && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Notes / Instructions</p>
              <p className="text-xs text-gray-700 leading-relaxed">{request.notes}</p>
            </div>
          )}
        </div>

        <div className="bg-teal-900 text-white p-6 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-lg bg-teal-800 flex items-center justify-center mb-3">
              <ShieldCheck className="w-6 h-6 text-teal-300" />
            </div>
            <h3 className="font-semibold text-base">Verification Guidelines</h3>
            <p className="text-xs text-teal-200/80 mt-2 leading-relaxed">
              Ensure your State Medical License, Board Certification, and Malpractice documentation are valid and unexpired.
            </p>
          </div>
          <div className="pt-4 border-t border-teal-800 text-xs text-teal-300">
            Encrypted AES-256 Cloud Vault
          </div>
        </div>
      </div>

      {/* Document Section */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h3 className="font-semibold text-base text-gray-900">Credential Documents ({request.documents?.length || 0})</h3>
            <p className="text-xs text-gray-500">Upload licenses, certificates, and medical board records for review.</p>
          </div>
        </div>

        {/* Upload box */}
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-5 text-center bg-gray-50/50 hover:bg-gray-50 transition">
          <input
            type="file"
            id="provider-doc-upload"
            accept=".pdf,image/jpeg,image/png,image/webp"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <label htmlFor="provider-doc-upload" className="cursor-pointer flex flex-col items-center gap-2">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
            ) : (
              <UploadCloud className="w-6 h-6 text-teal-600" />
            )}
            <span className="text-xs font-semibold text-gray-800">
              {uploading ? "Uploading Document..." : "Click to upload Medical License / Cert File (PDF or Image)"}
            </span>
            <span className="text-[11px] text-gray-400">PDF, JPG, PNG, WEBP — Max 10MB</span>
          </label>
        </div>

        {uploadError && <p className="text-xs text-red-500 bg-red-50 p-2.5 rounded-md">{uploadError}</p>}

        {/* Document List */}
        <div className="space-y-2 pt-2">
          {request.documents?.length === 0 ? (
            <p className="text-xs text-center text-gray-400 py-6">No documents uploaded for this request yet.</p>
          ) : (
            request.documents?.map((doc) => (
              <div key={doc._id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50/50 hover:bg-white transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-800">{doc.file_name}</p>
                    <p className="text-[10px] text-gray-400">
                      Uploaded on {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={doc.file_url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 text-xs text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-md font-medium flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> View
                  </a>
                  <button
                    onClick={() => handleDeleteDocument(doc._id)}
                    className="p-1.5 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Audit Trail Stepper */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
        <h3 className="font-semibold text-base text-gray-900">Verification Timeline & History</h3>
        <p className="text-xs text-gray-500 mb-4">Complete audit trail of status changes and review notes.</p>
        <StatusTimeline logs={request.status_logs} />
      </div>
    </div>
  );
}
