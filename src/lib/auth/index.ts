import jwtDecode from "jwt-decode";

export const checkToken = (token?: string): boolean => {
    if (!token) return false;
    const [schema, _token] = token.split(" ");
    if (schema !== "Bearer") {
        return false;
    }
    try {
        jwtDecode(_token);
        return true;
    } catch {
        return false;
    }
};
