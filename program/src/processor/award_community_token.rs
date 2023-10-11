use solana_program::{
    pubkey::Pubkey,
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    msg
};


pub fn award_community_token(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    address: String,
) -> ProgramResult {
    msg!("Awarding Community Token...");

    Ok(())
}