use solana_program::{
    pubkey::Pubkey,
    account_info::AccountInfo,
    entrypoint::ProgramResult,
    msg
};

pub fn request_invite(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    member: String,
        vessel_address: String
) -> ProgramResult {
    msg!("Requesting Invite...");

    Ok(())
}