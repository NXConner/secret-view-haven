import { render, screen } from '@testing-library/react'
import React from 'react'
import Index from '@/pages/Index'

describe('App smoke test', () => {
  it('renders header and sidebar toggle', () => {
    render(<Index />)
    expect(screen.getByText(/Private Media Vault/i)).toBeInTheDocument()
  })
})

