"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft, ImageIcon, Loader2, Check, Upload, X, Package, Tag } from "lucide-react"
import { useProducts } from "@/app/hooks/useProducts"
import { Spinner } from "@/components/ui/spinner"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import {useTranslations} from 'next-intl';

type ImageType = "product" | "offer"

interface GeneratedOption {
  id: string
  url: string
  isSelected: boolean
}

export default function ProductImageGeneratorPage({ params }: { params: { id: string } }) {
  const t = useTranslations('ProductImageGenerator');
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const generatedImagesRef = useRef<HTMLDivElement>(null)
  const [imageType, setImageType] = useState<ImageType>("product")
  const [referenceImage, setReferenceImage] = useState<File | null>(null)
  const [referenceImagePreview, setReferenceImagePreview] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedOptions, setGeneratedOptions] = useState<GeneratedOption[]>([])
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const { products, isLoading: isLoadingProducts, updateProduct } = useProducts()
  const product = products?.find((p) => p.id === params.id)

  // Scroll to generated images when they are ready
  useEffect(() => {
    if (generatedOptions.length > 0 && !isGenerating) {
      // Use setTimeout to ensure DOM has updated and images are loaded
      setTimeout(() => {
        // Scroll to bottom of page to show all generated images
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        })
      }, 500)
    }
  }, [generatedOptions.length, isGenerating])

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert(t('uploadImageError'))
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert(t('fileSizeError'))
      return
    }

    setReferenceImage(file)
    const reader = new FileReader()
    reader.onloadend = () => {
      setReferenceImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleRemoveReferenceImage = () => {
    setReferenceImage(null)
    setReferenceImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleGenerate = async () => {
    if (!product) return

    setIsGenerating(true)
    setGeneratedOptions([])
    setSelectedOptionId(null)

    try {
      const formData = new FormData()

      if (referenceImage) {
        formData.append("referenceImage", referenceImage)
      }
      const apiImageType = imageType === "product" ? "single-product" : "offer"

      formData.append("productId", product.id)
      formData.append("imageType", apiImageType)

      const response = await fetch("/api/product-image-generations", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || t('generateError'))
      }

      const data = await response.json()

      if (data.payload?.generatedImageUrls) {
        const newOptions: GeneratedOption[] = data.payload.generatedImageUrls.map(
          (url: string, index: number) => ({
            id: `${data.payload.id}-${index + 1}`,
            url,
            isSelected: false,
          })
        )
        setGeneratedOptions(newOptions)
      } else {
        throw new Error(t('invalidResponse'))
      }
    } catch (error) {
      console.error("Error generating images:", error)
      alert(error instanceof Error ? error.message : t('generateErrorRetry'))
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSelectOption = (id: string) => {
    setSelectedOptionId(id)
    setGeneratedOptions(generatedOptions.map((opt) => ({ ...opt, isSelected: opt.id === id })))
  }

  const handleSave = async () => {
    if (!selectedOptionId || !product) return

    const selectedOption = generatedOptions.find((opt) => opt.id === selectedOptionId)
    if (!selectedOption) return

    try {
      setIsSaving(true)
      await updateProduct(product.id, {
        imageUrl: selectedOption.url,
      })

      router.push("/dashboard/products")
    } catch (error) {
      console.error("Error saving image:", error)
      alert(t('saveError'))
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoadingProducts) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Spinner className="h-8 w-8 mx-auto mb-4" />
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{t('notFound')}</p>
          <Button onClick={() => router.push("/dashboard/products")}>{t('goBack')}</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/dashboard/products")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">{product.name}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="p-6 bg-card border-border">
          <div className="space-y-6">
            {/* Image Type Selection */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">{t('imageType')}</Label>
              <RadioGroup value={imageType} onValueChange={(value) => setImageType(value as ImageType)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="product" id="product" />
                  <Label htmlFor="product" className="flex items-center gap-2 cursor-pointer">
                    <Package className="h-4 w-4" />
                    <span>{t('productImage')}</span>
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="offer" id="offer" />
                  <Label htmlFor="offer" className="flex items-center gap-2 cursor-pointer">
                    <Tag className="h-4 w-4" />
                    <span>{t('offerImage')}</span>
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-sm text-muted-foreground">
                {imageType === "product"
                  ? t('productImageDescription')
                  : t('offerImageDescription')}
              </p>
            </div>

            {/* Reference Image Upload */}
            <div className="space-y-3">
              <Label className="text-base font-semibold text-foreground">{t('referenceImage')}</Label>
              {!referenceImagePreview ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                    isDragging
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <Upload className={`h-8 w-8 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
                    <div className="text-center">
                      <Label htmlFor="reference-image" className="cursor-pointer">
                        <span className="text-sm font-medium text-primary hover:underline">
                          {t('clickToUpload')}
                        </span>
                        <span className="text-sm text-muted-foreground"> {t('dragAndDrop')}</span>
                      </Label>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('fileTypes')}
                      </p>
                    </div>
                    <input
                      ref={fileInputRef}
                      id="reference-image"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-muted border border-border">
                    <img
                      src={referenceImagePreview}
                      alt={t('referencePreview')}
                      className="w-full h-full object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveReferenceImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    {referenceImage?.name}
                  </p>
                </div>
              )}
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  {t('generating')}
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  {t('generateImages')}
                </>
              )}
            </Button>

            {/* Generated Options */}
            {isGenerating && (
              <div className="text-center py-12">
                <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                <p className="text-muted-foreground">{t('generatingOptions')}</p>
              </div>
            )}

            {generatedOptions.length > 0 && (
              <div ref={generatedImagesRef} className="space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-foreground mb-4">{t('selectImage')}</h2>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('selectImageDescription')}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {generatedOptions.map((option) => (
                    <Card
                      key={option.id}
                      className={`cursor-pointer transition-all border-2 ${
                        option.isSelected
                          ? "border-primary shadow-lg shadow-primary/20"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => handleSelectOption(option.id)}
                    >
                      <div className="space-y-3">
                        <div 
                          className="relative  rounded-t-lg overflow-hidden bg-muted cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            setPreviewImage(option.url)
                          }}
                        >
                          <img
                            src={option.url || "/placeholder.svg"}
                            alt={`${t('generatedOption')} ${option.id}`}
                            className="w-full h-full object-cover"
                          />
                          {option.isSelected && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-primary text-primary-foreground">
                                <Check className="h-3 w-3 mr-1" />
                                {t('selected')}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="p-1">
                          <Button
                            variant={option.isSelected ? "default" : "outline"}
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSelectOption(option.id)
                            }}
                          >
                            {option.isSelected ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                {t('selected')}
                              </>
                            ) : (
                              t('select')
                            )}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {selectedOptionId && (
                  <div className="flex justify-end gap-4 pt-4 border-t border-border">
                    <Button 
                      variant="outline" 
                      onClick={() => router.push("/dashboard/products")}
                      disabled={isSaving}
                    >
                      {t('cancel')}
                    </Button>
                    <Button 
                      onClick={handleSave} 
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {t('saving')}
                        </>
                      ) : (
                        t('saveSelected')
                      )}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-0">
          {previewImage && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={previewImage}
                alt={t('generatedPreview')}
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
