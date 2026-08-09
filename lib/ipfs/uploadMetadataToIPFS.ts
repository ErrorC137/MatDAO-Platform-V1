export interface AIMetadata {
  commercialViability: number
  scientificIntegrity: number
  ipNovelty: number
  validationTier: string
}

export interface ProjectDetails {
  title: string
  description: string
  researchField: string
  imageIpfsHash?: string
  encryptedDataCid?: string
}

export interface NFTMetadata {
  name: string
  description: string
  image: string
  attributes: Array<{
    trait_type: string
    value: string | number
    display_type?: "number" | "boost_percentage" | "boost_number"
  }>
}

/**
 * Upload AI analysis metadata to IPFS using Pinata
 * This creates the permanent, trustless metadata URL for the IP-NFT
 * NOTE: This function is server-side only to avoid fs module issues
 */
export async function uploadMetadataToIPFS(
  aiScores: AIMetadata,
  projectDetails: ProjectDetails
): Promise<string> {
  // For now, return a mock IPFS URI to avoid fs module issues
  // TODO: Implement actual Pinata upload in a server-only context
  console.warn("Using mock IPFS URI - Pinata SDK requires server-side only")
  return `ipfs://QmMock${Date.now()}${Math.random().toString(36).substring(7)}`
}

/**
 * Upload a file to IPFS using Pinata
 * Useful for project images or encrypted research data
 * NOTE: This function is server-side only to avoid fs module issues
 */
export async function uploadFileToIPFS(file: File | Buffer): Promise<string> {
  // For now, return a mock IPFS URI to avoid fs module issues
  // TODO: Implement actual Pinata upload in a server-only context
  console.warn("Using mock IPFS URI - Pinata SDK requires server-side only")
  return `ipfs://QmMockFile${Date.now()}${Math.random().toString(36).substring(7)}`
}

/**
 * Get the gateway URL for an IPFS hash
 * Converts ipfs://<HASH> to https://<gateway>/ipfs/<HASH>
 */
export function getGatewayUrl(ipfsUri: string): string {
  const hash = ipfsUri.replace("ipfs://", "")
  return `https://${process.env.PINATA_GATEWAY || "gateway.pinata.cloud"}/ipfs/${hash}`
}
