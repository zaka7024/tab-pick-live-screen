"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ImageIcon, Loader2, Check, Sparkles } from "lucide-react"

interface GeneratedImage {
  id: string
  url: string
  prompt: string
  createdAt: string
  isActive: boolean
}

export default function ProductBannerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [bannerPrompt, setBannerPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock product data - in real app, fetch from API
  const productName = "Wireless Headphones Pro"

  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([
    {
      id: "1",
      url: "/wireless-headphones.png",
      prompt: "Professional product photo of wireless headphones on white background",
      createdAt: "2024-01-15",
      isActive: true,
    },
    {
      id: "2",
      url: "/wireless-headphones-lifestyle-shot.jpg",
      prompt: "Lifestyle shot of wireless headphones being worn outdoors",
      createdAt: "2024-01-14",
      isActive: false,
    },
    {
      id: "3",
      url: "/wireless-headphones-studio-lighting.jpg",
      prompt: "Studio lighting product shot with dramatic shadows",
      createdAt: "2024-01-13",
      isActive: false,
    },
  ])

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate AI generation
    setTimeout(() => {
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url: `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(bannerPrompt || productName)}`,
        prompt: bannerPrompt,
        createdAt: new Date().toISOString().split("T")[0],
        isActive: false,
      }
      setGeneratedImages([newImage, ...generatedImages])
      setBannerPrompt("")
      setIsGenerating(false)
    }, 2000)
  }

  const handleSetActive = (id: string) => {
    setGeneratedImages(generatedImages.map((img) => ({ ...img, isActive: img.id === id })))
  }

  const quickPrompts = [
    "Professional product photo on white background with soft lighting",
    "Lifestyle shot in modern minimalist setting",
    "Close-up detail shot with dramatic lighting",
    "Product in use by person in natural environment",
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/products")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Product Banner Generator</h1>
          <p className="text-muted-foreground mt-2">{productName}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Generation Panel */}
        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-4">Generate New Banner</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt" className="text-foreground">
                AI Prompt
              </Label>
              <Textarea
                id="prompt"
                value={bannerPrompt}
                onChange={(e) => setBannerPrompt(e.target.value)}
                placeholder={`Describe the product image you want to generate...\n\nExample: "Professional product photo of ${productName} on a clean white background with soft lighting"`}
                className="bg-secondary border-border text-foreground min-h-[120px]"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !bannerPrompt.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Generate Banner
                </>
              )}
            </Button>

            <div className="pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-4 w-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Quick Prompts</h3>
              </div>
              <div className="space-y-2">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => setBannerPrompt(prompt)}
                    className="w-full text-left p-3 rounded-lg bg-secondary hover:bg-secondary/80 border border-border text-sm text-foreground transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg border border-border">
              <h4 className="text-sm font-semibold text-foreground mb-2">Tips for Better Results:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Be specific about the product appearance and setting</li>
                <li>Mention lighting, background, and composition preferences</li>
                <li>Include style keywords like "professional", "lifestyle", "minimalist"</li>
                <li>Specify the product angle or perspective you want</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Generated Images Gallery */}
        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Generated Images</h2>
              <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10">
                {generatedImages.length} images
              </Badge>
            </div>

            <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-2">
              {generatedImages.map((image) => (
                <Card
                  key={image.id}
                  className={`p-4 bg-secondary border-2 transition-all ${
                    image.isActive
                      ? "border-primary shadow-lg shadow-primary/20"
                      : "border-border hover:border-border/60"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt={image.prompt}
                        className="w-full h-full object-cover"
                      />
                      {image.isActive && (
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-primary text-primary-foreground">
                            <Check className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-foreground line-clamp-2">{image.prompt}</p>
                      <p className="text-xs text-muted-foreground">Generated on {image.createdAt}</p>
                    </div>

                    {!image.isActive && (
                      <Button
                        onClick={() => handleSetActive(image.id)}
                        variant="outline"
                        size="sm"
                        className="w-full border-primary/30 text-primary hover:bg-primary/10"
                      >
                        Set as Active
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
