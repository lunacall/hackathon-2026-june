import { Link } from "@tanstack/react-router"

import { cn } from "@/lib/utils"
import { Shield, CheckCircle2 } from "lucide-react"

interface LogoProps {
  variant?: "full" | "icon" | "responsive"
  className?: string
  asLink?: boolean
}

export function Logo({
  variant = "full",
  className,
  asLink = true,
}: LogoProps) {
  const iconContent = (
    <div className="flex items-center justify-center relative w-6 h-6">
      <Shield className="w-5 h-5 text-blue-900" />
      <CheckCircle2 className="w-3 h-3 text-teal-500 absolute bottom-0 right-0" />
    </div>
  )

  const fullContent = (
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center relative w-6 h-6">
        <Shield className="w-5 h-5 text-blue-900" />
        <CheckCircle2 className="w-3 h-3 text-teal-500 absolute bottom-0 right-0" />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-bold text-blue-900">Data</span>
        <span className="text-sm font-bold text-blue-900">Governance</span>
        <span className="text-sm font-bold text-teal-600">Models</span>
      </div>
    </div>
  )

  const content =
    variant === "responsive" ? (
      <>
        <div className={cn("group-data-[collapsible=icon]:hidden", className)}>
          {fullContent}
        </div>
        <div className={cn("size-5 hidden group-data-[collapsible=icon]:block", className)}>
          {iconContent}
        </div>
      </>
    ) : variant === "full" ? (
      <div className={cn(className)}>
        {fullContent}
      </div>
    ) : (
      <div className={cn(className)}>
        {iconContent}
      </div>
    )

  if (!asLink) {
    return content
  }

  return <Link to="/">{content}</Link>
}
