import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Sidebar } from '@/components/Sidebar'

describe('Sidebar (app-specific)', () => {
  it('renders collections and triggers actions', () => {
    const onChange = vi.fn()
    const onUpload = vi.fn()
    render(
      <Sidebar
        isOpen
        collections={['all', 'recent', 'favorites']}
        selectedCollection="all"
        onCollectionChange={onChange}
        onUpload={onUpload}
      />
    )

    // Upload button
    fireEvent.click(screen.getByText(/Upload Media/i))
    expect(onUpload).toHaveBeenCalled()

    // Click collection
    fireEvent.click(screen.getByText('Recent'))
    expect(onChange).toHaveBeenCalledWith('recent')
  })
})

