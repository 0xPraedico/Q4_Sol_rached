use anchor_lang::prelude::*;

#[account]
pub struct Config {
    pub seed: u64,
    pub owner: Pubkey,
    pub mint_sol: Pubkey, // wsol mint obligatoire
    pub mint_1: Pubkey,
    pub mint_2: Pubkey,
    pub mint_3: Option<Pubkey>,
    pub mint_4: Option<Pubkey>,
    pub mint_5: Option<Pubkey>,
    pub mint_6: Option<Pubkey>,
    pub config_bump: u8,
}

impl Space for Config {
    const INIT_SPACE: usize = 8 // discriminator
        + 8 // seed
        + 32 // owner
        + 32 // mint_sol
        + (32 * 6) + 4// Option<Pubkey> for up to 2 + 4 optional mints
        + 1; // config_bump
}
