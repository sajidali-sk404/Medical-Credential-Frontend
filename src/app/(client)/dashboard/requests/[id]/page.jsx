"use client"
import { useState, useEffect } from "react"
import { use } from "react"
import { PageHeader } from "@/components/layout/PageHeader"
import { Badge } from "@/components/ui/Badge"
import { StatusTimeline } from "@/components/StatusTimeLine"
import { DocumentUpload } from "@/components/DocumentUpload"
import api from "@/lib/axios"

export default function RequestDetailPage({ params }) {
    const { id } = use(params)
    const [request, setRequest] = useState(null)
    const [documents, setDocuments] = useState([])
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchRequest = () => {
        api.get(`/api/requests/${id}`)
            .then(r => {
                setRequest(r.data)
                setDocuments(r.data.documents || [])
                setLogs(r.data.status_logs || [])
            })
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchRequest() }, [id])

    if (loading) return <p className="text-gray-400">Loading...</p>
    if (!request) return <p>Request not found.</p>

    const handleDownload = async (url, name) => {
        const res = await fetch(url)
        const blob = await res.blob()

        const link = document.createElement("a")
        link.href = URL.createObjectURL(blob)
        link.download = name
        link.click()
    }

    return (
        <div className="p-6 space-y-6">

            <PageHeader
                title={request.provider_name}
                subtitle={request.specialty}
                action={<Badge label={request.status.replace("_", " ")} variant={request.status} />}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* DOCUMENTS */}
                <div className="lg:col-span-2 bg-white rounded-xl border shadow-sm p-5">

                    <div className="flex items-center mb-2 gap-2">
                        <div className="px-3 py-1.5 rounded-lg border text-xs font-medium hover:bg-gray-50 transition cursor-pointer">
                            <DocumentUpload
                                requestId={id}
                                onUploaded={(doc) => setDocuments(prev => [...prev, doc])}
                            />
                        </div>
                    </div>
                    {documents.length === 0 ? (
                        <p className="text-sm text-gray-400">
                            No documents uploaded yet.
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {documents.map(doc => (
                                <div
                                    key={doc._id}
                                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition"
                                >
                                    <div className="flex items-center gap-3">

                                        {/* File icon */}
                                        <div className="w-10 h-10 rounded-lg bg-white border flex items-center justify-center text-xs font-semibold">
                                            {doc.file_type === "application/pdf" ? "PDF" : "IMG"}
                                        </div>

                                        {/* Info */}
                                        <div>
                                            <p className="text-sm font-medium">{doc.file_name}</p>
                                            <p className="text-xs text-gray-400">
                                                {new Date(doc.uploaded_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDownload(doc.file_url, doc.file_name)}
                                            className="text-xs px-3 py-1 rounded-md border text-gray-700 hover:bg-gray-100"
                                        >
                                            Download
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* TIMELINE */}
                <div className="bg-white rounded-xl border shadow-sm p-5 h-fit sticky top-6">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">
                        Status History
                    </h2>

                    <StatusTimeline logs={logs} />
                </div>
            </div>
        </div>
    )
}