use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{Mint, Token, TokenAccount}};

use crate::Config;

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct CreateIndex<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    pub mint_sol: Box<Account<'info, Mint>>, // wsol mint
    pub mint_1: Box<Account<'info, Mint>>,
    pub mint_2: Box<Account<'info, Mint>>,
    pub mint_3: Option<Box<Account<'info, Mint>>>,
    pub mint_4: Option<Box<Account<'info, Mint>>>,
    pub mint_5: Option<Box<Account<'info, Mint>>>,
    pub mint_6: Option<Box<Account<'info, Mint>>>,
    #[account(
        mut,
        associated_token::mint = mint_sol,
        associated_token::authority = owner,
    )]
    pub owner_sol_ata: Box<Account<'info, TokenAccount>>, // wsol ata
    #[account(
        init,
        payer = owner,
        seeds = [b"config", seed.to_le_bytes().as_ref()],
        bump,
        space = Config::INIT_SPACE,
    )]
    pub config: Box<Account<'info, Config>>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
}

impl<'info> CreateIndex<'info> {
    pub fn init_index(&mut self, seed: u64, bumps: &CreateIndexBumps) -> Result<()> {
        self.config.set_inner(Config {
            seed,
            owner: self.owner.key(),
            mint_sol: self.mint_sol.key(),
            mint_1: self.mint_1.key(),
            mint_2: self.mint_2.key(),
            mint_3: self.mint_3.as_ref().map(|mint| mint.key()),
            mint_4: self.mint_4.as_ref().map(|mint| mint.key()),
            mint_5: self.mint_5.as_ref().map(|mint| mint.key()),
            mint_6: self.mint_6.as_ref().map(|mint| mint.key()),
            config_bump: bumps.config,
            
        });

        Ok(())
    }
}
