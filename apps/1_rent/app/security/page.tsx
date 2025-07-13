"use client"

import { useState } from "react"
import { useAuth } from "../providers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Smartphone,
  Lock,
  Eye,
  Activity,
  MapPin,
  Calendar,
} from "lucide-react"

interface SecurityEvent {
  id: string
  type: "login" | "password_change" | "failed_login" | "2fa_enabled" | "suspicious_activity"
  description: string
  timestamp: string
  location: string
  device: string
  status: "success" | "warning" | "danger"
}

export default function SecurityPage() {
  const { user } = useAuth()
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [smsAlerts, setSmsAlerts] = useState(false)

  const securityEvents: SecurityEvent[] = [
    {
      id: "1",
      type: "login",
      description: "Successful login",
      timestamp: "2024-01-15 10:30 AM",
      location: "Seattle, WA",
      device: "Chrome on Windows",
      status: "success",
    },
    {
      id: "2",
      type: "failed_login",
      description: "Failed login attempt",
      timestamp: "2024-01-15 09:45 AM",
      location: "Unknown location",
      device: "Unknown device",
      status: "warning",
    },
    {
      id: "3",
      type: "password_change",
      description: "Password changed successfully",
      timestamp: "2024-01-14 03:20 PM",
      location: "Seattle, WA",
      device: "Safari on iPhone",
      status: "success",
    },
    {
      id: "4",
      type: "suspicious_activity",
      description: "Multiple login attempts from new location",
      timestamp: "2024-01-13 11:15 PM",
      location: "New York, NY",
      device: "Firefox on Linux",
      status: "danger",
    },
  ]

  const getEventIcon = (type: string, status: string) => {
    if (status === "danger") return <AlertTriangle className="h-4 w-4 text-red-500" />
    if (status === "warning") return <Clock className="h-4 w-4 text-yellow-500" />
    return <CheckCircle className="h-4 w-4 text-green-500" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "danger":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access security settings</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Security Dashboard</h1>
            <p className="mt-2 text-gray-600 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              Monitor and manage your account security
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="activity">Activity Log</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Security Score</CardTitle>
                    <Shield className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">98%</div>
                    <p className="text-xs text-muted-foreground">Excellent security</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2</div>
                    <p className="text-xs text-muted-foreground">Current devices</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Last Login</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2h ago</div>
                    <p className="text-xs text-muted-foreground">Seattle, WA</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Status</CardTitle>
                    <CardDescription>Current security configuration</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Lock className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">Strong Password</p>
                          <p className="text-sm text-gray-500">Last changed 2 days ago</p>
                        </div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">{twoFactorEnabled ? "Enabled" : "Not enabled"}</p>
                        </div>
                      </div>
                      {twoFactorEnabled ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Eye className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">Account Monitoring</p>
                          <p className="text-sm text-gray-500">Active surveillance</p>
                        </div>
                      </div>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent Security Events</CardTitle>
                    <CardDescription>Latest security-related activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {securityEvents.slice(0, 4).map((event) => (
                        <div key={event.id} className="flex items-center space-x-3">
                          {getEventIcon(event.type, event.status)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{event.description}</p>
                            <p className="text-xs text-gray-500">{event.timestamp}</p>
                          </div>
                          <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Authentication Settings</CardTitle>
                    <CardDescription>Manage your login and authentication preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                      </div>
                      <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                    </div>

                    <div className="space-y-4">
                      <Button className="w-full">
                        <Lock className="h-4 w-4 mr-2" />
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent">
                        <Smartphone className="h-4 w-4 mr-2" />
                        Manage Devices
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Configure how you receive security alerts</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-medium">Email Alerts</p>
                        <p className="text-sm text-gray-500">Receive security notifications via email</p>
                      </div>
                      <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="font-medium">SMS Alerts</p>
                        <p className="text-sm text-gray-500">Receive critical alerts via text message</p>
                      </div>
                      <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Security Activity Log</CardTitle>
                  <CardDescription>Complete history of security-related events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {securityEvents.map((event) => (
                      <div key={event.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3">
                            {getEventIcon(event.type, event.status)}
                            <div>
                              <p className="font-medium">{event.description}</p>
                              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  {event.timestamp}
                                </span>
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {event.location}
                                </span>
                              </div>
                              <p className="text-xs text-gray-400 mt-1">{event.device}</p>
                            </div>
                          </div>
                          <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Security Alert:</strong> We detected a failed login attempt from an unrecognized device. If
                    this wasn't you, please change your password immediately.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Security Update:</strong> Your password was successfully changed 2 days ago.
                  </AlertDescription>
                </Alert>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Alert Preferences</CardTitle>
                  <CardDescription>Customize when and how you receive security alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Failed login attempts</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>New device logins</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Password changes</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Suspicious activity</span>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
