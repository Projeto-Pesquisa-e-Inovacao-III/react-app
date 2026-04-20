export function verifyRole(roles: string[]) {
    if (roles?.includes("personal") && !roles?.includes("admin")) {
        return "personal";
    }
    if (roles?.includes("admin") && !roles?.includes("personal")) {
        return "admin";
    }

    if (roles?.includes("admin") && roles?.includes("personal")) {
        return "personal-admin";
    }

    if (roles?.includes("aluno") && !roles?.includes("admin") && !roles?.includes("personal")) {
        return "aluno";
    }

    return null;
}