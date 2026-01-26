"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ChevronUp, Link as LinkIcon } from "@/components/icons"
import { useI18n } from "@/lib/i18n/context"
import { cn } from "@/lib/utils"

interface Section {
  id: string
  title: string
  level: number
  content: string
}

interface SpecViewerProps {
  title: string
  sections: Section[]
}

export function SpecViewer({ title, sections }: SpecViewerProps) {
  const { t } = useI18n()
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [tocOpen, setTocOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300)
      
      // Update active section based on scroll position
      const sectionElements = sections.map(s => document.getElementById(s.id))
      const scrollPosition = window.scrollY + 100
      
      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i]
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i].id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  const copyAnchorLink = (id: string) => {
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    navigator.clipboard.writeText(url)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="relative">
      {/* Desktop Layout: TOC on left, content on right */}
      <div className="lg:flex lg:gap-12">
        {/* TOC - Desktop */}
        <aside className="hidden lg:block lg:w-64 shrink-0">
          <nav className="sticky top-20">
            <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
              {t("site.spec.toc")}
            </h2>
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className={cn(
                      "block text-sm transition-colors py-1",
                      section.level > 1 && "pl-4",
                      activeSection === section.id
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* TOC - Mobile (collapsible) */}
        <div className="lg:hidden mb-8">
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className="flex items-center justify-between w-full py-3 border-b border-border text-sm"
          >
            <span className="text-muted-foreground">{t("site.spec.toc")}</span>
            <ChevronUp className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              !tocOpen && "rotate-180"
            )} />
          </button>
          {tocOpen && (
            <nav className="py-4 border-b border-border">
              <ul className="space-y-2">
                {sections.map((section) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      onClick={() => setTocOpen(false)}
                      className={cn(
                        "block text-sm py-1",
                        section.level > 1 && "pl-4",
                        "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>

        {/* Content */}
        <article className="flex-1 min-w-0">
          <h1 className="text-2xl font-medium text-foreground mb-12">{title}</h1>
          
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="mb-12 scroll-mt-20"
            >
              <div className="flex items-center gap-2 group mb-4">
                <h2 className={cn(
                  "font-medium text-foreground",
                  section.level === 1 ? "text-lg" : "text-base"
                )}>
                  {section.title}
                </h2>
                <button
                  onClick={() => copyAnchorLink(section.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-muted-foreground hover:text-foreground"
                  aria-label="Copy link to section"
                >
                  <LinkIcon className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">
                {section.content}
              </div>
            </section>
          ))}
        </article>
      </div>

      {/* Back to top button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 bg-card border border-border rounded-full shadow-lg hover:bg-muted transition-colors z-50"
          aria-label={t("site.spec.back_to_toc")}
        >
          <ChevronUp className="h-4 w-4 text-foreground" />
        </button>
      )}
    </div>
  )
}
