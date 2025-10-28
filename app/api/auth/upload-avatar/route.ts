import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('avatar') as unknown as File

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // 验证文件大小 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File too large' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // 创建上传目录
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 生成唯一文件名
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop()
    const fileName = `avatar_${timestamp}.${fileExtension}`
    const filePath = join(uploadDir, fileName)

    // 保存文件
    await writeFile(filePath, new Uint8Array(buffer))

    // 返回文件URL
    const avatarUrl = `/uploads/avatars/${fileName}`

    // Cập nhật avatar_url vào database thông qua backend API
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (token) {
      try {
        const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000'
        const updateResponse = await fetch(`${backendUrl}/api/auth/me`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ avatar_url: avatarUrl })
        })

        if (updateResponse.ok) {
          const updateResult = await updateResponse.json()
          console.log('Avatar URL updated in database:', updateResult)
        } else {
          console.error('Failed to update avatar in database')
        }
      } catch (error) {
        console.error('Error updating avatar in database:', error)
      }
    }

    return NextResponse.json({ 
      success: true, 
      avatar_url: avatarUrl 
    })

  } catch (error) {
    console.error('Avatar upload error:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
