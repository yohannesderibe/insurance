import React, { useEffect, useState } from "react";
import getMyProfile from "../../../../api/Coustomer/myprofile/profileApi";
import type { ClientProfile } from "../../../../type/Profile";
import { Edit, Camera } from "lucide-react";
import { Button } from "../../../../reusable/UI/button";
import { Avatar, AvatarImage, AvatarFallback } from "../../../../reusable/UI/Avatar";

const MyProfile: React.FC = () => {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[75vh] text-lg text-yellow-600 animate-pulse">
        🐝 Loading your profile…
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-[75vh] text-red-600 font-semibold">
        🚫 Failed to load profile.
      </div>
    );
  }

  const initials = `${profile.firstName[0] || ""}${profile.fatherName[0] || ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50 honeycomb-pattern">
      <div className="container max-w-5xl py-10 px-4 md:px-6">

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl shadow-xl border border-yellow-200 overflow-hidden">

          {/* HEADER */}
          <div className="relative">
            <div className="h-32 md:h-40 rounded-t-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-yellow-50 to-rose-100" />
              <div className="absolute inset-0 bg-[url('/assets/clouds.svg')] opacity-10" />
            </div>

            <div className="px-6 md:px-8 pb-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-12 md:-mt-16">

                {/* AVATAR */}
                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-md">
                      <AvatarImage src={`http://localhost:5150${profile.passportOrNationalIdImageUrl}`} />
                      <AvatarFallback className="bg-yellow-100 text-yellow-700 text-3xl font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <button className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-yellow-500 text-white flex items-center justify-center shadow hover:bg-yellow-600 transition">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>

                  {/* NAME + EMAIL */}
                  <div className="md:pb-2">
                    <h1 className="text-3xl font-serif font-bold text-gray-900">
                      {profile.firstName} {profile.fatherName}
                    </h1>
                    <p className="text-gray-600 mt-1">{profile.email}</p>
                  </div>
                </div>

                {/* EDIT BUTTON */}
                <Button
                  variant="honey"
                  onClick={() => setIsEditing(true)}
                  className="mt-4 md:mt-0 w-full md:w-auto"
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>

          {/* CONTENT */}
          <div className="px-6 md:px-8 py-8 space-y-10">

            <Section title="Personal Information">
              <Info label="Full Name" value={`${profile.firstName} ${profile.fatherName}`} />
              <Info label="Gender" value={profile.gender} />
              <Info label="Date of Birth" value={new Date(profile.dateOfBirth).toDateString()} />
            </Section>

            <Divider />

            <Section title="Contact Information">
              <Info label="Email" value={profile.email} />
              <Info label="Phone" value={profile.phoneNumber} />
              <Info label="Region" value={profile.region} />
              <Info label="City" value={profile.city} />
              <Info label="Sub City" value={profile.subCity} />
            </Section>

            <Divider />

            <Section title="Identification">
              <Info label="National ID / Passport" value={profile.nationalIdOrPassport} />
              <p className="text-gray-600 mt-4 font-medium">Uploaded ID</p>
              <img
                src={`http://localhost:5150${profile.passportOrNationalIdImageUrl}`}
                className="w-60 rounded-xl shadow-md border border-yellow-200"
              />
            </Section>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2024 BeeSecure Insurance. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <div className="h-1 w-6 bg-yellow-500 rounded-full" />
      <h2 className="text-xl font-serif font-bold text-gray-900">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);
// addes color to the input fiels 
// const Info = ({ label, value }: { label: string; value: string }) => (
//   <div className="space-y-1">
//     <p className="text-sm text-gray-500">{label}</p>
//     <p className="bg-yellow-50 p-2 rounded-lg   text-gray-700 hover:ring-1 hover:ring-yellow-300 focus:ring-2 focus:ring-yellow-400 transition">
//       {value || "--"}
//     </p>
//   </div>
// );
const Info = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="p-2 rounded-lg   text-gray-700 hover:ring-1 hover:ring-yellow-300 focus:ring-2 focus:ring-yellow-400 transition">
      {value || "--"}
    </p>
  </div>
);
const Divider = () => <div className="border-t border-yellow-200" />;

export default MyProfile;