"use client";
import { useEffect } from "react";
export default function Home() {
  useEffect(() => {
    // Staggered fade-up animation
    const elements = document.querySelectorAll(".fade-up");
    elements.forEach((el, i) => {
      setTimeout(() => el.classList.add("opacity-100", "translate-y-0"), i * 150);
    });
    // Animate counters when they enter viewport
    const counters = document.querySelectorAll(".count-up");
    const animateCounters = () => {
      counters.forEach((counter) => {
        const target = parseInt(counter.getAttribute("data-target") || "0", 10);
        const increment = target / 100;
        let current = 0;
        const update = () => {
          if (current < target) {
            current += increment;
            counter.textContent = Math.ceil(current).toLocaleString() + "+";
            requestAnimationFrame(update);
          } else {
            counter.textContent = target.toLocaleString() + "+";
          }
        };
        update();
      });
    };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounters();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    const statsSection = document.querySelector("#stats");
    if (statsSection) observer.observe(statsSection);
    return () => observer.disconnect();
  }, []);
  return (
    <div className="px-6 py-12 text-white">
      <div className="max-w-6xl mx-auto">
        {/* Intro Section */}
        <section className="text-center py-16 fade-up opacity-0 translate-y-6 transition-all duration-700">
          <h1 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-4 animate-pulse">
            Share & Download Notes Easily
          </h1>
          <p className="text-slate-300 mb-6 text-lg">
            A platform created for students to upload, share, and learn from
            high-quality study materials across all universities.
          </p>
          <div className="flex justify-center gap-4">
            <a href="/upload" className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl shadow-lg hover:scale-105 hover:shadow-cyan-400/40 transition transform duration-300">
              Upload Notes
            </a>
            <a href="/notes" className="px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white rounded-xl shadow-lg hover:scale-105 hover:shadow-fuchsia-400/40 transition transform duration-300">
              Browse Notes
            </a>
          </div>
        </section>
        {/* How to Upload Notes */}
        <section className="mt-20 fade-up opacity-0 translate-y-6 transition-all duration-700">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-6">How to Upload Notes?</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { title: "Step 1", text: "Login or create your student account." },
              { title: "Step 2", text: "Upload your Notes / Assignments / Papers." },
              { title: "Step 3", text: "Get visibility and help thousands of students." },
            ].map((step, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl shadow-lg bg-slate-800/50 backdrop-blur border border-slate-700 hover:border-cyan-400 hover:-translate-y-2 transition-all duration-300"
              >
                <h3 className="font-bold text-xl text-cyan-300">{step.title}</h3>
                <p className="text-slate-300 mt-2">{step.text}</p>
              </div>
            ))}
          </div>
        </section>
        {/* Purpose Section */}
        <section className="mt-20 fade-up opacity-0 translate-y-6 transition-all duration-700">
          <h2 className="text-3xl font-semibold mb-4">Purpose of This Platform</h2>
          <p className="text-white text-lg leading-relaxed">
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
        <section id="stats" className="mt-20 fade-up opacity-0 translate-y-6 transition-all duration-700">
          <h2 className="text-3xl font-semibold mb-6">Total Study Resources</h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            {[
              { label: "Notes", count: 1240 },
              { label: "Papers", count: 540 },
              { label: "Other Materials", count: 780 },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 border rounded-xl shadow-sm bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                <p className="text-4xl font-bold text-blue-600 count-up" data-target={item.count}>
                  0
                </p>
                <p className="text-lg text-gray-700 mt-2">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Colleges & Universities */}
        <section className="mt-20 fade-up opacity-0 translate-y-6 transition-all duration-700">
          <h2 className="text-3xl font-semibold mb-4">Supported Universities</h2>

          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-700 font-medium">
            <li className="p-3 bg-gray-100 rounded-md hover:bg-blue-100 hover:scale-105 transition transform duration-300">
              RTMNU – Nagpur University
            </li>
            <li className="p-3 bg-gray-100 rounded-md hover:bg-blue-100 hover:scale-105 transition transform duration-300">
              Savitribai Phule Pune University
            </li>
            <li className="p-3 bg-gray-100 rounded-md hover:bg-blue-100 hover:scale-105 transition transform duration-300">
              Mumbai University
            </li>
            <li className="p-3 bg-gray-100 rounded-md hover:bg-blue-100 hover:scale-105 transition transform duration-300">
              Delhi University
            </li>
            <li className="p-3 bg-gray-100 rounded-md hover:bg-blue-100 hover:scale-105 transition transform duration-300">
              Amravati University
            </li>
            <li className="p-3 bg-gray-100 rounded-md hover:bg-blue-100 hover:scale-105 transition transform duration-300">
              More Universities Coming Soon…
            </li>
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
                className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 text-gray-800 font-medium"
              >
                {type}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
