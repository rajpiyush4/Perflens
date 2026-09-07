"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Activity, Mail, Lock, User, ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [isMagicLink, setIsMagicLink] = useState(false);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            toast.error("Please enter your email address");
            return;
        }

        setLoading(true);

        try {
            if (isMagicLink) {
                // Send Magic Link via NextAuth Email Provider
                const res = await signIn("email", { email, redirect: false });
                if (res?.error) {
                    toast.error(res.error || "Failed to send magic link");
                } else {
                    toast.success("Magic link sent! Check your inbox.");
                }
            } else if (isSignUp) {
                // Register User API
                const res = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password }),
                });

                const data = await res.json();

                if (!res.ok) {
                    toast.error(data.error || "Sign up failed");
                } else {
                    toast.success("Account created successfully! Signing you in...");
                    // Automatically sign in after sign up
                    const signInRes = await signIn("credentials", {
                        email,
                        password,
                        redirect: false,
                    });

                    if (signInRes?.ok) {
                        router.push("/");
                        router.refresh();
                    } else {
                        toast.error(signInRes?.error || "Invalid credentials");
                    }
                }
            } else {
                // Sign in with Credentials
                if (!password) {
                    toast.error("Please enter your password");
                    setLoading(false);
                    return;
                }

                const res = await signIn("credentials", {
                    email,
                    password,
                    redirect: false,
                });

                if (res?.error) {
                    toast.error(res.error || "Invalid credentials");
                } else {
                    toast.success("Welcome back to PerfLens!");
                    router.push("/");
                    router.refresh();
                }
            }
        } catch (err: any) {
            console.error(err);
            toast.error("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Ambient Glows */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="w-full max-w-md space-y-8 relative z-10">
                {/* Brand Header */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold tracking-wide">
                        <Activity className="w-4 h-4" /> PerfLens Observability
                    </div>
                    <h1 className="text-3xl font-extrabold tracking-tight text-white">
                        {isSignUp ? "Create your account" : "Sign in to PerfLens"}
                    </h1>
                    <p className="text-sm text-zinc-400">
                        {isSignUp
                            ? "Start monitoring performance and Web Vitals in minutes"
                            : "Access your frontend metrics and Lighthouse benchmark audits"}
                    </p>
                </div>

                {/* Auth Card */}
                <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-2xl backdrop-blur-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {isSignUp && (
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Alex Morgan"
                                        className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="alex@perflens.io"
                                    className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                                />
                            </div>
                        </div>

                        {!isMagicLink && (
                            <div>
                                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="w-5 h-5 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="password"
                                        required={!isMagicLink}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500 transition-colors"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Mode Selector Toggle */}
                        <div className="flex items-center justify-between text-xs pt-1">
                            <button
                                type="button"
                                onClick={() => setIsMagicLink(!isMagicLink)}
                                className="text-blue-400 hover:text-blue-300 font-medium transition-colors flex items-center gap-1"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                {isMagicLink ? "Use Password Instead" : "Sign in with Magic Link"}
                            </button>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all duration-200 shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 group"
                        >
                            {loading ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white" />
                            ) : (
                                <>
                                    <span>
                                        {isMagicLink
                                            ? "Send Magic Link"
                                            : isSignUp
                                                ? "Create Account"
                                                : "Sign In"}
                                    </span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle between Sign Up and Sign In */}
                    <div className="mt-6 pt-6 border-t border-white/10 text-center">
                        <button
                            type="button"
                            onClick={() => {
                                setIsSignUp(!isSignUp);
                                setIsMagicLink(false);
                            }}
                            className="text-xs text-zinc-400 hover:text-white font-medium transition-colors"
                        >
                            {isSignUp
                                ? "Already have an account? Sign in"
                                : "Don't have an account? Sign up"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
