import { NextRequest, NextResponse } from 'next/server'
import { verifyMessage, recoverMessageAddress } from 'viem'
import { createPublicClient, http } from 'viem'
import { sepolia } from 'viem/chains'

const IPT_ABI = [
  "function balanceOf(address account) public view returns (uint256)"
] as const

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { address, message, signature, projectId } = body

    // Validate required fields
    if (!address || !message || !signature || !projectId) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Step 1: Verify signature
    const recoveredAddress = await recoverMessageAddress({
      message: message as `0x${string}`,
      signature: signature as `0x${string}`
    })

    if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
      return NextResponse.json(
        { message: 'Access Denied: Invalid Signature' },
        { status: 403 }
      )
    }

    // Step 2: Validate timestamp (prevent replay attacks - 5 minute window)
    const timestampMatch = message.match(/timestamp: (\d+)/)
    if (!timestampMatch) {
      return NextResponse.json(
        { message: 'Invalid message format' },
        { status: 400 }
      )
    }

    const timestamp = parseInt(timestampMatch[1])
    const currentTime = Math.floor(Date.now() / 1000)
    const timeDiff = currentTime - timestamp

    if (timeDiff > 300 || timeDiff < -300) { // 5 minutes = 300 seconds
      return NextResponse.json(
        { message: 'Access Denied: Request expired (replay attack prevention)' },
        { status: 403 }
      )
    }

    // Step 3: Check on-chain IPT balance
    const iptAddress = process.env.NEXT_PUBLIC_MATDAO_IPT_ADDRESS
    if (!iptAddress) {
      return NextResponse.json(
        { message: 'Server configuration error' },
        { status: 500 }
      )
    }

    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(process.env.SEPOLIA_RPC_URL || 'https://sepolia.infura.io/v3/YOUR_INFURA_KEY')
    })

    const balance = await publicClient.readContract({
      address: iptAddress as `0x${string}`,
      abi: IPT_ABI,
      functionName: 'balanceOf',
      args: [address as `0x${string}`]
    })

    // Step 4: Security gate - check if user has IPT tokens
    if (balance === BigInt(0)) {
      return NextResponse.json(
        { message: 'Access Denied: Insufficient IPT Balance' },
        { status: 403 }
      )
    }

    // Step 5: Secure file delivery
    // For MVP, we'll serve a mock PDF. In production, this would fetch from S3 or private storage
    const mockPdfContent = Buffer.from(
      '%PDF-1.4\n1 0 obj\n<<\n/Type /Catalog\n/Pages 2 0 R\n>>\nendobj\n2 0 obj\n<<\n/Type /Pages\n/Count 1\n/Kids [3 0 R]\n>>\nendobj\n3 0 obj\n<<\n/Type /Page\n/Parent 2 0 R\n/MediaBox [0 0 612 792]\n/Contents 4 0 R\n>>\nendobj\n4 0 obj\n<<\n/Length 44\n>>\nstream\nBT\n/F1 12 Tf\n100 700 Td\n(MatDAO Secure Document) Tj\nET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f\n0000000009 00000 n\n0000000058 00000 n\n0000000115 00000 n\n0000000202 00000 n\ntrailer\n<<\n/Size 5\n/Root 1 0 R\n>>\nstartxref\n289\n%%EOF',
      'binary'
    )

    return new NextResponse(mockPdfContent, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="secure-document-${projectId}.pdf"`,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      }
    })

  } catch (error) {
    console.error('VDR API Error:', error)
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    )
  }
}
