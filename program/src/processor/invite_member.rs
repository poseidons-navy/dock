use solana_program::{
    pubkey::Pubkey,
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    msg
};


pub fn invite_member(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    address: String,
) -> ProgramResult {
    msg!("Inviting Member...");

    Ok(())
}