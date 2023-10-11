use solana_program::{
    pubkey::Pubkey,
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    msg
};

pub fn vote_specialist(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    voted_member: String
) -> ProgramResult {
    msg!("Voting Specialist...");

    Ok(())
}