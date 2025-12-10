// src/components/Profile/ProfileHeader.tsx
import React, { useMemo, useState } from "react";
import { User as UserIcon } from "lucide-react";

interface Props {
  name: string;
  email: string;
  img: string;
}

const ProfileHeader: React.FC<Props> = ({ name, email, img }) => {
  const [fallback, setFallback] = useState(!img);
  const initials = useMemo(() => {
    const parts = (name || "").trim().split(/\s+/);
    const first = parts[0]?.[0] ?? "";
    const second = parts[1]?.[0] ?? "";
    const both = `${first}${second}`.toUpperCase();
    return both || "U";
  }, [name]);

  return (
    <div className="flex items-center gap-6 bg-white shadow-md rounded-2xl p-6 border border-amber-100">
      {fallback ? (
        <div className="w-28 h-28 rounded-xl bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center text-white font-semibold text-2xl shadow">
          {initials.length >= 1 ? initials : <UserIcon className="w-10 h-10" />}
        </div>
      ) : (
        <img
          src={img}
          alt="Profile"
          className="w-28 h-28 object-cover rounded-xl shadow"
          onError={() => setFallback(true)}
        />
      )}
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">{name}</h1>
        <p className="text-gray-600">{email || "—"}</p>
      </div>
    </div>
  );
};

export default ProfileHeader;
