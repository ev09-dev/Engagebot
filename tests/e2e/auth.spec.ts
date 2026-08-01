import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test('loads sign in page', async ({ page }) => {
    await page.goto('/auth/signin')
    
    await expect(page).toHaveTitle(/EngageBot/)
    await expect(page.locator('h1')).toContainText('Sign In')
  })

  test('switches between sign in and sign up', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Check initial state
    await expect(page.locator('h1')).toContainText('Sign In')
    
    // Click switch to sign up
    await page.click("text=Don't have an account? Sign up")
    
    // Check sign up state
    await expect(page.locator('h1')).toContainText('Create Account')
    
    // Click switch to sign in
    await page.click('text=Already have an account? Sign in')
    
    // Check sign in state
    await expect(page.locator('h1')).toContainText('Sign In')
  })

  test('validates email and password fields', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Try to submit without filling fields
    await page.click('button[type="submit"]')
    
    // Check for validation (HTML5 validation)
    const emailInput = page.locator('input[type="email"]')
    const passwordInput = page.locator('input[type="password"]')
    
    await expect(emailInput).toHaveAttribute('required')
    await expect(passwordInput).toHaveAttribute('required')
  })

  test('navigates to home page', async ({ page }) => {
    await page.goto('/auth/signin')
    
    // Click back to home link
    await page.click('text=Back to Home')
    
    // Verify navigation
    await expect(page).toHaveURL('/')
    await expect(page.locator('h1')).toContainText('Smart Engagement for Content Creators')
  })
})