import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { BookOpen, ChevronDown, ChevronRight, Menu, Users, Star, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface MenuItem {
  label: string
  icon: React.ReactNode
  base: string
  links: { label: string; to: string }[]
}

const menuItems: MenuItem[] = [
  {
    label: 'Authors',
    icon: <Users size={18} />,
    base: '/authors',
    links: [
      { label: 'List', to: '/authors/list' },
      { label: 'Create', to: '/authors/create' },
    ],
  },
  {
    label: 'Books',
    icon: <BookOpen size={18} />,
    base: '/books',
    links: [
      { label: 'List', to: '/books/list' },
      { label: 'Create', to: '/books/create' },
    ],
  },
  {
    label: 'Reviews',
    icon: <Star size={18} />,
    base: '/reviews',
    links: [
      { label: 'List', to: '/reviews/list' },
      { label: 'Create', to: '/reviews/create' },
    ],
  },
]

export default function Sidebar() {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(menuItems.map((m) => [m.base, location.pathname.startsWith(m.base)]))
  )

  const toggle = (base: string) =>
    setOpenMenus((prev) => ({ ...prev, [base]: !prev[base] }))

  const navContent = (
    <>
      <div className="flex items-center gap-2 px-5 py-5 border-b border-sidebar-border">
        <BookOpen size={24} className="text-primary" />
        <span className="font-semibold text-lg text-sidebar-foreground">BookShelf</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        {menuItems.map((item) => {
          const isOpen = openMenus[item.base]
          return (
            <div key={item.base}>
              <button
                onClick={() => toggle(item.base)}
                className="w-full flex items-center justify-between px-5 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  {item.icon}
                  {item.label}
                </span>
                {isOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
              </button>

              {isOpen && (
                <div className="pl-10 pb-1">
                  {item.links.map((link) => (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileOpen(false)}
                      className={({ isActive }) =>
                        cn(
                          'block py-1.5 px-3 text-sm rounded-md transition-colors',
                          isActive
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium mr-2'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </>
  )

  return (
    <>
      {/* Mobile hamburger button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 lg:hidden h-9 w-9 p-0"
        onClick={() => setMobileOpen(true)}
      >
        <Menu size={20} />
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-screen w-60 bg-sidebar-background border-r border-sidebar-border flex flex-col z-50 transition-transform duration-200',
          'lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Mobile close button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 h-8 w-8 p-0 lg:hidden"
          onClick={() => setMobileOpen(false)}
        >
          <X size={16} />
        </Button>

        {navContent}
      </aside>
    </>
  )
}
