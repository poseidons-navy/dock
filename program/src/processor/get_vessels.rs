use solana_program::{
    pubkey::Pubkey,
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    msg
};

pub fn get_vessels(
    program_id: &Pubkey,
    accounts: &[AccountInfo]
) -> ProgramResult {
    msg!("Getting Vessels...");

    Ok(())
}