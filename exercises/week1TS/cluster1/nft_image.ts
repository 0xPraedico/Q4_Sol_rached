import wallet from "../wba-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        //1. Load image
        const img = await readFile("/home/praedico/solana-starter/ts/generug.png");
        //2. Convert image to generic file.
        const genIm = createGenericFile(img,"rug", {
                contentType: "image/png"
            });
        
        //3. Upload image

        const [uri] = await umi.uploader.upload([genIm]);  //use https://devnet.irys.xyz/CqGx1GJFat6TKQDVrjGrijdvrqJqm62whHcLzLx5WC3A
                                                        

         
        console.log("Your image URI: ", uri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
