use std::str::FromStr;

use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{transfer, Token, Transfer}, token_interface::{Mint, TokenAccount, TokenInterface}};
use raydium_cpmm_cpi::{
    cpi,
    program::RaydiumCpmm,
    states::{AmmConfig, ObservationState, PoolState},
};



use crate::constants::FEE_RECEIVER; 

#[derive(Accounts)]
pub struct ProxySwapBaseInput1<'info> {
      #[account(
        init_if_needed,
        payer = payer,
        associated_token::mint = mint_input,
        associated_token::authority = fee_receiver_authority
    )]
    pub fee_receiver_account: Box<InterfaceAccount<'info, TokenAccount>>,

    /// CHECK: personnal address to derive the ATA
    #[account(
        address = Pubkey::from_str(FEE_RECEIVER).unwrap()
    )]
    pub fee_receiver_authority: UncheckedAccount<'info>,

    pub cp_swap_program: Program<'info, RaydiumCpmm>,
    /// The user performing the swap
    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: pool vault and lp mint authority
    #[account(
      seeds = [
        raydium_cpmm_cpi::AUTH_SEED.as_bytes(),
      ],
      seeds::program = cp_swap_program.key(),
      bump,
  )]
    pub authority: UncheckedAccount<'info>,

    /// The factory state to read protocol fees
    #[account(address = pool_state.load()?.amm_config)]
    pub amm_config: Box<Account<'info, AmmConfig>>,

    /// The program account of the pool in which the swap will be performed
    #[account(mut)]
    pub pool_state: AccountLoader<'info, PoolState>,

    /// The owner token account for input token
    #[account(mut)]
    pub owner_input_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
      init_if_needed,
      payer=payer,
      associated_token::mint = mint_output,
      associated_token::authority = payer
    )]
    pub owner_output_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The vault token account for input token
    #[account(
      mut,
      constraint = input_vault.key() == pool_state.load()?.token_0_vault || input_vault.key() == pool_state.load()?.token_1_vault
  )]
    pub input_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    /// The vault token account for output token
    #[account(
      mut,
      constraint = output_vault.key() == pool_state.load()?.token_0_vault || output_vault.key() == pool_state.load()?.token_1_vault
  )]
    pub output_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    /// SPL program for input token transfers
    pub input_token_program: Interface<'info, TokenInterface>,

    /// SPL program for output token transfers
    pub output_token_program: Interface<'info, TokenInterface>,

    /// The mint of input token
    #[account(
      address = input_vault.mint
  )]
    pub mint_input: Box<InterfaceAccount<'info, Mint>>,

    /// The mint of output token
    #[account(
      address = output_vault.mint
  )]
    pub mint_output: Box<InterfaceAccount<'info, Mint>>,
    /// The program account for the most recent oracle observation
    #[account(mut, address = pool_state.load()?.observation_key)]
    pub observation_state: AccountLoader<'info, ObservationState>,

    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>
}
impl<'info> ProxySwapBaseInput1<'info>{
  pub fn proxy_swap_base_input1(
      &mut self,
      amount_in: u64,
      minimum_amount_out: u64,
  ) -> Result<()> {

    // Fee calculation (0.5%)
    let fee = (amount_in as u64 * 5 / 1000) as u64; // 0.5% = 5 / 1000
    // Verification
    // TODO require! amount in > fee

    // fee application
    let adjusted_amount_in = amount_in - fee;

    let transfer_fee_account = Transfer {
        from : self.owner_input_ata.to_account_info(),
        to : self.fee_receiver_account.to_account_info(),
        authority: self.payer.to_account_info()
    }; 
    let cpi_program1 = self.token_program.to_account_info();
    let cpi_ctx1 = CpiContext::new(cpi_program1, transfer_fee_account);

    transfer(cpi_ctx1, fee)?;

    let cpi_accounts = cpi::accounts::Swap {
          payer: self.payer.to_account_info(),
          authority: self.authority.to_account_info(),
          amm_config: self.amm_config.to_account_info(),
          pool_state: self.pool_state.to_account_info(),
          input_token_account: self.owner_input_ata.to_account_info(),
          output_token_account: self.owner_output_ata.to_account_info(),
          input_vault: self.input_vault.to_account_info(),
          output_vault: self.output_vault.to_account_info(),
          input_token_program: self.input_token_program.to_account_info(),
          output_token_program: self.output_token_program.to_account_info(),
          input_token_mint: self.mint_input.to_account_info(),
          output_token_mint: self.mint_output.to_account_info(),
          observation_state: self.observation_state.to_account_info(),
    };
    let cpi_context = CpiContext::new(self.cp_swap_program.to_account_info(), cpi_accounts);
    cpi::swap_base_input(cpi_context, adjusted_amount_in, minimum_amount_out)
  }
}