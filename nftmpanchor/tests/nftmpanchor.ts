import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Nftmpanchor } from "../target/types/nftmpanchor";

describe("nftmpanchor", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Nftmpanchor as Program<Nftmpanchor>;

 
});
