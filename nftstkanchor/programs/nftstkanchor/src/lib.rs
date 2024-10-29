use anchor_lang::prelude::*;

declare_id!("G1KxMmExYfRtaniiiEGEJUsUJxYanTi6rsAUsv5LDUH7");

mod state;
mod instructions;
mod errors;

pub use instructions::*;


#[program]
pub mod nftstkanchor {
    use super::*;

    pub fn initialize_config(ctx: Context<InitializeConfig>, points_per_stake: u8, max_stake: u8, freeze_period: u32) -> Result<()> {
        ctx.accounts.initialize_config(points_per_stake, max_stake, freeze_period, &ctx.bumps)
    }

    pub fn initialize_user(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.initialize_user(&ctx.bumps)
    }

    pub fn stake(ctx: Context<Stake>) -> Result<()> {
        ctx.accounts.stake(&ctx.bumps)
    }

}


