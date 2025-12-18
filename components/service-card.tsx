"use client"

import { Clock, MapPin, FileText, DollarSign } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ServiceCardProps {
  service: {
    id: string
    name: string
    description: string
    price: number
    duration: string | null
    locationLat?: number | null
    locationLng?: number | null
    locationRadius?: number | null
    locationAddress?: string | null
    conditions: string | null
  }
}

export function ServiceCard({ service }: ServiceCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-card hover:border-primary/40 transition-all duration-300 hover:shadow-xl">
      {/* Header with gradient */}
      <div className="relative bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-5 border-b border-border/50">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              {service.name}
            </h3>
            <div className="flex items-center gap-4 mt-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-medium">₹</span>
                <span className="text-2xl font-bold text-primary">
                  {service.price.toLocaleString("en-IN")}
                </span>
              </div>
              {service.duration && (
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{service.duration}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Description */}
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <div
            className="text-sm text-muted-foreground leading-relaxed"
            dangerouslySetInnerHTML={{ __html: service.description }}
          />
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-border/30">
          {service.locationAddress && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground mb-0.5">Location</p>
                <p className="text-sm text-foreground">
                  {service.locationRadius ? `${service.locationRadius} km radius - ` : ""}
                  {service.locationAddress}
                </p>
              </div>
            </div>
          )}
          
          {service.duration && (
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-muted-foreground mb-0.5">Duration</p>
                <p className="text-sm text-foreground">{service.duration}</p>
              </div>
            </div>
          )}
        </div>

        {/* Conditions */}
        {service.conditions && (
          <div className="pt-3 border-t border-border/30">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-muted-foreground mb-1">Terms & Conditions</p>
                <p className="text-sm text-foreground leading-relaxed">{service.conditions}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-2xl" />
    </div>
  )
}

