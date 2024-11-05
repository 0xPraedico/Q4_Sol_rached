use anchor_lang::error_code;

#[error_code]
pub enum MarketplaceError {
    #[msg("the lengh for the given name for the marketplace should be between 1 and 32")]
    NameTooLong,
}