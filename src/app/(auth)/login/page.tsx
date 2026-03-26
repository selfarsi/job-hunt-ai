"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input, Card } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { useAppStore } from "@/store";
import { Mail, Lock, User, Sparkles, CheckCircle, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const { user, setUser, loadJobs } = useAppStore();

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      if (isLogin) {
        if (formData.email && formData.password) {
          const existingUser = JSON.parse(localStorage.getItem("jobhunt_user") || "{}");
          if (existingUser.email === formData.email) {
            setUser(existingUser);
            loadJobs();
            addToast({ type: "success", title: "Welcome back!", message: `Signed in as ${existingUser.name}` });
            router.push("/");
          } else {
            addToast({ type: "error", title: "Invalid credentials" });
          }
        } else {
          const demoUser = {
            id: "demo-user",
            name: formData.email.split("@")[0] || "Demo User",
            email: formData.email,
            resumeText: "",
            preferences: {
              targetTitles: [],
              locations: [],
              minSalary: 0,
              matchThreshold: 80,
            },
          };
          setUser(demoUser);
          loadJobs();
          addToast({ type: "success", title: "Welcome!", message: "Signed in as demo user" });
          router.push("/");
        }
      } else {
        const newUser = {
          id: `user-${Date.now()}`,
          name: formData.name,
          email: formData.email,
          resumeText: "",
          preferences: {
            targetTitles: [],
            locations: [],
            minSalary: 0,
            matchThreshold: 80,
          },
        };
        localStorage.setItem("jobhunt_user", JSON.stringify(newUser));
        setUser(newUser);
        loadJobs();
        addToast({ type: "success", title: "Account created!", message: "Welcome to JobHunt AI" });
        router.push("/");
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-violet/10 rounded-full blur-3xl" />
      </div>

      <Card className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-gradient-to-br from-accent-cyan to-accent-violet mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">JobHunt AI</h1>
          <p className="text-text-secondary mt-2">
            {isLogin ? "Welcome back" : "Create your account"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={<User className="h-4 w-4" />}
              required
            />
          )}

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            icon={<Mail className="h-4 w-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            icon={<Lock className="h-4 w-4" />}
            required={isLogin}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="animate-pulse">Please wait...</span>
            ) : isLogin ? (
              <>
                Sign In
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Create Account
                <ArrowRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-text-secondary text-sm">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-accent-cyan hover:underline font-medium"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>

        <div className="mt-6 pt-6 border-t border-border">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <CheckCircle className="h-4 w-4 text-accent-emerald" />
            <span>100% Free - No database required</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-text-muted mt-2">
            <CheckCircle className="h-4 w-4 text-accent-emerald" />
            <span>Your data stays on your device</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
