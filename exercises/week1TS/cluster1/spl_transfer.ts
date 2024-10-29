import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import wallet from "../wba-wallet.json"
import { getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint = new PublicKey("684HoBgf3fKzDcJG7SYy2qvAB1SSEh1iGP2vVL2jLo5r");

// Recipient address
const to = new PublicKey("Kvn6AEP9Xz3JUbYRsJiF7hYnyZxcHeJtKU4zR7m3BrF");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it
        const from_ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            keypair.publicKey,
        );
        // Get the token account of the toWallet address, and if it does not exist, create it
        const to_ata = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,
            mint,
            to,
        );
        // Transfer the new token to the "toTokenAccount" we just created
        const tx = await transfer(
            connection,
            keypair,
            from_ata.address,
            to_ata.address,
            keypair.publicKey,
            1000
        );
        console.log(`Succesfully Minted!. Transaction Here: https://explorer.solana.com/tx/${tx}?cluster=devnet`)
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();