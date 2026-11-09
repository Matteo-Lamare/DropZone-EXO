import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { DropCard } from './DropCard'
import { makeDrop } from '../test/fixtures'

function renderDropCard(overrides = {}) {
  return render(
    <MemoryRouter>
      <DropCard drop={makeDrop(overrides)} />
    </MemoryRouter>,
  )
}

describe('DropCard', () => {
  it('displays the product, price, remaining stock and status', () => {
    renderDropCard()

    expect(screen.getByRole('link', { name: /Air Max 1/i })).toBeInTheDocument()
    expect(screen.getByText(/180,00/)).toBeInTheDocument()
    expect(screen.getByText('42 / 100 paires restantes')).toBeInTheDocument()
    expect(screen.getByText('En vente')).toBeInTheDocument()
  })

  it('displays the upcoming status', () => {
    renderDropCard({ status: 'upcoming' })

    expect(screen.getByText('À venir')).toBeInTheDocument()
  })

  it('displays the sold out status and zero remaining stock', () => {
    renderDropCard({ status: 'sold_out', remaining: 0 })

    expect(screen.getByText('0 / 100 paires restantes')).toBeInTheDocument()
    expect(screen.getByText('Épuisé')).toBeInTheDocument()
  })
})
