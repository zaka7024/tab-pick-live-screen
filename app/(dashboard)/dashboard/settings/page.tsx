"use client"

import { useReducer, useEffect, useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Palette, Layout, Eye, Save, Upload, X, ImageIcon } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { useSettings } from "@/app/hooks/useSettings"
import { Spinner } from "@/components/ui/spinner"
import { toast } from "sonner"
import { PreviewDialog } from "@/components/preview"
import { ImageOrientation } from "@/app/types/settings"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface SettingsState {
  theme: {
    primaryColor: string
    secondaryColor: string
    logoUrl?: string
    fontFamily?: string
  }
  layout: {
    style: string
    columns: number
    rows: number
    spacing: number
  }
  card: {
    style: string
    borderRadius: number
  }
  layoutSpecific: {
    carousel: {
      itemWidth: number
      gap: number
    }
  }
}

type SettingsAction =
  | { type: 'SET_THEME_COLOR'; field: 'primaryColor' | 'secondaryColor'; value: string }
  | { type: 'SET_LOGO_URL'; value: string }
  | { type: 'SET_FONT_FAMILY'; value: string }
  | { type: 'SET_LAYOUT_STYLE'; value: string }
  | { type: 'SET_LAYOUT_COLUMNS'; value: number }
  | { type: 'SET_LAYOUT_ROWS'; value: number }
  | { type: 'SET_LAYOUT_SPACING'; value: number }
  | { type: 'SET_CARD_STYLE'; value: string }
  | { type: 'SET_CARD_BORDER_RADIUS'; value: number }
  | { type: 'SET_CAROUSEL_ITEM_WIDTH'; value: number }
  | { type: 'SET_CAROUSEL_GAP'; value: number }
  | { type: 'INITIALIZE_SETTINGS'; payload: SettingsState }

const initialState: SettingsState = {
  theme: {
    primaryColor: "#4EB2F1",
    secondaryColor: "#6366F1",
    logoUrl: undefined,
    fontFamily: undefined,
  },
  layout: {
    style: "carousel",
    columns: 2,
    rows: 1,
    spacing: 16,
  },
  card: {
    style: "elevated",
    borderRadius: 8,
  },
  layoutSpecific: {
    carousel: {
      itemWidth: 280,
      gap: 16,
    },
  },
}

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'SET_THEME_COLOR':
      return {
        ...state,
        theme: {
          ...state.theme,
          [action.field]: action.value,
        },
      }
    case 'SET_LOGO_URL':
      return {
        ...state,
        theme: {
          ...state.theme,
          logoUrl: action.value,
        },
      }
    case 'SET_FONT_FAMILY':
      return {
        ...state,
        theme: {
          ...state.theme,
          fontFamily: action.value === '' ? undefined : action.value,
        },
      }
    case 'SET_LAYOUT_STYLE':
      return {
        ...state,
        layout: {
          ...state.layout,
          style: action.value,
        },
      }
    case 'SET_LAYOUT_COLUMNS':
      return {
        ...state,
        layout: {
          ...state.layout,
          columns: action.value,
        },
      }
    case 'SET_LAYOUT_ROWS':
      return {
        ...state,
        layout: {
          ...state.layout,
          rows: action.value,
        },
      }
    case 'SET_LAYOUT_SPACING':
      return {
        ...state,
        layout: {
          ...state.layout,
          spacing: action.value,
        },
      }
    case 'SET_CARD_STYLE':
      return {
        ...state,
        card: {
          ...state.card,
          style: action.value,
        },
      }
    case 'SET_CARD_BORDER_RADIUS':
      return {
        ...state,
        card: {
          ...state.card,
          borderRadius: action.value,
        },
      }
    case 'SET_CAROUSEL_ITEM_WIDTH':
      return {
        ...state,
        layoutSpecific: {
          ...state.layoutSpecific,
          carousel: {
            ...state.layoutSpecific.carousel,
            itemWidth: action.value,
          },
        },
      }
    case 'SET_CAROUSEL_GAP':
      return {
        ...state,
        layoutSpecific: {
          ...state.layoutSpecific,
          carousel: {
            ...state.layoutSpecific.carousel,
            gap: action.value,
          },
        },
      }
    case 'INITIALIZE_SETTINGS':
      return action.payload
    default:
      return state
  }
}

export default function DisplayPage() {
  const { settings, isLoading, isError, updateSettings, mutate } = useSettings()
  const [state, dispatch] = useReducer(settingsReducer, initialState)
  const [isSaving, setIsSaving] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (settings) {
      dispatch({
        type: 'INITIALIZE_SETTINGS',
        payload: {
          theme: {
            primaryColor: settings.theme.primaryColor,
            secondaryColor: settings.theme.secondaryColor,
            logoUrl: settings.theme.logoUrl,
            fontFamily: settings.theme.fontFamily,
          },
          layout: {
            style: settings.layout.style,
            columns: settings.layout.config.columns,
            rows: settings.layout.config.rows,
            spacing: settings.layout.config.spacing,
          },
          card: {
            style: settings.card.style,
            borderRadius: settings.card.borderRadius,
          },
          layoutSpecific: state.layoutSpecific,
        },
      })
    }
  }, [settings])

  const handleLogoUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB")
      return
    }

    setIsUploadingLogo(true)
    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to upload logo")
      }

      const data = await response.json()
      
      const logoUrl = data.payload?.fileUrl
      
      if (logoUrl) {
        dispatch({ type: 'SET_LOGO_URL', value: logoUrl })
        toast.success("Logo uploaded successfully!")
      } else {
        throw new Error("Invalid response format from API")
      }
    } catch (error) {
      console.error("Error uploading logo:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload logo. Please try again.")
    } finally {
      setIsUploadingLogo(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleLogoUpload(file)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleRemoveLogo = () => {
    dispatch({ type: 'SET_LOGO_URL', value: '' })
    toast.success("Logo removed")
  }

  const handleSaveSettings = async () => {
    try {
      setIsSaving(true)
      
      await updateSettings({
        theme: {
          primaryColor: state.theme.primaryColor,
          secondaryColor: state.theme.secondaryColor,
          logoUrl: state.theme.logoUrl || undefined,
          fontFamily: state.theme.fontFamily || undefined,
        },
        layout: {
          style: state.layout.style,
          config: {
            columns: state.layout.columns,
            rows: state.layout.rows,
            spacing: state.layout.spacing,
            itemsPerPage: settings?.layout.config.itemsPerPage || 10,
            autoPlay: settings?.layout.config.autoPlay || false,
            showIndicators: settings?.layout.config.showIndicators || true,
            imageOrientation: settings?.layout.config.imageOrientation || ImageOrientation.Landscape,
          },
        },
        card: {
          style: state.card.style,
          borderRadius: state.card.borderRadius,
        },
      })
      
      toast.success("Settings saved successfully!")
    } catch (error) {
      console.error('Failed to save settings:', error)
      toast.error("Failed to save settings. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Spinner className="h-8 w-8 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-destructive mb-4">Failed to load settings</p>
          <Button onClick={() => mutate()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Customize themes, layouts, visual styles for product recommendations, and ai generation settings.
          </p>
        </div>
        <Button 
          onClick={handleSaveSettings} 
          disabled={isSaving}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSaving ? (
            <>
              <Spinner className="h-4 w-4 mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="space-y-6">
        <Card className="p-6 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Live Preview</h3>
              <p className="text-sm text-muted-foreground">See how your changes look in real-time</p>
            </div>
            <Button 
              onClick={() => setPreviewOpen(true)}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Eye className="h-4 w-4 mr-2" />
              Open Preview
            </Button>
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
                  value={state.theme.primaryColor}
                  onChange={(e) => dispatch({ type: 'SET_THEME_COLOR', field: 'primaryColor', value: e.target.value })}
                  className="w-20 h-12 cursor-pointer"
                />
                <Input
                  type="text"
                  value={state.theme.primaryColor}
                  onChange={(e) => dispatch({ type: 'SET_THEME_COLOR', field: 'primaryColor', value: e.target.value })}
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
                  value={state.theme.secondaryColor}
                  onChange={(e) => dispatch({ type: 'SET_THEME_COLOR', field: 'secondaryColor', value: e.target.value })}
                  className="w-20 h-12 cursor-pointer"
                />
                <Input
                  type="text"
                  value={state.theme.secondaryColor}
                  onChange={(e) => dispatch({ type: 'SET_THEME_COLOR', field: 'secondaryColor', value: e.target.value })}
                  className="flex-1 bg-secondary border-border text-foreground"
                  placeholder="#6366F1"
                />
              </div>
              <p className="text-xs text-muted-foreground">Used for accents and secondary elements</p>
            </div>

            <div className="space-y-3">
              <Label className="text-foreground font-medium">Font Family</Label>
              <Select
                value={state.theme.fontFamily || 'default'}
                onValueChange={(value) => dispatch({ type: 'SET_FONT_FAMILY', value: value === 'default' ? '' : value })}
              >
                <SelectTrigger className="w-full bg-secondary border-border text-foreground">
                  <SelectValue placeholder="Select a font family" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Lato">Lato</SelectItem>
                  <SelectItem value="Montserrat">Montserrat</SelectItem>
                  <SelectItem value="Poppins">Poppins</SelectItem>
                  <SelectItem value="Raleway">Raleway</SelectItem>
                  <SelectItem value="Source Sans Pro">Source Sans Pro</SelectItem>
                  <SelectItem value="Nunito">Nunito</SelectItem>
                  <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                  <SelectItem value="Merriweather">Merriweather</SelectItem>
                  <SelectItem value="Oswald">Oswald</SelectItem>
                  <SelectItem value="Ubuntu">Ubuntu</SelectItem>
                  <SelectItem value="Lora">Lora</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Choose the font family for your theme</p>
            </div>

            <div className="space-y-3">
              <Label className="text-foreground font-medium">Logo</Label>
              <div className="space-y-3">
                {state.theme.logoUrl ? (
                  <div className="flex items-center gap-4 p-4 border border-border rounded-lg bg-secondary/50">
                    <div className="relative w-24 h-24 flex items-center justify-center bg-card rounded border border-border overflow-hidden">
                      <img
                        src={state.theme.logoUrl}
                        alt="Logo preview"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground font-medium">Logo uploaded</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your logo will be displayed in the theme
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleRemoveLogo}
                      className="text-destructive hover:text-destructive"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-border rounded-lg p-6 bg-secondary/50">
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="p-3 rounded-full bg-primary/10 mb-3">
                        <ImageIcon className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground mb-1">Upload your logo</p>
                      <p className="text-xs text-muted-foreground mb-4">
                        PNG, JPG up to 10MB
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="logo-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingLogo}
                        className="bg-secondary hover:bg-secondary/80"
                      >
                        {isUploadingLogo ? (
                          <>
                            <Spinner className="h-4 w-4 mr-2" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Choose File
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Upload your brand logo to display in the theme</p>
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
              <RadioGroup value={state.layout.style} onValueChange={(value) => dispatch({ type: 'SET_LAYOUT_STYLE', value })} className="grid grid-cols-2 gap-4">
                <div>
                  <RadioGroupItem value="grid" id="grid" className="peer sr-only" disabled />
                  <Label
                    htmlFor="grid"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-border bg-secondary/50 p-4 opacity-50 cursor-not-allowed"
                  >
                    <div className="grid grid-cols-2 gap-1 mb-2">
                      <div className="w-8 h-8 rounded bg-primary/10" />
                      <div className="w-8 h-8 rounded bg-primary/10" />
                      <div className="w-8 h-8 rounded bg-primary/10" />
                      <div className="w-8 h-8 rounded bg-primary/10" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Grid (Coming Soon)</span>
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

            {state.layout.style === "grid" && (
              <div className="space-y-4 p-4 rounded-lg bg-secondary/50 border border-border">
                <h4 className="font-medium text-foreground">Grid Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Columns</Label>
                    <span className="text-sm font-semibold text-primary">{state.layout.columns}</span>
                  </div>
                  <Slider 
                    value={[state.layout.columns]} 
                    onValueChange={(value) => dispatch({ type: 'SET_LAYOUT_COLUMNS', value: value[0] })} 
                    min={2} 
                    max={3} 
                    step={1} 
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Rows</Label>
                    <span className="text-sm font-semibold text-primary">{state.layout.rows}</span>
                  </div>
                  <Slider 
                    value={[state.layout.rows]} 
                    onValueChange={(value) => dispatch({ type: 'SET_LAYOUT_ROWS', value: value[0] })} 
                    min={1} 
                    max={2} 
                    step={1} 
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Gap</Label>
                    <span className="text-sm font-semibold text-primary">{state.layout.spacing}px</span>
                  </div>
                  <Slider 
                    value={[state.layout.spacing]} 
                    onValueChange={(value) => dispatch({ type: 'SET_LAYOUT_SPACING', value: value[0] })} 
                    min={8} 
                    max={32} 
                    step={4} 
                  />
                </div>
              </div>
            )}

            {state.layout.style === "carousel" && (
              <div className="space-y-4 p-4 rounded-lg bg-secondary/50 border border-border">
                <h4 className="font-medium text-foreground">Carousel Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Item Width</Label>
                    <span className="text-sm font-semibold text-primary">{state.layoutSpecific.carousel.itemWidth}px</span>
                  </div>
                  <Slider
                    value={[state.layoutSpecific.carousel.itemWidth]}
                    onValueChange={(value) => dispatch({ type: 'SET_CAROUSEL_ITEM_WIDTH', value: value[0] })}
                    min={720}
                    max={1400}
                    step={100}
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-foreground">Gap</Label>
                    <span className="text-sm font-semibold text-primary">{state.layoutSpecific.carousel.gap}px</span>
                  </div>
                  <Slider 
                    value={[state.layoutSpecific.carousel.gap]} 
                    onValueChange={(value) => dispatch({ type: 'SET_CAROUSEL_GAP', value: value[0] })} 
                    min={8} 
                    max={32} 
                    step={4} 
                  />
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
              <RadioGroup value={state.card.style} onValueChange={(value) => dispatch({ type: 'SET_CARD_STYLE', value })} className="grid grid-cols-3 gap-4">
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
              </RadioGroup>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-foreground font-medium">Border Radius</Label>
                <span className="text-sm font-semibold text-primary">{state.card.borderRadius}px</span>
              </div>
              <Slider
                value={[state.card.borderRadius]}
                onValueChange={(value) => dispatch({ type: 'SET_CARD_BORDER_RADIUS', value: value[0] })}
                min={0}
                max={24}
                step={2}
                className="w-full"
              />
            </div>
          </div>
        </Card>
      </div>

      <PreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        settings={state}
      />
    </div>
  )
}
