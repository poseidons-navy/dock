use solana_program::{
    pubkey::Pubkey,
    account_info::{AccountInfo, next_account_info},
    entrypoint::ProgramResult,
    sysvar::{rent::Rent, Sysvar},
    program_error::ProgramError,
    system_instruction,
    msg
};

use crate::{processor::create_vessel, state::Poll};
use crate::state::Vessel;
use borsh::BorshSerialize;

pub fn create_poll(
    post_id: String,
    user_id: String,
    vessel_id: String,
    id: String,
    chaos_message_id: String,
    accounts: &[AccountInfo],
    program_id: &Pubkey,
) -> ProgramResult {
    msg!("Creating Poll...");

    // Some constants for the post
    let for_invite: u64 = 0;
    let against_invite: u64 = 0;
    let post_type = String::from("invitation");

    msg!("Extracting Accounts");
    // Extract accounts
    let accounts_iter = &mut accounts.iter();

    let member_account = next_account_info(accounts_iter)?;
    let owner = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let system_program_account = next_account_info(accounts_iter)?;

    // Get PDA storing community data
    msg!("Deriving PDA");
    let (pda, bump_seed) = create_vessel::derive_program_account(owner.key, &vessel_id, program_id);

    msg!("Deserializing Account data");
    // Deserialize it
    let mut account_data = crate::processor::create_vessel::my_try_from_slice_unchecked::<Vessel>(&pda_account.data.borrow()).unwrap();

    msg!("Adding poll to account");
    account_data.add_post(&post_id, &user_id, &member_account.key.to_bytes(), &post_type, &chaos_message_id);

    msg!("Add poll to account");
    let new_poll = Poll {
        id,
        post_id,
        for_invite,
        against_invite,
    };
    account_data.polls.push(new_poll);

    // Add lamports if needed
    msg!("Calculating Rent Needed!");
    let rent = Rent::get()?;
    let new_account_size = create_vessel::get_vessel_size(&account_data);
    let new_rent_lamports = rent.minimum_balance(new_account_size);

    if pda_account.lamports() < new_rent_lamports {
        msg!("Charging Member for entry");
        // Charge member for lamports
        let lamports_to_be_paid = new_rent_lamports - pda_account.lamports();
        if member_account.lamports() < lamports_to_be_paid {
            return Err(ProgramError::InsufficientFunds);
        }

        // Fund account
        msg!("Running charge command");
        create_vessel::invoke_signed_transaction(
            &system_instruction::transfer(member_account.key, pda_account.key, lamports_to_be_paid), 
            &[owner.clone(), system_program_account.clone(), member_account.clone(), pda_account.clone()], 
            owner.key, 
            &vessel_id, 
            bump_seed
        )?;
    }

    // Increase size of account
    pda_account.realloc(new_account_size, false)?;

    // Save changes in account
    msg!("Serializing Data to PDA");
    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
    Ok(())
}