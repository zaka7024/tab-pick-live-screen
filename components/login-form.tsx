"use client"

import { GalleryVerticalEnd } from "lucide-react"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {useTranslations} from 'next-intl';

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations('Login');
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError(t('invalidCredentials'))
      } else if (result?.ok) {
        router.push("/dashboard/settings")
        router.refresh()
      }
    } catch (err) {
      setError(t('error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">{t('screenReader')}</span>
            </a>
            <h1 className="text-xl font-bold">{t('title')}</h1>
          </div>
          {error && (
            <div className="text-sm text-red-500 text-center p-2 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          <Field>
            <FieldLabel htmlFor="email">{t('email')}</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">{t('password')}</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder={t('passwordPlaceholder')}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </Field>
          <Field>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('loggingIn') : t('login')}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  )
}
