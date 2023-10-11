use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint::ProgramResult,
    program_error::ProgramError,
    pubkey::Pubkey,
    borsh0_10::try_from_slice_unchecked,
    sysvar::{rent::Rent, Sysvar},
    system_instruction,
    program::invoke,
    msg
};

use borsh::{BorshDeserialize, BorshSerialize};

use crate::state::{Vessel, Member};

pub fn add_member(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    id: u64,
) -> ProgramResult {
    // Extract accounts
    let accounts_iter = &mut accounts.iter();

    let member_account = next_account_info(accounts_iter)?;
    let owner = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let system_program_account = next_account_info(accounts_iter)?;

    // Get PDA storing community data
    msg!("Deriving PDA");
    let (pda, bump_seed) = Pubkey::find_program_address(&[owner.key.as_ref(), id.to_be_bytes().as_ref()], program_id);

    // Deserialize it
    let mut account_data = try_from_slice_unchecked::<Vessel>(&pda_account.data.borrow()).unwrap();
    let member_data: Member = Member::try_from_slice(&member_account.data.borrow())?;

    // Update it
    let new_member = Member {key: member_data.key};
    account_data.add_member(new_member);

    // Add lamports if needed
    let rent = Rent::get()?;
    let rent_lamports = rent.minimum_balance(32);

    if member_account.lamports() > rent_lamports {
        return Err(ProgramError::InsufficientFunds);
    }

    let transfer_transaction = system_instruction::transfer(member_account.key, pda_account.key, rent_lamports);

    // Fund account
    invoke(
        &transfer_transaction, 
        &[member_account.clone(), pda_account.clone(), system_program_account.clone()], 
    )?;

    // Save changes in account
    msg!("Serializing Data to PDA");
    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
    Ok(())
}

