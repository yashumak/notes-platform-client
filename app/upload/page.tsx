"use client";

import React, { useState } from "react";

interface UploadResponse {
  success: boolean;
  message?: string;
  url?: string;
}

const UploadNote: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [university, setUniversity] = useState("");
  const [course, setCourse] = useState("");
  const [studyType, setStudyType] = useState("");
  const [year, setYear] = useState("");

  const [loading, setLoading] = useState(false);

  const studyTypes: string[] = [
    "Notes",
    "Assignments",
    "Papers",
    "Que Banks",
    "PPT",
    "Reports",
  ];

  const universities: string[] = [
    "RTMNU",
    "Pune University",
    "Mumbai University",
    "Nagpur University",
  ];

  const courses: string[] = ["B.Tech", "B.E", "MCA", "B.Sc CS", "Diploma"];

  const years: string[] = [
    "2025",
    "2024",
    "2023",
    "2022",
    "2021",
    "2020",
    "2019",
  ];

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file!");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("university", university);
    formData.append("course", course);
    formData.append("studyType", studyType);
    formData.append("year", year);

    try {
      const response = await fetch("http://localhost:5000/api/notes/upload", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: formData,
      });

      const data: UploadResponse = await response.json();
      console.log(data);

      if (data.success) {
        alert("Upload successful!");
      } else {
        alert(data.message || "Upload failed!");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong while uploading.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-lg mt-20">
      <h2 className="text-2xl font-bold mb-4">Upload Study Material</h2>

      {/* File Input */}
      <label className="text-gray-700 text-sm font-medium">Select File</label>
      <input
        type="file"
        className="w-full mt-2 mb-4 p-2 border rounded-lg"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      {/* Title */}
      <label className="text-gray-700 text-sm font-medium">Title</label>
      <input
        type="text"
        placeholder="Enter title"
        className="w-full mt-2 mb-4 p-2 border rounded-lg"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Description */}
      <label className="text-gray-700 text-sm font-medium">Description</label>
      <textarea
        placeholder="Enter description"
        className="w-full mt-2 mb-4 p-2 border rounded-lg"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* University */}
      <label className="text-gray-700 text-sm font-medium">University</label>
      <select
        className="w-full mt-2 mb-4 p-2 border rounded-lg"
        value={university}
        onChange={(e) => setUniversity(e.target.value)}
      >
        <option value="">Select University</option>
        {universities.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>

      {/* Course */}
      <label className="text-gray-700 text-sm font-medium">Course</label>
      <select
        className="w-full mt-2 mb-4 p-2 border rounded-lg"
        value={course}
        onChange={(e) => setCourse(e.target.value)}
      >
        <option value="">Select Course</option>
        {courses.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* Study Material Type */}
      <label className="text-gray-700 text-sm font-medium">
        Study Material Type
      </label>
      <select
        className="w-full mt-2 mb-4 p-2 border rounded-lg"
        value={studyType}
        onChange={(e) => setStudyType(e.target.value)}
      >
        <option value="">Select Type</option>
        {studyTypes.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      {/* Year */}
      <label className="text-gray-700 text-sm font-medium">Academic Year</label>
      <select
        className="w-full mt-2 mb-4 p-2 border rounded-lg"
        value={year}
        onChange={(e) => setYear(e.target.value)}
      >
        <option value="">Select Year</option>
        {years.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </select>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg mt-4 hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadNote;
