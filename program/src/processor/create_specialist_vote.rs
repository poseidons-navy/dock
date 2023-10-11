use solana_program::{
    pubkey::Pubkey,
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    msg
};

pub fn create_specialist_vote(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    title: String,
    description: String
) -> ProgramResult {
    msg!("Creating Specialist Vote...");

    Ok(())
}