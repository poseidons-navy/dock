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

use crate::processor::create_vessel;

use borsh::{BorshDeserialize};
use borsh::ser::BorshSerialize;

use crate::state::{Vessel, Member};

pub fn check_if_user_type_is_valid(
    user_type: &String
) -> bool {
    if (user_type == "member" || user_type == "founder" || user_type == "creator" || user_type == "specialist" || user_type == "invitee" || user_type == "invited_founder") {
        true
    } else {
        false
    }
}

pub fn add_member(
    vessel_id: String,
    user_type: String,
    user_id: String,
    chaos_participant_id: String,
    accounts: &[AccountInfo],
    program_id: &Pubkey,
) -> ProgramResult {
    // Check if user_type is valid
    // let is_user_valid = check_if_user_type_is_valid(&user_type);
    // if is_user_valid == false {
    //     return Err(ProgramError::InvalidArgument);
    // }

    // Extract accounts
    let accounts_iter = &mut accounts.iter();

    let member_account = next_account_info(accounts_iter)?;
    let owner = next_account_info(accounts_iter)?;
    let pda_account = next_account_info(accounts_iter)?;
    let system_program_account = next_account_info(accounts_iter)?;

    // Get PDA storing community data
    msg!("Deriving PDA");
    let (pda, bump_seed) = create_vessel::derive_program_account(owner.key, &vessel_id, program_id);

    if pda != pda_account.key.clone() {
        return  Err(ProgramError::InvalidArgument);
    }

    // Deserialize it
    let mut account_data = Vessel::try_from_slice(&pda_account.data.borrow()).unwrap();
    let member_data: Member = Member::try_from_slice(&member_account.data.borrow())?;

    // Update it
    let new_member = Member {
        key: member_account.key.clone().to_bytes(),
        owner_key: owner.key.clone().to_bytes(),
        user_type: String::from("invitee"),
        user_id: user_id,
        chaos_participant_id: chaos_participant_id
    };
    account_data.members.push(new_member);

    // Add lamports if needed
    let rent = Rent::get()?;
    let new_account_size = create_vessel::get_vessel_size(&account_data);
    let new_rent_lamports = rent.minimum_balance(new_account_size);

    if (pda_account.lamports() < new_rent_lamports) {
        // Charge member for lamports
        let lamports_to_be_paid = new_rent_lamports - pda_account.lamports();
        if member_account.lamports() > lamports_to_be_paid {
            return Err(ProgramError::InsufficientFunds);
        }

        // Fund account
        create_vessel::invoke_signed_transaction(
            &system_instruction::transfer(member_account.key, pda_account.key, lamports_to_be_paid), 
            &[owner.clone(), system_program_account.clone(), member_account.clone(), pda_account.clone()], 
            owner.key, 
            &vessel_id, 
            bump_seed
        );
    }

    // Save changes in account
    msg!("Serializing Data to PDA");
    account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
    Ok(())
}

