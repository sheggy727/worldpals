"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Edit2, Check, X, MapPin, Languages } from "lucide-react";
import toast from "react-hot-toast";
import { COUNTRIES, LANGUAGES, INTERESTS, COUNTRY_FLAGS, UserProfile } from "@/types";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<UserProfile & { photoFile?: File }>>({});
  const [photoPreview, setPhotoPreview] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setForm(data);
      });
  }, [session]);

  const toggleTag = (field: "languages" | "interests" | "countriesWantConnect", value: string) => {
    setForm((f) => {
      const arr = (f[field] as string[]) || [];
      return {
        ...f,
        [field]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
      };
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoPreview(URL.createObjectURL(file));
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.path) setForm((f) => ({ ...f, photoPath: data.path }));
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch("/api/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        displayName: form.displayName,
        bio: form.bio,
        age: form.age,
        country: form.country,
        languages: form.languages,
        interests: form.interests,
        countriesWantConnect: form.countriesWantConnect,
        photoPath: form.photoPath,
      }),
    });

    if (res.ok) {
      const updated = await res.json();
      setProfile(updated.user ? {
        ...updated.user,
        languages: JSON.parse(updated.user.languages || "[]"),
        interests: JSON.parse(updated.user.interests || "[]"),
        countriesWantConnect: JSON.parse(updated.user.countriesWantConnect || "[]"),
        blockedUsers: JSON.parse(updated.user.blockedUsers || "[]"),
      } : form as UserProfile);
      toast.success("Profile updated!");
      setEditing(false);
      setPhotoPreview("");
    } else {
      toast.error("Failed to save");
    }
    setSaving(false);
  };

  if (!profile) {
    return <div className="flex items-center justify-center h-64"><LoadingSpinner /></div>;
  }

  const flag = COUNTRY_FLAGS[profile.country || ""] || "🌍";
  const currentPhoto = photoPreview || form.photoPath || profile.photoPath;

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="btn-secondary flex items-center gap-2 py-2 px-4 text-sm">
            <Edit2 className="w-4 h-4" /> Edit
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => { setEditing(false); setForm(profile); setPhotoPreview(""); }} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <X className="w-5 h-5 text-gray-600" />
            </button>
            <button onClick={handleSave} disabled={saving} className="p-2 rounded-full bg-primary-500 hover:bg-primary-600 transition-colors disabled:opacity-50">
              <Check className="w-5 h-5 text-gray-900" />
            </button>
          </div>
        )}
      </div>

      {/* Photo */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative w-28 h-28 rounded-full overflow-hidden bg-primary-100">
          {currentPhoto ? (
            <Image src={currentPhoto} alt="Profile" fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">😊</div>
          )}
        </div>
        {editing && (
          <label className="mt-3 btn-secondary text-sm py-1.5 cursor-pointer">
            Change photo
            <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </label>
        )}
      </div>

      {/* Basic info */}
      <div className="card mb-4">
        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display name</label>
              <input className="input-field" value={form.displayName || ""} onChange={(e) => setForm({ ...form, displayName: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <input type="number" className="input-field" value={form.age || ""} onChange={(e) => setForm({ ...form, age: parseInt(e.target.value) })} min={13} max={120} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <select className="input-field" value={form.country || ""} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                <option value="">Select country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
              <textarea className="input-field resize-none" rows={3} value={form.bio || ""} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={200} />
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              {profile.displayName || "No name set"}{profile.age ? `, ${profile.age}` : ""} <span>{flag}</span>
            </h2>
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <MapPin className="w-4 h-4" />
              <span>{profile.country || "Unknown location"}</span>
            </div>
            {profile.bio && <p className="text-gray-600 text-sm mt-3 leading-relaxed">{profile.bio}</p>}
          </div>
        )}
      </div>

      {/* Languages */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Languages className="w-5 h-5 text-primary-500" />
          <h3 className="font-semibold text-gray-900">Languages</h3>
        </div>
        {editing ? (
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {LANGUAGES.map((lang) => (
              <button key={lang} onClick={() => toggleTag("languages", lang)}
                className={(form.languages as string[] || []).includes(lang) ? "tag-selected" : "tag"}>
                {lang}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(profile.languages || []).length > 0
              ? profile.languages.map((lang) => <span key={lang} className="tag">{lang}</span>)
              : <span className="text-gray-400 text-sm">No languages added</span>}
          </div>
        )}
      </div>

      {/* Interests */}
      <div className="card mb-4">
        <h3 className="font-semibold text-gray-900 mb-3">Interests</h3>
        {editing ? (
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {INTERESTS.map((item) => (
              <button key={item} onClick={() => toggleTag("interests", item)}
                className={(form.interests as string[] || []).includes(item) ? "tag-selected" : "tag"}>
                {item}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(profile.interests || []).length > 0
              ? profile.interests.map((item) => <span key={item} className="tag">{item}</span>)
              : <span className="text-gray-400 text-sm">No interests added</span>}
          </div>
        )}
      </div>

      {/* Countries */}
      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-3">Want to connect with</h3>
        {editing ? (
          <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
            {COUNTRIES.map((country) => (
              <button key={country} onClick={() => toggleTag("countriesWantConnect", country)}
                className={(form.countriesWantConnect as string[] || []).includes(country) ? "tag-selected" : "tag"}>
                {country}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {(profile.countriesWantConnect || []).length > 0
              ? profile.countriesWantConnect.map((c) => (
                <span key={c} className="tag">{COUNTRY_FLAGS[c] || "🌍"} {c}</span>
              ))
              : <span className="text-gray-400 text-sm">No preferences set</span>}
          </div>
        )}
      </div>
    </div>
  );
}
