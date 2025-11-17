import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const setUserType = useStore((state) => state.setUserType);
  const userType = useStore((state) => state.userType);
  const profile = useStore((state) => state.profile);
  const setProfile = useStore((state) => state.setProfile);
  const router = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (data.user !== null) {
        // Successful login
        const { data: profileData, error } = await supabase
          .from("profiles")
          .select("*");
        if (error) {
          if (error instanceof Error) alert(error.message);
        } else if (profileData) {
          console.log("Profile Data:", profileData);
          setProfile(profileData as any);
          if (profileData[0].usertype === "Buyer") {
            setUserType("Buyer");
            router("/marketplace"); // or wherever you want to redirect
          } else {
            setUserType("Farmer");
            router("/dashboard"); // or wherever you want to redirect
          }
        }
        console.log(data);
      } else {
        // Handle error
        // toast({
        //   variant: "destructive",
        //   title: "Error",
        //   description: data.error || "Login failed"
        // });
        console.error("Login failed:", error);
      }
    } catch (error: any) {
      alert("Login error: " + error.message);
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
      console.log("User type", userType);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name, e.target.value);

    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <main className="flex min-h-screen">
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-100 shadow-2xl">
        <div className="w-full max-w-md lg:bg-white rounded-2xl lg:p-10">
          {/* Header  */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Login into your Account
            </h2>
            <p className="text-gray-600">
              Welcome back! Select method to login{" "}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input  */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Password Input  */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            {/* Remember Me & Forgot Password  */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Remember me</span>
              </label>
              <a
                href={"/forgot-password"}
                className="text-sm text-green-600 hover:text-green-700"
              >
                Forgotten Password?
              </a>
            </div>

            {/* Login Button  */}
            <button
              type="submit"
              className="w-full flex bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition- cursor-pointer items-center justify-center"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider  */}
          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gray-50 text-gray-500">
                or continue with
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {/* Metamask Button */}
            {/* <button
              onClick={handleMetamaskLogin}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M21.5 12L19 15.5L17 13.5L19.5 9.5L21.5 12Z"
                  fill="#E17726"
                />
                <path
                  d="M2.5 12L5 15.5L7 13.5L4.5 9.5L2.5 12Z"
                  fill="#E27625"
                />
              </svg>
              <span className="font-medium text-gray-700">
                Sign in with metamask
              </span>
            </button> */}

            {/* Google Button */}
            <button
              // onClick={""}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-medium text-gray-700">
                Sign in with Google
              </span>
            </button>
          </div>

          <p className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{" "}
            <a
              href="/register"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;
