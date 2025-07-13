"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../providers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, MapPin, Home, DollarSign, Calendar } from "lucide-react"

interface AnalysisResult {
  id: string
  property_type: string
  location: string
  suggested_rent: number
  market_average: number
  confidence: number
  factors: string[]
  date: string
}

export default function AIAnalysisPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [formData, setFormData] = useState({
    property_type: "",
    bedrooms: "",
    bathrooms: "",
    square_feet: "",
    location: "",
    amenities: "",
    condition: "",
  })

  const previousAnalyses: AnalysisResult[] = [
    {
      id: "1",
      property_type: "2-bedroom apartment",
      location: "Downtown Seattle",
      suggested_rent: 2800,
      market_average: 2650,
      confidence: 92,
      factors: ["Prime location", "Recent renovations", "High demand area"],
      date: "2024-01-15",
    },
    {
      id: "2",
      property_type: "1-bedroom condo",
      location: "Capitol Hill",
      suggested_rent: 2200,
      market_average: 2100,
      confidence: 88,
      factors: ["Walkable neighborhood", "Good transit access", "Pet-friendly"],
      date: "2024-01-10",
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate AI analysis
    await new Promise((resolve) => setTimeout(resolve, 3000))

    const mockResult: AnalysisResult = {
      id: Date.now().toString(),
      property_type: `${formData.bedrooms}-bedroom ${formData.property_type}`,
      location: formData.location,
      suggested_rent: Math.floor(Math.random() * 1000) + 2000,
      market_average: Math.floor(Math.random() * 800) + 1800,
      confidence: Math.floor(Math.random() * 20) + 80,
      factors: ["Market demand analysis", "Comparable properties", "Location premium", "Property condition assessment"],
      date: new Date().toISOString().split("T")[0],
    }

    setResult(mockResult)
    setLoading(false)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access AI analysis</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">AI Rent Analysis</h1>
            <p className="mt-2 text-gray-600 flex items-center">
              <Brain className="h-4 w-4 mr-2 text-blue-500" />
              Get AI-powered rent price suggestions based on market data
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Analysis Form */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>Provide property information for accurate analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="property_type">Property Type</Label>
                      <Select
                        value={formData.property_type}
                        onValueChange={(value) => handleInputChange("property_type", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="condo">Condo</SelectItem>
                          <SelectItem value="townhouse">Townhouse</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Select value={formData.bedrooms} onValueChange={(value) => handleInputChange("bedrooms", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="studio">Studio</SelectItem>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4+">4+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Select
                        value={formData.bathrooms}
                        onValueChange={(value) => handleInputChange("bathrooms", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="1.5">1.5</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="2.5">2.5</SelectItem>
                          <SelectItem value="3+">3+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="square_feet">Square Feet</Label>
                      <Input
                        id="square_feet"
                        type="number"
                        placeholder="e.g., 1200"
                        value={formData.square_feet}
                        onChange={(e) => handleInputChange("square_feet", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Downtown Seattle, WA"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amenities">Amenities</Label>
                    <Textarea
                      id="amenities"
                      placeholder="List key amenities (parking, gym, pool, etc.)"
                      value={formData.amenities}
                      onChange={(e) => handleInputChange("amenities", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Property Condition</Label>
                    <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excellent">Excellent</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                        <SelectItem value="needs_work">Needs Work</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" className="w-full" disabled={loading}>
                    <Brain className="h-4 w-4 mr-2" />
                    {loading ? "Analyzing..." : "Get AI Analysis"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            <div className="space-y-6">
              {result && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                      Analysis Results
                    </CardTitle>
                    <CardDescription>AI-generated rent recommendation</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <DollarSign className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <p className="text-2xl font-bold text-blue-600">${result.suggested_rent.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Suggested Rent</p>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <Home className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                        <p className="text-2xl font-bold text-gray-600">${result.market_average.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">Market Average</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <span className="text-sm font-medium">Confidence Score</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {result.confidence}%
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Key Factors</h4>
                      <div className="space-y-2">
                        {result.factors.map((factor, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                            {factor}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {result.location}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Previous Analyses */}
              <Card>
                <CardHeader>
                  <CardTitle>Previous Analyses</CardTitle>
                  <CardDescription>Your recent AI rent analyses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {previousAnalyses.map((analysis) => (
                      <div key={analysis.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{analysis.property_type}</h4>
                          <Badge variant="outline">{analysis.confidence}% confidence</Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {analysis.location}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {analysis.date}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-blue-600">
                            ${analysis.suggested_rent.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">
                            Market avg: ${analysis.market_average.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
