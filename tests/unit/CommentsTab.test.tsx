import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CommentsTab } from '@/components/dashboard/tabs/CommentsTab'
import { useAuth } from '@/contexts/AuthContext'

// Mock the AuthContext
jest.mock('@/contexts/AuthContext')

const mockUser = {
  id: 'user-123',
  email: 'test@example.com',
}

describe('CommentsTab', () => {
  beforeEach(() => {
    ;(useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      loading: false,
    })
  })

  it('renders loading state initially', () => {
    render(<CommentsTab />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('renders empty state when no comments', async () => {
    // Mock Supabase to return empty data
    jest.mock('@/lib/supabase', () => ({
      supabase: {
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              order: jest.fn(() => ({
                then: jest.fn((resolve) => resolve({ data: [], error: null }))
              }))
            }))
          }))
        }))
      }
    }))

    render(<CommentsTab />)
    
    await waitFor(() => {
      expect(screen.getByText(/No comments yet/)).toBeInTheDocument()
    })
  })

  it('renders filter buttons', async () => {
    render(<CommentsTab />)
    
    await waitFor(() => {
      expect(screen.getByText('All Comments')).toBeInTheDocument()
      expect(screen.getByText('Instagram')).toBeInTheDocument()
      expect(screen.getByText('TikTok')).toBeInTheDocument()
    })
  })

  it('switches between filters', async () => {
    render(<CommentsTab />)
    
    await waitFor(() => {
      const instagramButton = screen.getByText('Instagram')
      fireEvent.click(instagramButton)
    })
  })
})