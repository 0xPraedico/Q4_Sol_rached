use anchor_lang::prelude::*;

declare_id!("7CQL1htK4GVPRyxasMhC9g2YScUeEcCUWtC5HWT9tk1");

pub mod state;
pub use state::*;
pub mod constants;

pub mod instructions;
pub use instructions::*;

#[program]
pub mod metamemthree {
    use super::*;

    pub fn create_index(ctx: Context<CreateIndex>, seed: u64) -> Result<()> {
        ctx.accounts.init_index(seed, &ctx.bumps)
        
    }
    pub fn swapforunderlying1(
        ctx: Context<ProxySwapBaseInput1>,
        amount_in: u64,
        minimum_amount_out: u64,
    ) -> Result<()> {
        ctx.accounts.proxy_swap_base_input1(amount_in, minimum_amount_out)
    }

    pub fn depositunderlying(ctx: Context<Deposit>) -> Result<()> {
        ctx.accounts.deposit()
    }
    
    pub fn withdraw(ctx: Context<Redeem>) -> Result<()> {
        ctx.accounts.withdraw()
    }
}

