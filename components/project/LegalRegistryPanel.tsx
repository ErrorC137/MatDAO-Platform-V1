"use client"

import { useReadContract } from "wagmi"
import { FileText, Building2, Clock, Hash, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const IPNFT_ABI = [
  "function legalAgreementHashes(uint256 tokenId) public view returns (bytes32)",
  "function getActiveLicenses(uint256 tokenId) external view returns (address[] memory licensees, uint256[] memory expirationBlocks, bytes32[] memory licenseTermsHashes)"
] as const

interface LegalRegistryPanelProps {
  ipnftAddress: string
  tokenId: number
}

export function LegalRegistryPanel({ ipnftAddress, tokenId }: LegalRegistryPanelProps) {
  const { data: legalHash } = useReadContract({
    address: ipnftAddress as `0x${string}`,
    abi: IPNFT_ABI,
    functionName: "legalAgreementHashes",
    args: [BigInt(tokenId)],
  })

  const { data: licenses } = useReadContract({
    address: ipnftAddress as `0x${string}`,
    abi: IPNFT_ABI,
    functionName: "getActiveLicenses",
    args: [BigInt(tokenId)],
  })

  // Mock legal hash for demo if not deployed
  const displayHash = legalHash || "0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
  
  // Mock licenses for demo
  const mockLicenses = licenses || [
    {
      licensees: ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"],
      expirationBlocks: [BigInt(12345678)],
      licenseTermsHashes: ["0x8a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef"]
    }
  ]

  const hasActiveLicenses = mockLicenses[0]?.licensees?.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          On-Chain Legal Registry
        </CardTitle>
        <CardDescription>
          Cryptographically bound legal agreements and enterprise licenses
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Legal Agreement Hash */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-foreground">Legal Agreement Hash</h3>
            <Badge className="bg-emerald-500 text-white animate-pulse">
              <CheckCircle className="h-3 w-3 mr-1" />
              STATE: LEGALLY BINDING TO CHULA TTO
            </Badge>
          </div>
          
          <div className="p-4 bg-secondary/20 border border-border/60 rounded-lg">
            <div className="flex items-start gap-2">
              <Hash className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <code className="text-xs text-muted-foreground break-all font-mono">
                {displayHash}
              </code>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground">
            This SHA-256 hash cryptographically binds the IP-NFT to the physical Intellectual Property Assignment Agreement (IPAA) filed with Chula TTO, making the token represent legally enforceable commercial rights.
          </p>
        </div>

        {/* Enterprise Sub-Licenses */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Enterprise Sub-Licenses
          </h3>
          
          {hasActiveLicenses ? (
            <div className="border border-border/60 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-secondary/20">
                    <TableHead className="text-xs">Licensee</TableHead>
                    <TableHead className="text-xs">Expires Block</TableHead>
                    <TableHead className="text-xs">Terms Hash</TableHead>
                    <TableHead className="text-xs">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockLicenses[0].licensees.map((licensee, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-xs font-mono">
                        {licensee.slice(0, 6)}...{licensee.slice(-4)}
                      </TableCell>
                      <TableCell className="text-xs">
                        #{mockLicenses[0].expirationBlocks[index].toString()}
                      </TableCell>
                      <TableCell className="text-xs font-mono">
                        {mockLicenses[0].licenseTermsHashes[index].slice(0, 10)}...
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-4 bg-secondary/20 border border-border/60 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-foreground">No Active Licenses</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    This IP-NFT has not yet been licensed to enterprise partners. When R2C is achieved, corporate licenses will appear here.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground">
            Enterprise sub-licenses demonstrate successful "Research-to-Commercialization" (R2C) achievement, proving the asset has transitioned from academic research to commercial application.
          </p>
        </div>

        {/* Security Notice */}
        <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-xs text-blue-900 dark:text-blue-100">
            <strong>Legal Innovation:</strong> MatDAO uses cryptographic document hashing to physically bind real-world patent agreements to smart contracts, ensuring tokens represent legally enforceable commercial rights.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
