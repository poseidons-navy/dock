// use solana_program::{
//     pubkey::Pubkey,
//     account_info::{AccountInfo, next_account_info},
//     entrypoint::ProgramResult,
//     msg, 
//     program_error::ProgramError, 
//     borsh0_10::try_from_slice_unchecked,
//     sysvar::{rent::Rent, Sysvar},
//     system_instruction,
//     program::invoke,
// };

// use crate::state::{Vessel, Founder};

// pub fn invite_founding_member(
//     program_id: &Pubkey,
//     accounts: &[AccountInfo],
//     id: u64,
// ) -> ProgramResult {
//     msg!("Inviting Founding Members...");

//     msg!("Get Accounts");
//     // Extract accounts
//     let accounts_iter = &mut accounts.iter();

//     let founder_account = next_account_info(accounts_iter)?;
//     let owner = next_account_info(accounts_iter)?;
//     let pda_account = next_account_info(accounts_iter)?;
//     let system_program_account = next_account_info(accounts_iter)?;

//     // Get pda that is storing account's data
//     msg!("Deriving PDA");
//     let (pda, bump_seed) = Pubkey::find_program_address(&[owner.key.as_ref(), id.to_be_bytes().as_ref()], program_id);

//     if pda != pda_account.key.clone() {
//         return Err(ProgramError::InvalidAccountData)
//     }

//     // Get account data from pda_account
//     let mut account_data = try_from_slice_unchecked::<Vessel>(&pda_account.data.borrow()).unwrap();

//     // Check if more than 3 founders are in community
//     if account_data.founders.len() >= 3 {
//         msg!("There are already 3 founders in the community");
//         return Err(ProgramError::InvalidAccountData);
//     }
    
//     // Get founder data
//     let founder_data = Founder::try_from_slice(&founder_account.data.borrow())?;


//     // Add to the account data
//     account_data.founders.push(Founder { key: founder_data.key.clone(), owner_key: owner.key.clone() });

//     // If length of founders is equal to 3 set isCreated to true
//     if account_data.founders.len() == 3 {
//         account_data.is_created = false;
//     }

//     // Get size of account_data
//     let pubkeysize = 8;
//     let size_account_data = 1 + 4 + 4 + (account_data.name.len()) + (4 + account_data.description.len()) + 4 + 24 + (account_data.members.len() * pubkeysize) + 24 + (account_data.founders.len() * (pubkeysize * 2)) + 1;
    
//     // Calculate amount of rent needed to store account data
//     let rent = Rent::get()?;
//     let rent_needed = rent.minimum_balance(size_account_data);

//     // If account has less lamports than needed add lamports
//     if rent_needed > pda_account.lamports() {
//         // Bill founder
//         let rent_to_be_added = rent_needed - pda_account.lamports();
//         if founder_account.lamports() > rent_to_be_added {
//             return Err(ProgramError::InsufficientFunds);
//         }
    
//         let transfer_transaction = system_instruction::transfer(founder_account.key, pda_account.key, rent_to_be_added);
    
//         // Fund account
//         invoke(
//             &transfer_transaction, 
//             &[founder_account.clone(), pda_account.clone(), system_program_account.clone()], 
//         )?;
//     }

//     msg!("Serializing PDA!");
//     account_data.serialize(&mut &mut pda_account.data.borrow_mut()[..])?;
//     Ok(())
// }