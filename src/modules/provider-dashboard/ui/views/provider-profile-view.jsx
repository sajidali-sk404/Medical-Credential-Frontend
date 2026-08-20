"use client";
import { useState, useEffect } from "react";
import { PageHeader } from "@/components/layout/PageHeader";
import { User, Stethoscope, Hash, FileBadge, MapPin, Phone, Save, CheckCircle2, ShieldCheck } from "lucide-react";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";

export default function ProviderProfileView() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [npiNumber, setNpiNumber] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseState, setLicenseState] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [bio, setBio] = useState("");
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    api.get("/api/provider/profile")
      .then(({ data }) => {
        setUserData(data.user_id);
        setNpiNumber(data.npi_number || "");
        setSpecialty(data.specialty || "");
        setLicenseNumber(data.license_number || "");
        setLicenseState(data.license_state || "");
        setPhone(data.phone || "");
        setAddress(data.address || "");
        setBio(data.bio || "");
      })
      .catch((err) => {
        console.error("Error fetching provider profile:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      await api.put("/api/provider/profile", {
        npi_number: npiNumber,
        specialty,
        license_number: licenseNumber,
        license_state: licenseState,
        phone,
        address,
        bio
      });
      setMessage("Profile & credential details updated successfully!");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="py-12 text-center text-gray-500">
      <p>Loading profile information...</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <PageHeader
        title="Provider Profile & Credentials"
        subtitle="Manage your professional medical identifiers, state licenses, and contact information"
      />

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          {message}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* User Account Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b">
            <div className="w-14 h-14 rounded-full bg-teal-100 border-2 border-teal-500 text-teal-800 flex items-center justify-center font-bold text-xl">
              {userData?.name ? userData.name.charAt(0) : "P"}
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{userData?.name}</h3>
              <p className="text-xs text-gray-500">{userData?.email}</p>
              <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-teal-100 text-teal-800 uppercase tracking-wider">
                Verified Provider
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                National Provider Identifier (NPI)
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="10-digit NPI number"
                  value={npiNumber}
                  onChange={(e) => setNpiNumber(e.target.value)}
                  className="pl-9 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Primary Specialty
              </label>
              <div className="relative">
                <Stethoscope className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="e.g. Cardiology, Internal Medicine"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  className="pl-9 bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* License Info */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
          <h3 className="font-semibold text-base text-gray-900 border-b pb-3">State Medical Licensing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Medical License Number
              </label>
              <div className="relative">
                <FileBadge className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="e.g. C123456"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="pl-9 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Licensing State / Jurisdiction
              </label>
              <Input
                type="text"
                placeholder="e.g. CA, NY, TX"
                value={licenseState}
                onChange={(e) => setLicenseState(e.target.value)}
                className="bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-xs space-y-4">
          <h3 className="font-semibold text-base text-gray-900 border-b pb-3">Contact & Practice Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-9 bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Practice Address
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="123 Medical Center Way, Suite 400"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-9 bg-gray-50"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Professional Biography & Qualifications
            </label>
            <textarea
              rows={4}
              placeholder="Brief overview of clinical background, fellowship training, and board certifications..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-3 border border-gray-200 rounded-lg text-xs bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full md:w-auto px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving Changes..." : "Save Profile Details"}
        </button>
      </form>
    </div>
  );
}
