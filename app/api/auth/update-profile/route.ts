import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const token = request.headers.get('authorization')?.replace('Bearer ', '')

    console.log('Profile update request:', { body, hasToken: !!token })

    if (!token) {
      console.log('No token provided')
      return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 401 })
    }

    // Gọi backend API
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
    const response = await fetch(`${backendUrl}/api/auth/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Backend API error:', { status: response.status, error: errorData })
      return NextResponse.json(
        { error: errorData.detail || 'Có lỗi xảy ra khi cập nhật thông tin' },
        { status: response.status }
      )
    }

    const result = await response.json()
    console.log('Profile update success:', result)
    
    // Ensure we return proper JSON with clear message
    return NextResponse.json({
      status: result.status || 'success',
      message: result.message || 'Cập nhật thông tin thành công',
      user: result.user
    })

  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Lỗi server khi cập nhật thông tin' },
      { status: 500 }
    )
  }
}
