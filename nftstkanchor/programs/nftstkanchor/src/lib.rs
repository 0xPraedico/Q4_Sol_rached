use anchor_lang::prelude::*;

declare_id!("G1KxMmExYfRtaniiiEGEJUsUJxYanTi6rsAUsv5LDUH7");

pub mod constants;
pub mod errors;
pub mod instructions;
pub mod state;

pub use constants::*;
pub use instructions::*;
pub use state::*;

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

    pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
        ctx.accounts.unstake()
    }

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        ctx.accounts.claim()
    }
}


