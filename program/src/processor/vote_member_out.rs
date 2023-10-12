use solana_program::{
    pubkey::Pubkey,
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    msg
};

pub fn vote_member_out(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    member: String,
    vote: bool
) -> ProgramResult {
    msg!("Voting Member Out...");

    Ok(())
}
