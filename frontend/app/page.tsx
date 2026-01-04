"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PrimaryButton } from "@/components/PrimaryButton"
import { Card, CardContent } from "@/components/ui/card"
import {
  GraduationCap,
  Users,
  Coins,
  MessageSquare,
  TrendingUp,
  Clock,
  Award,
  ArrowRight,
  CheckCircle,
  Star,
  Sparkles
} from "lucide-react"
import { useAuthRedirect } from "@/lib/useAuthRedirect"

export default function HomePage() {
  useAuthRedirect()
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 md:py-32 text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            <span>Join 10,000+ learners worldwide</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Learn. Teach.{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Grow.
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-2xl mx-auto">
            Exchange skills with peers using tokens. Join CircleEd and start your learning journey today.
          </p>
          <p className="text-lg text-gray-500 mb-10">
            Build your skills, earn tokens, and connect with a global community of learners
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <PrimaryButton asChild size="lg" className="text-lg px-8 py-6">
              <Link href="/register" className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </PrimaryButton>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Free to start</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto px-4 py-16 bg-white/50 backdrop-blur-sm rounded-2xl mb-20 max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">10K+</div>
            <div className="text-gray-600">Active Learners</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
            <div className="text-gray-600">Expert Teachers</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50K+</div>
            <div className="text-gray-600">Sessions Completed</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-bold text-primary mb-2">4.9</div>
            <div className="text-gray-600 flex items-center justify-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              Average Rating
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 py-16 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose CircleEd?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to learn, teach, and grow in one platform
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Peer-to-Peer Learning</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with teachers and learners from around the world. Learn from real people with real experience.
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Coins className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Token System</h3>
              <p className="text-gray-600 leading-relaxed">
                Earn tokens by teaching, spend them to learn new skills. A fair exchange that benefits everyone.
              </p>
            </CardContent>
          </Card>
          <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-lg">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageSquare className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">Easy Communication</h3>
              <p className="text-gray-600 leading-relaxed">
                Chat with teachers, schedule sessions, and track your progress all in one place.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="container mx-auto px-4 py-16 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in three simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="relative">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Sign Up & Explore</h3>
              <p className="text-gray-600">
                Create your free account and browse thousands of skills available to learn
              </p>
            </div>
            <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent -z-10"></div>
          </div>
          <div className="relative">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Book a Session</h3>
              <p className="text-gray-600">
                Choose a teacher, pick a time slot, and use tokens to book your learning session
              </p>
            </div>
            <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary to-transparent -z-10"></div>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
              3
            </div>
            <h3 className="text-xl font-semibold mb-3">Learn & Earn</h3>
            <p className="text-gray-600">
              Attend your session, learn new skills, and earn tokens by teaching others
            </p>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="container mx-auto px-4 py-16 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Community Says
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[
            {
              name: "Sarah Chen",
              role: "Learned Spanish",
              content: "CircleEd changed how I learn languages. The token system is brilliant and my teacher Maria is amazing!",
              rating: 5
            },
            {
              name: "James Wilson",
              role: "Teaching Guitar",
              content: "I love teaching on CircleEd. It's rewarding to share my passion and earn tokens at the same time.",
              rating: 5
            },
            {
              name: "Emma Thompson",
              role: "Learned Design",
              content: "The best learning platform I've used. The sessions are flexible and the community is supportive.",
              rating: 5
            }
          ].map((testimonial, idx) => (
            <Card key={idx} className="border-2">
              <CardContent className="p-6">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.content}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20 mb-20">
        <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-0">
          <CardContent className="p-12 text-center">
            <Award className="h-16 w-16 mx-auto mb-6 text-white/90" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of learners and teachers building skills together. Start your journey today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" variant="secondary" className="text-lg px-8 py-6">
                <Link href="/register">Get Started Free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white/10">
                <Link href="/marketplace">Browse Skills</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

