import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-md text-center">
        <CardContent className="pt-6">
          <h2 className="text-2xl font-bold mb-2">Skill Not Found</h2>
          <p className="text-gray-600 mb-6">
            The skill you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/marketplace">Back to Marketplace</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

