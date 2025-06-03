import * as bcrypt from 'bcryptjs';


export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds)
}

export async function comparePassword(plainText: string, hashed: string): Promise<boolean> {
    console.log(await bcrypt.compare(plainText, hashed))
    return await bcrypt.compare(plainText, hashed)
}