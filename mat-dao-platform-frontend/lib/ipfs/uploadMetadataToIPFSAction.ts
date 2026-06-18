"use server"

import { uploadMetadataToIPFS } from "./uploadMetadataToIPFS"
import type { AIMetadata, ProjectDetails } from "./uploadMetadataToIPFS"

/**
 * Server action wrapper for IPFS upload (to avoid fs module issues in client components)
 */
export async function uploadMetadataToIPFSAction(
  aiScores: AIMetadata,
  projectDetails: ProjectDetails
): Promise<string> {
  return await uploadMetadataToIPFS(aiScores, projectDetails)
}
