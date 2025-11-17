import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Sprout } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { unstable_OneTimePasswordField as OneTimePasswordField } from "radix-ui";

import { useStore } from "@/lib/store";

// Types
type UserType = "Buyer" | "Farmer";

interface FormData {
  farmName: string;
  batchName: string;
  deviceId: string;
  breedType: string;
  numberOfChickens: string;
  location: string;
}

interface StepConfig {
  id: number;
  label: string;
}

export default function LoginStepper() {
  const router = useNavigate();

  // Store
  const userType = useStore((state) => state.userType);
  const setUserType = useStore((state) => state.setUserType);
  const profile = useStore((state) => state.profile);
  const setProfile = useStore((state) => state.setProfile);

  // State
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    farmName: "",
    batchName: "",
    deviceId: "",
    breedType: "",
    numberOfChickens: "",
    location: "",
  });

  // Computed values
  const showWalletCreation =
    step === 4 && (userType === "Buyer" || !walletAddress);
  const showFarmRegistration =
    step === 4 && userType === "Farmer" && walletAddress;

  const steps: StepConfig[] = [
    { id: 1, label: "Create Account" },
    { id: 2, label: "Verify your Email" },
  ];

  // Navigation
  const nextStep = useCallback(() => {
    setStep((prev) => Math.min(prev + 1, steps.length));
  }, [steps.length]);

  const prevStep = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1));
  }, []);

  // Form handlers
  const handleFormChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  // Validation
  const validateSignupForm = useCallback((): string | null => {
    if (!email.trim()) return "Please enter your email";
    if (!displayName.trim()) return "Please enter you user-name";
    if (!password) return "Please enter your password";
    if (password.length < 6) return "Password must be at least 6 characters";
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  }, [displayName, email, password, confirmPassword]);

  // Sign Up
  const handleSignUp = useCallback(async () => {
    const validationError = validateSignupForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: "http://localhost:8080/register",
        },
      });

      if (signUpError) throw signUpError;

      const signUpUser = data?.user;
      if (!signUpUser) {
        throw new Error("Sign up completed but no user was returned");
      }

      // Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: signUpUser.id,
        display_name: displayName,
      });

      // if (profileError) throw profileError;

      setError(null);
      nextStep(); // Move to "Verify Email" step
    } catch (err: any) {
      setError(err.message || "Failed to create account");
      console.error("Signup error:", err);
    } finally {
      setLoading(false);
    }
  }, [email, password, displayName, userType, nextStep, validateSignupForm]);

  // Fetch user profile and determine step
  const fetchUserProfile = useCallback(
    async (currentUser: User) => {
      try {
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*");

        if (error) throw error;

        if (profileData[0]?.usertype) {
          setProfile(profileData as any);
          setUserType(profileData[0]?.usertype as UserType);
          setStep(2);
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    },
    [setUserType]
  );

  // Auth state listener
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser && event === "SIGNED_IN") {
          // await fetchUserProfile(currentUser);
          console.log("Signed In");
          router("/dashboard");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
    };

    checkSession();
  }, [fetchUserProfile]);

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col lg:flex-row w-full max-w-screen mx-auto gap-4 min-h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Desktop Stepper */}
        <div className="hidden lg:block lg:w-[450px] lg:min-w-[400px] border-r bg-[#F2F2F2] p-8 rounded-l-md">
          <Link to="/" className="flex items-center space-x-2">
            <Sprout className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">AgriPal</span>
          </Link>

          <div className="relative ml-4 mt-[60px]">
            {steps.map((item, index) => (
              <div key={item.id} className="relative flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <img
                    src={step >= item.id ? "/Ellipse 74.svg" : "/Ellipse2.svg"}
                    alt="step indicator"
                    className="m-2 mx-auto h-11"
                    width={100}
                    height={100}
                  />
                  {index < steps.length - 1 && (
                    <img
                      src={step > item.id ? "/Vector 1.svg" : "/Vector 2.svg"}
                      alt="connector line"
                      className="m-2 mx-auto h-11"
                      width={19}
                      height={10}
                    />
                  )}
                </div>
                <span
                  className={`${
                    step >= item.id
                      ? "mt-[-30px] text-black-700 font-medium"
                      : "mt-[-30px] text-gray-500"
                  }`}
                >
                  <div className="flex flex-col">
                    <span>Step {item.id}</span>
                    <span>{item.label}</span>
                  </div>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Step Indicator */}
        <div className="lg:hidden bg-white px-4 pt-6 pb-2">
          <Link to="/" className="flex items-center justify-center">
            <Sprout className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold">AgriPal</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            {steps.map((item, index) => (
              <div key={item.id} className="flex items-center">
                <div
                  className={`h-2 w-2 rounded-full ${
                    step >= item.id ? "bg-green-600" : "bg-gray-300"
                  }`}
                />
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 w-8 sm:w-12 ${
                      step > item.id ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-600">
            Step {step} of {steps.length}: {steps[step - 1].label}
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex lg:items-center justify-center p-4 sm:p-6 lg:p-8">
          {/* Error Display */}
          {error && (
            <div className="absolute top-4 right-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-md">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Step 2: Create Account */}
          {step === 1 && (
            <div className="space-y-4 w-full max-w-md mx-auto">
              <h2 className="text-xl sm:text-2xl text-center font-semibold">
                Create Your Account
              </h2>
              <p className="text-center text-sm sm:text-base text-[#6E6E6E]">
                Let's get you set up, your journey starts here.
              </p>
              <input
                type="name"
                placeholder="Enter your username"
                value={displayName}
                className="w-full rounded-md border px-3 py-2 focus:outline-green-600"
                onChange={(e) => setDisplayName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                className="w-full rounded-md border px-3 py-2 focus:outline-green-600"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                className="w-full rounded-md border px-3 py-2 focus:outline-green-600"
                onChange={(e) => setPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Repeat your password"
                value={confirmPassword}
                className="w-full rounded-md border px-3 py-2 focus:outline-green-600"
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 cursor-pointer flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Create account"
                )}
              </button>

              <div className="w-full flex justify-center items-center">
                <p className="text-sm sm:text-base">
                  Have an account already?
                  <span
                    className="text-blue-700 ml-2 cursor-pointer hover:underline"
                    onClick={() => router("/login")}
                  >
                    Login
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Verify Email */}
          {step === 2 && (
            <div className="space-y-4 w-full max-w-md mx-auto flex flex-col items-center">
              <h2 className="text-xl sm:text-2xl text-center font-semibold">
                Verify your Email
              </h2>
              <p className="text-center text-sm sm:text-base text-[#6E6E6E] px-4">
                Account activation link has been sent to the e-mail address you
                provided
              </p>
              <div className="flex flex-col gap-6 items-center justify-center w-full px-4">
                <div className="relative w-full max-w-[400px] h-[200px] sm:h-[250px]">
                  <img
                    src="/frame3.png"
                    className="object-contain"
                    alt="email verification"
                  />
                </div>
                <div>
                  <OneTimePasswordField.Root className="OTPRoot">
                    <OneTimePasswordField.Input className="OTPInput" />
                    <OneTimePasswordField.Input className="OTPInput" />
                    <OneTimePasswordField.Input className="OTPInput" />
                    <OneTimePasswordField.Input className="OTPInput" />
                    <OneTimePasswordField.Input className="OTPInput" />
                    <OneTimePasswordField.Input className="OTPInput" />
                    <OneTimePasswordField.HiddenInput />
                  </OneTimePasswordField.Root>
                </div>
                <p className="text-sm sm:text-base">
                  Didn't get the mail?{" "}
                  <span
                    className="text-blue-700 ml-2 cursor-pointer hover:underline"
                    onClick={() => {
                      prevStep();
                      setError("Please try signing up again");
                    }}
                  >
                    Resend
                  </span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper Component for User Type Selection
interface UserTypeCardProps {
  type: UserType;
  emoji: string;
  title: string;
  description: string;
  selected: boolean;
  onClick: () => void;
  bgColor?: string;
}

function UserTypeCard({
  type,
  emoji,
  title,
  description,
  selected,
  onClick,
  bgColor = "bg-green-100",
}: UserTypeCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full p-6 rounded-xl border-2 cursor-pointer transition-all hover:border-green-500 hover:shadow-lg ${
        selected ? "border-green-600 bg-green-50" : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 ${bgColor} rounded-full flex items-center justify-center text-2xl`}
          >
            {emoji}
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
            selected ? "border-green-600 bg-green-600" : "border-gray-300"
          }`}
        >
          {selected && (
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}
