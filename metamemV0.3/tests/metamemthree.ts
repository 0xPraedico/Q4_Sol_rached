import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { AddressLookupTableProgram, ComputeBudgetProgram, LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionMessage, VersionedTransaction } from "@solana/web3.js";

import { Metamemthree } from "../target/types/metamemthree";
import { getAccount, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { randomBytes } from "crypto";
import { cpSwapProgram, configAddress } from "./config";


describe("metamemthree", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const owner = anchor.Wallet.local().payer;
  const connection = provider.connection;
  const program = anchor.workspace.Metamemthree as Program<Metamemthree>;
 

  const tokenProgram = anchor.utils.token.TOKEN_PROGRAM_ID;
  const associatedTokenProgram = anchor.utils.token.ASSOCIATED_PROGRAM_ID;
  const systemProgram = anchor.web3.SystemProgram.programId;

   
  const mintSol = new PublicKey("So11111111111111111111111111111111111111112"); // mint de WSOL
  const mint2 = new PublicKey("GM6zZia2fYRS8tiKUXarqnzmFFMZU7Ph2p87KuMok9F9"); // mint2
  const poolstate2 = new PublicKey("99AM9YAPUGUAvLwjQYVXE2UgkBGQGRv8rJD7LfrHqUiy")
  const mint1 = new PublicKey("6sURBuhcBbqibuFRona2PWcErWo7bTSiK1PuFDDSPoND");
  const poolstate1 = new PublicKey("EywYQ9qwWKhV21LToUhabFVpytNS4HF8U6SNhfTriMGS");
  const mint3 = new PublicKey("BRjpCHtyQLNCo8gqRUr8jtdAj5AjPYQaoqbvcZiHok1k");
  const poolstate3 = new PublicKey("5EqqFbCMGWuyHXQKx9XmfM9ygxFox5KfEmeNG8etdSfJ");
  const mint4 = new PublicKey("DfZ5GjSXWcYVWLTgk1QRD7kx3u8FmKMNErUPsa8JPPdo");
  const poolstate4 = new PublicKey("9LrM2MVA7FYYZQQayenMya9VzmG27XUEgLQq43eqqDCZ");
  const mint5 = new PublicKey("8wJGJA6NUecQTrkvGz2FA4aarEZ6xM4P7cg3MPh7sggq");
  const poolstate5 = new PublicKey("EHuakhVhVjfQDsQ5Dtd8yCEqnrJmKvSfcP2BMG6RTX6U");
  const mint6 = new PublicKey("F4rSRFG9Coa3JQToNZAkeUKPhvevPo4fbbHE13k9YX8E");
  const poolstate6 = new PublicKey("nENS4Nf7uM5Y6NLARJUcdfXJB9SK2c8iezJQLEyqqaf");

  const solAta = getAssociatedTokenAddressSync(mintSol, owner.publicKey, false, tokenProgram);
  const owner1Ata = getAssociatedTokenAddressSync(mint1, owner.publicKey, false, tokenProgram);
  const owner2Ata = getAssociatedTokenAddressSync(mint2, owner.publicKey, false, tokenProgram);
  const owner3Ata = getAssociatedTokenAddressSync(mint3, owner.publicKey, false, tokenProgram);
  const owner4Ata = getAssociatedTokenAddressSync(mint4, owner.publicKey, false, tokenProgram);
  const owner5Ata = getAssociatedTokenAddressSync(mint5, owner.publicKey, false, tokenProgram);
  const owner6Ata = getAssociatedTokenAddressSync(mint6, owner.publicKey, false, tokenProgram);


  const seed = new BN(randomBytes(8)); 
  const [configPda] =  PublicKey.findProgramAddressSync(
    [Buffer.from("config"), seed.toArrayLike(Buffer, "le", 8)],
    program.programId
  );
  const config1Ata = getAssociatedTokenAddressSync(
    mint1,               // mint1
    configPda,           // the owner of the ATA
    true,                // the owner is a PDA 
    tokenProgram         // SPL Token Program
  );
  const config2Ata = getAssociatedTokenAddressSync(
    mint2,               
    configPda,          
    true,               
    tokenProgram         
  );
  const config3Ata = getAssociatedTokenAddressSync(
    mint3,               
    configPda,           
    true,               
    tokenProgram         
  );
  const config4Ata = getAssociatedTokenAddressSync(
    mint4,              
    configPda,           
    true,                
    tokenProgram         
  );
  const config5Ata = getAssociatedTokenAddressSync(
    mint5,               
    configPda,           
    true,                
    tokenProgram         
  );
  const config6Ata = getAssociatedTokenAddressSync(
    mint6,               
    configPda,           
    true,               
    tokenProgram         
  );
  
  const feereceiver = new PublicKey("Kvn6AEP9Xz3JUbYRsJiF7hYnyZxcHeJtKU4zR7m3BrF");
  const feereceiveraccSol = getAssociatedTokenAddressSync(mintSol, feereceiver, false, tokenProgram)
  const feereceiveracc1 = getAssociatedTokenAddressSync(mint1, feereceiver, false, tokenProgram)
  const feereceiveracc2 = getAssociatedTokenAddressSync(mint2, feereceiver, false, tokenProgram)
  const feereceiveracc3 = getAssociatedTokenAddressSync(mint3, feereceiver, false, tokenProgram)
  const feereceiveracc4 = getAssociatedTokenAddressSync(mint4, feereceiver, false, tokenProgram)
  const feereceiveracc5 = getAssociatedTokenAddressSync(mint5, feereceiver, false, tokenProgram)
  const feereceiveracc6 = getAssociatedTokenAddressSync(mint6, feereceiver, false, tokenProgram)



 it("Atomic test: create index, swap, and deposit", async () => {

  const amountIn1 = new anchor.BN(0.02 * LAMPORTS_PER_SOL); // 20,000,000 lamports
  const minimumAmountOut1 = new anchor.BN(0);
  
  const computeBudgetInstruction = ComputeBudgetProgram.setComputeUnitLimit({
    units: 1_000_000, 
  });
 

  // create index account
  const accounts = {
    owner: owner.publicKey,
    mintSol: mintSol,
    mint1: mint1,
    mint2: mint2,
    mint3: mint3, // Optional 
    mint4: mint4,
    mint5: null,
    mint6: null,
    ownerSolAta: solAta,
    config: configPda,
    tokenProgram,
    associatedTokenProgram,
    systemProgram,
  };

  // Swap account
  const swapAccounts1 = {
    feeReceiverAccount: feereceiveraccSol,
    cp_swap_program: cpSwapProgram,
    payer: owner.publicKey,
    authority: new PublicKey("7rQ1QFNosMkUCuh7Z7fPbTHvh73b68sQYdirycEzJVuw"),
    ammConfig: configAddress,
    poolState: new PublicKey("EywYQ9qwWKhV21LToUhabFVpytNS4HF8U6SNhfTriMGS"),
    ownerInputAta: solAta,
    ownerOutputAta: owner1Ata,
    inputVault: new PublicKey("8NZ6pnPt2qJ5o7FynG1Wu4sawDeLXwD8bkt3e2CSj2nw"),
    outputVault: new PublicKey("DN1HJYYQJwam8kQDQauWeqGmB52cSHcDwcUiggPgCNAq"),
    inputTokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    outputTokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    mintInput: mintSol,
    mintOutput: mint1,
    observationState: new PublicKey("A4wse6BQfaDhzX6BnbbKucAT4x5MVavPTLNzTSXU92nK"),
  };

  const swapAccounts2 = {
    feeReceiverAccount: feereceiveraccSol,
    cp_swap_program: cpSwapProgram,
    payer: owner.publicKey,
    authority: new PublicKey("7rQ1QFNosMkUCuh7Z7fPbTHvh73b68sQYdirycEzJVuw"),
    ammConfig: configAddress,
    poolState: new PublicKey("5V3iCCqsRHRhr2MgzKoMuWz4Fy81KWvj7dZtKRsMTdbC"),
    ownerInputAta: solAta,
    ownerOutputAta: owner2Ata,
    inputVault: new PublicKey("Dd6tahz4yNUg6uJXmhXrCywzKE8vXauBnQ4Y1pYrLGiD"),
    outputVault: new PublicKey("8jGFmkCxsVyq1CXyPVVHeGgYkagXuw36MUWMpfgepUg9"),
    inputTokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    outputTokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    mintInput: mintSol,
    mintOutput: mint2,
    observationState: new PublicKey("3faz4s6ft6tnKFXfkZoYvgJYL6R6JKEpfUxkW1mYAoPY"),
  };

  const swapAccounts3 = {
    feeReceiverAccount: feereceiveraccSol,
    cp_swap_program: cpSwapProgram,
    payer: owner.publicKey,
    authority: new PublicKey("7rQ1QFNosMkUCuh7Z7fPbTHvh73b68sQYdirycEzJVuw"),
    ammConfig: configAddress,
    poolState: new PublicKey("5EqqFbCMGWuyHXQKx9XmfM9ygxFox5KfEmeNG8etdSfJ"),
    ownerInputAta: solAta,
    ownerOutputAta: owner3Ata,
    inputVault: new PublicKey("EvT6V6oW3g3vBecUZ7ygEc2R81EcC4izkks47waEa95U"),
    outputVault: new PublicKey("2WASmCGx9XKDrxiyVZDxdYRJjoDmcmaPvhdJJ8Pi9BDF"),
    inputTokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    outputTokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    mintInput: mintSol,
    mintOutput: mint3,
    observationState: new PublicKey("J5pvVmKzvx7mKbSdpNSCs4GGHs5h7ShANUoDe6RUGCD7"),
  };
  const swapAccounts4 = {
    feeReceiverAccount: feereceiveraccSol,
    cp_swap_program: cpSwapProgram,
    payer: owner.publicKey,
    authority: new PublicKey("7rQ1QFNosMkUCuh7Z7fPbTHvh73b68sQYdirycEzJVuw"),
    ammConfig: configAddress,
    poolState: new PublicKey("9LrM2MVA7FYYZQQayenMya9VzmG27XUEgLQq43eqqDCZ"),
    ownerInputAta: solAta,
    ownerOutputAta: owner4Ata,
    inputVault: new PublicKey("5S8muJnTaMSTFhRn9oP7873aHMzjmwAyUYKJBGr3Poqq"),
    outputVault: new PublicKey("5aj8BoecJiTYnddHppHSoKYctW1k6DMsW658AKcH9rdc"),
    inputTokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    outputTokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    mintInput: mintSol,
    mintOutput: mint4,
    observationState: new PublicKey("8Cr3FVZ4T7EunZ2yyaCbCjkg6P2NkGvGbW84u8uKvrGK"),
  };

  // deposit account
  const depositAccounts1 = {
    owner: owner.publicKey,
    mintDeposit: mint1,
    ownerDepositAta: owner1Ata,
    config: configPda,
    configDepositAta: config1Ata,
  };
  const depositAccounts2 = {
    owner: owner.publicKey,
    mintDeposit: mint2,
    ownerDepositAta: owner2Ata,
    config: configPda,
    configDepositAta: config2Ata,
  };
  const depositAccounts3 = {
    owner: owner.publicKey,
    mintDeposit: mint3,
    ownerDepositAta: owner3Ata,
    config: configPda,
    configDepositAta: config3Ata,
  };
  const depositAccounts4 = {
    owner: owner.publicKey,
    mintDeposit: mint4,
    ownerDepositAta: owner4Ata,
    config: configPda,
    configDepositAta: config4Ata,
  };
 

  // 1 : Create an ALT
  const slot = await connection.getSlot();
  const [lookupTableInst, lookupTableAddress] =
    AddressLookupTableProgram.createLookupTable({
      authority: owner.publicKey,
      payer: owner.publicKey,
      recentSlot: slot - 1,
     });

  // 2 : Add the addresses in the ALT
  const allAddressesOrdered  = [
    ...Object.values(accounts).filter((v) => v instanceof PublicKey),
    ...Object.values(swapAccounts1).filter((v) => v instanceof PublicKey),
    ...Object.values(swapAccounts2).filter((v) => v instanceof PublicKey),
    ...Object.values(swapAccounts3).filter((v) => v instanceof PublicKey),
    ...Object.values(swapAccounts4).filter((v) => v instanceof PublicKey),
    ...Object.values(depositAccounts1).filter((v) => v instanceof PublicKey),
    ...Object.values(depositAccounts2).filter((v) => v instanceof PublicKey),
    ...Object.values(depositAccounts3).filter((v) => v instanceof PublicKey),
    ...Object.values(depositAccounts4).filter((v) => v instanceof PublicKey),
  ];
  // Deduplication
  const uniqueAddressesOrdered = [...new Map(allAddressesOrdered.map((a) => [a.toBase58(), a])).values()];


  const extendInstruction = AddressLookupTableProgram.extendLookupTable({
    payer: owner.publicKey,
    authority: owner.publicKey,
    lookupTable: lookupTableAddress,
    addresses: uniqueAddressesOrdered,
  });

  
  // 3 : Send the transaction to create the ALT
  const altTransaction =  new Transaction()
    .add(lookupTableInst)
    .add(extendInstruction);
  
  await provider.sendAndConfirm(altTransaction, [owner]);
  console.log(`Address Lookup Table Created: ${lookupTableAddress.toBase58()}`);
  
  // Add an await for ALT activation complete
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await sleep(2000); // 2 seconds add if not enough 



  // 4 : get the ALT in the transaction
  const lookupTableAccount = await connection.getAddressLookupTable(
    lookupTableAddress
  );
  if (!lookupTableAccount.value) {
    throw new Error("Failed to fetch the lookup table");
  }
  console.log("Addresses in the ALT after extend :", lookupTableAccount.value.state.addresses.map((a) => a.toBase58()));


  // 5 : Build versionned transaction 
  const instructions = [];

  // Add instructions (compute budget, create, swap, deposit)
  instructions.push(computeBudgetInstruction);

  // create instructions
  instructions.push(
    await program.methods
      .createIndex(seed)
      .accounts(accounts)
      .instruction()
  );
  // swap instructions
  instructions.push(
    await program.methods
      .swapforunderlying1(amountIn1, minimumAmountOut1)
      .accounts(swapAccounts1)
      .instruction()
  );

  instructions.push(
    await program.methods
      .swapforunderlying1(amountIn1, minimumAmountOut1)
      .accounts(swapAccounts2)
      .instruction()
  );

  instructions.push(
    await program.methods
      .swapforunderlying1(amountIn1, minimumAmountOut1)
      .accounts(swapAccounts3)
      .instruction()
  );
  instructions.push(
    await program.methods
      .swapforunderlying1(amountIn1, minimumAmountOut1)
      .accounts(swapAccounts4)
      .instruction()
  );
  // deposit instructions
  instructions.push(
    await program.methods
      .depositunderlying()
      .accounts(depositAccounts1)
      .instruction()
  );
  instructions.push(
    await program.methods
      .depositunderlying()
      .accounts(depositAccounts2)
      .instruction()
  );
  instructions.push(
    await program.methods
      .depositunderlying()
      .accounts(depositAccounts3)
      .instruction()
  );
  instructions.push(
    await program.methods
      .depositunderlying()
      .accounts(depositAccounts4)
      .instruction()
  );

  // Create a versioned message
  const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const message = new TransactionMessage({
    payerKey: owner.publicKey,
    recentBlockhash,
    instructions,
  }).compileToV0Message([lookupTableAccount.value]);

  // Create a versioned transaction
  const versionedTransaction = new VersionedTransaction(message);

  // 6 : Signature and send the transaction
  const signature = await provider.sendAndConfirm(versionedTransaction, [owner]);

  console.log("Atomic operation successful: create swap and deposit with ALT");
  console.log("Transaction signature:", signature);

  // Verification
  const solAtaAccount = await getAccount(connection, solAta);
  console.log("solAta balance after transaction:", solAtaAccount.amount.toString());
});


// REDEEM : 

it("Redeem: withdraw and swap", async() => {
    const computeBudgetInstruction = ComputeBudgetProgram.setComputeUnitLimit({
    units: 1_000_000, 
  });

  const withdrawAccounts1 = {
    owner: owner.publicKey,
    mintWithdraw: mint1,
    ownerWithdrawAta: owner1Ata,
    config: configPda,
    configWithdrawAta: config1Ata,
  }
  const withdrawAccounts2 = {
    owner: owner.publicKey,
    mintWithdraw: mint2,
    ownerWithdrawAta: owner2Ata,
    config: configPda,
    configWithdrawAta: config2Ata,
  }
  const withdrawAccounts3 = {
    owner: owner.publicKey,
    mintWithdraw: mint3,
    ownerWithdrawAta: owner3Ata,
    config: configPda,
    configWithdrawAta: config3Ata,
  }
  const withdrawAccounts4 = {
    owner: owner.publicKey,
    mintWithdraw: mint4,
    ownerWithdrawAta: owner4Ata,
    config: configPda,
    configWithdrawAta: config4Ata,
  }

  const wswapAccounts1 = {
    feeReceiverAccount: feereceiveracc1, // fee receiver account
    cp_swap_program: cpSwapProgram,
    payer: owner.publicKey,
    authority: new PublicKey("7rQ1QFNosMkUCuh7Z7fPbTHvh73b68sQYdirycEzJVuw"),
    ammConfig: configAddress,
    poolState: new PublicKey("EywYQ9qwWKhV21LToUhabFVpytNS4HF8U6SNhfTriMGS"),
    ownerInputAta: owner1Ata,
    ownerOutputAta: solAta,
    inputVault: new PublicKey("DN1HJYYQJwam8kQDQauWeqGmB52cSHcDwcUiggPgCNAq"),
    outputVault: new PublicKey("8NZ6pnPt2qJ5o7FynG1Wu4sawDeLXwD8bkt3e2CSj2nw"),
    inputTokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    outputTokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    mintInput: mint1,
    mintOutput: mintSol,
    observationState: new PublicKey("A4wse6BQfaDhzX6BnbbKucAT4x5MVavPTLNzTSXU92nK"),
  };

  const wswapAccounts2 = {
    feeReceiverAccount: feereceiveracc2,
    cp_swap_program: cpSwapProgram,
    payer: owner.publicKey,
    authority: new PublicKey("7rQ1QFNosMkUCuh7Z7fPbTHvh73b68sQYdirycEzJVuw"),
    ammConfig: configAddress,
    poolState: new PublicKey("5V3iCCqsRHRhr2MgzKoMuWz4Fy81KWvj7dZtKRsMTdbC"),
    ownerInputAta: owner2Ata,
    ownerOutputAta: solAta,
    inputVault: new PublicKey("8jGFmkCxsVyq1CXyPVVHeGgYkagXuw36MUWMpfgepUg9"),
    outputVault: new PublicKey("Dd6tahz4yNUg6uJXmhXrCywzKE8vXauBnQ4Y1pYrLGiD"),
    inputTokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    outputTokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    mintInput: mint2,
    mintOutput: mintSol,
    observationState: new PublicKey("3faz4s6ft6tnKFXfkZoYvgJYL6R6JKEpfUxkW1mYAoPY"),
  };

  const wswapAccounts3 = {
    feeReceiverAccount: feereceiveracc3,
    cp_swap_program: cpSwapProgram,
    payer: owner.publicKey,
    authority: new PublicKey("7rQ1QFNosMkUCuh7Z7fPbTHvh73b68sQYdirycEzJVuw"),
    ammConfig: configAddress,
    poolState: new PublicKey("5EqqFbCMGWuyHXQKx9XmfM9ygxFox5KfEmeNG8etdSfJ"),
    ownerInputAta: owner3Ata,
    ownerOutputAta: solAta,
    inputVault: new PublicKey("2WASmCGx9XKDrxiyVZDxdYRJjoDmcmaPvhdJJ8Pi9BDF"),
    outputVault: new PublicKey("EvT6V6oW3g3vBecUZ7ygEc2R81EcC4izkks47waEa95U"),
    inputTokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    outputTokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    mintInput: mint3,
    mintOutput: mintSol,
    observationState: new PublicKey("J5pvVmKzvx7mKbSdpNSCs4GGHs5h7ShANUoDe6RUGCD7"),
  }; 
  const wswapAccounts4 = {
    feeReceiverAccount: feereceiveracc4,
    cp_swap_program: cpSwapProgram,
    payer: owner.publicKey,
    authority: new PublicKey("7rQ1QFNosMkUCuh7Z7fPbTHvh73b68sQYdirycEzJVuw"),
    ammConfig: configAddress,
    poolState: new PublicKey("9LrM2MVA7FYYZQQayenMya9VzmG27XUEgLQq43eqqDCZ"),
    ownerInputAta: owner4Ata,
    ownerOutputAta: solAta,
    inputVault: new PublicKey("5aj8BoecJiTYnddHppHSoKYctW1k6DMsW658AKcH9rdc"),
    outputVault: new PublicKey("5S8muJnTaMSTFhRn9oP7873aHMzjmwAyUYKJBGr3Poqq"),
    inputTokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    outputTokenProgram: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
    mintInput: mint4,
    mintOutput: mintSol,
    observationState: new PublicKey("8Cr3FVZ4T7EunZ2yyaCbCjkg6P2NkGvGbW84u8uKvrGK"),
  };

  const slot2 = await connection.getSlot();
  const [lookupTableInst2, lookupTableAddress2] =
    AddressLookupTableProgram.createLookupTable({
      authority: owner.publicKey,
      payer: owner.publicKey,
      recentSlot: slot2 - 1,
    });

  const allAddressesOrdered2 = [
    ...Object.values(withdrawAccounts1).filter((v) => v instanceof PublicKey),
    ...Object.values(withdrawAccounts2).filter((v) => v instanceof PublicKey),
    ...Object.values(withdrawAccounts3).filter((v) => v instanceof PublicKey),
    ...Object.values(withdrawAccounts4).filter((v) => v instanceof PublicKey),
    ...Object.values(wswapAccounts1).filter((v) => v instanceof PublicKey),
    ...Object.values(wswapAccounts2).filter((v) => v instanceof PublicKey),
    ...Object.values(wswapAccounts3).filter((v) => v instanceof PublicKey),
    ...Object.values(wswapAccounts4).filter((v) => v instanceof PublicKey),
  ];
  const uniqueAddressesOrdered2 = [...new Map(allAddressesOrdered2.map((a) => [a.toBase58(), a])).values()];


  const extendInstruction2 = AddressLookupTableProgram.extendLookupTable({
    payer: owner.publicKey,
    authority: owner.publicKey,
    lookupTable: lookupTableAddress2,
    addresses: uniqueAddressesOrdered2,
  });

  
  // 3 : Send the transactoin to create the ALT
  const altTransaction2 = new Transaction()
    .add(lookupTableInst2)
    .add(extendInstruction2);
  
  await provider.sendAndConfirm(altTransaction2, [owner]);
  console.log(`Address Lookup Table Created: ${lookupTableAddress2.toBase58()}`);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  await sleep(2000);

  // 4 : Add the ALT in the transaction
  const lookupTableAccount2 = await connection.getAddressLookupTable(
    lookupTableAddress2
  );
  if (!lookupTableAccount2.value) {
    throw new Error("Failed to fetch the lookup table");
  }
  console.log("Addresses in the ALT after extend :", lookupTableAccount2.value.state.addresses.map((a) => a.toBase58()));


  // 5 : Build a versioned transaction
  const instructions = [];

  // Add the instructions (compute budget, withdraw, swap)
  instructions.push(computeBudgetInstruction);

  // withdraw instructions
  instructions.push(
    await program.methods
      .withdraw()
      .accounts(withdrawAccounts1)
      .instruction()
  )
  instructions.push(
    await program.methods
    .withdraw()
    .accounts(withdrawAccounts2)
    .instruction()
  )
  instructions.push(
    await program.methods
      .withdraw()
      .accounts(withdrawAccounts3)
      .instruction()
  )
  instructions.push(
    await program.methods
      .withdraw()
      .accounts(withdrawAccounts4)
      .instruction()
  )



  // Get the amount to swap // TODO!: A better "logic" 
  const config1AtaAccount = await getAccount(connection, config1Ata);
  const config2AtaAccount = await getAccount(connection, config2Ata);
  const config3AtaAccount = await getAccount(connection, config3Ata);
  const config4AtaAccount = await getAccount(connection, config4Ata);
  console.log("Balance of owner1Ata:", config1AtaAccount.amount.toString());
  console.log("Balance of owner2Ata:", config2AtaAccount.amount.toString());
  console.log("Balance of owner3Ata:", config3AtaAccount.amount.toString());
  console.log("Balance of owner4Ata:", config4AtaAccount.amount.toString());



  const maxAmount1 = new anchor.BN(config1AtaAccount.amount.toString()); 
  const maxAmount2 = new anchor.BN(config2AtaAccount.amount.toString());
  const maxAmount3 = new anchor.BN(config3AtaAccount.amount.toString()); 
  const maxAmount4 = new anchor.BN(config4AtaAccount.amount.toString());

  const minimumAmountOut1 = new anchor.BN(0);

  // Swap instructions
  instructions.push(
    await program.methods
      .swapforunderlying1(maxAmount1, minimumAmountOut1)
      .accounts(wswapAccounts1)
      .instruction()
  )
  instructions.push(
    await program.methods
      .swapforunderlying1(maxAmount2, minimumAmountOut1)
      .accounts(wswapAccounts2)
      .instruction()
  )

  instructions.push(
    await program.methods
      .swapforunderlying1(maxAmount3, minimumAmountOut1)
      .accounts(wswapAccounts3)
      .instruction()
  )
  instructions.push(
    await program.methods
      .swapforunderlying1(maxAmount4, minimumAmountOut1)
      .accounts(wswapAccounts4)
      .instruction()
  )

  // Create a versioned message
  const recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

  const message = new TransactionMessage({
    payerKey: owner.publicKey,
    recentBlockhash,
    instructions,
  }).compileToV0Message([lookupTableAccount2.value]);

  // Create a versioned transaction
  const versionedTransaction = new VersionedTransaction(message);

  // 6 : Signature and send the transaction
  const signature = await provider.sendAndConfirm(versionedTransaction, [owner]);

  console.log("Redeem operation successful: withdraw and swap with ALT");
  console.log("Transaction signature:", signature);

  // Verification
  const solAtaAccount = await getAccount(connection, solAta);
  console.log("solAta balance after transaction:", solAtaAccount.amount.toString());
});
});