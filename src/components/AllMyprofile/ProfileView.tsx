import React from 'react';
import { Edit, Camera } from "lucide-react";
import { Button } from "../../reusable/UI/button";
import { Avatar, AvatarImage, AvatarFallback } from "../../reusable/UI/Avatar";
import type { ActorProfile } from "../../type/BaseProfile";

interface ProfileViewProps {
  profile: ActorProfile;
  onEditClick?: () => void;
}

const ProfileView = ({ profile, onEditClick }: ProfileViewProps) => {
  const initials = `${profile.firstName[0] || ""}${profile.fatherName[0] || ""}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-amber-50 honeycomb-pattern">
      <div className="container max-w-5xl py-10 px-4 md:px-6">

        <div className="bg-white rounded-3xl shadow-xl border border-yellow-200 overflow-hidden">

          {/* HEADER */}
          <div className="relative">
            <div className="h-32 md:h-40 rounded-t-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-yellow-50 to-rose-100" />
              <div className="absolute inset-0 bg-[url('/assets/clouds.svg')] opacity-10" />
            </div>

            <div className="px-6 md:px-8 pb-6">
              <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-12 md:-mt-16">

                <div className="flex flex-col md:flex-row md:items-end gap-4">
                  <div className="relative">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-md">
                      <AvatarImage src={`http://localhost:5150${profile.passportOrNationalIdImageUrl || ''}`} />
                      <AvatarFallback className="bg-yellow-100 text-yellow-700 text-3xl font-semibold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

                    <button className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-yellow-500 text-white flex items-center justify-center shadow hover:bg-yellow-600 transition">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="md:pb-2">
                    <h1 className="text-3xl font-serif font-bold text-gray-900">
                      {profile.firstName} {profile.fatherName}
                    </h1>
                    <p className="text-gray-600 mt-1">{profile.email}</p>
                  </div>
                </div>

                <Button 
                  variant="honey" 
                  onClick={onEditClick}
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
            
            {/* PERSONAL INFORMATION */}
            <Section title="Personal Information">
              <Info label=" Name" value={`${profile.firstName}`} />
              <Info label='Father Name' value ={`${profile.fatherName}`} />
            <Info label="Grand Father Name" value={`${profile.grandFatherName}`} />

              <Info label="Gender" value={profile.gender} />
              <Info
                label="Date of Birth"
                value={new Date(profile.dateOfBirth).toDateString()}
              />
              {profile.createdAt && (
                <Info
                  label="Member Since"
                  value={new Date(profile.createdAt).toDateString()}
                />
              )}
            </Section>

            <Divider />

            {/* CONTACT INFORMATION */}
            <Section title="Contact Information">
              <Info label="Email" value={profile.email} />
              <Info label="Phone" value={profile.phoneNumber} />
              <Info label="Region" value={profile.region} />
              <Info label="City" value={profile.city} />
              <Info label="Sub City" value={profile.subCity} />
            </Section>

            <Divider />

            {/* IDENTIFICATION */}
            <Section title="Identification">
              <Info
                label="National ID / Passport"
                value={profile.nationalIdOrPassport}
              />
              {profile.passportOrNationalIdImageUrl && (
                <div className="space-y-1">
                  <p className="text-sm text-gray-500">Uploaded ID</p>
                  <img
                    src={`http://localhost:5150${profile.passportOrNationalIdImageUrl}`}
                    className="w-60 rounded-xl shadow-md border border-yellow-200 mt-2"
                    alt="ID Document"
                  />
                </div>
              )}
            </Section>
          </div>

          {/* FOOTER */}
          <div className="text-center mt-8 pb-8 text-sm text-gray-500">
            <p>© 2024 BeeSecure Insurance. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Section Component
interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <div className="h-1 w-6 bg-yellow-500 rounded-full" />
      <h2 className="text-xl font-serif font-bold text-gray-900">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
  </div>
);

// Info Component
interface InfoProps {
  label: string;
  value: string;
}

const Info = ({ label, value }: InfoProps) => (
  <div className="space-y-1">
    <p className="text-sm text-gray-500">{label}</p>
    <p className="p-2 rounded-lg text-gray-700 hover:ring-1 hover:ring-yellow-300 focus:ring-2 focus:ring-yellow-400 transition">
      {value || "--"}
    </p>
  </div>
);

// Divider Component
const Divider = () => <div className="border-t border-yellow-200" />;

export default ProfileView;