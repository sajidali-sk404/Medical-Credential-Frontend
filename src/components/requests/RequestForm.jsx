"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, UploadCloud, FileText, X } from "lucide-react";
import api from "@/lib/axios";

const SPECIALTIES = [
  "Cardiology","Radiology","Pediatrics","Surgery",
  "Neurology","Oncology","Orthopedics","Dermatology",
];

const ALLOWED_TYPES = ["application/pdf","image/jpeg","image/png","image/webp"];
const MAX_SIZE_MB = 10;

export function RequestForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({
    provider_name: "",
    specialty: "",
    notes: "",
  });

  const update = (field) => (e) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files);
    const valid = [];
    const errors = [];

    picked.forEach(file => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: invalid type`);
      } else if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        errors.push(`${file.name}: >10MB`);
      } else valid.push(file);
    });

    if (errors.length) {
      setError(errors.join(" • "));
      return;
    }

    setError("");
    setFiles(prev => [...prev, ...valid]);
    e.target.value = "";
  };

  const removeFile = (index) =>
    setFiles(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: newRequest } = await api.post("/api/requests", form);

      if (files.length > 0) {
        await Promise.all(
          files.map(file => {
            const formData = new FormData();
            formData.append("document", file);
            return api.post(`/api/requests/${newRequest._id}/documents`, formData);
          })
        );
      }

      router.push(`/dashboard/requests/${newRequest._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Submission failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* 🔥 Progress Stepper */}
      <div className="flex items-center justify-between">
        {["Provider","Notes","Documents","Review"].map((label, i) => (
          <div key={i} className="flex-1 flex items-center">
            
            {/* circle */}
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold
              ${step > i+1 ? "bg-green-500 text-white" :
                step === i+1 ? "bg-primary text-white" :
                "bg-gray-200 text-gray-500"}`}>
              {step > i+1 ? <Check className="w-4 h-4"/> : i+1}
            </div>

            {/* label */}
            <span className={`ml-2 text-xs font-medium 
              ${step === i+1 ? "text-gray-900" : "text-gray-400"}`}>
              {label}
            </span>

            {/* line */}
            {i < 3 && (
              <div className={`flex-1 h-[2px] mx-2 
                ${step > i+1 ? "bg-green-500" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      <Card className="rounded-2xl shadow-sm border">
        <CardContent className="p-6 space-y-5">

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h2 className="text-lg font-semibold">Provider Information</h2>

              <div className="space-y-3">
                <Input
                  placeholder="Dr. Bilal Raza"
                  value={form.provider_name}
                  onChange={update("provider_name")}
                />

                <select
                  value={form.specialty}
                  onChange={update("specialty")}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="">Select specialty</option>
                  {SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <Button className="w-full" onClick={() => {
                if (!form.provider_name || !form.specialty) {
                  setError("Fill required fields");
                  return;
                }
                setError("");
                setStep(2);
              }}>
                Continue →
              </Button>
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <h2 className="text-lg font-semibold">Additional Notes</h2>

              <textarea
                value={form.notes}
                onChange={update("notes")}
                rows={4}
                placeholder="Optional notes..."
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 focus:ring-2 focus:ring-primary outline-none resize-none"
              />

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={() => setStep(3)}>Continue →</Button>
              </div>
            </>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <>
              <h2 className="text-lg font-semibold">Upload Documents</h2>

              {/* Upload Box */}
              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer hover:bg-gray-50 transition">
                <UploadCloud className="w-6 h-6 text-gray-400 mb-2"/>
                <p className="text-sm font-medium">Click or drag files</p>
                <p className="text-xs text-gray-400">PDF, JPG, PNG (max 10MB)</p>

                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {/* Files */}
              <div className="space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2">
                    
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500"/>
                      <span className="text-sm truncate">{file.name}</span>
                    </div>

                    <button
                      onClick={() => removeFile(i)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4"/>
                    </button>
                  </div>
                ))}
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button onClick={() => setStep(4)}>Continue →</Button>
              </div>
            </>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <>
              <h2 className="text-lg font-semibold">Review</h2>

              <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2 border">
                <p><strong>Provider:</strong> {form.provider_name}</p>
                <p><strong>Specialty:</strong> {form.specialty}</p>
                <p><strong>Notes:</strong> {form.notes || "—"}</p>
                <p><strong>Files:</strong> {files.length}</p>
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </>
          )}

        </CardContent>
      </Card>
    </div>
  );
}