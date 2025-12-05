"use client";

import React, { useState, useEffect } from "react";

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
  const [branch, setBranch] = useState("");
  const [studyType, setStudyType] = useState("");
  const [year, setYear] = useState("");

  const [uniSearch, setUniSearch] = useState("");
  const [showUniList, setShowUniList] = useState(false);
  const [branchSearch, setBranchSearch] = useState("");
  const [showBranchList, setShowBranchList] = useState(false);

  const [loading, setLoading] = useState(false);

  const studyTypes: string[] = [
    "Notes",
    "Assignments",
    "Papers",
    "Que Banks",
    "PPT",
    "Reports",
  ];

  const [universities, setUniversities] = useState<string[]>([]);
  const [branches, setBranches] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/data/engineeringData.json");
        const data = await response.json();
        setUniversities(data.colleges);
        setBranches(data.branches);
      } catch (error) {
        console.error("Error fetching engineering data:", error);
      }
    };
    fetchData();
  }, []);

  const years: string[] = [
    "2025", "2024", "2023", "2022", "2021", "2020",
    "2019", "2018", "2017", "2016", "2015", "2014",
    "2013", "2012", "2011", "2010", "2009", "2008",
    "2007", "2006", "2005", "2004", "2003", "2002",
    "2001", "2000",
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
    formData.append("branch", branch);
    formData.append("studyType", studyType);
    formData.append("year", year);

    try {
      const response = await fetch("/api/notes/upload", {
        method: "POST",
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
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-20">
      <h2 className="text-3xl font-bold mb-6 text-center">Upload Study Material</h2>

      {/* GRID START */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* File Input */}
        <div className="col-span-2">
          <label className="text-gray-700 text-sm font-medium">Select File</label>
          <input
            type="file"
            className="w-full mt-2 mb-4 p-2 border rounded-lg"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        {/* Title */}
        <div>
          <label className="text-gray-700 text-sm font-medium">Title</label>
          <input
            type="text"
            placeholder="Enter title"
            className="w-full mt-2 p-2 border rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Study Type */}
        <div>
          <label className="text-gray-700 text-sm font-medium">
            Study Material Type
          </label>
          <select
            className="w-full mt-2 p-2 border rounded-lg"
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
        </div>

        {/* University */}
        <div>
          <label className="text-gray-700 text-sm font-medium">University/College</label>
          <input
            type="text"
            value={uniSearch}
            onChange={(e) => {
              setUniSearch(e.target.value);
              setShowUniList(true);
            }}
            onFocus={() => setShowUniList(true)}
            className="w-full p-3 mt-1 border rounded-md"
            placeholder="Search university"
          />

          {showUniList && (
            <ul className="border rounded-md mt-2 max-h-40 overflow-y-auto bg-white shadow-lg">
              {universities
                .filter((u) =>
                  u.toLowerCase().includes(uniSearch.toLowerCase())
                )
                .map((u, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => {
                      setUniSearch(u);
                      setUniversity(u);
                      setShowUniList(false);
                    }}
                  >
                    {u}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Branch */}
        <div>
          <label className="text-gray-700 text-sm font-medium">Branch</label>
          <input
            type="text"
            value={branchSearch}
            onChange={(e) => {
              setBranchSearch(e.target.value);
              setShowBranchList(true);
            }}
            onFocus={() => setShowBranchList(true)}
            className="w-full p-3 mt-1 border rounded-md"
            placeholder="Search branch"
          />

          {showBranchList && (
            <ul className="border rounded-md mt-2 max-h-40 overflow-y-auto bg-white shadow-lg">
              {branches
                .filter((b) =>
                  b.toLowerCase().includes(branchSearch.toLowerCase())
                )
                .map((b, i) => (
                  <li
                    key={i}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => {
                      setBranchSearch(b);
                      setBranch(b);
                      setShowBranchList(false);
                    }}
                  >
                    {b}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Year */}
        <div>
          <label className="text-gray-700 text-sm font-medium">Academic Year</label>
          <select
            className="w-full mt-2 p-2 border rounded-lg"
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
        </div>

        {/* Description (Full Width) */}
        <div className="col-span-2">
          <label className="text-gray-700 text-sm font-medium">Description</label>
          <textarea
            placeholder="Enter description"
            className="w-full mt-2 p-3 border rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

      </div>
      {/* GRID END */}

      {/* Button */}
      <button
        onClick={handleUpload}
        disabled={loading}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg mt-6 hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadNote;
