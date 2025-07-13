"use client"

import { useAuth } from "../providers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, CreditCard, Shield, Brain, Plus, Home } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access your dashboard</h1>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  const userType = user.user_metadata?.user_type || "renter"

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.email}</h1>
            <p className="mt-2 text-gray-600">
              <Badge variant="secondary" className="mr-2">
                {userType === "renter" ? "Renter" : "Landlord"}
              </Badge>
              Here's what's happening with your rentals today.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Chats</CardTitle>
                <MessageCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">+2 from last week</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {userType === "renter" ? "Deposits Paid" : "Deposits Received"}
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$2,400</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98%</div>
                <p className="text-xs text-muted-foreground">Excellent security</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Analyses</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks for {userType === "renter" ? "renters" : "landlords"}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userType === "renter" ? (
                  <>
                    <Link href="/properties/search">
                      <Button className="w-full justify-start">
                        <Home className="h-4 w-4 mr-2" />
                        Search Properties
                      </Button>
                    </Link>
                    <Link href="/ai-analysis">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <Brain className="h-4 w-4 mr-2" />
                        Get Rent Analysis
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/properties/add">
                      <Button className="w-full justify-start">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Property
                      </Button>
                    </Link>
                    <Link href="/tenants/manage">
                      <Button variant="outline" className="w-full justify-start bg-transparent">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Manage Tenants
                      </Button>
                    </Link>
                  </>
                )}
                <Link href="/chat">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Open Chat
                  </Button>
                </Link>
                <Link href="/payments">
                  <Button variant="outline" className="w-full justify-start bg-transparent">
                    <CreditCard className="h-4 w-4 mr-2" />
                    View Payments
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest interactions and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Deposit payment received</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">New message from landlord</p>
                      <p className="text-xs text-muted-foreground">5 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">AI analysis completed</p>
                      <p className="text-xs text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
