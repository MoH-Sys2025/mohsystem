import { useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { Label } from "@/components/ui/label.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Loader2, Lock, Mail, User, Phone, ShieldCheck, Key } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import {api} from "@/supabase/Functions.tsx";

interface CreateAccountPageProps {
    onBackToLogin: () => void;
}

export function CreateAccountPage({ onBackToLogin }: CreateAccountPageProps) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(""); // single string for OTP
    const [role, setRole] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!role) {
            toast.error("Please select a role");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (otp.length !== 6) {
            toast.error("Please complete the 6-digit OTP");
            return;
        }
        setLoading(true);

        const result = await api.signupWithOtpCheck({
            full_name: fullName,
            email,
            phone,
            password,
            role,
            otp,
        });

        if (result?.error) {
            toast.error(result.error.message || "Account creation failed");
        } else {
            toast.success("Account created successfully. Please sign in.");
            onBackToLogin();
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-5">
                    <div className="inline-flex items-center justify-center w-14 rounded-xl mb-3">
                        <img src="/logo.png" alt="logo" />
                    </div>
                    <h1 className="text-neutral-900 mb-1 font-bold text-lg">
                        Malawi Outbreak and Emergency Response System
                    </h1>
                    <p className="text-neutral-500">Healthcare Workforce Management Platform</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-xl border-2 border-neutral-200 p-5">
                    <div className="mb-4">
                        <h2 className="text-neutral-900 mb-1">Create your account</h2>
                        <p className="text-sm text-neutral-500">Fill in the details to register</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Full Name */}
                        <div>
                            <Label className="block text-sm font-medium text-neutral-700 mb-2">Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <Input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="John Banda"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <Label className="block text-sm font-medium text-neutral-700 mb-2">Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="user@health.gov.mw"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <Label className="block text-sm font-medium text-neutral-700 mb-2">Phone Number</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <Input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder="+265 999 123 456"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* OTP */}
                        <div>
                            <Label className="block text-sm font-medium text-neutral-700 mb-2">
                                OTP Code <span className="text-xs font-normal text-gray-500">(Provided by administrator_00)</span>
                            </Label>

                            <div className="flex items-center gap-2">
                                <Key className="h-5 w-5 text-neutral-400" />

                                <InputOTP
                                    maxLength={6}
                                    value={otp}
                                    onChange={(val) => setOtp(val)}
                                >
                                <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>

                                    <InputOTPSeparator className="text-gray-500" />

                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </div>
                        </div>


                        {/* Role */}
                        <div>
                            <Label className="block text-sm font-medium text-neutral-700 mb-2">Role</Label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 z-10" />
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger className="w-full pl-10">
                                        <SelectValue placeholder="Select your role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="admin">Administrator</SelectItem>
                                        <SelectItem value="supervisor">Supervisor</SelectItem>
                                        <SelectItem value="hcw">Healthcare Worker</SelectItem>
                                        <SelectItem value="viewer">Viewer</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <Label className="block text-sm font-medium text-neutral-700 mb-2">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a password"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <Label className="block text-sm font-medium text-neutral-700 mb-2">Confirm Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                                <Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Re-enter password"
                                    required
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <Button type="submit" disabled={loading} className="w-full mt-2">
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create account
                        </Button>
                    </form>

                    {/* Back to login */}
                    <div className="mt-4 text-center">
                        <p className="text-sm text-neutral-500">
                            Already have an account?{" "}
                            <button type="button" onClick={onBackToLogin} className="text-neutral-900 font-semibold hover:underline">
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>

                <p className="text-sm text-neutral-500 text-center mt-5">
                    Ministry of Health, Malawi · Outbreak Response Division
                </p>
            </div>
        </div>
    );
}
