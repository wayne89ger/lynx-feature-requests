
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { LogIn } from "lucide-react";

export default function AuthPage() {
  const { user, signInWithMicrosoft, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center">
            Sign in with your organizational account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button 
              onClick={signInWithMicrosoft} 
              className="w-full bg-[#2f2f2f] hover:bg-[#1f1f1f]"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign in with Microsoft
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
