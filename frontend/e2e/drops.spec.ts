import { expect, test } from '@playwright/test'

test('la liste des drops s’affiche', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Les drops' })).toBeVisible()
  await expect(page.getByTestId('drop-card').first()).toBeVisible()
})

async function createDrop(
  request: import('@playwright/test').APIRequestContext,
  stock: number,
) {
  const response = await request.post('/api/drops', {
    data: {
      product: `Playwright Test ${Date.now()}-${Math.random()}`,
      description: 'Drop créé pour un test E2E',
      price_cents: 18000,
      stock,
      opens_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    },
  })

  expect(response.status()).toBe(201)
  return response.json()
}

test('une commande diminue le stock disponible', async ({ page, request }) => {
  const drop = await createDrop(request, 2)

  await page.goto(`/drops/${drop.id}`)

  const remaining = page.getByTestId('remaining')
  await expect(remaining).toHaveText('2 / 2 paires restantes')

  await page.getByRole('button', { name: 'Commander' }).click()

  await expect(remaining).toHaveText('1 / 2 paires restantes')
})

test('un drop épuisé désactive le bouton de commande', async ({
  page,
  request,
}) => {
  const drop = await createDrop(request, 1)

  const orderResponse = await request.post(
    `/api/drops/${drop.id}/orders`,
  )
  expect(orderResponse.status()).toBe(201)

  await page.goto(`/drops/${drop.id}`)

  await expect(page.getByTestId('remaining')).toHaveText(
    '0 / 1 paires restantes',
  )

  await expect(page.getByRole('button')).toBeDisabled()
})
