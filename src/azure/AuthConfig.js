export const msalConfig = {
    auth: {
        clientId: 'c251866b-8385-406e-aa70-a75e6b102bb4', // Wstaw swój Application (client) ID z Azure AD B2C
        authority: 'https://pratyki.b2clogin.com/c692f6ff-a5b7-49a0-b3f2-879535563102/B2C_1_susi', // Wstaw swoją ścieżkę Authority z Azure AD B2C
        redirectUri: 'http://localhost:3000'
    },
    cache: {
        cacheLocation: 'localStorage', // Można też użyć 'sessionStorage'
        storeAuthStateInCookie: false, // Zalecane w przypadku IE11 lub starszych przeglądarek
    },
};
    export const loginRequest = {
        scopes: ["openid", "User.ReadWrite.All"] // Zakresy żądane podczas logowania
    };