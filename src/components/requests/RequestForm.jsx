"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, UploadCloud, FileText, X, UserCheck, Stethoscope } from "lucide-react";
import api from "@/lib/axios";

const SPECIALTIES = [
  "Cardiology", "Radiology", "Pediatrics", "Surgery",
  "Neurology", "Oncology", "Orthopedics", "Dermatology",
  "Internal Medicine", "General Practice", "Emergency Medicine",
  "Psychiatry", "Anesthesiology", "Obstetrics & Gynecology"
];

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const MAX_SIZE_MB = 10;

export function RequestForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [files, setFiles] = useState([]);
  
  // Available registered providers list
  const [availableProviders, setAvailableProviders] = useState([]);
  const [selectedProviderId, setSelectedProviderId] = useState("");
  const [isManualEntry, setIsManualEntry] = useState(false);

  const [form, setForm] = useState({
    provider_id: "",
    provider_name: "",
    specialty: "",
    notes: "",
  });

  useEffect(() => {
    api.get("/api/requests/available-providers")
      .then(({ data }) => {
        setAvailableProviders(data.providers || []);
      })
      .catch((err) => {
        console.error("Error loading providers:", err);
      });
  }, []);

  const handleProviderSelect = (e) => {
    const val = e.target.value;
    setSelectedProviderId(val);

    if (val === "manual") {
      setIsManualEntry(true);
      setForm((prev) => ({ ...prev, provider_id: "", provider_name: "", specialty: "" }));
    } else if (val) {
      setIsManualEntry(false);
      const chosen = availableProviders.find((p) => String(p._id) === String(val) || p.name === val);
      if (chosen) {
        setForm((prev) => ({
          ...prev,
          provider_id: chosen._id && chosen._id !== chosen.name ? chosen._id : "",
          provider_name: chosen.name,
          specialty: chosen.specialty || prev.specialty,
        }));
      }
    } else {
      setIsManualEntry(false);
      setForm((prev) => ({ ...prev, provider_id: "", provider_name: "", specialty: "" }));
    }
  };

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files);
    const valid = [];
    const errors = [];

    picked.forEach((file) => {
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
    setFiles((prev) => [...prev, ...valid]);
    e.target.value = "";
  };

  const removeFile = (index) =>
    setFiles((prev) => prev.filter((_, i) => i !== index));

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const { data: newRequest } = await api.post("/api/requests", form);

      if (files.length > 0) {
        await Promise.all(
          files.map((file) => {
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
      {/* Progress Stepper */}
      <div className="flex items-center justify-between">
        {["Select Provider", "Notes", "Documents", "Review"].map((label, i) => (
          <div key={i} className="flex-1 flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold
              ${step > i + 1 ? "bg-green-500 text-white" :
                step === i + 1 ? "bg-primary text-white" :
                  "bg-gray-200 text-gray-500"}`}>
              {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
            </div>

            <span className={`ml-2 text-xs font-medium 
              ${step === i + 1 ? "text-gray-900" : "text-gray-400"}`}>
              {label}
            </span>

            {i < 3 && (
              <div className={`flex-1 h-[2px] mx-2 
                ${step > i + 1 ? "bg-green-500" : "bg-gray-200"}`} />
            )}
          </div>
        ))}
      </div>

      <Card className="rounded-2xl shadow-sm border">
        <CardContent className="p-6 space-y-5">
          {/* STEP 1 */}
          {step === 1 && (
            <>
              <div>
                <h2 className="text-lg font-semibold">Select Healthcare Provider</h2>
                <p className="text-xs text-gray-500">Choose a registered provider or type provider details manually</p>
              </div>

              <div className="space-y-4">
                {/* Registered Provider Dropdown */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Registered Providers List
                  </label>
                  <select
                    value={selectedProviderId}
                    onChange={handleProviderSelect}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="">-- Choose from available registered providers --</option>
                    {availableProviders.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} {p.specialty ? `— ${p.specialty}` : ""} {p.npi_number ? `(NPI: ${p.npi_number})` : ""}
                      </option>
                    ))}
                    <option value="manual">+ Enter provider manually</option>
                  </select>
                </div>

                {/* If manual or details needed */}
                {(isManualEntry || !selectedProviderId) && (
                  <div className="p-4 border rounded-xl bg-gray-50/50 space-y-3">
                    <p className="text-xs font-semibold text-gray-700">Provider Details</p>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Provider Full Name</label>
                      <Input
                        placeholder="Dr. Jane Smith, MD"
                        value={form.provider_name}
                        onChange={update("provider_name")}
                      />
                    </div>
                  </div>
                )}

                {/* Specialty Selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Medical Specialty
                  </label>
                  <select
                    value={form.specialty}
                    onChange={update("specialty")}
                    className="w-full border rounded-lg px-3 py-2.5 text-sm bg-gray-50 focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="">Select specialty</option>
                    {SPECIALTIES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {selectedProviderId && selectedProviderId !== "manual" && (
                  <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-800 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-teal-600 shrink-0" />
                    <div>
                      <span className="font-semibold">Selected:</span> {form.provider_name} ({form.specialty || "No specialty specified"})
                    </div>
                  </div>
                )}
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <Button className="w-full" onClick={() => {
                if (!form.provider_name || !form.specialty) {
                  setError("Please select or enter provider name and specialty");
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
                placeholder="Optional credentialing instructions or notes..."
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
              <h2 className="text-lg font-semibold">Upload Verification Documents</h2>

              <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer hover:bg-gray-50 transition">
                <UploadCloud className="w-6 h-6 text-gray-400 mb-2" />
                <p className="text-sm font-medium">Click or drag files</p>
                <p className="text-xs text-gray-400">PDF, JPG, PNG, WEBP (max 10MB)</p>

                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              <div className="space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm truncate">{file.name}</span>
                    </div>

                    <button
                      onClick={() => removeFile(i)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="w-4 h-4" />
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
              <h2 className="text-lg font-semibold">Review & Submit</h2>

              <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2 border">
                <p><strong>Provider:</strong> {form.provider_name}</p>
                <p><strong>Specialty:</strong> {form.specialty}</p>
                <p><strong>Notes:</strong> {form.notes || "—"}</p>
                <p><strong>Attached Documents:</strong> {files.length} file(s)</p>
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Submitting Request..." : "Submit Credentialing Request"}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}