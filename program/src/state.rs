use borsh::{BorshSerialize, BorshDeserialize};

// Struct for storing vessel data
#[derive(BorshDeserialize, BorshSerialize)]
pub struct Vessel {
    pub is_initialized: bool,
    pub name: String,
    pub description: String,
    pub amount_token: u32,
    pub members: Vec<Member>,
    pub is_created: bool,
    pub categories: Vec<String>,
    pub id: String,
    pub creator_id: String,
    pub owner_key: [u8; 32],
    pub chaos_channel_id: String,
    pub posts: Vec<Post>,
    pub invites: Vec<Invitation>,
    pub contents: Vec<Content>,
    pub polls: Vec<Poll>
}

impl Vessel {
    pub fn add_post(
        &mut self, 
        id: &String,
        user_id: &String,
        creator_key: &[u8; 32],
        post_type: &String,
        chaos_message_id: &String,
    ) {
        let post = Post {
            id: id.clone(),
            user_id: user_id.clone(),
            creator_key: creator_key.clone(),
            post_type: post_type.clone(),
            chaos_message_id: chaos_message_id.clone()
        };

        self.posts.push(post);
    }
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Post {
    pub id: String,
    pub user_id: String,
    pub creator_key: [u8; 32],
    pub post_type: String,
    pub chaos_message_id: String,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Invitation {
    pub id: String,
    pub post_id: String,
    pub due: String,
    pub for_invite: u64,
    pub against_invite: u64,
    pub user_to_be_invited: [u8; 32],
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Content {
    pub id: String,
    pub post_id: String,
    pub upvotes: u64,
    pub downvotes: u64,
}

#[derive(BorshDeserialize, BorshSerialize)]
pub struct Poll {
    pub id: String,
    pub post_id: String,
    pub for_invite: u64,
    pub against_invite: u64,
    pub result: String,
    pub voted_members: Vec<Member>
}

// Posts - count of interactions e.g likes, comments; member who created it

#[derive(BorshDeserialize, BorshSerialize)]
#[derive(Clone)]
pub struct Member {
    pub key: [u8; 32],
    pub owner_key: [u8; 32],
    pub user_type: String,
    pub user_id: String,
    pub chaos_participant_id: String
}

// #[derive(BorshDeserialize, BorshSerialize)]
// pub struct Founder {
//     pub key: u32,
//     pub owner_key: u32
// }

// #[derive(BorshDeserialize, BorshSerialize)]
// pub struct Specialist {
//     pub role: String,
//     pub key: u32,
//     pub owner_key: u32
// }

// impl Specialist {
//     pub fn get_size(& self) -> usize {
//         let size = 4 + (self.role.len()) +  8 + 8;
//         return size;          
//     }
// }