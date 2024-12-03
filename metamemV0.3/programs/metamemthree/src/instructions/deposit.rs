use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{transfer, Mint, Token, TokenAccount, Transfer}};

use crate::Config;

#[derive(Accounts)]
pub struct Deposit<'info>{
    #[account(mut)]
    pub owner: Signer<'info>,
    pub mint_deposit:  Box<Account<'info, Mint>>,
    #[account(
        mut,
        associated_token::mint = mint_deposit,
        associated_token::authority = owner,
    )]
    pub owner_deposit_ata: Box<Account<'info, TokenAccount>>,
    #[account(
        mut, 
        seeds = [b"config", config.seed.to_le_bytes().as_ref()],
        bump = config.config_bump,
      )]
    pub config: Box<Account<'info, Config>>,
    #[account(
        init_if_needed,
        payer = owner,
        associated_token::mint = mint_deposit,
        associated_token::authority = config,
    )]
    pub config_deposit_ata: Box<Account<'info, TokenAccount>>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>
    
    
}

impl<'info> Deposit<'info>{
    pub fn deposit(&mut self) -> Result<()> {
        let deposit_mint_amount = self.owner_deposit_ata.amount;

        let deposit_account = Transfer {
            from: self.owner_deposit_ata.to_account_info(),
            to: self.config_deposit_ata.to_account_info(),
            authority: self.owner.to_account_info()
        };
        
        let cpi_program = self.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, deposit_account);
       

        transfer(cpi_ctx, deposit_mint_amount)
       
        
    }
}