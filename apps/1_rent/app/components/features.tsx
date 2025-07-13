import { Shield, MessageCircle, CreditCard, Brain, Users, Lock } from "lucide-react"

const features = [
  {
    name: "Secure Authentication",
    description: "Multi-factor authentication with social login options for enhanced security.",
    icon: Lock,
  },
  {
    name: "Real-time Chat",
    description: "Encrypted messaging between renters and landlords with presence indicators.",
    icon: MessageCircle,
  },
  {
    name: "Secure Payments",
    description: "Escrow-based deposit handling with Stripe integration for safe transactions.",
    icon: CreditCard,
  },
  {
    name: "AI Price Analysis",
    description: "Get AI-powered rent price suggestions based on property details and market data.",
    icon: Brain,
  },
  {
    name: "User Management",
    description: "Comprehensive user profiles and verification system for trust building.",
    icon: Users,
  },
  {
    name: "Security Monitoring",
    description: "Advanced security monitoring with alerts and activity logging.",
    icon: Shield,
  },
]

export function Features() {
  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for secure rentals
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            RentHub provides all the tools needed for safe and transparent rental transactions.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">{feature.name}</p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
