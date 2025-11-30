// import React, { useState, useEffect } from "react";
// import Menu from "./Menu";
// import Feedback from "./Feedback";
// import Chart from "./Chart";
// import Login from "./Login";
// import WasteLog from "./WasteLog";
// import { getUserRole, getUserEmail } from "../utils";
// import { applyLeave, getMyLeaves } from "../api";
// import {
//   LogOut,
//   LayoutDashboard,
//   Utensils,
//   Trash2,
//   LineChart,
//   QrCode, // <--- 2. Import QrCode Icon
// } from "lucide-react";
// import QRCode from "react-qr-code";
// import AttendanceScanner from "./AttendanceScanner";
// import { ScanLine } from "lucide-react"; // Import Icon
// import Predictions from "./Predictions";
// import { BrainCircuit } from "lucide-react";

// const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
//       isActive
//         ? "bg-primary text-white shadow-md"
//         : "bg-white text-neutral-500 hover:bg-neutral-50"
//     }`}
//   >
//     <Icon size={18} /> {label}
//   </button>
// );

// function Dashboard() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [role, setRole] = useState(null);
//   const [userEmail, setUserEmail] = useState(""); // <--- 3. Add State for Email
//   const [activeTab, setActiveTab] = useState("");
//   const [isSkipped, setIsSkipped] = useState(false);

//   useEffect(() => {
//     const checkAuth = () => {
//       const userRole = getUserRole();
//       const email = getUserEmail(); // <--- 4. Get Email from Token

//       if (userRole) {
//         setIsAuthenticated(true);
//         setRole(userRole);
//         setUserEmail(email || "student@test.com"); // Fallback if decoding fails

//         if (!activeTab) {
//           setActiveTab(userRole === "admin" ? "analytics" : "menu");
//         }
//       }
//     };
//     checkAuth();
//   }, [activeTab]);

//   useEffect(() => {
//     const checkLeaveStatus = async () => {
//       if (role === "student") {
//         try {
//           const today = new Date().toISOString().split("T")[0];
//           const res = await getMyLeaves();

//           // Check if there is ANY record matching Today + Lunch
//           const alreadySkipped = res.data.find(
//             (leave) => leave.leave_date === today && leave.meal_type === "Lunch"
//           );

//           if (alreadySkipped) {
//             setIsSkipped(true);
//           }
//         } catch (e) {
//           console.error("Could not fetch leave status", e);
//         }
//       }
//     };

//     if (isAuthenticated) {
//       checkLeaveStatus();
//     }
//   }, [isAuthenticated, role]);

//   const handleLoginSuccess = () => {
//     const userRole = getUserRole();
//     const email = getUserEmail(); // <--- 5. Get Email on Login Success

//     setRole(userRole);
//     setUserEmail(email);
//     setIsAuthenticated(true);
//     setActiveTab(userRole === "admin" ? "analytics" : "menu");
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("messmate_token");
//     setIsAuthenticated(false);
//     setRole(null);
//     setUserEmail("");
//   };
//   const handleSkipMeal = async () => {
//     if (confirm("Mark leave for Today's Lunch?")) {
//       try {
//         const today = new Date().toISOString().split("T")[0];
//         const response = await applyLeave(today, "Lunch");

//         // Check what the backend actually said
//         if (response.data.message === "Leave already applied.") {
//           alert("You have ALREADY applied for leave!");
//         } else {
//           alert("Leave Applied! Rebate credited.");
//         }

//         setIsSkipped(true); // Disable button
//       } catch (e) {
//         alert("Failed to apply leave.");
//       }
//     }
//   };

//   if (!isAuthenticated) {
//     return <Login onLoginSuccess={handleLoginSuccess} />;
//   }

//   return (
//     <div className="min-h-screen bg-neutral-50/50">
//       {/* Header Bar */}
//       <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-neutral-100">
//         <div>
//           <h2 className="text-2xl font-bold text-neutral-800">
//             {role === "admin" ? "Admin Dashboard" : "Student Portal"}
//           </h2>
//           <p className="text-sm text-neutral-400">
//             Welcome back, {userEmail || role}
//           </p>
//         </div>
//         <button
//           onClick={handleLogout}
//           className="flex items-center gap-2 text-red-500 font-bold px-4 py-2 hover:bg-red-50 rounded-lg transition"
//         >
//           <LogOut size={18} /> Logout
//         </button>
//       </div>

//       {/* --- ADMIN DASHBOARD LAYOUT --- */}
//       {role === "admin" && (
//         <div className="space-y-6">
//           <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
//             <TabButton
//               icon={LineChart}
//               label="Analytics & Reviews"
//               isActive={activeTab === "analytics"}
//               onClick={() => setActiveTab("analytics")}
//             />
//             <TabButton
//               icon={Trash2}
//               label="Waste Management"
//               isActive={activeTab === "waste"}
//               onClick={() => setActiveTab("waste")}
//             />
//             <TabButton
//               icon={ScanLine} // Use the new icon
//               label="Scanner"
//               isActive={activeTab === "scanner"}
//               onClick={() => setActiveTab("scanner")}
//             />
//             <TabButton
//               icon={BrainCircuit}
//               label="AI Predictions"
//               isActive={activeTab === "predictions"}
//               onClick={() => setActiveTab("predictions")}
//             />
//           </div>

//           {activeTab === "analytics" && (
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//               <div className="lg:col-span-2 h-[500px]">
//                 <Chart />
//               </div>
//               <div className="h-[500px]">
//                 <Feedback mode="view" />
//               </div>
//             </div>
//           )}

//           {activeTab === "scanner" && <AttendanceScanner />}
//           {activeTab === "predictions" && <Predictions />}
//           {activeTab === "waste" && <WasteLog />}
//         </div>
//       )}

//       {/* --- STUDENT DASHBOARD LAYOUT --- */}
//       {role === "student" && (
//         <div className="space-y-6">
//           <div className="flex gap-4 mb-6 justify-center">
//             <TabButton
//               icon={Utensils}
//               label="Today's Menu"
//               isActive={activeTab === "menu"}
//               onClick={() => setActiveTab("menu")}
//             />
//             <TabButton
//               icon={LayoutDashboard}
//               label="Give Feedback"
//               isActive={activeTab === "feedback"}
//               onClick={() => setActiveTab("feedback")}
//             />
//             {/* --- 6. ADDED MISSING QR BUTTON --- */}
//             <TabButton
//               icon={QrCode}
//               label="Entry Pass"
//               isActive={activeTab === "qr"}
//               onClick={() => setActiveTab("qr")}
//             />
//           </div>

//           {activeTab === "menu" && (
//             <div className="mb-4 flex justify-end">
//               <button
//                 onClick={handleSkipMeal}
//                 disabled={isSkipped}
//                 className={`px-4 py-2 rounded-lg font-bold text-sm ${
//                   isSkipped
//                     ? "bg-neutral-200 text-neutral-500"
//                     : "bg-red-100 text-red-600 hover:bg-red-200"
//                 }`}
//               >
//                 {isSkipped
//                   ? "On Leave (Rebate Active)"
//                   : "Skip Lunch & Save ₹50"}
//               </button>
//             </div>
//           )}

//           {activeTab === "menu" && <Menu />}

//           {activeTab === "feedback" && (
//             <div className="flex justify-center mt-10">
//               <Feedback mode="submit" />
//             </div>
//           )}

//           {activeTab === "qr" && (
//             <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-soft">
//               <h3 className="text-xl font-bold mb-6">Your Mess Entry Pass</h3>
//               <div className="p-4 bg-white border-2 border-neutral-900 rounded-xl">
//                 {/* --- 7. Use userEmail state here --- */}
//                 <QRCode value={userEmail || "No Email Found"} size={200} />
//               </div>
//               <p className="mt-6 text-neutral-500 text-sm">
//                 Show this to the mess manager to mark attendance.
//               </p>
//               <p className="mt-2 text-xs text-neutral-400 font-mono">
//                 {userEmail}
//               </p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Dashboard;

import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Feedback from "./Feedback";
import Chart from "./Chart";
import Login from "./Login";
import WasteLog from "./WasteLog";
import { getUserRole, getUserEmail } from "../utils";
import { applyLeave, getMyLeaves } from "../api"; // Ensure applyLeave is imported
import {
  LogOut,
  LayoutDashboard,
  Utensils,
  Trash2,
  LineChart,
  QrCode,
  ScanLine,
  BrainCircuit,
} from "lucide-react";
import QRCode from "react-qr-code";
import AttendanceScanner from "./AttendanceScanner";
import Predictions from "./Predictions";
import WeeklyMenuTable from "./WeeklyMenuTable"; // <--- Add this
import { Table } from "lucide-react"; // Import an icon

const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all ${
      isActive
        ? "bg-primary text-white shadow-md"
        : "bg-white text-neutral-500 hover:bg-neutral-50"
    }`}
  >
    <Icon size={18} /> {label}
  </button>
);

function Dashboard() {
  // --- 1. STATE DECLARATIONS ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [isSkipped, setIsSkipped] = useState(false);
  const [targetMeal, setTargetMeal] = useState(null); // <--- NEW: Tracks which meal to skip

  // --- 2. HELPER: Determine Next Meal ---
  const determineNextMeal = () => {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();

    // Cutoffs in minutes (Start time - 15 mins):
    // 07:45 = 465, 11:45 = 705, 16:45 = 1005, 19:15 = 1155
    if (currentMins < 465) return "Breakfast";
    if (currentMins < 705) return "Lunch";
    if (currentMins < 1005) return "Snacks";
    if (currentMins < 1155) return "Dinner";

    return null; // No meals left today
  };

  // --- 3. AUTH & INIT EFFECT ---
  useEffect(() => {
    const checkAuth = () => {
      const userRole = getUserRole();
      const email = getUserEmail();

      if (userRole) {
        setIsAuthenticated(true);
        setRole(userRole);
        setUserEmail(email || "student@test.com");

        if (!activeTab) {
          setActiveTab(userRole === "admin" ? "analytics" : "menu");
        }
      }
    };
    checkAuth();
  }, [activeTab]);

  // --- 4. CHECK LEAVE STATUS EFFECT ---
  useEffect(() => {
    const checkLeaveStatus = async () => {
      if (role === "student") {
        // Calculate dynamic meal
        const nextMeal = determineNextMeal();
        setTargetMeal(nextMeal);

        if (!nextMeal) return;

        try {
          const today = new Date().toISOString().split("T")[0];
          const res = await getMyLeaves();

          // Check if we already skipped THIS specific calculated meal
          const alreadySkipped = res.data.find(
            (leave) =>
              leave.leave_date === today && leave.meal_type === nextMeal
          );

          if (alreadySkipped) {
            setIsSkipped(true);
          } else {
            setIsSkipped(false);
          }
        } catch (e) {
          console.error("Could not fetch leave status", e);
        }
      }
    };

    if (isAuthenticated) {
      checkLeaveStatus();
    }
  }, [isAuthenticated, role]);

  const handleLoginSuccess = () => {
    const userRole = getUserRole();
    const email = getUserEmail();
    setRole(userRole);
    setUserEmail(email);
    setIsAuthenticated(true);
    setActiveTab(userRole === "admin" ? "analytics" : "menu");
  };

  const handleLogout = () => {
    localStorage.removeItem("messmate_token");
    setIsAuthenticated(false);
    setRole(null);
    setUserEmail("");
  };

  // --- 5. SKIP MEAL HANDLER ---
  const handleSkipMeal = async () => {
    if (!targetMeal) return;

    if (confirm(`Mark leave for Today's ${targetMeal}?`)) {
      try {
        const today = new Date().toISOString().split("T")[0];
        // Use the DYNAMIC targetMeal
        const response = await applyLeave(today, targetMeal);

        if (response.data.message === "Leave already applied.") {
          alert("You have ALREADY applied for leave!");
        } else {
          alert(`Leave Applied for ${targetMeal}! Rebate credited.`);
        }

        setIsSkipped(true);
      } catch (e) {
        // Show backend error (e.g., "Too late!")
        alert(e.response?.data?.detail || "Failed to apply leave.");
      }
    }
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-neutral-50/50">
      {/* Header Bar */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-neutral-100">
        <div>
          <h2 className="text-2xl font-bold text-neutral-800">
            {role === "admin" ? "Admin Dashboard" : "Student Portal"}
          </h2>
          <p className="text-sm text-neutral-400">
            Welcome back, {userEmail || role}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 font-bold px-4 py-2 hover:bg-red-50 rounded-lg transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* --- ADMIN DASHBOARD LAYOUT --- */}
      {role === "admin" && (
        <div className="space-y-6">
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
            <TabButton
              icon={LineChart}
              label="Analytics & Reviews"
              isActive={activeTab === "analytics"}
              onClick={() => setActiveTab("analytics")}
            />
            <TabButton
              icon={Trash2}
              label="Waste Management"
              isActive={activeTab === "waste"}
              onClick={() => setActiveTab("waste")}
            />
            <TabButton
              icon={ScanLine}
              label="Scanner"
              isActive={activeTab === "scanner"}
              onClick={() => setActiveTab("scanner")}
            />
            <TabButton
              icon={BrainCircuit}
              label="AI Predictions"
              isActive={activeTab === "predictions"}
              onClick={() => setActiveTab("predictions")}
            />
            <TabButton
              icon={Table}
              label="Full Menu"
              isActive={activeTab === "admin_menu"}
              onClick={() => setActiveTab("admin_menu")}
            />
          </div>

          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-[500px]">
                <Chart />
              </div>
              <div className="h-[500px]">
                <Feedback mode="view" />
              </div>
            </div>
          )}

          {activeTab === "scanner" && <AttendanceScanner />}
          {activeTab === "predictions" && <Predictions />}
          {activeTab === "waste" && <WasteLog />}
          {activeTab === "admin_menu" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold px-1">Weekly Menu Schedule</h3>
              <WeeklyMenuTable />
            </div>
          )}
        </div>
      )}

      {/* --- STUDENT DASHBOARD LAYOUT --- */}
      {role === "student" && (
        <div className="space-y-6">
          <div className="flex gap-4 mb-6 justify-center">
            <TabButton
              icon={Utensils}
              label="Today's Menu"
              isActive={activeTab === "menu"}
              onClick={() => setActiveTab("menu")}
            />
            <TabButton
              icon={LayoutDashboard}
              label="Give Feedback"
              isActive={activeTab === "feedback"}
              onClick={() => setActiveTab("feedback")}
            />
            <TabButton
              icon={QrCode}
              label="Entry Pass"
              isActive={activeTab === "qr"}
              onClick={() => setActiveTab("qr")}
            />
          </div>

          {/* DYNAMIC BUTTON RENDER */}
          {activeTab === "menu" && targetMeal && (
            <div className="flex justify-end">
              <button
                onClick={handleSkipMeal}
                disabled={isSkipped}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${
                  isSkipped
                    ? "bg-neutral-200 text-neutral-500 cursor-not-allowed"
                    : "bg-red-100 text-red-600 hover:bg-red-200 shadow-sm"
                }`}
              >
                {isSkipped
                  ? `On Leave: ${targetMeal} (Rebate Active)`
                  : `Skip ${targetMeal} & Save ₹50`}
              </button>
            </div>
          )}

          {activeTab === "menu" && <Menu />}

          {activeTab === "feedback" && (
            <div className="flex justify-center mt-10">
              <Feedback mode="submit" />
            </div>
          )}

          {activeTab === "qr" && (
            <div className="flex flex-col items-center justify-center p-10 bg-white rounded-2xl shadow-soft">
              <h3 className="text-xl font-bold mb-6">Your Mess Entry Pass</h3>
              <div className="p-4 bg-white border-2 border-neutral-900 rounded-xl">
                <QRCode value={userEmail || "No Email Found"} size={200} />
              </div>
              <p className="mt-6 text-neutral-500 text-sm">
                Show this to the mess manager to mark attendance.
              </p>
              <p className="mt-2 text-xs text-neutral-400 font-mono">
                {userEmail}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
