import bcrypt from "bcryptjs";


export const hashPassword = async ({ password }: { password: string }) => bcrypt.hash(password, 10);

export const comparePassword = async ({ password, hash }: { password: string, hash: string }) => bcrypt.compare(password, hash);

