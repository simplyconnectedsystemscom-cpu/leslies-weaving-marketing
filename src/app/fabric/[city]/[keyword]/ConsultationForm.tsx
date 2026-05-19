"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { sendSampleRequest } from "./actions";

export default function ConsultationForm() {
  const params = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", firm: "", email: "", phone: "",
    projectType: "", meetingPref: "", message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await sendSampleRequest({
        name: form.name,
        firm: form.firm,
        email: form.email,
        phone: form.phone,
        message: form.message,
        city: params?.city as string,
        keyword: params?.keyword as string
      });

      if (response && response.success === false) {
        throw new Error(response.error || "Failed to send request.");
      }

      // Track successful form submission
      if (typeof window !== "undefined" && typeof (window as any).gtag === "function") {
        (window as any).gtag("event", "form_submitted", {
          city: params?.city,
          keyword: params?.keyword
        });
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Form submission error:", err);
      setError("We encountered an error sending your request. Please call us directly at (954) 253-7870.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-12 text-center" style={{ background: "white", borderRadius: "2px", border: "1px solid oklch(0.87 0.015 65)" }}>
        <div className="text-4xl mb-4" style={{ color: "oklch(0.52 0.13 35)" }}>&#10022;</div>
        <h4 className="text-2xl font-bold mb-3 font-display" style={{ color: "oklch(0.22 0.025 55)" }}>
          Thank you, {form.name.split(" ")[0]}.
        </h4>
        <p className="text-lg leading-relaxed" style={{ color: "oklch(0.5 0.02 60)" }}>
          We will call you shortly to set up your unique sample.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-8 shadow-xl" style={{ background: "white", borderRadius: "2px", border: "1px solid oklch(0.87 0.015 65)" }}>
      <div className="mb-8">
        <h3 className="text-xl sm:text-2xl font-bold font-display leading-relaxed" style={{ color: "oklch(0.22 0.025 55)" }}>
          Give us your contact information, we will call you, and set up to send you your sample!
        </h3>
      </div>

      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: "oklch(0.5 0.02 60)" }}>Your Name *</label>
            <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full px-4 py-3 text-sm border outline-none transition-colors focus:border-[#8f3a27]"
              style={{ borderColor: "oklch(0.87 0.015 65)", borderRadius: "2px", background: "oklch(0.98 0.005 75)", color: "oklch(0.22 0.025 55)" }}
              placeholder="Jane Smith" />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: "oklch(0.5 0.02 60)" }}>Firm / Studio Name *</label>
            <input required value={form.firm} onChange={e => setForm(f => ({ ...f, firm: e.target.value }))}
              className="w-full px-4 py-3 text-sm border outline-none transition-colors focus:border-[#8f3a27]"
              style={{ borderColor: "oklch(0.87 0.015 65)", borderRadius: "2px", background: "oklch(0.98 0.005 75)", color: "oklch(0.22 0.025 55)" }}
              placeholder="Smith Interiors" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: "oklch(0.5 0.02 60)" }}>Email *</label>
            <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              className="w-full px-4 py-3 text-sm border outline-none transition-colors focus:border-[#8f3a27]"
              style={{ borderColor: "oklch(0.87 0.015 65)", borderRadius: "2px", background: "oklch(0.98 0.005 75)", color: "oklch(0.22 0.025 55)" }}
              placeholder="jane@smithinteriors.com" />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: "oklch(0.5 0.02 60)" }}>Phone</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              className="w-full px-4 py-3 text-sm border outline-none transition-colors focus:border-[#8f3a27]"
              style={{ borderColor: "oklch(0.87 0.015 65)", borderRadius: "2px", background: "oklch(0.98 0.005 75)", color: "oklch(0.22 0.025 55)" }}
              placeholder="(305) 555-0100" />
          </div>
        </div>


        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase mb-1.5" style={{ color: "oklch(0.5 0.02 60)" }}>Tell us about your project</label>
          <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
            rows={4} className="w-full px-4 py-3 text-sm border outline-none resize-none focus:border-[#8f3a27]"
            style={{ borderColor: "oklch(0.87 0.015 65)", borderRadius: "2px", background: "oklch(0.98 0.005 75)", color: "oklch(0.22 0.025 55)" }}
            placeholder="Describe your project - fabric type, yardage estimate, timeline, color preferences..." />
        </div>

        {error && (
          <div className="p-4 mt-4 text-sm font-medium text-rose-800 bg-rose-50 border border-rose-200 rounded-sm">
            {error}
          </div>
        )}

        <button type="submit" disabled={loading}
          className={`w-full mt-4 py-4 text-sm font-bold tracking-widest uppercase transition-all duration-200 shadow-lg ${loading ? 'opacity-70 cursor-wait' : 'hover:opacity-90'}`}
          style={{ background: "oklch(0.52 0.13 35)", color: "white", borderRadius: "2px" }}>
          {loading ? "Sending..." : "Request Sample"}
        </button>
      </div>
    </form>
  );
}
