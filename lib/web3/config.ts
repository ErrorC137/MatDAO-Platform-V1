import { http, createConfig } from "wagmi"
import { sepolia } from "wagmi/chains"
import { injected, walletConnect } from "wagmi/connectors"

// Get contract addresses from environment variables
export const CONTRACT_ADDRESSES = {
  MATDAO_IPNFT: process.env.NEXT_PUBLIC_MATDAO_IPNFT_ADDRESS as `0x${string}`,
  MOCK_USDC: process.env.NEXT_PUBLIC_MOCK_USDC_ADDRESS as `0x${string}`,
  MATDAO_ESCROW: process.env.NEXT_PUBLIC_MATDAO_ESCROW_ADDRESS as `0x${string}`,
}

// Wagmi configuration
export const config = createConfig({
  chains: [sepolia],
  connectors: [
    injected(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "" }),
  ],
  transports: {
    [sepolia.id]: http(),
  },
})

// Export chain for use in components
export { sepolia }
