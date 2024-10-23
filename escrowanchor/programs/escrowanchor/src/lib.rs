use anchor_lang::prelude::*;

declare_id!("EhLT4VkyfgAn2aHr9nvSZbjX1cDyD7E1rkMQzNtQYBpg");

#[program]
pub mod escrowanchor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
