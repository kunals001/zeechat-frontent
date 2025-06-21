import React, { useRef, useState } from "react";
import axios from "axios";
import { Camera } from "lucide-react";

interface ProfilePicUploaderProps {
  profilePic: string;
  setProfilePic: (url: string) => void;
}

const ProfilePicUploader: React.FC<ProfilePicUploaderProps> = ({ profilePic, setProfilePic }) => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL;
  const inputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string>(profilePic || "");

  const handleClick = () => {
    inputRef.current?.click();
  };

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  setPreviewUrl(URL.createObjectURL(file));

  const formData = new FormData();
  formData.append("file", file);

  try {

    const res = await axios.post(`${API_URL}/api/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });

    const uploadedUrl = res.data.url;
    console.log("Uploaded URL:", uploadedUrl);
    setProfilePic(uploadedUrl); // ✅ only set local state

  } catch (err) {
    console.error("Upload failed", err);
  }
};


  return (
    <div
      className="relative rounded-full md:w-[8vw] md:h-[8vw] w-[12vh] h-[12vh] cursor-pointer"
      onClick={handleClick}
    >
      {previewUrl ? (
            <img
            src={previewUrl}
            alt="Preview"
            className="rounded-full w-full h-full object-cover"
            />
        ) : (
            null
        )}


      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[#0000007a] flex-col rounded-full">
        <Camera className="md:size-10 size-12 text-zinc-200" />
        <p className="md:text-[1vw] text-[1.3vh] text-center leading-tight md:w-[6vw] w-[8vh] text-white">
          Change Profile pic
        </p>
      </div>
    </div>
  );
};

export default ProfilePicUploader;
