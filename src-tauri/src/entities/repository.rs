use std::string;

use serde::Serialize;

#[derive(Serialize)]
pub struct RepositoryStruct {
    pub path: String,
    pub name: String,
}
