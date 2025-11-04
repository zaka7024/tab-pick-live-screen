"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Product } from "@/app/types/product"
import { Textarea } from "@/components/ui/textarea"
import {useTranslations} from 'next-intl';

interface ProductDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onSave: (product: Product) => void
  isSaving?: boolean
}

export function ProductDialog({ open, onOpenChange, product, onSave, isSaving = false }: ProductDialogProps) {
  const t = useTranslations('ProductDialog');
  const [formData, setFormData] = useState<Partial<Product>>({
    name: "",
    description: "",
    category: "",
    price: 0,
    currency: "USD",
    tags: [],
    organizationId: "",
  })
  const [tagInput, setTagInput] = useState("")

  useEffect(() => {
    if (product) {
      setFormData(product)
    } else {
      setFormData({
        name: "",
        description: "",
        category: "",
        price: 0,
        currency: "USD",
        tags: [],
        organizationId: "",
      })
    }
  }, [product, open])

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...(formData.tags || []), tagInput.trim()],
      })
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags?.filter((t) => t !== tag) || [],
    })
  }

  const handleSave = () => {
    onSave(formData as Product)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-foreground">{product ? t('editTitle') : t('addTitle')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              {t('productName')}
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t('productNamePlaceholder')}
              className="bg-secondary border-border text-foreground"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              {t('description')}
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={t('descriptionPlaceholder')}
              className="bg-secondary border-border text-foreground min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">
              {t('category')}
            </Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder={t('categoryPlaceholder')}
              className="bg-secondary border-border text-foreground"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-foreground">
                {t('price')}
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                placeholder="0.00"
                className="bg-secondary border-border text-foreground"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency" className="text-foreground">
                {t('currency')}
              </Label>
              <Input
                id="currency"
                value={formData.currency}
                onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                placeholder="USD"
                className="bg-secondary border-border text-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-foreground">{t('tags')}</Label>

            <div className="flex gap-2">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                placeholder={t('tagsPlaceholder')}
                className="bg-secondary border-border text-foreground"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                variant="outline"
                className="border-border text-foreground bg-transparent"
              >
                {t('addTag')}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2 mt-2">
              {formData.tags?.map((tag, i) => (
                <Badge key={i} variant="outline" className="border-primary/30 text-primary bg-primary/10 pr-1">
                  {tag}
                  <button onClick={() => handleRemoveTag(tag)} className="ml-2 hover:text-destructive">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="border-border text-foreground"
            disabled={isSaving}
          >
            {t('cancel')}
          </Button>
          <Button 
            onClick={handleSave} 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isSaving}
          >
            {isSaving ? t('saving') : product ? t('save') : t('add')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
