import React, { useState, useEffect } from "react";
import Menu from "./Menu";
import Feedback from "./Feedback";
import Chart from "./Chart";
import Login from "./Login";
import WasteLog from "./WasteLog";
import { getUserRole, getUserEmail } from "../utils";
import { applyLeave, getMyLeaves } from "../api";
import {
  LogOut,
  LayoutDashboard,
  Utensils,
  Trash2,
  LineChart,
  QrCode,
  ScanLine,
  BrainCircuit,
  Table,
  AlertTriangle,
  X,
  PanelBottom
} from "lucide-react";
import QRCode from "react-qr-code";
import AttendanceScanner from "./AttendanceScanner";
import Predictions from "./Predictions";
import WeeklyMenuTable from "./WeeklyMenuTable";
import toast from 'react-hot-toast';

const TabButton = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold rounded-xl transition-all duration-300 border ${
      isActive
        ? "bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
        : "bg-white/5 border-transparent text-slate-400 hover:bg-white/10 hover:text-white"
    }`}
  >
    <Icon size={18} /> {label}
  </button>
);

function Dashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [activeTab, setActiveTab] = useState("");
  const [isSkipped, setIsSkipped] = useState(false);
  const [targetMeal, setTargetMeal] = useState(null);
  
  // Modal State
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const determineNextMeal = () => {
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    if (currentMins < 465) return "Breakfast";
    if (currentMins < 705) return "Lunch";
    if (currentMins < 1005) return "Snacks";
    if (currentMins < 1155) return "Dinner";
    return null; 
  };

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

  useEffect(() => {
    const checkLeaveStatus = async () => {
      if (role === "student") {
        const nextMeal = determineNextMeal();
        setTargetMeal(nextMeal);
        if (!nextMeal) return;
        try {
          const today = new Date().toISOString().split("T")[0];
          const res = await getMyLeaves();
          const alreadySkipped = res.data.find(
            (leave) => leave.leave_date === today && leave.meal_type === nextMeal
          );
          if (alreadySkipped) setIsSkipped(true);
          else setIsSkipped(false);
        } catch (e) { console.error("Could not fetch leave status", e); }
      }
    };
    if (isAuthenticated) checkLeaveStatus();
  }, [isAuthenticated, role]);

  const handleLoginSuccess = () => {
    const userRole = getUserRole();
    const email = getUserEmail();
    setRole(userRole);
    setUserEmail(email);
    setIsAuthenticated(true);
    setActiveTab(userRole === "admin" ? "analytics" : "menu");
    toast.success("Access Granted", { id: 'login-success' });
  };

  const handleLogout = () => {
    localStorage.removeItem("messmate_token");
    setIsAuthenticated(false);
    setRole(null);
    setUserEmail("");
    toast('Session Ended', { icon: '🔒', id: 'logout' });
  };

  // --- API EXECUTION LOGIC ---
  const executeLeave = async () => {
    setShowConfirmModal(false);
    
    const loadToast = toast.loading("Processing Request...", { id: 'leave-process' });
    try {
      const today = new Date().toISOString().split("T")[0];
      const response = await applyLeave(today, targetMeal);
      
      if (response.data.message === "Leave already applied.") {
        toast.error("Duplicate Request Detected", { id: loadToast });
      } else {
        toast.success(`Rebate Credited: ${targetMeal}`, { id: loadToast });
      }
      setIsSkipped(true);
    } catch (e) {
      const msg = e.response?.data?.detail || "Transaction Failed";
      toast.error(msg, { id: loadToast });
    }
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen relative z-10">
      
      {/* --- CONFIRMATION MODAL --- */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" 
            onClick={() => setShowConfirmModal(false)}
          />
          <div className="glass-card w-full max-w-md rounded-2xl p-6 relative border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.15)] animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setShowConfirmModal(false)}
              className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex flex-col items-center text-center mb-6">
              <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20 mb-4 shadow-[0_0_20px_rgba(239,68,68,0.2)]">
                <AlertTriangle size={32} className="text-red-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Confirm Opt-Out</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                You are about to skip <strong className="text-cyan-400">{targetMeal}</strong> for today. 
                <br />
                This will grant you a <strong className="text-green-400">₹50 Rebate</strong>, but your QR Code will be blocked for this meal.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="py-3 rounded-xl font-semibold text-slate-300 hover:bg-white/5 border border-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeLeave}
                className="py-3 rounded-xl font-bold text-black bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 shadow-lg shadow-red-500/20 transition-all"
              >
                Confirm & Skip
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div className="flex justify-between items-center mb-8 glass-card p-6 rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/10 rounded-full border border-cyan-500/20">
             <PanelBottom className="text-cyan-400" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {role === "admin" ? "Admin Panel" : "Student Panel"}
            </h2>
            {/* --- FIX APPLIED BELOW: Removed 'uppercase' class --- */}
            <p className="text-sm text-cyan-200/60 font-mono tracking-wider">
              ID: {userEmail || role} 
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-400 font-bold px-4 py-2 hover:bg-red-500/10 rounded-lg transition border border-transparent hover:border-red-500/20"
        >
          <LogOut size={18} /> Disconnect
        </button>
      </div>

      {/* --- ADMIN DASHBOARD --- */}
      {role === "admin" && (
        <div className="space-y-6">
          <div className="flex gap-4 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            <TabButton icon={LineChart} label="Analytics" isActive={activeTab === "analytics"} onClick={() => setActiveTab("analytics")} />
            <TabButton icon={Trash2} label="Waste Logs" isActive={activeTab === "waste"} onClick={() => setActiveTab("waste")} />
            <TabButton icon={ScanLine} label="Scanner" isActive={activeTab === "scanner"} onClick={() => setActiveTab("scanner")} />
            <TabButton icon={BrainCircuit} label="AI Models" isActive={activeTab === "predictions"} onClick={() => setActiveTab("predictions")} />
            <TabButton icon={Table} label="Database" isActive={activeTab === "admin_menu"} onClick={() => setActiveTab("admin_menu")} />
          </div>

          {activeTab === "analytics" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-[500px]"><Chart /></div>
              <div className="h-[500px]"><Feedback mode="view" /></div>
            </div>
          )}

          {activeTab === "scanner" && <AttendanceScanner />}
          {activeTab === "predictions" && <Predictions />}
          {activeTab === "waste" && <WasteLog />}
          {activeTab === "admin_menu" && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold px-1 text-white">Menu Database</h3>
              <WeeklyMenuTable />
            </div>
          )}
        </div>
      )}

      {/* --- STUDENT DASHBOARD --- */}
      {role === "student" && (
        <div className="space-y-6">
          <div className="flex gap-4 mb-6 justify-center">
            <TabButton icon={Utensils} label="Menu" isActive={activeTab === "menu"} onClick={() => setActiveTab("menu")} />
            <TabButton icon={LayoutDashboard} label="Review" isActive={activeTab === "feedback"} onClick={() => setActiveTab("feedback")} />
            <TabButton icon={QrCode} label="Pass" isActive={activeTab === "qr"} onClick={() => setActiveTab("qr")} />
          </div>

          {activeTab === "menu" && targetMeal && (
            <div className="flex justify-end animate-in fade-in slide-in-from-right-5">
              <button
                onClick={() => setShowConfirmModal(true)} 
                disabled={isSkipped}
                className={`px-6 py-2 rounded-xl font-bold text-sm transition-all border ${
                  isSkipped
                    ? "bg-white/5 text-slate-500 border-white/5 cursor-not-allowed"
                    : "bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                }`}
              >
                {isSkipped
                  ? `Leaves Active: ${targetMeal}`
                  : `Opt-Out: ${targetMeal} (+₹50 Credit)`}
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
            <div className="flex flex-col items-center justify-center p-10 glass-card rounded-2xl">
              <h3 className="text-xl font-bold mb-6 text-white">Digital Entry Token</h3>
              <div className="p-4 bg-white rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                <QRCode value={userEmail || "No Email Found"} size={200} />
              </div>
              <p className="mt-6 text-slate-400 text-sm">
                Present this token for scanning
              </p>
              <p className="mt-2 text-xs text-cyan-400 font-mono tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
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