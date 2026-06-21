const { ethers } = require("hardhat")

async function main() {
  console.log("🚀 Starting MatDAO deployment and seeding...\n")

  const signers = await ethers.getSigners()
  if (signers.length === 0) {
    throw new Error("No signers found. Please ensure PRIVATE_KEY is set in your .env file")
  }
  
  const [deployer] = signers
  console.log("📝 Deploying contracts with account:", deployer.address)

  // Deploy MockUSDC
  console.log("\n1️⃣ Deploying MockUSDC...")
  const MockUSDC = await ethers.getContractFactory("MockUSDC")
  const mockUSDC = await MockUSDC.deploy()
  await mockUSDC.waitForDeployment()
  const mockUSDCAddress = await mockUSDC.getAddress()
  console.log("✅ MockUSDC deployed to:", mockUSDCAddress)

  // Deploy MatDAO_IPNFT
  console.log("\n2️⃣ Deploying MatDAO_IPNFT...")
  const MatDAO_IPNFT = await ethers.getContractFactory("MatDAO_IPNFT")
  const matDAO_IPNFT = await MatDAO_IPNFT.deploy()
  await matDAO_IPNFT.waitForDeployment()
  const ipNFTAddress = await matDAO_IPNFT.getAddress()
  console.log("✅ MatDAO_IPNFT deployed to:", ipNFTAddress)

  // Deploy MockIPT (Investment Participation Token)
  console.log("\n3️⃣ Deploying MockIPT...")
  const MockIPT = await ethers.getContractFactory("MockUSDC")
  const mockIPT = await MockIPT.deploy()
  await mockIPT.waitForDeployment()
  const iptAddress = await mockIPT.getAddress()
  console.log("✅ MockIPT deployed to:", iptAddress)

  // Deploy MatDAO_Escrow with new parameters (IPT token and treasury)
  console.log("\n4️⃣ Deploying MatDAO_Escrow...")
  const milestoneDescriptions = [
    "Lab Validation",
    "Prototype Development", 
    "Pilot Testing",
    "Commercial Scale-Up"
  ]
  const milestoneAmounts = [
    ethers.parseUnits("45000", 6), // 45,000 USDC
    ethers.parseUnits("45000", 6), // 45,000 USDC
    ethers.parseUnits("45000", 6), // 45,000 USDC
    ethers.parseUnits("45000", 6), // 45,000 USDC
  ]

  const MatDAO_Escrow = await ethers.getContractFactory("MatDAO_Escrow")
  const matDAO_Escrow = await MatDAO_Escrow.deploy(
    mockUSDCAddress,
    iptAddress,
    deployer.address, // Researcher address (using deployer for demo)
    deployer.address, // MatDAO Treasury (using deployer for demo)
    milestoneDescriptions,
    milestoneAmounts
  )
  await matDAO_Escrow.waitForDeployment()
  const escrowAddress = await matDAO_Escrow.getAddress()
  console.log("✅ MatDAO_Escrow deployed to:", escrowAddress)

  // Deploy MatDAO_Swap for secondary market
  console.log("\n5️⃣ Deploying MatDAO_Swap...")
  const exchangeRate = ethers.parseUnits("1", 6) // 1 IPT = 1 USDC
  const MatDAO_Swap = await ethers.getContractFactory("MatDAO_Swap")
  const matDAO_Swap = await MatDAO_Swap.deploy(
    mockUSDCAddress,
    iptAddress,
    exchangeRate
  )
  await matDAO_Swap.waitForDeployment()
  const swapAddress = await matDAO_Swap.getAddress()
  console.log("✅ MatDAO_Swap deployed to:", swapAddress)

  // Mint Admin Funds (100,000 MockUSDC to deployer)
  console.log("\n6️⃣ Minting 100,000 MockUSDC to deployer for demo...")
  const mintAmount = ethers.parseUnits("100000", 6) // 100,000 USDC
  await mockUSDC.faucet()
  const balance = await mockUSDC.balanceOf(deployer.address)
  console.log("✅ Deployer MockUSDC balance:", ethers.formatUnits(balance, 6), "USDC")

  // Mint IPT tokens to deployer for demo
  console.log("\n7️⃣ Minting 10,000 MockIPT to deployer for demo...")
  const iptMintAmount = ethers.parseUnits("10000", 6)
  await mockIPT.faucet()
  const iptBalance = await mockIPT.balanceOf(deployer.address)
  console.log("✅ Deployer MockIPT balance:", ethers.formatUnits(iptBalance, 6), "IPT")

  // Seed IP-NFT for "Water Hyacinth Biochar" project
  console.log("\n8️⃣ Seeding IP-NFT for 'Water Hyacinth Biochar' project...")
  const dummyResearcher = deployer.address // Using deployer for demo
  const dummyIPFSCID = "QmXyZ123456789abcdefghijklmnopqrstuv" // Dummy IPFS CID
  const tokenURI = `ipfs://${dummyIPFSCID}`
  
  // Mock legal hash for the IPAA document
  const legalHash = ethers.keccak256(ethers.toUtf8Bytes("Chula TTO IPAA Agreement - Water Hyacinth Biochar Project"))
  
  try {
    const mintTx = await matDAO_IPNFT.mintIP(dummyResearcher, tokenURI, legalHash)
    await mintTx.wait()
    console.log("✅ IP-NFT minted for researcher:", dummyResearcher)
    console.log("📄 Token URI:", tokenURI)
    console.log("🔐 Legal Agreement Hash:", legalHash)

    // Get token ID
    const tokenId = await matDAO_IPNFT.getNextTokenId()
    console.log("🎫 Token ID:", tokenId - 1n)
  } catch (error) {
    console.log("⚠️  IP-NFT minting skipped (optional for demo)")
    console.log("   Error:", error.message)
  }

  // Fund the escrow with initial capital
  console.log("\n9️⃣ Funding escrow with initial capital...")
  const fundAmount = ethers.parseUnits("50000", 6) // 50,000 USDC
  
  try {
    const approveTx = await mockUSDC.approve(escrowAddress, fundAmount)
    await approveTx.wait()
    console.log("✅ USDC approved for escrow")
    
    const fundTx = await matDAO_Escrow.fundProject(fundAmount)
    await fundTx.wait()
    console.log("✅ Escrow funded with:", ethers.formatUnits(fundAmount, 6), "USDC")

    // Get funding progress
    const [current, goal, percentage] = await matDAO_Escrow.getFundingProgress()
    console.log("📊 Funding Progress:")
    console.log("   Current:", ethers.formatUnits(current, 6), "USDC")
    console.log("   Goal:", ethers.formatUnits(goal, 6), "USDC")
    console.log("   Percentage:", percentage, "%")
  } catch (error) {
    console.log("⚠️  Escrow funding skipped (optional for demo)")
    console.log("   Error:", error.message)
  }

  // Add liquidity to swap contract
  console.log("\n🔟 Adding liquidity to swap contract...")
  const swapLiquidityUSDC = ethers.parseUnits("10000", 6) // 10,000 USDC
  const swapLiquidityIPT = ethers.parseUnits("10000", 6) // 10,000 IPT
  
  try {
    const approveUSDCTx = await mockUSDC.approve(swapAddress, swapLiquidityUSDC)
    await approveUSDCTx.wait()
    console.log("✅ USDC approved for swap")
    
    const approveIPTTx = await mockIPT.approve(swapAddress, swapLiquidityIPT)
    await approveIPTTx.wait()
    console.log("✅ IPT approved for swap")
    
    const addLiquidityTx = await matDAO_Swap.addLiquidity(swapLiquidityUSDC, swapLiquidityIPT)
    await addLiquidityTx.wait()
    console.log("✅ Liquidity added to swap contract")

    // Get swap liquidity status
    const [usdcBalance, swapIptBalance, currentRate] = await matDAO_Swap.getLiquidityStatus()
    console.log("💧 Swap Liquidity Status:")
    console.log("   USDC Balance:", ethers.formatUnits(usdcBalance, 6))
    console.log("   IPT Balance:", ethers.formatUnits(swapIptBalance, 6))
    console.log("   Exchange Rate:", ethers.formatUnits(currentRate, 6), "USDC per IPT")
  } catch (error) {
    console.log("⚠️  Swap liquidity addition skipped (optional for demo)")
    console.log("   Error:", error.message)
  }

  // Get financial breakdown
  console.log("\n📈 Financial Breakdown:")
  try {
    const [totalGoal, platformFee, netRunway] = await matDAO_Escrow.getFinancialBreakdown()
    console.log("   Total Goal:", ethers.formatUnits(totalGoal, 6), "USDC")
    console.log("   Platform Fee (2.5%):", ethers.formatUnits(platformFee, 6), "USDC")
    console.log("   Net Research Runway:", ethers.formatUnits(netRunway, 6), "USDC")
  } catch (error) {
    console.log("   (Skipped - escrow not funded)")
  }

  // Output all addresses for easy copy-paste
  console.log("\n" + "=".repeat(50))
  console.log("🎉 DEPLOYMENT COMPLETE!")
  console.log("=".repeat(50))
  console.log("\n📋 Copy these addresses to your .env.local file:\n")
  console.log(`NEXT_PUBLIC_MOCK_USDC_ADDRESS=${mockUSDCAddress}`)
  console.log(`NEXT_PUBLIC_MATDAO_IPNFT_ADDRESS=${ipNFTAddress}`)
  console.log(`NEXT_PUBLIC_MATDAO_ESCROW_ADDRESS=${escrowAddress}`)
  console.log(`NEXT_PUBLIC_MATDAO_SWAP_ADDRESS=${swapAddress}`)
  console.log(`NEXT_PUBLIC_MATDAO_IPT_ADDRESS=${iptAddress}`)
  console.log("\n" + "=".repeat(50))
  console.log("🔗 Verify on Etherscan (if on Sepolia):")
  console.log(`MockUSDC: https://sepolia.etherscan.io/address/${mockUSDCAddress}`)
  console.log(`MatDAO_IPNFT: https://sepolia.etherscan.io/address/${ipNFTAddress}`)
  console.log(`MatDAO_Escrow: https://sepolia.etherscan.io/address/${escrowAddress}`)
  console.log(`MatDAO_Swap: https://sepolia.etherscan.io/address/${swapAddress}`)
  console.log("=".repeat(50) + "\n")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
