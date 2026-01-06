interface UserData {
    f_name: string;
    l_name: string;
    email: string;
    password: string;
}

interface Credentials {
    email: string;
    password: string;
}

export type { UserData, Credentials };