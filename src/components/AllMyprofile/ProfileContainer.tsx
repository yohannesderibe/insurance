import { useEffect, useState } from "react";
import { getActorProfile, type ActorRole } from "../../api/common/Allprofile";
import ProfileView from "./ProfileView";
import type { ActorProfile } from "../../type/BaseProfile";

const ProfileContainer = ({ role }: { role: ActorRole }) => {
  const [profile, setProfile] = useState<ActorProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActorProfile(role)
      .then(setProfile)
      .finally(() => setLoading(false));
  }, [role]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[75vh] text-yellow-600 animate-pulse">
        🐝 Loading your profile…
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-[75vh] text-red-600">
        🚫 Failed to load profile.
      </div>
    );
  }

  return <ProfileView profile={profile} />;
};

export default ProfileContainer;
