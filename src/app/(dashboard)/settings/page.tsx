"use client";

import { useState } from "react";
import { Header } from "@/components/layout/header";
import { Card, Button, Input, Tabs, TabsList, TabsTrigger, TabsContent, Badge } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { useAppStore } from "@/store";
import { User as UserIcon, Bell, Loader2, Save, Database, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const { addToast } = useToast();
  const { user, updateUser } = useAppStore();

  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    targetTitles: user?.preferences?.targetTitles?.join(", ") || "",
    locations: user?.preferences?.locations?.join(", ") || "",
    minSalary: user?.preferences?.minSalary?.toString() || "0",
    matchThreshold: user?.preferences?.matchThreshold?.toString() || "80",
  });

  const [notificationSettings, setNotificationSettings] = useState({
    dailyDigest: true,
    digestTime: "08:00",
  });

  const handleSaveProfile = () => {
    setIsSaving(true);
    setTimeout(() => {
      updateUser({
        name: profileData.name,
        email: profileData.email,
        preferences: {
          targetTitles: profileData.targetTitles.split(",").map((s) => s.trim()).filter(Boolean),
          locations: profileData.locations.split(",").map((s) => s.trim()).filter(Boolean),
          minSalary: parseInt(profileData.minSalary) || 0,
          matchThreshold: parseInt(profileData.matchThreshold) || 80,
        },
      });
      setIsSaving(false);
      addToast({ type: "success", title: "Profile saved" });
    }, 500);
  };

  return (
    <div className="min-h-screen">
      <Header title="Settings" subtitle="Manage your account and preferences" />

      <div className="p-6 max-w-3xl mx-auto">
        <Card className="mb-6 border-accent-emerald/30 bg-accent-emerald/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent-emerald/10">
              <Database className="h-5 w-5 text-accent-emerald" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-text-primary">Local Storage Mode</h3>
                <Badge variant="success">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <p className="text-sm text-text-secondary mt-1">
                Your data is stored locally in your browser. No database needed!
              </p>
            </div>
          </div>
        </Card>

        <Tabs value={activeTab} onChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="profile">
              <UserIcon className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <h2 className="text-lg font-semibold text-text-primary mb-6">Profile Settings</h2>

              <div className="space-y-4">
                <Input
                  label="Full Name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  placeholder="Your name"
                />

                <Input
                  label="Email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  placeholder="your@email.com"
                />

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Target Job Titles
                  </label>
                  <Input
                    value={profileData.targetTitles}
                    onChange={(e) => setProfileData({ ...profileData, targetTitles: e.target.value })}
                    placeholder="Senior Engineer, Full Stack Developer (comma separated)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-1.5">
                    Preferred Locations
                  </label>
                  <Input
                    value={profileData.locations}
                    onChange={(e) => setProfileData({ ...profileData, locations: e.target.value })}
                    placeholder="Remote, New York, San Francisco (comma separated)"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Minimum Salary"
                    type="number"
                    value={profileData.minSalary}
                    onChange={(e) => setProfileData({ ...profileData, minSalary: e.target.value })}
                    placeholder="50000"
                  />
                  <Input
                    label="Match Threshold %"
                    type="number"
                    value={profileData.matchThreshold}
                    onChange={(e) => setProfileData({ ...profileData, matchThreshold: e.target.value })}
                    placeholder="80"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={handleSaveProfile} disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save Changes
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <h2 className="text-lg font-semibold text-text-primary mb-6">Notification Preferences</h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary">Daily Summary</p>
                    <p className="text-sm text-text-secondary">
                      Get daily reminders to check your job applications
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.dailyDigest}
                      onChange={(e) =>
                        setNotificationSettings({ ...notificationSettings, dailyDigest: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-bg-hover peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-cyan"></div>
                  </label>
                </div>

                {notificationSettings.dailyDigest && (
                  <Input
                    label="Reminder Time"
                    type="time"
                    value={notificationSettings.digestTime}
                    onChange={(e) =>
                      setNotificationSettings({ ...notificationSettings, digestTime: e.target.value })
                    }
                  />
                )}
              </div>

              <div className="flex justify-end mt-6">
                <Button onClick={() => addToast({ type: "success", title: "Preferences saved" })}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6">
          <h3 className="font-semibold text-text-primary mb-2">Data Management</h3>
          <p className="text-sm text-text-secondary mb-4">
            Your data is stored locally. Export to save a backup or clear data to start fresh.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                const data = localStorage.getItem("jobhunt_jobs");
                if (data) {
                  const blob = new Blob([data], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "jobhunt-backup.json";
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                  URL.revokeObjectURL(url);
                  addToast({ type: "success", title: "Data exported" });
                }
              }}
            >
              Export Data
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (confirm("Are you sure? This will delete all your data.")) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
            >
              Clear All Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
