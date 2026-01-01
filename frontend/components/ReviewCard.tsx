import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ReviewCardProps {
  reviewerName: string
  reviewerAvatar?: string
  rating: number
  comment: string
  date?: string | Date
}

export function ReviewCard({
  reviewerName,
  reviewerAvatar,
  rating,
  comment,
  date,
}: ReviewCardProps) {
  // Format the date for display
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'Recently'

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {reviewerAvatar ? (
            <Image
              src={reviewerAvatar}
              alt={reviewerName}
              width={48}
              height={48}
              className="rounded-full"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold">
              {reviewerName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-900">{reviewerName}</p>
                <p className="text-xs text-gray-500">{formattedDate}</p>
              </div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700">{comment}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

