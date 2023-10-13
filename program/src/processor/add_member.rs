use solana_program::{
    account_info::{AccountInfo, next_account_info},
    entrypoint::ProgramResult,
    program_error::ProgramError,
    pubkey::Pubkey,
    sysvar::{rent::Rent, Sysvar},
    system_instruction,
    msg
};

use crate::processor::create_vessel;

use borsh::ser::BorshSerialize;

use crate::state::{Vessel, Member};

pub fn check_if_user_type_is_valid(
    user_type: &String
) -> bool {
    if user_type == "member" || user_type == "founder" || user_type == "creator" || user_type == "specialist" || user_type == "invitee" || user_type == "invited_founder" {
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
    msg!("Adding Member");
    // Check if user_type is valid
    let is_user_valid = check_if_user_type_is_valid(&user_type);
    if is_user_valid == false {
        return Err(ProgramError::InvalidArgument);
    }

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

    // if pda != pda_account.key.clone() {
    //     return  Err(ProgramError::InvalidArgument);
    // }

    msg!("Deserializing Account data");
    // Deserialize it
    let mut account_data = crate::processor::create_vessel::my_try_from_slice_unchecked::<Vessel>(&pda_account.data.borrow()).unwrap();
    // let member_data: Member = Member::try_from_slice(&member_account.data.borrow())?;

    // Update it
    let new_member = Member {
        key: member_account.key.clone().to_bytes(),
        owner_key: owner.key.clone().to_bytes(),
        user_type,
        user_id,
        chaos_participant_id
    };
    msg!("Adding New Member");
    account_data.members.push(new_member);

    msg!("Marking Vessel As Created If There Are 3 Founders");
    if account_data.is_created == false {
        let mut founder = 0;
        for x in account_data.members.iter() {
            if x.user_type == String::from("founder") {
                founder += 1
            }
        }

        if founder >= 3 {
            account_data.is_created = true
        }
    }

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


#[cfg(test)]
mod tests {
    use {
        super::*,
        solana_program_test::*,
        solana_program::system_program,
        solana_program::instruction::{AccountMeta, Instruction},
        solana_sdk::{signature::Signer, transaction::Transaction, signer::keypair::Keypair},
        crate::instruction::VesselInstructionStruct,
        borsh::{BorshSerialize, BorshDeserialize},
    };


    #[tokio::test]
    async fn add_member_works() {
        let instruction_data = VesselInstructionStruct {
            id: String::from("VesselID"),
            name: String::from("Vessel Name"),
            description: String::from("Some Vessel"),
            amount_token: 64,
            user_type: String::from("member"),
            user_id: String::from("user#2"),
            chaos_participant_id: String::from("chaos_participant#1"),
            vessel_id: String::from("VesselID"),
            creator_id: String::from(""),
            chaos_channel_id: String::from(""),
            post_id: String::from(""),
            post_type: String::from(""),
            chaos_message_id: String::from(""),
            due: String::from(""),
            interaction_type: String::from("")
        };
        // Create vessel
        let mut sink = vec![0];
        instruction_data.serialize( &mut sink).unwrap();
        let program_id = Pubkey::new_unique();

        let (mut banks_client, payer, recent_blockhash) = ProgramTest::new(
            "Poseidons Dock",
            program_id,
            processor!(crate::entrypoint::process_instruction)
        )
        .start()
        .await;

        let test_account = Keypair::new();

        let mut transaction = Transaction::new_with_payer(
            &[Instruction {
                program_id,
                accounts: vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(test_account.pubkey(), true),
                    AccountMeta::new(system_program::id(), false)
                ],
                data: sink
            }],
            Some(&payer.pubkey()),
        );

        transaction.sign(&[&payer, &test_account], recent_blockhash);

        banks_client.process_transaction(transaction).await.unwrap();

        // Create a member for the vessel
        let mut sink2 = vec![11];
        instruction_data.serialize( &mut sink2).unwrap();
        let mut transaction2 = Transaction::new_with_payer(
            &[Instruction {
                program_id,
                accounts: vec![
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(payer.pubkey(), true),
                    AccountMeta::new(test_account.pubkey(), true),
                    AccountMeta::new(system_program::id(), false)
                ],
                data: sink2
            }],
            Some(&payer.pubkey()),
        );

        transaction2.sign(&[&payer, &test_account], recent_blockhash);

        banks_client.process_transaction(transaction2).await.unwrap();

        // Test if any of the created members has the id of the added member
        let created_account = banks_client.get_account(test_account.pubkey()).await;

        match created_account {
            Ok(None) => assert_eq!(false, true),
            Ok(Some(account)) => {
                let vessel = Vessel::deserialize(&mut account.data.to_vec().as_ref()).unwrap();
                
                // See if any member was returned
                assert!(vessel.members.len() >= 1, "No member was created `{}`", vessel.name);

                // See if the write member was created
                let mut found = false;
                for x in vessel.members {
                    if x.user_id == instruction_data.user_id {
                        found = true;
                    }
                }

                assert_eq!(found, true, "The wrong member was created");
            },
            Err(_) => assert_eq!(false, true),
        }

    }
}

