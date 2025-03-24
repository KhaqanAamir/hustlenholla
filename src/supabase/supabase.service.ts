import { HttpStatus, Injectable } from '@nestjs/common';
import { createClient, SignInWithPasswordCredentials, SignUpWithPasswordCredentials, SupabaseClient, User } from '@supabase/supabase-js';
import { Database, TablesInsert } from 'src/types/supabase';
import { CustomResponse } from 'src/types/types';
import { pgToHttpErr } from 'src/types/utils';

@Injectable()
export class SupabaseService {
    private SupaBaseClient: SupabaseClient

    constructor() {
        this.SupaBaseClient = createClient(
            process.env.SUPABASE_URL,
            process.env.SUPABASE_KEY
        )
    }
    public getSupabaseClient(): SupabaseClient {
        return this.SupaBaseClient
    }

    public async postData<T extends keyof Database['public']['Tables']>(
        tableName: T,
        dataToPost: TablesInsert<T>
    ): Promise<CustomResponse> {
        try {
            const { data, error } = await this.SupaBaseClient.from(tableName).insert(dataToPost).select('*');
            if (error) {
                return { error: true, msg: error.message, data: null, status: error.code ? pgToHttpErr(error.code) : HttpStatus.BAD_REQUEST }
            }
            return {
                error: false,
                msg: `Data sucessfully posted to table ${tableName}`,
                data: data,
                status: HttpStatus.OK
            }

        }
        catch {
            return { error: true, msg: 'An server error occured while posting Data' }
        }
    }

    public async signUp(
        dataToSignUp: SignUpWithPasswordCredentials
    ): Promise<CustomResponse> {
        try {
            const { data, error } = await this.SupaBaseClient.auth.signUp(dataToSignUp);
            if (error) {
                return { error: true, msg: `Error Signing Up User. ${error.message}`, data: null }
            }
            return {
                error: false,
                msg: 'Signed Up Successfully',
                data: {
                    id: data.user.id,
                    accessToken: data.session.access_token,
                    refreshToken: data.session.refresh_token
                }
            }
        }
        catch (e) {
            return { error: true, msg: `Internal Server Error Occured. ${e}`, data: null }
        }
    }

    public async signInWithPassword(
        dataToSignIn: SignInWithPasswordCredentials
    ): Promise<CustomResponse> {
        try {
            const { data, error } = await this.SupaBaseClient.auth.signInWithPassword(
                dataToSignIn
            )
            if (error)
                return { error: true, data: null, msg: `Error Signing In User. ${error.message}` }

            return {
                error: false,
                msg: 'User Signed In Successfully',
                data: {
                    accessToken: data.session.access_token,
                    refreshToken: data.session.refresh_token,
                    expires_at: data.session.expires_at
                        ? data.session.expires_at
                        : null,
                    expires_in: data.session.expires_in,
                    id: data.user.id,
                }
            }
        }
        catch (e) {
            return { error: true, msg: `Internal Server Error Occured. ${e}`, data: null }
        }
    }

    public async getUser(): Promise<CustomResponse> {
        try {
            const { data, error } = await this.SupaBaseClient.auth.getUser()

            if (error)
                return { error: true, msg: 'Failed to get user', details: error };

            return {
                error: false, data: data.user, msg: 'User Fetched Successfully'
            }
        }
        catch {
            return { error: true, msg: 'Unexpected error occurred, while fetching the user' };
        }
    }
}
