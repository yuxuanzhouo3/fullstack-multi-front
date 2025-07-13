"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "../providers"
import { Home, Shield, MessageCircle, CreditCard, Brain, Settings } from "lucide-react"

export function Navigation() {
  const { user, signOut } = useAuth()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">RentHub</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    <Home className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="ghost" size="sm">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Chat
                  </Button>
                </Link>
                <Link href="/payments">
                  <Button variant="ghost" size="sm">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payments
                  </Button>
                </Link>
                <Link href="/ai-analysis">
                  <Button variant="ghost" size="sm">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Analysis
                  </Button>
                </Link>
                <Link href="/security">
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Security
                  </Button>
                </Link>
                <Button onClick={signOut} variant="outline" size="sm">
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
