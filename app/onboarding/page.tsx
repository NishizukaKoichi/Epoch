"use client"

import { useRouter } from "next/navigation"
import { EpochOnboarding } from "@/components/epoch-onboarding"

export default function OnboardingPage() {
  const router = useRouter()

  const handleComplete = () => {
    router.push("/")
  }

  return <EpochOnboarding onComplete={handleComplete} />
}
