import { PinataSDK } from "@pinata/sdk"

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT || "",
  pinataGateway: process.env.PINATA_GATEWAY || "gateway.pinata.cloud",
})

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
 */
export async function uploadMetadataToIPFS(
  aiScores: AIMetadata,
  projectDetails: ProjectDetails
): Promise<string> {
  try {
    // Construct the JSON object matching the ERC-721 metadata schema
    const metadata: NFTMetadata = {
      name: projectDetails.title,
      description: projectDetails.description || "MatDAO IP-NFT representing validated material science research.",
      image: projectDetails.imageIpfsHash 
        ? `ipfs://${projectDetails.imageIpfsHash}` 
        : "ipfs://QmPlaceholderHashForDefaultImage",
      attributes: [
        { 
          trait_type: "Research Field", 
          value: projectDetails.researchField || "Material Science" 
        },
        { 
          display_type: "number", 
          trait_type: "AI Tool 1: Commercial Viability", 
          value: aiScores.commercialViability 
        },
        { 
          display_type: "number", 
          trait_type: "AI Tool 2: Scientific Integrity", 
          value: aiScores.scientificIntegrity 
        },
        { 
          display_type: "number", 
          trait_type: "AI Tool 3: IP Novelty", 
          value: aiScores.ipNovelty 
        },
        { 
          trait_type: "AI Validation Tier", 
          value: aiScores.validationTier 
        },
        ...(projectDetails.encryptedDataCid ? [{
          trait_type: "Encrypted Data CID",
          value: `ipfs://${projectDetails.encryptedDataCid}`
        }] : [])
      ]
    }

    // Upload to Pinata
    const result = await pinata.upload.json(metadata).addMetadata({
      name: `${projectDetails.title}-metadata`,
      keyvalues: {
        type: "matdao-ipnft-metadata",
        validationTier: aiScores.validationTier,
        researchField: projectDetails.researchField || "Material Science"
      }
    })

    // Return the IPFS hash formatted as ipfs://<HASH>
    return `ipfs://${result.IpfsHash}`
  } catch (error) {
    console.error("Error uploading metadata to IPFS:", error)
    throw new Error("Failed to upload metadata to IPFS")
  }
}

/**
 * Upload a file to IPFS using Pinata
 * Useful for project images or encrypted research data
 */
export async function uploadFileToIPFS(file: File | Buffer): Promise<string> {
  try {
    const result = await pinata.upload.file(file).addMetadata({
      name: typeof file === 'object' && 'name' in file ? file.name : "uploaded-file"
    })

    return `ipfs://${result.IpfsHash}`
  } catch (error) {
    console.error("Error uploading file to IPFS:", error)
    throw new Error("Failed to upload file to IPFS")
  }
}

/**
 * Get the gateway URL for an IPFS hash
 * Converts ipfs://<HASH> to https://<gateway>/ipfs/<HASH>
 */
export function getGatewayUrl(ipfsUri: string): string {
  const hash = ipfsUri.replace("ipfs://", "")
  return `https://${process.env.PINATA_GATEWAY || "gateway.pinata.cloud"}/ipfs/${hash}`
}
