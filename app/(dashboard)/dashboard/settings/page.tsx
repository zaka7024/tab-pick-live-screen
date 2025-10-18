"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Palette, Layout, Eye, Monitor, Smartphone, Tablet } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function DisplayPage() {
  const [layout, setLayout] = useState("grid")
  const [primaryColor, setPrimaryColor] = useState("#4EB2F1")
  const [secondaryColor, setSecondaryColor] = useState("#6366F1")
  const [cardStyle, setCardStyle] = useState("elevated")
  const [borderRadius, setBorderRadius] = useState([8])
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [previewDevice, setPreviewDevice] = useState("desktop")
  const [previewOpen, setPreviewOpen] = useState(false)

  const [gridColumns, setGridColumns] = useState([3])
  const [gridGap, setGridGap] = useState([16])

  const [listImageSize, setListImageSize] = useState([128])
  const [listSpacing, setListSpacing] = useState([16])

  const [carouselItemWidth, setCarouselItemWidth] = useState([280])
  const [carouselGap, setCarouselGap] = useState([16])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Customize themes, layouts, visual styles for product recommendations, and ai generation settings.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Live Preview</h3>
              <p className="text-sm text-muted-foreground">See how your changes look in real-time</p>
            </div>
            <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Eye className="h-4 w-4 mr-2" />
                  Open Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] w-full h-[90vh] bg-card border-border">
                <DialogHeader>
                  <DialogTitle className="text-foreground flex items-center justify-between">
                    <span>Display Preview</span>
                    <div className="flex gap-2">
                      <Button
                        variant={previewDevice === "desktop" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPreviewDevice("desktop")}
                        className={previewDevice === "desktop" ? "bg-primary text-primary-foreground" : "border-border"}
                      >
                        <Monitor className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={previewDevice === "tablet" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPreviewDevice("tablet")}
                        className={previewDevice === "tablet" ? "bg-primary text-primary-foreground" : "border-border"}
                      >
                        <Tablet className="h-4 w-4" />
                      </Button>
                      <Button
                        variant={previewDevice === "mobile" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPreviewDevice("mobile")}
                        className={previewDevice === "mobile" ? "bg-primary text-primary-foreground" : "border-border"}
                      >
                        <Smartphone className="h-4 w-4" />
                      </Button>
                    </div>
                  </DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-auto">
                  <div
                    className={`mx-auto ${previewDevice === "mobile" ? "max-w-sm" : previewDevice === "tablet" ? "max-w-2xl" : "max-w-6xl"}`}
                  >
                    <div className="rounded-lg border-2 border-border bg-secondary/50 p-6">
                      {layout === "grid" && (
                        <div
                          className="grid gap-4"
                          style={{
                            gridTemplateColumns: `repeat(${gridColumns[0]}, minmax(0, 1fr))`,
                            gap: `${gridGap[0]}px`,
                          }}
                        >
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                              key={i}
                              className={`rounded-lg bg-card border border-border p-4 ${
                                cardStyle === "elevated" ? "shadow-lg" : ""
                              } ${animationsEnabled ? "transition-transform hover:scale-105" : ""}`}
                              style={{ borderRadius: `${borderRadius[0]}px` }}
                            >
                              <div
                                className="w-full h-48 rounded mb-3"
                                style={{
                                  backgroundColor: primaryColor + "33",
                                  borderRadius: `${borderRadius[0]}px`,
                                }}
                              />
                              <h4 className="font-semibold text-foreground mb-1">Product {i}</h4>
                              <p className="text-sm text-muted-foreground mb-3">High-quality product description</p>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-foreground">${299 + i * 50}.99</span>
                                <Button
                                  size="sm"
                                  style={{
                                    backgroundColor: primaryColor,
                                    borderRadius: `${borderRadius[0]}px`,
                                  }}
                                >
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {layout === "list" && (
                        <div className="space-y-4" style={{ gap: `${listSpacing[0]}px` }}>
                          {[1, 2, 3, 4].map((i) => (
                            <div
                              key={i}
                              className={`rounded-lg bg-card border border-border p-4 flex gap-4 ${
                                cardStyle === "elevated" ? "shadow-lg" : ""
                              } ${animationsEnabled ? "transition-transform hover:scale-[1.02]" : ""}`}
                              style={{ borderRadius: `${borderRadius[0]}px` }}
                            >
                              <div
                                className="rounded flex-shrink-0"
                                style={{
                                  width: `${listImageSize[0]}px`,
                                  height: `${listImageSize[0]}px`,
                                  backgroundColor: primaryColor + "33",
                                  borderRadius: `${borderRadius[0]}px`,
                                }}
                              />
                              <div className="flex-1">
                                <h4 className="font-semibold text-foreground mb-1">Product {i}</h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                  Detailed product description with more information
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-foreground">${299 + i * 50}.99</span>
                                  <Button
                                    size="sm"
                                    style={{
                                      backgroundColor: primaryColor,
                                      borderRadius: `${borderRadius[0]}px`,
                                    }}
                                  >
                                    Add to Cart
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {layout === "carousel" && (
                        <div className="flex overflow-x-auto pb-4" style={{ gap: `${carouselGap[0]}px` }}>
                          {[1, 2, 3, 4, 5].map((i) => (
                            <div
                              key={i}
                              className={`rounded-lg bg-card border border-border p-4 flex-shrink-0 ${
                                cardStyle === "elevated" ? "shadow-lg" : ""
                              } ${animationsEnabled ? "transition-transform hover:scale-105" : ""}`}
                              style={{
                                borderRadius: `${borderRadius[0]}px`,
                                width: `${carouselItemWidth[0]}px`,
                              }}
                            >
                              <div
                                className="w-full h-48 rounded mb-3"
                                style={{
                                  backgroundColor: primaryColor + "33",
                                  borderRadius: `${borderRadius[0]}px`,
                                }}
                              />
                              <h4 className="font-semibold text-foreground mb-1">Product {i}</h4>
                              <p className="text-sm text-muted-foreground mb-3">Product description</p>
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-foreground">${299 + i * 50}.99</span>
                                <Button
                                  size="sm"
                                  style={{
                                    backgroundColor: primaryColor,
                                    borderRadius: `${borderRadius[0]}px`,
                                  }}
                                >
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Palette className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Brand Colors</h3>
              <p className="text-sm text-muted-foreground">Configure your brand color palette</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-foreground font-medium">Primary Color</Label>
              <div className="flex gap-3 items-center">
                <Input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-20 h-12 cursor-pointer"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 bg-secondary border-border text-foreground"
                  placeholder="#4EB2F1"
                />
              </div>
              <p className="text-xs text-muted-foreground">Used for buttons, links, and primary actions</p>
            </div>

            <div className="space-y-3">
              <Label className="text-foreground font-medium">Secondary Color</Label>
              <div className="flex gap-3 items-center">
                <Input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-20 h-12 cursor-pointer"
                />
                <Input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="flex-1 bg-secondary border-border text-foreground"
                  placeholder="#6366F1"
                />
              </div>
              <p className="text-xs text-muted-foreground">Used for accents and secondary elements</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Layout className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Layout Configuration</h3>
              <p className="text-sm text-muted-foreground">Choose how products are displayed</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-foreground font-medium">Layout Style</Label>
              <RadioGroup value={layout} onValueChange={setLayout} className="grid grid-cols-3 gap-4">
                <div>
                  <RadioGroupItem value="grid" id="grid" className="peer sr-only" />
                  <Label
                    htmlFor="grid"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-border bg-secondary p-4 hover:bg-secondary/80 peer-data-[state=checked]:border-primary cursor-pointer"
                  >
                    <div className="grid grid-cols-2 gap-1 mb-2">
                      <div className="w-8 h-8 rounded bg-primary/20" />
                      <div className="w-8 h-8 rounded bg-primary/20" />
                      <div className="w-8 h-8 rounded bg-primary/20" />
                      <div className="w-8 h-8 rounded bg-primary/20" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Grid</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="list" id="list" className="peer sr-only" />
                  <Label
                    htmlFor="list"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-border bg-secondary p-4 hover:bg-secondary/80 peer-data-[state=checked]:border-primary cursor-pointer"
                  >
                    <div className="flex flex-col gap-1 mb-2">
                      <div className="w-16 h-3 rounded bg-primary/20" />
                      <div className="w-16 h-3 rounded bg-primary/20" />
                      <div className="w-16 h-3 rounded bg-primary/20" />
                    </div>
                    <span className="text-sm font-medium text-foreground">List</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="carousel" id="carousel" className="peer sr-only" />
                  <Label
                    htmlFor="carousel"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-border bg-secondary p-4 hover:bg-secondary/80 peer-data-[state=checked]:border-primary cursor-pointer"
                  >
                    <div className="flex gap-1 mb-2">
                      <div className="w-6 h-12 rounded bg-primary/20" />
                      <div className="w-6 h-12 rounded bg-primary/30" />
                      <div className="w-6 h-12 rounded bg-primary/20" />
                    </div>
                    <span className="text-sm font-medium text-foreground">Carousel</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {layout === "grid" && (
              <div className="space-y-4 p-4 rounded-lg bg-secondary/50 border border-border">
                <h4 className="font-medium text-foreground">Grid Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Columns</Label>
                    <span className="text-sm font-semibold text-primary">{gridColumns[0]}</span>
                  </div>
                  <Slider value={gridColumns} onValueChange={setGridColumns} min={2} max={6} step={1} />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Gap</Label>
                    <span className="text-sm font-semibold text-primary">{gridGap[0]}px</span>
                  </div>
                  <Slider value={gridGap} onValueChange={setGridGap} min={8} max={32} step={4} />
                </div>
              </div>
            )}

            {layout === "list" && (
              <div className="space-y-4 p-4 rounded-lg bg-secondary/50 border border-border">
                <h4 className="font-medium text-foreground">List Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Image Size</Label>
                    <span className="text-sm font-semibold text-primary">{listImageSize[0]}px</span>
                  </div>
                  <Slider value={listImageSize} onValueChange={setListImageSize} min={80} max={200} step={8} />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Item Spacing</Label>
                    <span className="text-sm font-semibold text-primary">{listSpacing[0]}px</span>
                  </div>
                  <Slider value={listSpacing} onValueChange={setListSpacing} min={8} max={32} step={4} />
                </div>
              </div>
            )}

            {layout === "carousel" && (
              <div className="space-y-4 p-4 rounded-lg bg-secondary/50 border border-border">
                <h4 className="font-medium text-foreground">Carousel Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Item Width</Label>
                    <span className="text-sm font-semibold text-primary">{carouselItemWidth[0]}px</span>
                  </div>
                  <Slider
                    value={carouselItemWidth}
                    onValueChange={setCarouselItemWidth}
                    min={200}
                    max={400}
                    step={20}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Gap</Label>
                    <span className="text-sm font-semibold text-primary">{carouselGap[0]}px</span>
                  </div>
                  <Slider value={carouselGap} onValueChange={setCarouselGap} min={8} max={32} step={4} />
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 bg-card border-border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-primary/10">
              <Layout className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Card Style</h3>
              <p className="text-sm text-muted-foreground">Customize product card appearance</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label className="text-foreground font-medium">Style Preset</Label>
              <RadioGroup value={cardStyle} onValueChange={setCardStyle} className="grid grid-cols-2 gap-4">
                <div>
                  <RadioGroupItem value="elevated" id="elevated" className="peer sr-only" />
                  <Label
                    htmlFor="elevated"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-border bg-secondary p-4 hover:bg-secondary/80 peer-data-[state=checked]:border-primary cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-lg bg-card shadow-lg mb-2" />
                    <span className="text-sm font-medium text-foreground">Elevated</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="outlined" id="outlined" className="peer sr-only" />
                  <Label
                    htmlFor="outlined"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-border bg-secondary p-4 hover:bg-secondary/80 peer-data-[state=checked]:border-primary cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-lg bg-card border-2 border-border mb-2" />
                    <span className="text-sm font-medium text-foreground">Outlined</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="flat" id="flat" className="peer sr-only" />
                  <Label
                    htmlFor="flat"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-border bg-secondary p-4 hover:bg-secondary/80 peer-data-[state=checked]:border-primary cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-lg bg-card mb-2" />
                    <span className="text-sm font-medium text-foreground">Flat</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="glass" id="glass" className="peer sr-only" />
                  <Label
                    htmlFor="glass"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-border bg-secondary p-4 hover:bg-secondary/80 peer-data-[state=checked]:border-primary cursor-pointer"
                  >
                    <div className="w-16 h-16 rounded-lg bg-card/50 backdrop-blur mb-2" />
                    <span className="text-sm font-medium text-foreground">Glass</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground font-medium">Border Radius</Label>
                <span className="text-sm font-semibold text-primary">{borderRadius[0]}px</span>
              </div>
              <Slider
                value={borderRadius}
                onValueChange={setBorderRadius}
                min={0}
                max={24}
                step={2}
                className="w-full"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-foreground font-medium">Enable Animations</Label>
                <p className="text-sm text-muted-foreground">Smooth transitions and hover effects</p>
              </div>
              <Switch checked={animationsEnabled} onCheckedChange={setAnimationsEnabled} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
