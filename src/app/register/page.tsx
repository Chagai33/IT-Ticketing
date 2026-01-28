"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider";
import Link from "next/link";
import { registerTenantAction } from "@/app/login/actions";
import { auth } from "@/lib/firebase/client";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { Loader2 } from "lucide-react";

import { joinTenantAction } from "@/app/users/actions";
import { getInviteDetailsAction } from "./actions";
import { useEffect } from "react";

export default function RegisterPage({ searchParams }: { searchParams: { invite?: string } }) {
  const { signInWithGoogle } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const inviteToken = searchParams.invite;

  const [formData, setFormData] = useState({
    companyName: "",
    adminName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (inviteToken) {
      getInviteDetailsAction(inviteToken).then(result => {
        if (result.success && result.email) {
          setFormData(prev => ({
            ...prev,
            email: result.email,
            adminName: result.name || prev.adminName
          }));
          // Optionally lock the email field
        } else if (result.error) {
          toast.error(result.error);
        }
      });
    }
  }, [inviteToken]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreeTerms) {
      toast.error("You must agree to the Terms of Service.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create User with Email/Password
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const idToken = await userCredential.user.getIdToken();

      let result;

      if (inviteToken) {
        // JOIN EXISTING TENANT
        result = await joinTenantAction({
          inviteToken,
          idToken
        });
      } else {
        // CREATE NEW TENANT
        result = await registerTenantAction({
          idToken,
          companyName: formData.companyName,
          adminName: formData.adminName,
        });
      }

      if (result.success) {
        toast.success("Account created successfully!");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Registration failed");
      }

    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    if (!agreeTerms) {
      toast.error("You must agree to the Terms of Service.");
      return;
    }

    // We assume the user has filled in Company and Name, OR we could prompt for it after?
    // Current flow: User fills form, clicks 'Sign up with Google' instead of 'Sign up with Email'?
    // Actually, usually Google Sign up gets the Name/Email from Google.
    // But we still need Company Name.

    if (!inviteToken && !formData.companyName) {
      toast.error("Please enter a Company Name.");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithGoogle();
      if (!userCredential) throw new Error("Google Sign-In failed");

      const idToken = await userCredential.user.getIdToken();
      const displayName = userCredential.user.displayName || formData.adminName || "Admin";

      let result;
      if (inviteToken) {
        result = await joinTenantAction({
          inviteToken,
          idToken
        });
      } else {
        result = await registerTenantAction({
          idToken,
          companyName: formData.companyName,
          adminName: displayName,
        });
      }

      if (result.success) {
        toast.success("Account created successfully!");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Registration failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-slate-200 dark:border-slate-800 shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white mb-4 shadow-lg shadow-blue-600/20">
            <span className="text-xl font-bold">T</span>
          </div>
          <CardTitle className="text-2xl">
            {inviteToken ? "Join Your Team" : "Create your Workspace"}
          </CardTitle>
          <CardDescription>
            {inviteToken ? "You've been invited to join the platform." : "Get started with Ticketing for your team."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleRegister} className="space-y-4">

            {!inviteToken && (
              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  placeholder="Acme Inc."
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required={!inviteToken}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Your Full Name</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.adminName}
                onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirm</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id="terms"
                checked={agreeTerms}
                onCheckedChange={(c) => setAgreeTerms(c as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-600 dark:text-slate-400"
              >
                I agree to the <Link href="/terms" className="underline hover:text-blue-600">Terms of Service</Link> and <Link href="/privacy-policy" className="underline hover:text-blue-600">Privacy Policy</Link>.
              </label>
            </div>

            <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {inviteToken ? "Join Team" : "Sign Up with Email"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-950 px-2 text-slate-500">Or sign up with</span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleRegister}
            disabled={loading}
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
            </svg>
            Google
          </Button>

        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-slate-500">
            Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Log in</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
