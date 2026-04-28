"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Globe } from "lucide-react";
import toast from "react-hot-toast";
import { COUNTRIES, LANGUAGES, INTERESTS } from "@/types";
import Image from "next/image";

interface FormData {
  photoPath: string;
  photoPreview: string;
  displayName: string;
  age: string;
  bio: string;
  country: string;
  languages: string[];
  interests: string[];
  countriesWantConnect: string[];
}

const STEPS = ["Photo", "About You", "Languages", "Interests", "Connect With"];

export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormData>({
    photoPath: "",
    photoPreview: "",
    displayName: "",
    age: "",
    bio: "",
    country: "",
    languages: [],
    interests: [],
    countriesWantConnect: [],
  });

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setForm((f) => ({ ...f, photoPreview: preview }));

    const fd = new FormData();
    fd.append("file", file);

    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.path) setForm((f) => ({ ...f, photoPath: data.path }));
    else toast.error("Photo upload failed");
  };

  const toggleItem = (key: "languages" | "interests" | "countriesWantConnect", value: string) => {
    setForm((f) => {
      const arr = f[key];
      return {
        ...f,
        [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const handleComplete = async () => {
    setLoading(true);
    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: form.displayName,
        age: parseInt(form.age),
        bio: form.bio,
        country: form.country,
        languages: form.languages,
        interests: form.interests,
        countriesWantConnect: form.countriesWantConnect,
        photoPath: form.photoPath || null,
        isOnboarded: true,
      }),
    });

    if (!res.ok) {
      toast.error("Failed to save profile");
      setLoading(false);
      return;
    }

    toast.success("Profile complete! Let's find your WorldPals 🌍");
    router.push("/discover");
  };

  const stepVariants = {
    enter: { x: 40, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -40, opacity: 0 },
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 bg-primary-500 rounded-xl flex items-center justify-center">
          <Globe className="w-5 h-5 text-gray-900" />
        </div>
        <span className="text-xl font-bold text-gray-900">WorldPals</span>
      </div>

      {/* Progress */}
      <div className="w-full max-w-md mb-6">
        <div className="flex justify-between mb-2">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`text-xs font-medium ${i <= step ? "text-primary-600" : "text-gray-300"}`}
            >
              {s}
            </span>
          ))}
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500 rounded-full"
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Step {step + 1} of {STEPS.length}
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-card p-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.25 }}
          >
            {step === 0 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Add your photo</h2>
                <p className="text-gray-500 mb-6">Help others recognize you. A clear face photo works best.</p>
                <div className="flex flex-col items-center gap-4">
                  <div className="w-32 h-32 rounded-full bg-gray-100 overflow-hidden flex items-center justify-center border-4 border-primary-100">
                    {form.photoPreview ? (
                      <Image src={form.photoPreview} alt="Preview" width={128} height={128} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-5xl">😊</span>
                    )}
                  </div>
                  <label className="btn-primary cursor-pointer">
                    {form.photoPreview ? "Change photo" : "Choose photo"}
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                </div>
              </div>
            )}

            {step === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">About you</h2>
                <p className="text-gray-500 mb-6">Tell your future WorldPals who you are.</p>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Display name *</label>
                    <input
                      className="input-field"
                      placeholder="How you want to be known"
                      value={form.displayName}
                      onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                    <input
                      type="number"
                      className="input-field"
                      placeholder="Your age"
                      value={form.age}
                      onChange={(e) => setForm({ ...form, age: e.target.value })}
                      min={13}
                      max={120}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                    <textarea
                      className="input-field resize-none"
                      placeholder="A few words about yourself..."
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      rows={3}
                      maxLength={200}
                    />
                    <p className="text-xs text-gray-400 mt-1">{form.bio.length}/200</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                    <select
                      className="input-field"
                      value={form.country}
                      onChange={(e) => setForm({ ...form, country: e.target.value })}
                    >
                      <option value="">Select your country</option>
                      {COUNTRIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Languages you speak</h2>
                <p className="text-gray-500 mb-4">Select all languages you can communicate in.</p>
                <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => toggleItem("languages", lang)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        form.languages.includes(lang) ? "tag-selected" : "tag"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">{form.languages.length} selected</p>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your interests</h2>
                <p className="text-gray-500 mb-4">Pick topics you love to talk about.</p>
                <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto">
                  {INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleItem("interests", interest)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        form.interests.includes(interest) ? "tag-selected" : "tag"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">{form.interests.length} selected</p>
              </div>
            )}

            {step === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Where do you want friends from?</h2>
                <p className="text-gray-500 mb-4">Select countries you&apos;d love to connect with.</p>
                <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto">
                  {COUNTRIES.map((country) => (
                    <button
                      key={country}
                      onClick={() => toggleItem("countriesWantConnect", country)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                        form.countriesWantConnect.includes(country) ? "tag-selected" : "tag"
                      }`}
                    >
                      {country}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-3">{form.countriesWantConnect.length} selected</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {step > 0 && (
            <button onClick={back} className="btn-secondary flex-1">
              Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={next}
              className="btn-primary flex-1"
              disabled={
                (step === 1 && (!form.displayName || !form.age || !form.country)) ||
                (step === 2 && form.languages.length === 0)
              }
            >
              Continue
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {loading ? (
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                "Start discovering 🌍"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
