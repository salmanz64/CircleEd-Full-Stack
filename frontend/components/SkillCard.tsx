import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TokenBadge } from "@/components/TokenBadge"
import { Star, User, TrendingUp, Clock } from "lucide-react"
import Image from "next/image"

interface SkillCardProps {
  id: string
  title: string
  teacherName: string
  teacherAvatar?: string
  rating: number
  reviewCount: number
  tokensPerSession: number
  category: string
  level: string
  language: string
}

const levelColors = {
  Beginner: "from-indigo-400 to-indigo-600",
  Intermediate: "from-indigo-500 to-purple-600",
  Advanced: "from-purple-500 to-indigo-600",
}

const categoryIcons = {
  Programming: "💻",
  Design: "🎨",
  Business: "📊",
  Languages: "🌍",
  Music: "🎵",
  Fitness: "💪",
  "Art & Craft": "✏️",
  Photography: "📸",
  Writing: "✍️",
  Marketing: "📢",
}

export function SkillCard({
  id,
  title,
  teacherName,
  teacherAvatar,
  rating,
  reviewCount,
  tokensPerSession,
  category,
  level,
  language,
}: SkillCardProps) {
  const gradientClass = levelColors[level as keyof typeof levelColors] || "from-indigo-400 to-indigo-600"
  const categoryIcon = categoryIcons[category as keyof typeof categoryIcons] || "⭐"
  
  return (
    <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full bg-white">
      {/* Gradient Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      {/* Level Badge with Gradient */}
      <div className={`absolute top-4 right-4 bg-gradient-to-r ${gradientClass} text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg`}>
        {level}
      </div>

      <CardHeader className="pb-2 relative z-10 pt-10">
        <div className="flex items-start gap-2 mb-2">
          <div className="flex-1">
            <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {title}
            </h3>
            <p className="text-xs text-gray-500 font-medium">{category}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative z-10">
        {/* Teacher Info with Enhanced Styling */}
        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl">
          {teacherAvatar ? (
            <Image
              src={teacherAvatar}
              alt={teacherName}
              width={48}
              height={48}
              className="rounded-full ring-2 ring-indigo-200 w-12 h-12 object-cover"
            />
          ) : (
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${gradientClass} flex items-center justify-center ring-2 ring-indigo-200`}>
              <User className="h-6 w-6 text-white" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-gray-900 truncate">{teacherName}</p>
            <div className="flex items-center gap-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-xs font-semibold text-gray-700 ml-1">
                {rating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-indigo-50 rounded-lg border border-indigo-100">
            <Clock className="h-4 w-4 text-indigo-600" />
            <span className="text-xs text-indigo-900 font-medium">{language}</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg border border-purple-100">
            <TrendingUp className="h-4 w-4 text-purple-600" />
            <span className="text-xs text-purple-900 font-medium">{reviewCount} reviews</span>
          </div>
        </div>

        {/* Token Price with Badge */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-600 font-semibold">Token Price</span>
          <TokenBadge amount={tokensPerSession} />
        </div>
      </CardContent>

      <CardFooter className="pt-2 relative z-10">
        <Button 
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300" 
          asChild
        >
          <Link href={`/marketplace/${id}`}>
            View Details & Book
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}


