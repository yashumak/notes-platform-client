// "use client";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// export default function NotesPage() {


//   const [universities, setUniversities] = useState([]);
//   const [courses, setCourses] = useState([]);

//   const [uniSearch, setUniSearch] = useState("");
//   const [courseSearch, setCourseSearch] = useState("");

//   const [showUniList, setShowUniList] = useState(false);
//   const [showCourseList, setShowCourseList] = useState(false);

//   // ✅ Load JSON automatically from public folder
//   useEffect(() => {
//     fetch("/data/engineeringData.json")
//       .then((res) => res.json())
//       .then((data) => {
//         setUniversities(data.colleges || []);
//         setCourses(data.branches || []);
//       })
//   }, []);

//   // Filter logic
//   const filteredUniversities = universities.filter((u) =>
//     u.toLowerCase().startsWith(uniSearch.toLowerCase())
//   );

//   const filteredCourses = courses.filter((c) =>
//     c.toLowerCase().startsWith(courseSearch.toLowerCase())
//   );

//   return (
//     <div className="flex min-h-screen bg-gray-50 mt-17">

//       {/* LEFT FILTER SIDEBAR */}
//       <aside className="w-72 bg-white p-5 shadow-md border-r mt-1">
//         <div className="flex justify-between items-center">
//           <h2 className="text-xl font-bold ">Filter</h2>
//           <button className="text-sm text-blue-600">Clear all</button>
//         </div>

//         {/* University */}
//         <div className="mt-4 relative">
//           <label className="text-gray-700 text-sm font-medium">University</label>

//           <input
//             type="text"
//             placeholder="Search & select your college"
//             className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             value={uniSearch}
//             onChange={(e) => {
//               setUniSearch(e.target.value);
//               setShowUniList(true);
//             }}
//             onFocus={() => setShowUniList(true)}
//           />

//           {/* Dropdown list */}
//           {showUniList && (
//             <ul className="absolute z-20 w-full bg-white border shadow-lg max-h-56 overflow-y-auto rounded-lg mt-1">
//               {filteredUniversities.length > 0 ? (
//                 filteredUniversities.map((uni, i) => (
//                   <li
//                     key={i}
//                     className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
//                     onClick={() => {
//                       setUniSearch(uni);
                      
//                       setShowUniList(false);
//                     }}
//                   >
//                     {uni}
//                   </li>
//                 ))
//               ) : (
//                 <li className="px-4 py-2 text-gray-500">No matches found</li>
//               )}
//             </ul>
//           )}
//         </div>


//         {/* Course / Branch */}
//         <div className="mt-4 relative">
//           <label className="text-gray-700 text-sm font-medium">Course / Branch</label>

//           <input
//             type="text"
//             placeholder="Search & select your branch"
//             className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
//             value={courseSearch}
//             onChange={(e) => {
//               setCourseSearch(e.target.value);
//               setShowCourseList(true);
//             }}
//             onFocus={() => setShowCourseList(true)}
//           />

//           {/* Dropdown list */}
//           {showCourseList && (
//             <ul className="absolute z-20 w-full bg-white border shadow-lg max-h-56 overflow-y-auto rounded-lg mt-1">
//               {filteredCourses.length > 0 ? (
//                 filteredCourses.map((course, i) => (
//                   <li
//                     key={i}
//                     className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
//                     onClick={() => {
//                       setCourseSearch(course);
//                       setShowCourseList(false);
//                     }}
//                   >
//                     {course}
//                   </li>
//                 ))
//               ) : (
//                 <li className="px-4 py-2 text-gray-500">No matches found</li>
//               )}
//             </ul>
//           )}
//         </div>


//         {/* Subject */}
//         <div className="mt-4">
//           <label className="text-gray-700 text-sm font-medium">Subject</label>
//           <input
//             type="text"
//             placeholder="Enter subject"
//             className="w-full mt-1 p-2 border rounded-lg"
//           />
//         </div>

//         {/* Study Material Type */}
//         <div className="mt-5">
//           <label className="text-gray-700 text-sm font-medium">
//             Study Material Type
//           </label>

//           <div className="flex flex-wrap gap-2 mt-2">
//             {["Notes", "Assignments", "Papers", "Que Banks", "PPT", "Reports"].map((t) => (
//               <button
//                 key={t}
//                 className="px-3 py-1 text-sm border rounded-full hover:bg-gray-100"
//               >
//                 {t}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Academic Year (Dropdown) */}
//         <div className="mt-5">
//           <label className="text-gray-700 text-sm font-medium">
//             
//           </label>

//           <select className="w-full mt-2 p-2 border rounded-lg">
//             <option value="">Select Year</option>

//             {/* Generate last 10 years */}
//             {Array.from({ length: 12 }, (_, i) => {
//               const year = 2025 - i;
//               return (
//                 <option key={year} value={year}>
//                   {year}
//                 </option>
//               );
//             })}
//           </select>
//         </div>


//         {/* Language */}
//         {/* <div className="mt-5">
//           <label className="text-gray-700 text-sm font-medium">Language</label>
//           <select className="w-full p-2 border rounded-lg mt-1">
//             <option>All</option>
//             <option>English</option>
//             <option>Hindi</option>
//           </select>
//         </div> */}
//       </aside>

//       {/* RIGHT SIDE NOTES LIST */}
//       <main className="flex-1 p-6">
//         <h1 className="text-2xl font-bold mb-4">Documents & Flashcards</h1>
//         <p className="text-gray-500 mb-6">62004 results</p>

//         <div className="space-y-4">
//           {[1, 2, 3, 4].map((item) => (
//             <Link
//               href="/notes/1"
//               key={item}
//               className="flex items-center justify-between bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer"
//             >
//               {/* Left Section */}
//               <div className="flex items-center gap-4">
//                 <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>

//                 <div>
//                   <h3 className="font-semibold text-lg">NOTES {item}.pdf</h3>
//                   <p className="text-sm text-blue-700">
//                     Computer Engineering • RTMNU
//                   </p>
//                 </div>
//               </div>

//               {/* Right Section */}
//               <div className="flex items-center gap-6 text-sm text-gray-600">
//                 <p>2 years ago</p>

//                 <button className="px-4 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
//                   Download
//                 </button>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// }

export default function NoteDetailsPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Note Details</h1>
      <p>Note details will appear here.</p>
    </main>
  );
}
