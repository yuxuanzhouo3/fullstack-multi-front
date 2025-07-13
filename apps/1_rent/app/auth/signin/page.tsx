"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Facebook, MessageCircle, Eye, EyeOff, Mail } from "lucide-react" // Re-import Mail icon
// Remove Image import
import { useAuth } from "../../providers"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { signIn } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      await signIn(email, password)
      router.push("/dashboard")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const supabase = createClientComponentClient()

  const handleSocialSignIn = async (provider: "google" | "facebook" | "apple") => {
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

  const handleExternalSocialSignIn = (platform: "tiktok" | "wechat") => {
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
          <CardTitle className="text-2xl font-bold text-center">Sign In to RentHub</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
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
              className="w-full bg-white text-gray-800 border border-gray-300 hover:bg-gray-100"
              onClick={() => handleSocialSignIn("google")}
            >
              <Mail className="h-4 w-4 mr-2" /> {/* Reverted to Mail icon */}
              <span className="text-sm">Google</span>
            </Button>
            <Button
              className="w-full bg-[#1877F2] text-white hover:bg-[#1877F2]/90"
              onClick={() => handleSocialSignIn("facebook")}
            >
              <Facebook className="h-4 w-4 mr-2" />
              <span className="text-sm">Facebook</span>
            </Button>
            <Button
              className="w-full bg-black text-white hover:bg-black/90"
              onClick={() => handleExternalSocialSignIn("tiktok")}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">TikTok</span>
            </Button>
            <Button
              className="w-full bg-[#07C160] text-white hover:bg-[#07C160]/90"
              onClick={() => handleExternalSocialSignIn("wechat")}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">WeChat</span>
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </div>

          <div className="text-center text-sm">
            <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
              Forgot your password?
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
