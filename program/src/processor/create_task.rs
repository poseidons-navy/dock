use solana_program::{
    pubkey::Pubkey,
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    msg
};

pub fn create_task(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    description: String,
    amount_token: u64
) -> ProgramResult {
    msg!("Creating Task...");

    Ok(())
}