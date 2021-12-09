export const addAuthData = (username:string) => {
    return {
        username,
        type: 'simple',
        password: 'pass'
    }
}