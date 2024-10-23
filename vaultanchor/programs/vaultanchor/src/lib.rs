use anchor_lang::prelude::*;

declare_id!("Hw3ZetLFTQu1keyVXS7aeDy89AN41RxSfnZZBfii23rh");

#[program]
pub mod vaultanchor {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
