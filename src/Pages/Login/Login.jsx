import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(email, password);
    if (result.success) {
      navigate("/");
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      {/* Left Side - Image + Quote (Hidden on mobile, visible on medium screens and up) */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <img
          src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNWNmaXlyeWR6Y2VtcGowY3k0ZThrYWlzZTA1eG1rYjZhM2M2cTA4OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/aPjiWa9dUtBC/giphy.gif"
          alt="Traveler in Andaman"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-30 flex flex-col justify-end p-8 text-white">
          <blockquote className="text-xl md:text-2xl font-light mb-4">
            Explore the World, One Journey at a Time.
          </blockquote>
          <p className="text-sm opacity-90">— Make Andaman Travel</p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4 sm:p-8">
        <Card className="w-full max-w-sm mx-auto shadow-lg"> {/* Adjusted max-w-md to max-w-sm for better mobile fit */}
          <CardHeader className="text-center"> {/* Centered header text */}
            <CardTitle className="text-2xl font-bold">Welcome back to Make Andaman Travel</CardTitle>
            <CardDescription>
              Plan your island escape with our seamless booking experience.
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="text-red-500 text-sm p-2 bg-red-50 rounded">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="alex.jordan@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked)}
                  />
                  <Label htmlFor="remember" className="text-sm">
                    Remember me
                  </Label>
                </div>
                <Button variant="link" className="p-0 text-sm"> {/* Reduced padding for link button */}
                  Forgot password?
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700">
                Log In
              </Button>
              <div className="relative w-full flex items-center justify-center my-2"> {/* Added margin to OR divider */}
                <span className="absolute bg-white px-3 text-sm text-gray-500">OR</span>
                <hr className="w-full border-t border-gray-300" />
              </div>
              <Button
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"></path>
                </svg>
                Continue with Google
              </Button>
              <p className="text-sm text-center text-gray-600">
                Don't have an account?{" "}
                <Button variant="link" className="p-0 text-sm" onClick={() => navigate('/signup')}>
                  Sign up
                </Button>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}