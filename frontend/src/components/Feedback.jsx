import React, { useState, useEffect } from "react";
import { getFeedback, submitFeedback } from "../api";
import { Send, Smile, Meh, Frown, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

function Feedback({ mode = "submit" }) {
  const [feedbackList, setFeedbackList] = useState([]);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (mode === "view") fetchFeedback();
  }, [mode]);

  const fetchFeedback = async () => {
    try {
      const response = await getFeedback();
      setFeedbackList(response.data.reverse());
    } catch (error) {
      console.error(error);
    }
  };

  const handleSentiment = (label) => {
    if (label === "positive" || (label && label.includes("2")))
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-1 rounded-full">
          <Smile size={14} /> Positive
        </div>
      );
    if (label === "negative" || (label && label.includes("0")))
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-1 rounded-full">
          <Frown size={14} /> Negative
        </div>
      );
    return (
      <div className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-1 rounded-full">
        <Meh size={14} /> Neutral
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !comment) return;

    // Fixed ID prevents duplicates
    const toastId = "feedback-submission";
    toast.loading("Submitting...", { id: toastId });

    try {
      await submitFeedback({ name, comment });
      // Update the existing toast
      toast.success("Feedback submitted! Thanks.", { id: toastId });
      setName("");
      setComment("");
    } catch (error) {
      toast.error("Submission Failed", { id: toastId });
    }
  };

  if (mode === "submit") {
    return (
      <div className="glass-card p-8 rounded-2xl max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="text-cyan-400" />
          <h3 className="text-xl font-bold text-white">Rate Experience</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            placeholder="Diner Name (Optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-4 bg-black/20 border border-white/10 rounded-xl focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all text-white placeholder:text-slate-600"
          />
          <textarea
            placeholder="How was the food quality? (AI will analyze this)"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-4 bg-black/20 border border-white/10 rounded-xl h-32 focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all text-white placeholder:text-slate-600"
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-cyan-600 text-white p-4 rounded-xl hover:bg-cyan-500 transition font-bold shadow-[0_0_20px_rgba(8,145,178,0.3)]"
          >
            <Send size={18} /> Submit & Analyze
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-white">Sentiment Log</h3>
        <button
          onClick={fetchFeedback}
          className="text-sm text-cyan-400 font-semibold hover:text-cyan-300"
        >
          Sync Data
        </button>
      </div>

      <div className="space-y-4 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
        {feedbackList.length > 0 ? (
          feedbackList.map((fb) => (
            <div
              key={fb.id}
              className="glass-card p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-slate-200">
                  {fb.name || "Anonymous"}
                </span>
                {handleSentiment(fb.sentiment)}
              </div>
              <p className="text-slate-400 text-sm italic">"{fb.comment}"</p>
              <div className="mt-3 pt-3 border-t border-white/5 text-xs text-slate-600 flex justify-between">
                <span>
                  Confidence Score:{" "}
                  {fb.score ? (fb.score * 100).toFixed(1) + "%" : "N/A"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-600 text-center py-10">Database Empty</p>
        )}
      </div>
    </div>
  );
}

export default Feedback;
