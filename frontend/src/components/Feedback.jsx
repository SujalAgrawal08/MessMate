import React, { useState, useEffect } from 'react';
import { getFeedback, submitFeedback } from '../api';
import { Send, Smile, Meh, Frown, User } from 'lucide-react';

function Feedback() {
  const [feedbackList, setFeedbackList] = useState([]);
  const [name, setName] = useState('');
  const [comment, setComment] = useState('');

  useEffect(() => { fetchFeedback() }, []);

  const fetchFeedback = async () => {
    try {
      const response = await getFeedback();
      setFeedbackList(response.data.reverse());
    } catch (error) { console.error("Error fetching feedback:", error); }
  };

  const handleSentiment = (label) => {
    if (label === 'LABEL_2') return <div className="flex items-center gap-1.5 text-sm font-semibold text-green-600"><Smile size={16} /> Positive</div>;
    if (label === 'LABEL_1') return <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-600"><Meh size={16} /> Neutral</div>;
    if (label === 'LABEL_0') return <div className="flex items-center gap-1.5 text-sm font-semibold text-red-600"><Frown size={16} /> Negative</div>;
    return label;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !comment) return;
    try {
      await submitFeedback({ name, comment });
      fetchFeedback();
      setName('');
      setComment('');
    } catch (error) { console.error("Error submitting feedback:", error); }
  };

  return (
    <div className="space-y-8">
      {/* Submit Feedback Form */}
      <div className="bg-white p-6 rounded-2xl shadow-soft-lg">
        <h3 className="text-xl font-bold mb-4">Leave a Review</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 bg-neutral-100 border-transparent rounded-xl focus:ring-2 focus:ring-primary"
          />
          <textarea
            placeholder="Share your thoughts on the food..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full p-3 bg-neutral-100 border-transparent rounded-xl h-24 focus:ring-2 focus:ring-primary"
          />
          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-primary text-white p-3 rounded-xl hover:bg-primary-dark transition">
            <Send size={18} /> Submit Review
          </button>
        </form>
      </div>

      {/* Feedback List */}
      <div className="space-y-5">
        <h3 className="text-xl font-bold">What Diners Are Saying</h3>
        {feedbackList.length > 0 ? feedbackList.map(fb => (
          <div key={fb.id} className="bg-white p-5 rounded-2xl shadow-soft">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-neutral-100 p-2 rounded-full"><User size={18} className="text-neutral-500" /></div>
                <span className="font-bold text-neutral-900">{fb.name}</span>
              </div>
              {handleSentiment(fb.sentiment)}
            </div>
            <p className="text-neutral-500 mt-3 pl-12">"{fb.comment}"</p>
          </div>
        )) : <p className="text-neutral-500 text-center py-10">No feedback yet. Be the first to share your thoughts!</p>}
      </div>
    </div>
  );
}

export default Feedback;
