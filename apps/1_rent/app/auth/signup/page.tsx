"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"
import { useAuth } from "../../providers"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Eye, EyeOff, Facebook, MessageCircle, Mail } from "lucide-react" // Re-import Mail icon
// Remove Image import

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [userType, setUserType] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const { signUp } = useAuth()
  const supabase = createClientComponentClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    try {
      await signUp({ email, password, userType })
      setSuccess("Check your email for the confirmation link!")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialSignUp = async (provider: "google" | "facebook" | "apple") => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })

    if (error) {
      setError(error.message)
    }
  }

  const handleExternalSocialSignUp = (platform: "tiktok" | "wechat") => {
    const urls = {
      tiktok: "https://www.tiktok.com/auth/authorize/",
      wechat: "https://open.weixin.qq.com/connect/oauth2/authorize",
    }

    window.open(urls[platform], "_blank")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Join RentHub</CardTitle>
          <CardDescription className="text-center">Create your account to get started</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userType">I am a</Label>
              <Select value={userType} onValueChange={setUserType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="renter">Renter</SelectItem>
                  <SelectItem value="landlord">Landlord</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"} // Use the same showPassword state for consistency
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => handleSocialSignUp("google")}
              className="w-full bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
            >
              <Mail className="h-4 w-4 mr-2" /> {/* Reverted to Mail icon */}
              <span className="text-sm">Google</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialSignUp("facebook")}
              className="w-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
            >
              <Facebook className="h-4 w-4 mr-2" />
              <span className="text-sm">Facebook</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExternalSocialSignUp("tiktok")}
              className="w-full bg-black text-white hover:bg-black/90"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">TikTok</span>
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExternalSocialSignUp("wechat")}
              className="w-full bg-[#07C160] text-white hover:bg-[#07C160]/90"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">WeChat</span>
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link href="/auth/signin" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignUpPage
