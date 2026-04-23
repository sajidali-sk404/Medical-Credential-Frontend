"use client"
import { useState } from "react"
import { UploadCloud, FileText, Image as ImageIcon, Loader2, X } from "lucide-react"
import api from "@/lib/axios"

export function DocumentUpload({ requestId, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [file, setFile] = useState(null)

  const validateFile = (file) => {
    const allowed = ["application/pdf", "image/jpeg", "image/png", "image/webp"]

    if (!allowed.includes(file.type)) {
      return "Only PDF, JPG, PNG, or WEBP files are allowed"
    }

    if (file.size > 10 * 1024 * 1024) {
      return "File must be under 10MB"
    }

    return null
  }

  const handleUpload = async (selectedFile) => {
    const err = validateFile(selectedFile)
    if (err) {
      setError(err)
      return
    }

    setFile(selectedFile)
    setUploading(true)
    setError("")

    const formData = new FormData()
    formData.append("document", selectedFile)

    try {
      const { data } = await api.post(
        `/api/requests/${requestId}/documents`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      )

      setFile(null)
      onUploaded(data)
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleChange = (e) => {
    const selected = e.target.files[0]
    if (selected) handleUpload(selected)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped) handleUpload(dropped)
  }

  return (
    <div className="space-y-2">

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={`flex flex-col items-center justify-center p-5 border-2 border-dashed rounded-xl text-center transition ${
          uploading ? "opacity-50" : "hover:bg-gray-50 cursor-pointer"
        }`}
      >
        <input
          type="file"
          accept=".pdf,image/jpeg,image/png,image/webp"
          onChange={handleChange}
          className="hidden"
          id="doc-upload"
          disabled={uploading}
        />

        <label htmlFor="doc-upload" className="cursor-pointer flex flex-col items-center gap-2">

          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
          ) : (
            <UploadCloud className="w-6 h-6 text-gray-500" />
          )}

          <p className="text-sm font-medium text-gray-700">
            {uploading ? "Uploading..." : "Click or drag file to upload"}
          </p>

          <p className="text-xs text-gray-400">
            PDF, JPG, PNG, WEBP • Max 10MB
          </p>
        </label>
      </div>

      {/* File Preview */}
      {file && !uploading && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border">

          <div className="flex items-center gap-3">
            {file.type === "application/pdf" ? (
              <FileText className="w-5 h-5 text-red-500" />
            ) : (
              <ImageIcon className="w-5 h-5 text-blue-500" />
            )}

            <div>
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-gray-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          <button
            onClick={() => setFile(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-md">
          {error}
        </div>
      )}
    </div>
  )
}