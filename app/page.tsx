"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Simple fade animation
    const elements = document.querySelectorAll(".fade-up");
    elements.forEach((el, i) => {
      setTimeout(() => el.classList.add("opacity-100", "translate-y-0"), i * 150);
    });
  }, []);

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto">

      {/* Intro Section */}
      <section className="text-center py-16 fade-up opacity-0 translate-y-6 transition-all duration-700">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Share & Download Notes Easily
        </h1>
        <p className="text-gray-600 mb-6 text-lg">
          A platform created for students to upload, share, and learn from
          high-quality study materials across all universities.
        </p>

        <div className="flex justify-center gap-4">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow">
            Upload Notes
          </button>
          <button className="px-6 py-3 bg-gray-200 rounded-lg shadow">
            Browse Notes
          </button>
        </div>
      </section>

      {/* How to Upload Notes */}
      <section className="mt-20 fade-up opacity-0 translate-y-6 transition-all duration-700">
        <h2 className="text-3xl font-semibold mb-6">How to Upload Notes?</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: "Step 1", text: "Login or create your student account." },
            { title: "Step 2", text: "Upload your Notes / Assignments / Papers." },
            { title: "Step 3", text: "Get visibility and help thousands of students." },
          ].map((step, i) => (
            <div
              key={i}
              className="p-5 border rounded-xl shadow-sm bg-white hover:shadow-lg transition"
            >
              <h3 className="font-bold text-xl">{step.title}</h3>
              <p className="text-gray-600 mt-2">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Purpose Section */}
      <section className="mt-20 fade-up opacity-0 translate-y-6 transition-all duration-700">
        <h2 className="text-3xl font-semibold mb-4">Purpose of This Platform</h2>
        <p className="text-gray-700 text-lg leading-relaxed">
          The main purpose of this application is to build a centralized hub for educational
          content where students from different universities can share Notes, Question Banks,
          Assignments, Previous Year Papers, PPTs, Reports, Research Papers, and Project
          Documents.
          <br />
          This platform promotes collaborative learning and helps students access important
          study resources anytime, anywhere.
        </p>
      </section>

      {/* Total Notes Count */}
      <section className="mt-20 fade-up opacity-0 translate-y-6 transition-all duration-700">
        <h2 className="text-3xl font-semibold mb-6">Total Study Resources</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { label: "Notes", count: "1,240+" },
            { label: "Papers", count: "540+" },
            { label: "Other Materials", count: "780+" },
          ].map((item, i) => (
            <div
              key={i}
              className="p-6 border rounded-xl shadow-sm bg-white hover:shadow-lg transition"
            >
              <p className="text-4xl font-bold text-blue-600">{item.count}</p>
              <p className="text-lg text-gray-700 mt-2">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Colleges & Universities */}
      <section className="mt-20 fade-up opacity-0 translate-y-6 transition-all duration-700">
        <h2 className="text-3xl font-semibold mb-4">Supported Universities</h2>

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700 font-medium">
          <li className="p-3 bg-gray-100 rounded-md">RTMNU – Nagpur University</li>
          <li className="p-3 bg-gray-100 rounded-md">Savitribai Phule Pune University</li>
          <li className="p-3 bg-gray-100 rounded-md">Mumbai University</li>
          <li className="p-3 bg-gray-100 rounded-md">Delhi University</li>
          <li className="p-3 bg-gray-100 rounded-md">Amravati University</li>
          <li className="p-3 bg-gray-100 rounded-md">More Universities Coming Soon…</li>
        </ul>
      </section>

      {/* Types of Notes */}
      <section className="mt-20 fade-up opacity-0 translate-y-6 transition-all duration-700">
        <h2 className="text-3xl font-semibold mb-6">What Type of Materials We Support?</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            "Assignments",
            "Class Notes",
            "PPT Presentations",
            "Reports",
            "Posters",
            "Research Papers",
            "Mini Project Content",
            "Mega Project Content",
            "Question Banks",
            "Previous Year Papers",
          ].map((type, i) => (
            <div
              key={i}
              className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-lg transition text-gray-800 font-medium"
            >
              {type}
            </div>
          ))}
        </div>
      </section>
    </div>

  );
}
