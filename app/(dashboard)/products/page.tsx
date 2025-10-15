"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Tag, ImageIcon } from "lucide-react"
import { ProductDialog } from "@/components/product-dialog"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Product {
  id: string
  name: string
  category: string
  price: number
  stock: number
  aiTags: string[]
  status: "active" | "draft" | "archived"
  image: string
}

export default function ProductsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Wireless Headphones Pro",
      category: "Electronics",
      price: 299.99,
      stock: 45,
      aiTags: ["premium", "audio", "wireless", "trending"],
      status: "active",
      image: "/wireless-headphones.png",
    },
    {
      id: "2",
      name: "Smart Watch Ultra",
      category: "Wearables",
      price: 449.99,
      stock: 23,
      aiTags: ["fitness", "smart", "health", "popular"],
      status: "active",
      image: "/smartwatch-lifestyle.png",
    },
    {
      id: "3",
      name: "Ergonomic Office Chair",
      category: "Furniture",
      price: 599.99,
      stock: 12,
      aiTags: ["comfort", "office", "ergonomic", "bestseller"],
      status: "active",
      image: "/ergonomic-office-chair.png",
    },
    {
      id: "4",
      name: "Mechanical Keyboard RGB",
      category: "Electronics",
      price: 159.99,
      stock: 67,
      aiTags: ["gaming", "rgb", "mechanical", "new"],
      status: "active",
      image: "/mechanical-keyboard.png",
    },
  ])

  const handleAddProduct = () => {
    setSelectedProduct(null)
    setIsDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id))
  }

  const handleSaveProduct = (product: Product) => {
    if (selectedProduct) {
      setProducts(products.map((p) => (p.id === product.id ? product : p)))
    } else {
      setProducts([...products, { ...product, id: Date.now().toString() }])
    }
    setIsDialogOpen(false)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Product Management</h1>
          <p className="text-muted-foreground mt-2">Configure products and AI recommendation tags</p>
        </div>
        <Button onClick={handleAddProduct} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
      </div>

      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary border-border text-foreground"
            />
          </div>
          <Button variant="outline" className="border-border text-foreground bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </Card>

      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="p-6 bg-card border-border hover:border-primary/50 transition-colors">
            <div className="flex items-start gap-4">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-20 h-20 rounded-lg object-cover bg-secondary"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{product.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{product.category}</p>
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
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => router.push(`/products/${product.id}/banner`)}
                        className="text-foreground"
                      >
                        <ImageIcon className="h-4 w-4 mr-2" />
                        Edit Banner
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteProduct(product.id)} className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex items-center gap-6 mt-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="text-sm font-semibold text-foreground">${product.price}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Stock</p>
                    <p className="text-sm font-semibold text-foreground">{product.stock} units</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <Badge
                      variant={product.status === "active" ? "default" : "secondary"}
                      className={product.status === "active" ? "bg-chart-3 text-foreground" : ""}
                    >
                      {product.status}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">AI Tags</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.aiTags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="border-primary/30 text-primary bg-primary/10">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <ProductDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        product={selectedProduct}
        onSave={handleSaveProduct}
      />
    </div>
  )
}
