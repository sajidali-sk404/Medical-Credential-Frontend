// app/(auth)/sign-in/page.jsx  or  components/SignInView.jsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, Shield, Phone, User, MapPinHouse, Building2 } from "lucide-react";
import api from "@/lib/axios";
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input";


export const SignUpViews = () => {

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [phone, setPhone] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [image, setImage] = useState(null);
    const [address, setAddress] = useState("");
    const [preview, setPreview] = useState(null);


    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const router = useRouter()

    const pathname = usePathname();

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                setLoading(false);
                return;
            }

            // ✅ create FormData
            const formData = new FormData();
            formData.append("name", name);
            formData.append("email", email);
            formData.append("password", password);
            formData.append("company_name", companyName);
            formData.append("phone", phone);
            formData.append("address", address)

            // ✅ append image (if selected)
            if (image) {
                formData.append("image", image);
            }

            const { data } = await api.post(
                "/api/auth/register",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setMessage(data.message || "Registration successful! Please log in.");
            router.push("/sign-in");

        } catch (err) {
            setError(err.response?.data?.message || "Sign up failed");
        } finally {
            setName("");
            setEmail("");
            setAddress("")
            setPassword("");
            setConfirmPassword("");
            setCompanyName("");
            setPhone("");
            setLoading(false);
        }
    };

    return (
        <div className="flex h-full w-full bg-white ">

            {/* ── LEFT SIDE ─────────────────────────────────────────── */}
            <div className="hidden md:flex relative w-1/2 flex-col"
                style={{ background: "linear-gradient(160deg, #0a2a2a 0%, #0d3d3d 50%, #0a4a4a 100%)" }}>

                {/* Subtle grid overlay */}
                <div className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: "radial-gradient(circle, #4dd9ac 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />

                {/* Top: Logo */}
                <div className="relative z-10 p-8 flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-teal-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">C</span>
                    </div>
                    <span className="text-white font-semibold text-lg tracking-wide">CredFlow</span>
                </div>

                {/* Center: Lock icon + heading */}
                <div className="relative z-10 flex-1 flex flex-col items-start justify-center px-12">

                    {/* Decorative lock icon */}
                    <div className="mb-10 relative">
                        <div className="w-32 h-32 rounded-full border border-teal-500/30 flex items-center justify-center"
                            style={{ boxShadow: "0 0 60px rgba(45,212,191,0.15)" }}>
                            <div className="w-20 h-20 rounded-full border border-teal-400/40 flex items-center justify-center">
                                <Lock className="text-teal-400 w-9 h-9" />
                            </div>
                        </div>
                        {/* Orbiting dots */}
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
                        Secure, immutable, and precise credentialing
                        infrastructure built for high-stakes medical institutions.
                    </p>

                    {/* Marquee brand strip */}
                    <div className="mt-12 w-full overflow-hidden">
                        <div className="flex gap-8 text-white/20 font-bold text-7xl overflow-hidden tracking-widest uppercase">
                            <span>CLAFE RESEARCH </span>
                        </div>
                    </div>
                </div>

                {/* Bottom: Trusted badge */}
                <div className="relative z-10 p-8 flex items-center gap-3">
                    <div className="flex -space-x-2">
                        <img src="./docter.svg" alt="" />
                    </div>
                </div>
            </div>

            {/* ── RIGHT SIDE ────────────────────────────────────────── */}
            <div className="flex w-full md:w-1/2 items-center justify-center p-8 bg-white relative">

                <div className="w-full max-w-md">

                    {/* Heading */}
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back</h2>
                        <p className="text-gray-500 text-sm">Enter your credentials to access the ledger.</p>
                    </div>

                    {/* Login / Sign Up tabs */}
                    <div className="flex bg-gray-100 p-1 rounded-lg mb-8">
                        <Link
                            href="/sign-in"
                            className={`flex-1 text-center py-2 text-sm rounded-md font-medium transition-all ${pathname === "/sign-in"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Login
                        </Link>
                        <Link
                            href="/sign-up"
                            className={`flex-1 text-center py-2 text-sm rounded-md font-medium transition-all ${pathname === "/sign-up"
                                ? "bg-white text-gray-900 shadow-sm"
                                : "text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            Sign Up
                        </Link>
                    </div>
                    {/* Error and Message */}
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
                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* ─── Profile Upload ─── */}
                        <div className="flex flex-col items-center mb-6">

                            <div className="relative group">

                                {/* Avatar */}
                                <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border flex items-center justify-center">
                                    {preview ? (
                                        <img
                                            src={preview}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-gray-400 text-sm">No Image</span>
                                    )}
                                </div>

                                {/* Upload button overlay */}
                                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs cursor-pointer rounded-full transition">
                                    Upload
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <p className="text-xs text-gray-400 mt-2">
                                Profile picture (optional)
                            </p>
                        </div>

                        {/* full Name */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input
                                    type="text"
                                    placeholder="Sajid Ali"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 transition"
                                />
                            </div>
                        </div>
                        {/* Professional Email */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="email"
                                    placeholder="name@organization.org"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 transition"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Address
                            </label>
                            <div className="relative">
                                <MapPinHouse className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type="text"
                                    placeholder="Saidu Sharif Swat Mingora"
                                    required
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 transition"
                                />
                            </div>
                        </div>
                        {/* Company Name */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Company Name
                            </label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input
                                    type="text"
                                    placeholder="Northwell Health Partners"
                                    required
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 transition"
                                />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                                Phone
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4"/>
                                <Input
                                    type="text"
                                    placeholder="921234567890"
                                    required
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 transition"
                                />
                            </div>
                        </div>

                        {/* Access Key (password) */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="············"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>
                        {/* Confirm Pasword */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                    Confirm Password
                                </label>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="············"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-gray-50 transition"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-lg text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                            style={{ background: loading ? "#0d3d3d" : "linear-gradient(135deg, #0a3d3d, #0d5c5c)" }}
                        >
                            {loading ? "Authorizing..." : <>Authorize Access <span>→</span></>}
                        </button>
                    </form>

                    {/* Enterprise SSO */}
                    <div className="mt-8">
                        <div className="relative mb-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200" />
                            </div>
                        </div>
                    </div>

                    {/* Footer links */}
                    <div className="mt-8 text-center space-y-2">
                        <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
                            <Link href="/privacy" className="hover:text-gray-600 transition">Privacy Charter</Link>
                            <Link href="/terms" className="hover:text-gray-600 transition">Credentialing Terms</Link>
                            <Link href="/status" className="hover:text-gray-600 transition">System Status</Link>
                        </div>
                        <p className="text-xs text-gray-400">
                            © 2024 CredFlow Clinical Network. All rights reserved.
                        </p>
                    </div>
                </div>

                {/* System Verified badge — bottom right */}
                <div className="absolute bottom-0 -mb-10 right-6 flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-sm">
                    <div className="w-6 h-6 rounded bg-teal-500 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                        <p className="text-xs font-semibold text-gray-800">System Verified</p>
                        <p className="text-xs text-gray-400">Secure AES-256 encrypted channel active.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};