import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { auth } from '@/auth';

export async function getAccessToken() {
  const session = await auth();
  return session?.user.accessToken;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
