import type { HostPlatform } from '@/state/appStore'

export interface CommercialPlatformTheme {
  id: HostPlatform
  brandLabel: string
  logoMark: string
  headerBg: string
  toolbarBg: string
  columnHeaderBg: string
  accent: string
  accentDark: string
  link: string
  submitCta: string
  footerBrand: string
  showGiddyupFooter: boolean
}

const HERITAGE: CommercialPlatformTheme = {
  id: 'heritage',
  brandLabel: 'GRIDS',
  logoMark: 'G',
  headerBg: '#1a5fb4',
  toolbarBg: '#ffffff',
  columnHeaderBg: '#1a2744',
  accent: '#e85d04',
  accentDark: '#c74d03',
  link: '#1a5fb4',
  submitCta: 'Submit Request',
  footerBrand: 'GRIDS · Heritage Design Services',
  showGiddyupFooter: false,
}

const ROOFHUB: CommercialPlatformTheme = {
  id: 'roofhub',
  brandLabel: 'SRS Distribution',
  logoMark: '🏠',
  headerBg: '#6b1c2e',
  toolbarBg: '#5a1726',
  columnHeaderBg: '#1a1a1a',
  accent: '#c41e3a',
  accentDark: '#a01830',
  link: '#c41e3a',
  submitCta: 'Submit Design Request',
  footerBrand: 'SRS Distribution',
  showGiddyupFooter: true,
}

export function themeForPlatform(host: HostPlatform): CommercialPlatformTheme {
  if (host === 'roofhub') return ROOFHUB
  return HERITAGE
}
