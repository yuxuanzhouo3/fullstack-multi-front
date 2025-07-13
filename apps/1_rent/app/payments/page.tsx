"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../providers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CreditCard,
  Shield,
  DollarSign,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Smartphone,
  Wallet,
} from "lucide-react"

interface Payment {
  id: string
  amount: number
  status: "completed" | "pending" | "failed"
  type: "deposit" | "rent" | "refund"
  property: string
  date: string
  description: string
  payment_method: string
}

export default function PaymentsPage() {
  const { user } = useAuth()
  const [amount, setAmount] = useState("")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [loading, setLoading] = useState(false)

  const payments: Payment[] = [
    {
      id: "1",
      amount: 2000,
      status: "completed",
      type: "deposit",
      property: "123 Main St, Apt 4B",
      date: "2024-01-15",
      description: "Security deposit for rental agreement",
      payment_method: "Stripe",
    },
    {
      id: "2",
      amount: 1500,
      status: "pending",
      type: "rent",
      property: "123 Main St, Apt 4B",
      date: "2024-01-10",
      description: "Monthly rent payment",
      payment_method: "PayPal",
    },
    {
      id: "3",
      amount: 500,
      status: "completed",
      type: "refund",
      property: "456 Oak Ave, Unit 2A",
      date: "2024-01-05",
      description: "Partial deposit refund",
      payment_method: "WeChat Pay",
    },
  ]

  const paymentMethods = [
    { id: "stripe", name: "Stripe", icon: CreditCard },
    { id: "paypal", name: "PayPal", icon: Wallet },
    { id: "wechat", name: "WeChat Pay", icon: Smartphone },
    { id: "alipay", name: "Alipay", icon: Smartphone },
    { id: "card", name: "Credit/Debit Card", icon: CreditCard },
    { id: "platform", name: "Platform Deposit", icon: Shield },
  ]

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert(`Payment processed successfully via ${selectedPaymentMethod}!`)
    setLoading(false)
    setAmount("")
    setCardNumber("")
    setExpiryDate("")
    setCvv("")
    setSelectedPaymentMethod("")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access payments</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Payments & Deposits</h1>
            <p className="mt-2 text-gray-600 flex items-center">
              <Shield className="h-4 w-4 mr-2 text-green-500" />
              Secure payment processing with escrow protection
            </p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="make-payment">Make Payment</TabsTrigger>
              <TabsTrigger value="history">Payment History</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$2,000</div>
                    <p className="text-xs text-muted-foreground">Currently held in escrow</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$1,500</div>
                    <p className="text-xs text-muted-foreground">Processing within 24 hours</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">This Month</CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$3,500</div>
                    <p className="text-xs text-muted-foreground">Total transactions</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Your latest payment activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {payments.slice(0, 3).map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(payment.status)}
                          <div>
                            <p className="font-medium">{payment.description}</p>
                            <p className="text-sm text-gray-500">{payment.property}</p>
                            <p className="text-xs text-gray-400">via {payment.payment_method}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${payment.amount.toLocaleString()}</p>
                          <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="make-payment" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Make a Payment</CardTitle>
                    <CardDescription>Choose your preferred payment method</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePayment} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount</Label>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0.00"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Payment Method</Label>
                        <div className="grid grid-cols-3 gap-2">
                          {paymentMethods.map((method) => (
                            <Button
                              key={method.id}
                              type="button"
                              variant={selectedPaymentMethod === method.id ? "default" : "outline"}
                              className="h-16 flex flex-col items-center justify-center"
                              onClick={() => setSelectedPaymentMethod(method.id)}
                            >
                              <method.icon className="h-5 w-5 mb-1" />
                              <span className="text-xs">{method.name}</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {selectedPaymentMethod === "card" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input
                              id="cardNumber"
                              placeholder="1234 5678 9012 3456"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value)}
                              required
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="expiryDate">Expiry Date</Label>
                              <Input
                                id="expiryDate"
                                placeholder="MM/YY"
                                value={expiryDate}
                                onChange={(e) => setExpiryDate(e.target.value)}
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="cvv">CVV</Label>
                              <Input
                                id="cvv"
                                placeholder="123"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                        </>
                      )}

                      <Button type="submit" className="w-full" disabled={loading || !selectedPaymentMethod}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        {loading
                          ? "Processing..."
                          : `Pay with ${paymentMethods.find((m) => m.id === selectedPaymentMethod)?.name || "Selected Method"}`}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payment Security</CardTitle>
                    <CardDescription>How we protect your payments</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Escrow Protection</h4>
                        <p className="text-sm text-gray-600">
                          Deposits are held securely until lease agreements are finalized
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Multiple Payment Options</h4>
                        <p className="text-sm text-gray-600">
                          Support for Stripe, PayPal, WeChat Pay, Alipay, and more
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">256-bit Encryption</h4>
                        <p className="text-sm text-gray-600">All payment data is encrypted using bank-level security</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <h4 className="font-medium">PCI Compliance</h4>
                        <p className="text-sm text-gray-600">We meet the highest standards for payment security</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                  <CardDescription>Complete record of all your transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {payments.map((payment) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(payment.status)}
                          <div>
                            <p className="font-medium">{payment.description}</p>
                            <p className="text-sm text-gray-500">{payment.property}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-400">
                              <span>{payment.date}</span>
                              <span>•</span>
                              <span>via {payment.payment_method}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">${payment.amount.toLocaleString()}</p>
                          <Badge className={getStatusColor(payment.status)}>{payment.status}</Badge>
                        </div>
                      </div>
                    ))}
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
