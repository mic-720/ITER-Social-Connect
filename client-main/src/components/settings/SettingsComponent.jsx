"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { BACKEND_URL } from "@/configs/index";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Settings, User, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import LeftPanel from "@/components/panels/LeftPanel";
import RightTopPanel from "@/components/panels/RightTopPanel";

export default function SettingsComponent() {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { accessToken } = useAuth();
  const router = useRouter();

  // Redirect to sign in if not authenticated
  useEffect(() => {
    if (!accessToken) {
      router.push("/signin");
    }
  }, [accessToken, router]);

  const buttons = [
    {
      label: "Settings",
      icons: Settings,
      showChevron: true,
      key: "settings",
    },
  ];

  // State for update profile form
  const [profileForm, setProfileForm] = useState({
    name: "",
    about: "",
    email: "",
    github: "",
    linkedin: "",
    x: "",
    profilePicture: "",
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  // State for change password form
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // Handle update profile input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle change password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  // Submit update profile form
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage("");
    setProfileError("");
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/settings/updateProfile`,
        profileForm,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );
      setProfileMessage(response.data.message || "Profile updated successfully!");
    } catch (error) {
      setProfileError(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // Submit change password form
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage("");
    setPasswordError("");
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      setPasswordError("New passwords do not match");
      return;
    }
    setPasswordLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/settings/change-password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );
      setPasswordMessage(
        response.data.message || "Password changed successfully!"
      );
      // Optionally, reset the form
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      setPasswordError(
        error.response?.data?.message || "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="max-w-full mx-auto h-full">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar */}
        <LeftPanel
          heading="Settings"
          subheading="Manage your account!"
          buttons={buttons}
        />

        {/* Main Content */}
        <div className="flex-1">
          <RightTopPanel
            placeholder="Search settings..."
            buttonLabel="Update Settings"
            buttonIcon={User}
            onButtonClick={() => console.log("Update Settings Clicked")}
            disabled={true}
          />

          <div className="mt-6 space-y-8">
            {/* Update Profile Panel */}
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Update Profile
                </h2>
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileChange}
                      placeholder="Your Name"
                      className="mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="about"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      About
                    </Label>
                    <Input
                      id="about"
                      type="text"
                      name="about"
                      value={profileForm.about}
                      onChange={handleProfileChange}
                      placeholder="Tell us about yourself"
                      className="mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="email"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileChange}
                      placeholder="you@example.com"
                      className="mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="github"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      GitHub
                    </Label>
                    <Input
                      id="github"
                      type="url"
                      name="github"
                      value={profileForm.github}
                      onChange={handleProfileChange}
                      placeholder="https://github.com/username"
                      className="mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="linkedin"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      LinkedIn
                    </Label>
                    <Input
                      id="linkedin"
                      type="url"
                      name="linkedin"
                      value={profileForm.linkedin}
                      onChange={handleProfileChange}
                      placeholder="https://linkedin.com/in/username"
                      className="mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="x"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      X (Twitter)
                    </Label>
                    <Input
                      id="x"
                      type="url"
                      name="x"
                      value={profileForm.x}
                      onChange={handleProfileChange}
                      placeholder="https://twitter.com/username"
                      className="mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="profilePicture"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Profile Picture URL
                    </Label>
                    <Input
                      id="profilePicture"
                      type="url"
                      name="profilePicture"
                      value={profileForm.profilePicture}
                      onChange={handleProfileChange}
                      placeholder="https://example.com/your-picture.jpg"
                      className="mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  {profileError && (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{profileError}</AlertDescription>
                    </Alert>
                  )}
                  {profileMessage && (
                    <Alert variant="default">
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>{profileMessage}</AlertDescription>
                    </Alert>
                  )}
                  <div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                      disabled={profileLoading}
                    >
                      {profileLoading ? "Updating..." : "Update Profile"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Change Password Panel */}
            <Card className="bg-white dark:bg-gray-800">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                  Change Password
                </h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <Label
                      htmlFor="currentPassword"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Current Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        name="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={handlePasswordChange}
                        placeholder="Current Password"
                        className="mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-300 focus:outline-none"
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="newPassword"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        name="newPassword"
                        value={passwordForm.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="New Password"
                        className="mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-300 focus:outline-none"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <Label
                      htmlFor="confirmNewPassword"
                      className="text-gray-700 dark:text-gray-300"
                    >
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirmNewPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmNewPassword"
                        value={passwordForm.confirmNewPassword}
                        onChange={handlePasswordChange}
                        placeholder="Confirm New Password"
                        className="mt-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-700 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-300 focus:outline-none"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  {passwordError && (
                    <Alert variant="destructive">
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{passwordError}</AlertDescription>
                    </Alert>
                  )}
                  {passwordMessage && (
                    <Alert variant="default">
                      <AlertTitle>Success</AlertTitle>
                      <AlertDescription>{passwordMessage}</AlertDescription>
                    </Alert>
                  )}
                  <div>
                    <Button
                      type="submit"
                      className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? "Changing..." : "Change Password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
