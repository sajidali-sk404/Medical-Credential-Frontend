"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Shield, Phone, User, Building2, Stethoscope, FileBadge, Hash } from "lucide-react";
import api from "@/lib/axios";
import { Input } from "@/components/ui/input";

export const SignUpViews = () => {
    const [role, setRole] = useState("client"); // "client" | "provider"
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    // Provider fields
    const [npiNumber, setNpiNumber] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [licenseState, setLicenseState] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const router = useRouter();
    const pathname = usePathname();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                setLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("role", role);
            formData.append("phone", phone);
            formData.append("address", address);

            if (role === "client") {
                formData.append("company_name", companyName);
            } else {
                formData.append("npi_number", npiNumber);
                formData.append("specialty", specialty);
                formData.append("license_number", licenseNumber);
                formData.append("license_state", licenseState);
            }

            if (image) {
                formData.append("image", image);
            }

            const { data } = await api.post("/api/auth/register", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage(data.message || "Account created successfully! Please log in.");
            setTimeout(() => {
                router.push("/sign-in");
            }, 1200);
        } catch (err) {
            setError(err.response?.data?.message || "Sign up failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div suppressHydrationWarning className="flex h-full w-full bg-white">
            {/* ── LEFT SIDE ─────────────────────────────────────────── */}
            <div className="hidden md:flex relative w-1/2 flex-col"
                style={{ background: "linear-gradient(160deg, #0a2a2a 0%, #0d3d3d 50%, #0a4a4a 100%)" }}>
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: "radial-gradient(circle, #4dd9ac 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
                <div className="relative z-10 p-8 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-teal-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                    </div>
                    <span className="text-white font-semibold text-lg tracking-wide">CredFlow</span>
                </div>

                <div className="relative z-10 flex-1 flex flex-col items-start justify-center px-12">
                    <div className="mb-10 relative">
                        <div className="w-32 h-32 rounded-full border border-teal-500/30 flex items-center justify-center"
                            style={{ boxShadow: "0 0 60px rgba(45,212,191,0.15)" }}>
                            <div className="w-20 h-20 rounded-full border border-teal-400/40 flex items-center justify-center">
                                <Lock className="text-teal-400 w-9 h-9" />
                            </div>
                        </div>
                        {[0, 60, 120, 180, 240, 300].map((deg) => (
                            <div key={deg}
                                className="absolute w-2 h-2 rounded-full bg-teal-400/50"
                                style={{
                                    top: "50%",
                                    left: "50%",
                                    transform: `rotate(${deg}deg) translateX(68px) translateY(-50%)`,
                                }}
                            />
                        ))}
                    </div>

                    <h1 className="text-4xl font-bold text-white leading-tight mb-4">
                        The Authority in<br />
                        <span className="text-teal-400">Healthcare Data.</span>
                    </h1>
                    <p className="text-teal-100/70 text-sm leading-relaxed max-w-xs">
                        Secure, immutable, and precise credentialing infrastructure built for healthcare providers and institutions.
                    </p>

                    <div className="mt-12 w-full overflow-hidden">
                        <div className="flex gap-8 text-white/20 font-bold text-7xl overflow-hidden tracking-widest uppercase">
                            <span>CREDENTIALING</span>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 p-8 flex items-center gap-3">
                    <img src="./docter.svg" alt="doctor graphic" />
                </div>
            </div>

            {/* ── RIGHT SIDE ────────────────────────────────────────── */}
            <div className="flex w-full md:w-1/2 items-center justify-center p-8 bg-white relative overflow-y-auto">
                <div className="w-full max-w-md my-auto py-6">
                    <div className="text-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h2>
                        <p className="text-gray-500 text-sm">Join the credentialing network.</p>
                    </div>

                    <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
                        <Link href="/sign-in" className={`flex-1 text-center py-2 text-sm rounded-md font-medium transition-all ${pathname === "/sign-in" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                            Login
                        </Link>
                        <Link href="/sign-up" className={`flex-1 text-center py-2 text-sm rounded-md font-medium transition-all ${pathname === "/sign-up" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
                            Sign Up
                        </Link>
                    </div>

                    {/* Role selector */}
                    <div className="mb-6">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                            Account Type
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setRole("client")}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition ${role === "client" ? "border-teal-600 bg-teal-50 text-teal-900 font-semibold shadow-sm" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                            >
                                <Building2 className="w-4 h-4 text-teal-600" />
                                Facility / Client
                            </button>
                            <button
                                type="button"
                                onClick={() => setRole("provider")}
                                className={`flex items-center justify-center gap-2 p-3 rounded-lg border text-sm font-medium transition ${role === "provider" ? "border-teal-600 bg-teal-50 text-teal-900 font-semibold shadow-sm" : "border-gray-200 text-gray-600 hover:bg-gray-50"}`}
                            >
                                <Stethoscope className="w-4 h-4 text-teal-600" />
                                Provider / Doctor
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded">
                            {error}
                        </div>
                    )}
                    {message && (
                        <div className="mb-4 p-3 text-sm text-green-700 bg-green-100 rounded">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder={role === "provider" ? "Dr. Jane Smith, MD" : "John Doe"}
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="email"
                                    placeholder="jane.smith@hospital.org"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50"
                                />
                            </div>
                        </div>

                        {/* Role-specific fields */}
                        {role === "client" ? (
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                    Organization / Company Name
                                </label>
                                <div className="relative">
                                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        type="text"
                                        placeholder="St. Jude Health System"
                                        required
                                        value={companyName}
                                        onChange={(e) => setCompanyName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50"
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                            NPI Number
                                        </label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <Input
                                                type="text"
                                                placeholder="10-digit NPI"
                                                value={npiNumber}
                                                onChange={(e) => setNpiNumber(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                            Specialty
                                        </label>
                                        <div className="relative">
                                            <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <Input
                                                type="text"
                                                placeholder="Cardiology / Internal Med"
                                                value={specialty}
                                                onChange={(e) => setSpecialty(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                            License Number
                                        </label>
                                        <div className="relative">
                                            <FileBadge className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                            <Input
                                                type="text"
                                                placeholder="MD1234567"
                                                value={licenseNumber}
                                                onChange={(e) => setLicenseNumber(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                            License State
                                        </label>
                                        <Input
                                            type="text"
                                            placeholder="CA / NY / TX"
                                            value={licenseState}
                                            onChange={(e) => setLicenseState(e.target.value)}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Phone */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="+1 (555) 000-0000"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50"
                                />
                            </div>
                        </div>

                        {/* Password & Confirm */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                    Password
                                </label>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                    Confirm
                                </label>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60 mt-4"
                            style={{ background: loading ? "#0d3d3d" : "linear-gradient(135deg, #0a3d3d, #0d5c5c)" }}
                        >
                            {loading ? "Registering..." : <>Register Account <span>→</span></>}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-xs text-gray-400">
                            Already registered? <Link href="/sign-in" className="text-teal-600 font-semibold hover:underline">Log in here</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};