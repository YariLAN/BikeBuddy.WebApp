export interface UserProfileResponse {
    id : string,
    surname : string,
    name : string,
    middleName : string,
    birthDay? : Date,
    address? : string,
    avatarUrl: string
}

export interface UserProfileRequest {
    surname : string,
    name : string,
    middleName : string,
    birthDay? : Date,
    address? : string
}

export interface UserResponse {
    userID: string,
    userName: string,
    email: string,
    surname: string,
    name: string,
    middleName: string,
    birthDay: string,
    address: string,
    photoUrl: string,
}
