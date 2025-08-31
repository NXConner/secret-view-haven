import { render, screen } from '@testing-library/react'
import React from 'react'
import WallpaperControls from '@/components/WallpaperControls'
import type { WallpaperConfig } from '@/components/BackgroundWallpaper'

describe('WallpaperControls', () => {
  it('renders nothing when value is null', () => {
    const { container } = render(<WallpaperControls value={null} onChange={() => {}} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders controls for image wallpaper', () => {
    const value: WallpaperConfig = {
      type: 'image',
      url: 'u',
    }
    render(<WallpaperControls value={value} onChange={() => {}} />)
    expect(screen.getByText(/Object Fit/i)).toBeInTheDocument()
    expect(screen.getByText(/Opacity/)).toBeInTheDocument()
    expect(screen.getByText(/Blur/)).toBeInTheDocument()
    expect(screen.getByText(/Brightness/)).toBeInTheDocument()
  })
})

