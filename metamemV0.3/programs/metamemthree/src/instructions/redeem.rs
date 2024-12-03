use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{transfer_checked, Mint, Token, TokenAccount, TransferChecked}};

use crate::Config;


#[derive(Accounts)]
pub struct Redeem<'info>{
    #[account(mut)]
    pub owner: Signer<'info>,
    pub mint_withdraw:  Box<Account<'info, Mint>>,
    #[account(
        mut,
        associated_token::mint = mint_withdraw,
        associated_token::authority = owner,
    )]
    pub owner_withdraw_ata: Box<Account<'info, TokenAccount>>,
    #[account(
        mut,
        seeds = [b"config", config.seed.to_le_bytes().as_ref()],
        bump = config.config_bump,
      )]
    pub config: Box<Account<'info, Config>>,
    #[account(
        mut,
        associated_token::mint = mint_withdraw,
        associated_token::authority = config,
    )]
    pub config_withdraw_ata: Box<Account<'info, TokenAccount>>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>

}
impl<'info> Redeem<'info>{
    pub fn withdraw(&mut self) -> Result<()> {
        
        let withdraw_mint_amount = self.config_withdraw_ata.amount;
        let binding = self.config.seed.to_le_bytes();
        let seeds = &[
                    b"config",
                    binding.as_ref(),
                    &[self.config.config_bump],
                    ];
                    
        let signer = &[&seeds[..]];
        
        let withdraw_account = TransferChecked {
            from: self.config_withdraw_ata.to_account_info(),
            to : self.owner_withdraw_ata.to_account_info(),
            authority: self.config.to_account_info(),
            mint: self.mint_withdraw.to_account_info(),
        };
        
        let cpi_program = self.token_program.to_account_info();
        let cpi_ctx = CpiContext::new_with_signer(cpi_program, withdraw_account, signer);

        transfer_checked(cpi_ctx, withdraw_mint_amount, self.mint_withdraw.decimals)

    }
}