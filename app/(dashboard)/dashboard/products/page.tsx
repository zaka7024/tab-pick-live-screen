"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Tag, ImageIcon, Sparkles } from "lucide-react"
import { ProductDialog } from "@/components/product-dialog"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useProducts } from "@/app/hooks/useProducts"
import { Product } from "@/app/types/product"
import { Spinner } from "@/components/ui/spinner"
import {useTranslations} from 'next-intl';


export default function ProductsPage() {
  const t = useTranslations('Products');
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Fetch products using SWR hook
  const { products, isLoading, isError, mutate, createProduct, updateProduct, deleteProduct } = useProducts()

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleDeleteProduct = async (id: string) => {
    try {
      if (confirm(t('deleteConfirm'))) {
        await deleteProduct(id)
      }
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert(t('deleteError'))
    }
  }

  const handleSaveProduct = async (product: Product) => {
    try {
      setIsSaving(true)
      
      if (selectedProduct) {
        // Update existing product
        await updateProduct(product.id, product)
      } else {
        // Create new product (omit id as backend will generate it)
        const { id, ...productData } = product
        await createProduct(productData)
      }
      
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Failed to save product:', error)
      alert(t('saveError'))
    } finally {
      setIsSaving(false)
    }
  }

  const filteredProducts = products?.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  ) || []

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Spinner className="h-8 w-8 mx-auto mb-4" />
          <p className="text-muted-foreground">{t('loading')}</p>
        </div>
      </div>
    )
  }

  // Error state
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">{t('error')}</p>
          <Button onClick={() => mutate()}>{t('tryAgain')}</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">{t('subtitle')}</p>
        </div>
        <Button onClick={handleAddProduct} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          {t('addProduct')}
        </Button>
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border text-foreground"
            />
          </div>
        </div>
      </Card>

      <div className="grid gap-4">
        {filteredProducts.length === 0 ? (
          <Card className="p-12 bg-card border-border">
            <div className="text-center">
              <p className="text-muted-foreground">{t('noProducts')}</p>
            </div>
          </Card>
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
              <div className="flex items-start gap-4">
                <div 
                  className={`w-20 h-20 rounded-lg bg-secondary flex items-center justify-center overflow-hidden ${
                    product.imageUrl ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
                  }`}
                  onClick={() => product.imageUrl && setPreviewImage(product.imageUrl)}
                >
                  {product.imageUrl ? (
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
                      {product.description && (
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
                      )}
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem onClick={() => handleEditProduct(product)} className="text-foreground">
                          <Edit className="h-4 w-4 mr-2" />
                          {t('editProduct')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t('delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-6 mt-4">
                    <div>
                      <p className="text-xs text-muted-foreground">{t('price')}</p>
                      <p className="text-sm font-semibold text-foreground">
                        {product.currency} {product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {product.tags && product.tags.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        <p className="text-xs text-muted-foreground">{t('tags')}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {product.tags.map((tag, i) => (
                          <Badge key={i} variant="outline" className="border-primary/30 text-primary bg-primary/10">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 mt-4">
                    <Button
                      onClick={() => router.push(`/dashboard/products/${product.id}/images`)}
                      className="bg-gradient-to-r from-primary via-primary/90 to-primary text-primary-foreground hover:from-primary/90 hover:via-primary/80 hover:to-primary/90 shadow-md hover:shadow-xl transition-all duration-300 font-semibold border-0 relative overflow-hidden group cursor-pointer"
                      size="default"
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                      <Sparkles className="h-4 w-4 mr-2 relative z-10" />
                      <span className="relative z-10">{t('generateImages')}</span>
                    </Button>
                  </div>
                
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
        onSave={handleSaveProduct}
        isSaving={isSaving}
      />

      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-0">
          {previewImage && (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={previewImage}
                alt="Product preview"
                className="max-w-full max-h-[80vh] object-contain rounded-lg"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
