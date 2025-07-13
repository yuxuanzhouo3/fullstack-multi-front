import { Hero } from "./components/hero"
import { Features } from "./components/features"
import { Navigation } from "./components/navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navigation />
      <Hero />
      <Features />
    </div>
  )
}
