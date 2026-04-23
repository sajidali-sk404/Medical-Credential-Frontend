"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import { RequestForm } from "@/components/requests/RequestForm"

export const NewRequestViewPage = () => {
    const router = useRouter()

    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const [files, setFiles] = useState([])
    const [form, setForm] = useState({
        provider_name: "",
        specialty: "",
        notes: "",
    })

    // ✅ Allowed types (SYNC with backend)
    const ALLOWED_TYPES = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp",
    ]

    const MAX_SIZE = 10 * 1024 * 1024

    // ─────────────────────────────
    // FORM UPDATE
    // ─────────────────────────────
    const update = (field) => (e) => {
        setForm((prev) => ({
            ...prev,
            [field]: e.target.value,
        }))
    }

    // ─────────────────────────────
    // FILE HANDLING
    // ─────────────────────────────
    const handleFiles = (selectedFiles) => {
        const valid = []
        const errors = []

        Array.from(selectedFiles).forEach((file) => {
            const isValidMime = ALLOWED_TYPES.includes(file.type)
            const isPdfByName = file.name.toLowerCase().endsWith(".pdf")

            if (!isValidMime && !isPdfByName) {
                errors.push(`${file.name}: invalid type`)
            } else if (file.size > MAX_SIZE) {
                errors.push(`${file.name}: exceeds 10MB`)
            } else {
                valid.push(file)
            }
        })

        if (errors.length) {
            setError(errors.join(" • "))
            return
        }

        setError("")
        setFiles((prev) => [...prev, ...valid])
    }

    const removeFile = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }

    // ─────────────────────────────
    // SUBMIT
    // ─────────────────────────────
    const handleSubmit = async () => {
        setLoading(true)
        setError("")

        try {
            // 1️⃣ Create request
            const { data: newRequest } = await api.post("/api/requests", form)

            // 2️⃣ Upload files
            if (files.length > 0) {
                await Promise.all(
                    files.map((file) => {
                        const formData = new FormData()
                        formData.append("document", file)

                        return api.post(
                            `/api/requests/${newRequest._id}/documents`,
                            formData,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        )
                    })
                )
            }

            // 3️⃣ Redirect
            router.push(`/dashboard/requests/${newRequest._id}`)

        } catch (err) {
            setError(err.response?.data?.message || "Submission failed")
        } finally {
            setLoading(false)
        }
    }

    // ─────────────────────────────
    // UI
    // ─────────────────────────────
    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">

            {/* HEADER */}
            <h1 className="text-xl font-semibold">
                New Credentialing Request
            </h1>
            {/* CARD */}
            <div className="border rounded-xl p-5 space-y-4">
                <RequestForm />
            </div>
        </div>
    )
}