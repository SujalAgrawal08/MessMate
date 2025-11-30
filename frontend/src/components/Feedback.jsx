// // import React, { useState, useEffect } from 'react';
// // import { getFeedback, submitFeedback } from '../api';
// // import { Send, Smile, Meh, Frown, User } from 'lucide-react';

// // function Feedback() {
// //   const [feedbackList, setFeedbackList] = useState([]);
// //   const [name, setName] = useState('');
// //   const [comment, setComment] = useState('');

// //   useEffect(() => { fetchFeedback() }, []);

// //   const fetchFeedback = async () => {
// //     try {
// //       const response = await getFeedback();
// //       setFeedbackList(response.data.reverse());
// //     } catch (error) { console.error("Error fetching feedback:", error); }
// //   };

// //   const handleSentiment = (label) => {
// //     if (label === 'LABEL_2') return <div className="flex items-center gap-1.5 text-sm font-semibold text-green-600"><Smile size={16} /> Positive</div>;
// //     if (label === 'LABEL_1') return <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-600"><Meh size={16} /> Neutral</div>;
// //     if (label === 'LABEL_0') return <div className="flex items-center gap-1.5 text-sm font-semibold text-red-600"><Frown size={16} /> Negative</div>;
// //     return label;
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     if (!name || !comment) return;
// //     try {
// //       await submitFeedback({ name, comment });
// //       fetchFeedback();
// //       setName('');
// //       setComment('');
// //     } catch (error) { console.error("Error submitting feedback:", error); }
// //   };

// //   return (
// //     <div className="space-y-8">
// //       {/* Submit Feedback Form */}
// //       <div className="bg-white p-6 rounded-2xl shadow-soft-lg">
// //         <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
// //         <form onSubmit={handleSubmit} className="space-y-4">
// //           <input
// //             type="text"
// //             placeholder="Your Name"
// //             value={name}
// //             onChange={(e) => setName(e.target.value)}
// //             className="w-full p-3 bg-neutral-100 border-transparent rounded-xl focus:ring-2 focus:ring-primary"
// //           />
// //           <textarea
// //             placeholder="Share your thoughts on the food..."
// //             value={comment}
// //             onChange={(e) => setComment(e.target.value)}
// //             className="w-full p-3 bg-neutral-100 border-transparent rounded-xl h-24 focus:ring-2 focus:ring-primary"
// //           />
// //           <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-white p-3 rounded-xl hover:bg-primary-dark transition">
// //             <Send size={18} /> Submit Review
// //           </button>
// //         </form>
// //       </div>

// //       {/* Feedback List */}
// //       <div className="space-y-5">
// //         <h3 className="text-xl font-bold">What Diners Are Saying</h3>
// //         {feedbackList.length > 0 ? feedbackList.map(fb => (
// //           <div key={fb.id} className="bg-white p-5 rounded-2xl shadow-soft">
// //             <div className="flex items-center justify-between">
// //               <div className="flex items-center gap-3">
// //                 <div className="bg-neutral-100 p-2 rounded-full"><User size={18} className="text-neutral-500" /></div>
// //                 <span className="font-bold text-neutral-900">{fb.name}</span>
// //               </div>
// //               {handleSentiment(fb.sentiment)}
// //             </div>
// //             <p className="text-neutral-500 mt-3 pl-12">"{fb.comment}"</p>
// //           </div>
// //         )) : <p className="text-neutral-500 text-center py-10">No feedback yet. Be the first to share your thoughts!</p>}
// //       </div>
// //     </div>
// //   );
// // }

// // export default Feedback;

// import React, { useState, useEffect } from 'react';
// import { getFeedback, submitFeedback } from '../api';
// import { Send, Smile, Meh, Frown, User, MessageSquare } from 'lucide-react';

// // Props: mode can be 'submit' (Student) or 'view' (Admin)
// function Feedback({ mode = 'submit' }) {
//   const [feedbackList, setFeedbackList] = useState([]);
//   const [name, setName] = useState('');
//   const [comment, setComment] = useState('');

//   useEffect(() => {
//     // Admin needs to see the list immediately
//     if (mode === 'view') fetchFeedback();
//   }, [mode]);

//   const fetchFeedback = async () => {
//     try {
//       const response = await getFeedback();
//       setFeedbackList(response.data.reverse());
//     } catch (error) { console.error("Error fetching feedback:", error); }
//   };

//   const handleSentiment = (label) => {
//     // Helper to color-code sentiment
//     if (label === 'positive' || (label && label.includes('2')))
//       return <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full"><Smile size={14} /> Positive</div>;
//     if (label === 'negative' || (label && label.includes('0')))
//       return <div className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full"><Frown size={14} /> Negative</div>;
//     return <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full"><Meh size={14} /> Neutral</div>;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!name || !comment) return;
//     try {
//       await submitFeedback({ name, comment });
//       alert("Feedback submitted! Thanks.");
//       setName('');
//       setComment('');
//     } catch (error) { console.error("Error submitting feedback:", error); }
//   };

//   // --- STUDENT VIEW: SUBMIT ONLY ---
//   if (mode === 'submit') {
//     return (
//       <div className="bg-white p-6 rounded-2xl shadow-soft-lg max-w-2xl mx-auto">
//         <div className="flex items-center gap-3 mb-6">
//           <MessageSquare className="text-primary-dark" />
//           <h3 className="text-xl font-bold">Rate Today's Meal</h3>
//         </div>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <input
//             type="text"
//             placeholder="Your Name (Optional)"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full p-3 bg-neutral-100 border-transparent rounded-xl focus:ring-2 focus:ring-primary"
//           />
//           <textarea
//             placeholder="How was the food? Be honest..."
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             className="w-full p-3 bg-neutral-100 border-transparent rounded-xl h-32 focus:ring-2 focus:ring-primary"
//           />
//           <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-white p-3 rounded-xl hover:bg-primary-dark transition font-semibold">
//             <Send size={18} /> Submit Review
//           </button>
//         </form>
//       </div>
//     );
//   }

//   // --- ADMIN VIEW: HISTORY LIST ONLY ---
//   return (
//     <div className="space-y-5">
//       <div className="flex justify-between items-center">
//         <h3 className="text-xl font-bold text-neutral-800">Recent Reviews</h3>
//         <button onClick={fetchFeedback} className="text-sm text-primary font-semibold hover:underline">Refresh</button>
//       </div>

//       <div className="space-y-4 h-[500px] overflow-y-auto pr-2">
//         {feedbackList.length > 0 ? feedbackList.map(fb => (
//           <div key={fb.id} className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100">
//             <div className="flex items-center justify-between mb-2">
//               <span className="font-bold text-sm text-neutral-900">{fb.name || 'Anonymous'}</span>
//               {handleSentiment(fb.sentiment)}
//             </div>
//             <p className="text-neutral-600 text-sm">"{fb.comment}"</p>
//             <div className="mt-2 text-xs text-neutral-400 flex justify-between">
//               <span>Sentiment Score: {fb.score ? fb.score.toFixed(2) : 'N/A'}</span>
//             </div>
//           </div>
//         )) : <p className="text-neutral-400 text-center">No reviews yet.</p>}
//       </div>
//     </div>
//   );
// }

// export default Feedback;

import React, { useState, useEffect } from "react";
import { getFeedback, submitFeedback } from "../api";
import { Send, Smile, Meh, Frown, MessageSquare } from "lucide-react";
import toast from "react-hot-toast"; // <--- Import

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
      console.error("Error fetching feedback:", error);
    }
  };

  const handleSentiment = (label) => {
    if (label === "positive" || (label && label.includes("2")))
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
          <Smile size={14} /> Positive
        </div>
      );
    if (label === "negative" || (label && label.includes("0")))
      return (
        <div className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded-full">
          <Frown size={14} /> Negative
        </div>
      );
    return (
      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
        <Meh size={14} /> Neutral
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !comment) return;

    const loadId = toast.loading("Submitting...");
    try {
      await submitFeedback({ name, comment });
      toast.success("Feedback submitted! Thanks.", { id: loadId });
      setName("");
      setComment("");
    } catch (error) {
      toast.error("Failed to submit feedback", { id: loadId });
    }
  };

  if (mode === "submit") {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-soft-lg max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <MessageSquare className="text-primary-dark" />
          <h3 className="text-xl font-bold">Rate Today's Meal</h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name (Optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-neutral-100 border-transparent rounded-xl focus:ring-2 focus:ring-primary"
          />
          <textarea
            placeholder="How was the food? Be honest..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 bg-neutral-100 border-transparent rounded-xl h-32 focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-primary text-white p-3 rounded-xl hover:bg-primary-dark transition font-semibold"
          >
            <Send size={18} /> Submit Review
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-neutral-800">Recent Reviews</h3>
        <button
          onClick={fetchFeedback}
          className="text-sm text-primary font-semibold hover:underline"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-4 h-[500px] overflow-y-auto pr-2">
        {feedbackList.length > 0 ? (
          feedbackList.map((fb) => (
            <div
              key={fb.id}
              className="bg-white p-4 rounded-xl shadow-sm border border-neutral-100"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-neutral-900">
                  {fb.name || "Anonymous"}
                </span>
                {handleSentiment(fb.sentiment)}
              </div>
              <p className="text-neutral-600 text-sm">"{fb.comment}"</p>
              <div className="mt-2 text-xs text-neutral-400 flex justify-between">
                <span>
                  Sentiment Score: {fb.score ? fb.score.toFixed(2) : "N/A"}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-neutral-400 text-center">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}

export default Feedback;
